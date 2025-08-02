import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Trash2, 
  Search, 
  Database, 
  FileImage, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  Upload
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

const AdminPhotoManager: React.FC = () => {
  const [analysis, setAnalysis] = useState<PhotoAnalysis | null>(null);
  const [speeltuinenWithPhotos, setSpeeltuinenWithPhotos] = useState<SpeeltuinWithPhotos[]>([]);
  const [orphanedPhotos, setOrphanedPhotos] = useState<OrphanedPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const { toast } = useToast();

  const analyzeDatabase = async () => {
    setIsLoading(true);
    try {
      // Get basic statistics
      const { data: statsData, error: statsError } = await supabase
        .from('speeltuinen')
        .select('fotos, afbeelding_url');

      if (statsError) throw statsError;

      const stats = {
        total_speeltuinen: statsData.length,
        speeltuinen_met_fotos: statsData.filter(s => s.fotos && s.fotos.length > 0).length,
        speeltuinen_met_oude_foto: statsData.filter(s => s.afbeelding_url && s.afbeelding_url !== '').length
      };

      setAnalysis(stats);

      // Get speeltuinen with photos
      const { data: photosData, error: photosError } = await supabase
        .rpc('get_speeltuinen_with_photos');

      if (photosError) {
        console.warn('Could not get detailed photo data:', photosError);
      } else {
        setSpeeltuinenWithPhotos(photosData || []);
      }

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
    analyzeDatabase();
  }, []);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {speeltuinenWithPhotos.map((speeltuin) => (
              <Card key={speeltuin.id}>
                <CardHeader>
                  <CardTitle className="text-sm">{speeltuin.naam}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{speeltuin.aantal_fotos}</span>
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">foto's</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {speeltuinenWithPhotos.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Geen speeltuinen met foto's gevonden</p>
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
    </div>
  );
};

export default AdminPhotoManager; 