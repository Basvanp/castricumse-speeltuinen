import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import EditSpeeltuinDialog from '@/components/EditSpeeltuinDialog';
import { useSpeeltuinen, useUpdateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { 
  Trash2, 
  Search, 
  Database, 
  FileImage, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload,
  Edit,
  X,
  ExternalLink,
  Eye,
  EyeOff
} from 'lucide-react';

interface PhotoAnalysis {
  total_speeltuinen: number;
  speeltuinen_met_fotos: number;
  speeltuinen_met_oude_foto: number;
}

interface SpeeltuinWithPhotos {
  id: string;
  naam: string;
  fotos: any;
  aantal_fotos: number;
}

interface OrphanedPhoto {
  storage_file: string;
  file_size: number;
  created_at: string;
  orphaned_reason: string;
}

interface PhotoUsage {
  url: string;
  filename: string;
  used_by: string[];
  file_size?: number;
  created_at?: string;
}

const AdminPhotoManager: React.FC = () => {
  const { data: speeltuinen = [] } = useSpeeltuinen();
  const updateSpeeltuin = useUpdateSpeeltuin();
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [speeltuinenWithPhotos, setSpeeltuinenWithPhotos] = useState<SpeeltuinWithPhotos[]>([]);
  const [orphanedPhotos, setOrphanedPhotos] = useState<OrphanedPhoto[]>([]);
  const [photoUsage, setPhotoUsage] = useState<PhotoUsage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [editingSpeeltuin, setEditingSpeeltuin] = useState<any>(null);
  const { toast } = useToast();

  const analyzeDatabase = async () => {
    setIsLoading(true);
    try {
      // Calculate statistics from local data
      const stats = {
        total_speeltuinen: speeltuinen.length,
        speeltuinen_met_fotos: speeltuinen.filter(s => 
          (s.fotos && s.fotos.length > 0) || (s.afbeelding_url && s.afbeelding_url !== '')
        ).length,
        speeltuinen_met_oude_foto: speeltuinen.filter(s => s.afbeelding_url && s.afbeelding_url !== '').length
      };

      setAnalysis(stats);

      // Create speeltuinen with photos data from local data
      const photosData = speeltuinen
        .filter(s => (s.fotos && s.fotos.length > 0) || (s.afbeelding_url && s.afbeelding_url !== ''))
        .map(s => ({
          id: s.id,
          naam: s.naam,
          fotos: s.fotos || [],
          aantal_fotos: Array.isArray(s.fotos) ? s.fotos.length : (s.afbeelding_url ? 1 : 0)
        }))
        .sort((a, b) => b.aantal_fotos - a.aantal_fotos);

      setSpeeltuinenWithPhotos(photosData);

      // Analyze photo usage
      const usageMap = new Map<string, PhotoUsage>();
      
      speeltuinen.forEach(speeltuin => {
        // Handle new fotos array
        if (speeltuin.fotos && Array.isArray(speeltuin.fotos)) {
          speeltuin.fotos.forEach((photo: any) => {
            const url = photo.url || photo;
            const filename = url.split('/').pop() || url;
            
            if (!usageMap.has(url)) {
              usageMap.set(url, {
                url,
                filename,
                used_by: []
              });
            }
            
            usageMap.get(url)!.used_by.push(speeltuin.naam);
          });
        }
        
        // Handle old afbeelding_url
        if (speeltuin.afbeelding_url && speeltuin.afbeelding_url !== '') {
          const url = speeltuin.afbeelding_url;
          const filename = url.split('/').pop() || url;
          
          if (!usageMap.has(url)) {
            usageMap.set(url, {
              url,
              filename,
              used_by: []
            });
          }
          
          usageMap.get(url)!.used_by.push(speeltuin.naam);
        }
      });
      
      setPhotoUsage(Array.from(usageMap.values()));

      toast({
        title: "Database geanalyseerd",
        description: `Gevonden: ${stats.total_speeltuinen} speeltuinen, ${stats.speeltuinen_met_fotos} met foto's`,
      });

    } catch (error) {
      console.error('Error analyzing database:', error);
      toast({
        title: "Fout bij analyseren",
        description: "Er is een fout opgetreden bij het analyseren van de database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const findOrphanedPhotos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .rpc('find_orphaned_photos');

      if (error) throw error;

      setOrphanedPhotos(data || []);
      
      toast({
        title: "Orphaned foto's gevonden",
        description: `${data?.length || 0} orphaned foto's gevonden in storage.`,
      });

    } catch (error) {
      console.error('Error finding orphaned photos:', error);
      toast({
        title: "Fout bij zoeken",
        description: "Er is een fout opgetreden bij het zoeken naar orphaned foto's.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (speeltuinId: string, photoIndex: number) => {
    const speeltuin = speeltuinen.find(s => s.id === speeltuinId);
    if (!speeltuin || !speeltuin.fotos) return;

    const updatedFotos = [...speeltuin.fotos];
    const deletedPhoto = updatedFotos.splice(photoIndex, 1)[0];

    try {
      await updateSpeeltuin.mutateAsync({
        id: speeltuinId,
        fotos: updatedFotos
      });

      toast({
        title: "Foto verwijderd",
        description: `Foto is succesvol verwijderd uit ${speeltuin.naam}`,
      });

      // Refresh data
      analyzeDatabase();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van de foto.",
        variant: "destructive",
      });
    }
  };

  const cleanupOrphanedPhotos = async () => {
    if (!orphanedPhotos.length) {
      toast({
        title: "Geen orphaned foto's",
        description: "Er zijn geen orphaned foto's om op te ruimen.",
      });
      return;
    }

    setIsCleaning(true);
    try {
      const { data, error } = await supabase
        .rpc('cleanup_orphaned_photos');

      if (error) throw error;

      const cleanedCount = data || 0;
      setOrphanedPhotos([]);
      
      toast({
        title: "Opruiming voltooid",
        description: `${cleanedCount} orphaned foto's zijn verwijderd uit storage.`,
      });

    } catch (error) {
      console.error('Error cleaning up orphaned photos:', error);
      toast({
        title: "Fout bij opruimen",
        description: "Er is een fout opgetreden bij het opruimen van orphaned foto's.",
        variant: "destructive",
      });
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    if (speeltuinen.length > 0) {
      analyzeDatabase();
    }
  }, [speeltuinen]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Foto Beheer</h2>
          <p className="text-muted-foreground">
            Analyseer en beheer foto's in de database en storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={analyzeDatabase}
            disabled={isLoading}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overzicht</TabsTrigger>
          <TabsTrigger value="photos">Foto's per Speeltuin</TabsTrigger>
          <TabsTrigger value="usage">Foto Gebruik</TabsTrigger>
          <TabsTrigger value="orphaned">Orphaned Foto's</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Totaal Speeltuinen</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analysis?.total_speeltuinen || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Met Foto's</CardTitle>
                <FileImage className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {analysis?.speeltuinen_met_fotos || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analysis ? Math.round((analysis.speeltuinen_met_fotos / analysis.total_speeltuinen) * 100) : 0}% van totaal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Met Oude Foto</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {analysis?.speeltuinen_met_oude_foto || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Gebruikt nog afbeelding_url
                </p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Automatische Cleanup:</strong> Foto's worden automatisch verwijderd uit storage wanneer:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Een speeltuin wordt verwijderd</li>
                <li>Foto's worden vervangen in een speeltuin</li>
                <li>Foto's worden handmatig verwijderd uit de fotos array</li>
              </ul>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Speeltuinen met Foto's</h3>
            <Badge variant="secondary">
              {speeltuinenWithPhotos.length} speeltuinen
            </Badge>
          </div>

          <div className="space-y-4">
            {speeltuinenWithPhotos.map((speeltuin) => (
              <Card key={speeltuin.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{speeltuin.naam}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {speeltuin.aantal_fotos} foto's
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const fullSpeeltuin = speeltuinen.find(s => s.id === speeltuin.id);
                          setEditingSpeeltuin(fullSpeeltuin);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Bewerken
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Get all photos (both new fotos array and old afbeelding_url)
                    const allPhotos: any[] = [];
                    
                    // Add photos from fotos array
                    if (speeltuin.fotos && Array.isArray(speeltuin.fotos)) {
                      speeltuin.fotos.forEach((photo: any) => {
                        allPhotos.push({
                          url: photo.url || photo,
                          isOldPhoto: false,
                          used_in_production: photo.used_in_production !== false
                        });
                      });
                    }
                    
                    // Add photo from afbeelding_url if it exists
                    const fullSpeeltuin = speeltuinen.find(s => s.id === speeltuin.id);
                    if (fullSpeeltuin?.afbeelding_url && fullSpeeltuin.afbeelding_url !== '') {
                      allPhotos.push({
                        url: fullSpeeltuin.afbeelding_url,
                        isOldPhoto: true,
                        used_in_production: true
                      });
                    }
                    
                    if (allPhotos.length > 0) {
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {allPhotos.map((photo: any, index: number) => {
                            const url = photo.url;
                            const filename = url.split('/').pop() || url;
                            const isUsedInProduction = photo.used_in_production;
                        
                        return (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`${speeltuin.naam} foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            
                            {/* Production usage indicator */}
                            <div className="absolute top-2 left-2">
                              <Badge 
                                variant={isUsedInProduction ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {isUsedInProduction ? (
                                  <>
                                    <Eye className="h-3 w-3 mr-1" />
                                    Productie
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="h-3 w-3 mr-1" />
                                    Verborgen
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            {/* Old photo indicator */}
                            {photo.isOldPhoto && (
                              <div className="absolute top-2 right-2">
                                <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800">
                                  Oude Foto
                                </Badge>
                              </div>
                            )}
                            
                            {/* Delete button */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                onClick={() => {
                                  if (photo.isOldPhoto) {
                                    // Remove old photo by clearing afbeelding_url
                                    const fullSpeeltuin = speeltuinen.find(s => s.id === speeltuin.id);
                                    if (fullSpeeltuin) {
                                      updateSpeeltuin.mutateAsync({
                                        id: speeltuin.id,
                                        afbeelding_url: ''
                                      }).then(() => {
                                        toast({
                                          title: "Oude foto verwijderd",
                                          description: `Oude foto is verwijderd uit ${speeltuin.naam}`,
                                        });
                                        analyzeDatabase();
                                      });
                                    }
                                  } else {
                                    // Remove from fotos array
                                    handleDeletePhoto(speeltuin.id, index);
                                  }
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="mt-2 space-y-1">
                              <p className="text-xs text-muted-foreground truncate" title={filename}>
                                {filename}
                              </p>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 text-xs"
                                  onClick={() => window.open(url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  Bekijk
                                </Button>
                                <Button
                                  size="sm"
                                  variant={isUsedInProduction ? "outline" : "default"}
                                  className="flex-1 text-xs"
                                  onClick={async () => {
                                    try {
                                      await updateSpeeltuin.mutateAsync({
                                        id: speeltuin.id,
                                        fotos: speeltuin.fotos.map((p: any, i: number) => 
                                          i === index ? { ...p, used_in_production: !isUsedInProduction } : p
                                        )
                                      });
                                      
                                      toast({
                                        title: isUsedInProduction ? "Foto verborgen" : "Foto zichtbaar gemaakt",
                                        description: `Foto is ${isUsedInProduction ? 'verborgen' : 'zichtbaar'} in productie`,
                                      });
                                      
                                      analyzeDatabase();
                                    } catch (error) {
                                      toast({
                                        title: "Fout",
                                        description: "Er is een fout opgetreden bij het wijzigen van de foto status.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                >
                                  {isUsedInProduction ? (
                                    <>
                                      <EyeOff className="h-3 w-3 mr-1" />
                                      Verberg
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="h-3 w-3 mr-1" />
                                      Toon
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Geen foto's gevonden</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Foto Gebruik Analyse</h3>
            <Badge variant="secondary">
              {photoUsage.length} unieke foto's
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photoUsage.map((photo, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="relative mb-3">
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <Badge 
                      variant={photo.used_by.length > 1 ? "default" : "secondary"}
                      className="absolute top-2 right-2"
                    >
                      {photo.used_by.length}x gebruikt
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium text-sm truncate" title={photo.filename}>
                      {photo.filename}
                    </p>
                    
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Gebruikt door:</p>
                      <div className="flex flex-wrap gap-1">
                        {photo.used_by.map((speeltuin, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {speeltuin}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(photo.url, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Bekijk
                      </Button>
                      {photo.used_by.length === 0 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          className="flex-1"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Verwijder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {photoUsage.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Geen foto's gevonden</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="orphaned" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Orphaned Foto's</h3>
            <div className="flex gap-2">
              <Button
                onClick={findOrphanedPhotos}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <Search className="h-4 w-4 mr-2" />
                Zoeken
              </Button>
              <Button
                onClick={cleanupOrphanedPhotos}
                disabled={isCleaning || orphanedPhotos.length === 0}
                variant="destructive"
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Opruimen ({orphanedPhotos.length})
              </Button>
            </div>
          </div>

          {orphanedPhotos.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{orphanedPhotos.length} orphaned foto's gevonden!</strong> 
                Deze foto's staan in storage maar zijn niet gelinkt aan een speeltuin.
                Je kunt ze veilig opruimen.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            {orphanedPhotos.map((photo, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{photo.storage_file}</p>
                      <p className="text-sm text-muted-foreground">
                        Grootte: {(photo.file_size / 1024 / 1024).toFixed(2)} MB | 
                        Aangemaakt: {new Date(photo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="destructive">Orphaned</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {orphanedPhotos.length === 0 && !isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>Geen orphaned foto's gevonden!</p>
              <p className="text-sm">Alle foto's in storage zijn correct gelinkt aan speeltuinen.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      {editingSpeeltuin && (
        <EditSpeeltuinDialog
          speeltuin={editingSpeeltuin}
          onClose={() => {
            setEditingSpeeltuin(null);
            // Refresh data after edit
            analyzeDatabase();
          }}
        />
      )}
    </div>
  );
};

export default AdminPhotoManager; 