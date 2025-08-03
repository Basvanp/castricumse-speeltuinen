import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../integrations/supabase/client';
import { useCreateSpeeltuin } from '../hooks/useSpeeltuinen';
import { Speeltuin } from '../types/speeltuin';
import exifr from 'exifr';
import { compressImage, shouldCompress, getCompressionStats } from '../utils/imageCompression';

interface PhotoWithLocation {
  file: File;
  url: string;
  latitude?: number;
  longitude?: number;
  name: string;
  originalSize?: string;
  compressedSize?: string;
}

interface LocationGroup {
  latitude: number;
  longitude: number;
  photos: PhotoWithLocation[];
  formData: {
    naam: string;
    omschrijving: string;
    [key: string]: any;
  };
}

const AdminPhotoImporter: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<PhotoWithLocation[]>([]);
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const createSpeeltuinMutation = useCreateSpeeltuin();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    const photos: PhotoWithLocation[] = [];

    try {
      for (const file of files) {
        // Compress image if needed
        let processedFile = file;
        let originalSize: string | undefined;
        let compressedSize: string | undefined;

        if (shouldCompress(file)) {
          try {
            const originalFile = file;
            processedFile = await compressImage(file);
            const stats = getCompressionStats(originalFile, processedFile);
            originalSize = stats.originalSize;
            compressedSize = stats.compressedSize;
            
            console.log(`Compressed ${file.name}: ${stats.originalSize} → ${stats.compressedSize} (${stats.compressionRatio} smaller)`);
          } catch (err) {
            console.error(`Failed to compress ${file.name}:`, err);
            // Continue with original file if compression fails
          }
        }

        // Create preview URL
        const url = URL.createObjectURL(processedFile);
        
        // Extract EXIF GPS data
        let latitude: number | undefined;
        let longitude: number | undefined;
        
        try {
          const exifData = await exifr.parse(processedFile, { gps: true });
          if (exifData?.latitude && exifData?.longitude) {
            latitude = exifData.latitude;
            longitude = exifData.longitude;
          }
        } catch (err) {
          console.log(`No GPS data in ${file.name}`);
        }

        photos.push({
          file: processedFile,
          url,
          latitude,
          longitude,
          name: file.name,
          originalSize,
          compressedSize
        });
      }

      setUploadedPhotos(photos);
      
      const compressedCount = photos.filter(p => p.compressedSize).length;
      const gpsCount = photos.filter(p => p.latitude).length;
      
      toast({
        title: "Foto's geladen!",
        description: `${photos.length} foto's geüpload. ${gpsCount} hebben GPS data. ${compressedCount} gecomprimeerd.`,
      });

      // Group photos by location
      groupPhotosByLocation(photos);

    } catch (err) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het laden van de foto's.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupPhotosByLocation = (photos: PhotoWithLocation[]) => {
    const groups: { [key: string]: LocationGroup } = {};
    
    for (const photo of photos) {
      if (photo.latitude && photo.longitude) {
        // Round coordinates to group nearby photos (within ~20 meters)
        const latKey = Math.round(photo.latitude * 10000) / 10000;
        const lonKey = Math.round(photo.longitude * 10000) / 10000;
        const key = `${latKey},${lonKey}`;
        
        if (!groups[key]) {
          groups[key] = {
            latitude: photo.latitude,
            longitude: photo.longitude,
            photos: [],
            formData: {
              naam: '',
              omschrijving: '',
              // Add all boolean fields with defaults
              heeft_glijbaan: false,
              heeft_schommel: false,
              heeft_zandbak: false,
              heeft_kabelbaan: false,
              heeft_bankjes: false,
              heeft_sportveld: false,
              heeft_klimtoestel: false,
              heeft_water_pomp: false,
              heeft_skatebaan: false,
              heeft_basketbalveld: false,
              heeft_wipwap: false,
              heeft_duikelrek: false,
              heeft_toilet: false,
              heeft_parkeerplaats: false,
              heeft_horeca: false,
              heeft_panakooi: false,
              ondergrond_zand: false,
              ondergrond_gras: false,
              ondergrond_rubber: false,
              ondergrond_tegels: false,
              ondergrond_kunstgras: false,
              geschikt_peuters: false,
              geschikt_kleuters: false,
              geschikt_kinderen: false,
              is_omheind: false,
              heeft_schaduw: false,
              type_natuurspeeltuin: false,
              type_buurtspeeltuin: false,
              type_schoolplein: false,
              type_speelbos: false,
              grootte: 'middel' as const,
              badge: 'geen' as const,
            }
          };
        }
        
        groups[key].photos.push(photo);
      }
    }

    const locationGroups = Object.values(groups);
    setLocationGroups(locationGroups);
    
    if (locationGroups.length > 0) {
      toast({
        title: "Groepen gevonden!",
        description: `${locationGroups.length} locaties gevonden op basis van GPS data.`,
      });
    }
  };

  const handleFormChange = (field: string, value: any) => {
    setLocationGroups(prev => prev.map((group, index) => 
      index === currentGroupIndex 
        ? { ...group, formData: { ...group.formData, [field]: value } }
        : group
    ));
  };

  const uploadPhotosToStorage = async (photos: PhotoWithLocation[]): Promise<string[]> => {
    const urls: string[] = [];
    
    for (const photo of photos) {
      const fileName = `${Date.now()}-${photo.name}`;
      
      const { data, error } = await supabase.storage
        .from('speeltuin-fotos')
        .upload(fileName, photo.file);
      
      if (error) {
        console.error('Upload error:', error);
        continue;
      }
      
      const publicUrl = supabase.storage
        .from('speeltuin-fotos')
        .getPublicUrl(fileName).data.publicUrl;
      
      urls.push(publicUrl);
    }
    
    return urls;
  };

  const handleCreateSpeeltuin = async () => {
    const currentGroup = locationGroups[currentGroupIndex];
    
    if (!currentGroup.formData.naam) {
      toast({
        title: "Validatie Error",
        description: "Vul een naam in voor de speeltuin.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload photos to storage
      const photoUrls = await uploadPhotosToStorage(currentGroup.photos);
      
      if (photoUrls.length === 0) {
        throw new Error('Geen foto\'s geüpload');
      }

      const speeltuinData = {
        ...currentGroup.formData,
        latitude: currentGroup.latitude,
        longitude: currentGroup.longitude,
        fotos: photoUrls,
      } as Omit<Speeltuin, 'id' | 'created_at' | 'updated_at'>;

      await createSpeeltuinMutation.mutateAsync(speeltuinData);
      
      toast({
        title: "Succes!",
        description: `Speeltuin "${currentGroup.formData.naam}" aangemaakt met ${currentGroup.photos.length} foto's.`,
      });

      // Move to next group
      if (currentGroupIndex < locationGroups.length - 1) {
        setCurrentGroupIndex(currentGroupIndex + 1);
      }

    } catch (err) {
      toast({
        title: "Error",
        description: "Er is een fout opgetreden bij het aanmaken van de speeltuin.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const currentGroup = locationGroups[currentGroupIndex];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Foto Import Tool</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {locationGroups.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Upload foto's vanaf je telefoon met GPS data om speeltuinen te importeren.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                disabled={loading}
                size="lg"
              >
                {loading ? 'Laden...' : '📱 Foto\'s Uploaden vanaf Telefoon'}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Selecteer meerdere foto's met GPS data. Ze worden automatisch gegroepeerd per locatie.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Group Navigation */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Locatie {currentGroupIndex + 1} van {locationGroups.length}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentGroupIndex(Math.max(0, currentGroupIndex - 1))}
                    disabled={currentGroupIndex === 0}
                  >
                    Vorige
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentGroupIndex(Math.min(locationGroups.length - 1, currentGroupIndex + 1))}
                    disabled={currentGroupIndex === locationGroups.length - 1}
                  >
                    Volgende
                  </Button>
                </div>
              </div>

              {/* Current Group Info */}
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <h3 className="font-medium text-green-900">
                  Locatie: {currentGroup.latitude.toFixed(6)}, {currentGroup.longitude.toFixed(6)}
                </h3>
                <p className="text-sm text-green-700">
                  {currentGroup.photos.length} foto's op deze locatie
                </p>
              </div>

              {/* Photo Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-64 overflow-y-auto">
                {currentGroup.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                      {photo.name.length > 15 ? photo.name.substring(0, 15) + '...' : photo.name}
                    </div>
                    {photo.compressedSize && (
                      <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        {photo.compressedSize}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="naam">Naam van de speeltuin *</Label>
                    <Input
                      id="naam"
                      value={currentGroup.formData.naam}
                      onChange={(e) => handleFormChange('naam', e.target.value)}
                      placeholder="Bijv. Speeltuin Castricum Centrum"
                    />
                  </div>
                  <div>
                    <Label htmlFor="omschrijving">Omschrijving</Label>
                    <Textarea
                      id="omschrijving"
                      value={currentGroup.formData.omschrijving}
                      onChange={(e) => handleFormChange('omschrijving', e.target.value)}
                      placeholder="Beschrijving van de speeltuin..."
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {currentGroup.photos.length} foto's op deze locatie
                  </div>
                  <Button 
                    onClick={handleCreateSpeeltuin} 
                    disabled={loading}
                  >
                    {loading ? 'Aanmaken...' : 'Speeltuin Aanmaken'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPhotoImporter; 