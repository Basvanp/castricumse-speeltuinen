import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { useToast } from './ui/use-toast';
import { supabase } from '../integrations/supabase/client';
import { Speeltuin } from '../types/speeltuin';
import { Loader2, MapPin, Image, CheckCircle, XCircle } from 'lucide-react';
import { FileObject } from '@supabase/storage-js';
import exifr from 'exifr';

type PhotoFile = FileObject;

interface PhotoWithLocation {
  file: PhotoFile;
  url: string;
  latitude?: number;
  longitude?: number;
  locationKey: string;
  distance?: number;
  suggestedSpeeltuin?: Speeltuin;
}

interface LocationGroup {
  locationKey: string;
  latitude: number;
  longitude: number;
  photos: PhotoWithLocation[];
  suggestedSpeeltuin?: Speeltuin;
  selectedSpeeltuinId?: string;
  selectedPhotos: string[];
}

const AdminPhotoManager: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [locationGroups, setLocationGroups] = useState<LocationGroup[]>([]);
  const [speeltuinen, setSpeeltuinen] = useState<Speeltuin[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const { toast } = useToast();

  // Load all speeltuinen for dropdown selection
  const loadSpeeltuinen = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('speeltuinen')
        .select('*')
        .order('naam');

      if (error) throw error;
      setSpeeltuinen(data || []);
    } catch (error) {
      console.error('Error loading speeltuinen:', error);
      toast({
        title: "Fout",
        description: "Kon speeltuinen niet laden",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Calculate distance between two GPS coordinates
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find closest speeltuin to a location
  const findClosestSpeeltuin = (latitude: number, longitude: number): Speeltuin | undefined => {
    if (!speeltuinen.length) return undefined;

    let closest: Speeltuin | undefined;
    let minDistance = Infinity;

    speeltuinen.forEach(speeltuin => {
      if (speeltuin.latitude && speeltuin.longitude) {
        const distance = calculateDistance(
          latitude, 
          longitude, 
          speeltuin.latitude, 
          speeltuin.longitude
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = speeltuin;
        }
      }
    });

    return closest;
  };

  // Extract GPS coordinates from image metadata using EXIF data
  const extractGPSFromImage = async (file: PhotoFile): Promise<{ latitude?: number; longitude?: number }> => {
    try {
      // Get the public URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from('lovable-uploads')
        .getPublicUrl(file.name);

      // Fetch the image as a blob
      const response = await fetch(publicUrl);
      if (!response.ok) {
        console.warn(`Failed to fetch image: ${file.name}`);
        return { latitude: undefined, longitude: undefined };
      }

      const blob = await response.blob();
      
      // Parse EXIF data
      const exifData = await exifr.parse(blob, { gps: true });
      
      if (exifData && exifData.latitude && exifData.longitude) {
        return {
          latitude: exifData.latitude,
          longitude: exifData.longitude
        };
      }
      
      return { latitude: undefined, longitude: undefined };
    } catch (error) {
      console.warn(`Error extracting GPS from ${file.name}:`, error);
      return { latitude: undefined, longitude: undefined };
    }
  };

  // Load photos from Supabase bucket
  const loadPhotos = useCallback(async () => {
    setLoading(true);
    try {
      // List all files in the bucket
      const { data: files, error } = await supabase.storage
        .from('lovable-uploads')
        .list('', {
          limit: 1000,
          offset: 0,
        });

      if (error) throw error;

      if (!files || files.length === 0) {
        setLocationGroups([]);
        return;
      }

      // Filter for image files
      const imageFiles = files.filter(file => {
        const extension = file.name.toLowerCase().split('.').pop();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '');
      });

      if (imageFiles.length === 0) {
        setLocationGroups([]);
        return;
      }

      toast({
        title: "Foto's laden",
        description: `${imageFiles.length} foto's gevonden, GPS-coördinaten worden geëxtraheerd...`,
      });

      // Process each file to extract location data
      const photosWithLocation: PhotoWithLocation[] = [];
      let processedCount = 0;
      
      for (const file of imageFiles) {
        try {
          const url = supabase.storage
            .from('lovable-uploads')
            .getPublicUrl(file.name).data.publicUrl;

          // Try to extract GPS coordinates
          const { latitude, longitude } = await extractGPSFromImage(file);
          
          if (latitude && longitude) {
            // Round coordinates to 4 decimal places for grouping
            const locationKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
            
            photosWithLocation.push({
              file,
              url,
              latitude,
              longitude,
              locationKey,
            });
          }
          
          processedCount++;
          
          // Update progress every 10 photos
          if (processedCount % 10 === 0) {
            toast({
              title: "Verwerken...",
              description: `${processedCount}/${imageFiles.length} foto's verwerkt`,
            });
          }
        } catch (error) {
          console.warn(`Error processing ${file.name}:`, error);
          processedCount++;
        }
      }

      // Group photos by location
      const groups: { [key: string]: PhotoWithLocation[] } = {};
      photosWithLocation.forEach(photo => {
        if (!groups[photo.locationKey]) {
          groups[photo.locationKey] = [];
        }
        groups[photo.locationKey].push(photo);
      });

      // Convert to LocationGroup format
      const locationGroupsData: LocationGroup[] = Object.entries(groups).map(([locationKey, photos]) => {
        const avgLat = photos.reduce((sum, p) => sum + (p.latitude || 0), 0) / photos.length;
        const avgLon = photos.reduce((sum, p) => sum + (p.longitude || 0), 0) / photos.length;
        const suggestedSpeeltuin = findClosestSpeeltuin(avgLat, avgLon);

        return {
          locationKey,
          latitude: avgLat,
          longitude: avgLon,
          photos,
          suggestedSpeeltuin,
          selectedSpeeltuinId: suggestedSpeeltuin?.id,
          selectedPhotos: [],
        };
      });

      setLocationGroups(locationGroupsData);
      
      toast({
        title: "Klaar!",
        description: `${photosWithLocation.length} foto's met GPS-coördinaten gevonden in ${locationGroupsData.length} locaties`,
      });
    } catch (error) {
      console.error('Error loading photos:', error);
      toast({
        title: "Fout",
        description: "Kon foto's niet laden uit de bucket",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [speeltuinen, toast]);

  // Handle photo selection
  const handlePhotoSelection = (locationKey: string, photoName: string, selected: boolean) => {
    setLocationGroups(prev => prev.map(group => {
      if (group.locationKey === locationKey) {
        const selectedPhotos = selected
          ? [...group.selectedPhotos, photoName]
          : group.selectedPhotos.filter(name => name !== photoName);
        
        return { ...group, selectedPhotos };
      }
      return group;
    }));
  };

  // Handle speeltuin selection
  const handleSpeeltuinSelection = (locationKey: string, speeltuinId: string) => {
    setLocationGroups(prev => prev.map(group => {
      if (group.locationKey === locationKey) {
        return { ...group, selectedSpeeltuinId: speeltuinId };
      }
      return group;
    }));
  };

  // Assign photos to speeltuin
  const assignPhotosToSpeeltuin = async (group: LocationGroup) => {
    if (!group.selectedSpeeltuinId || group.selectedPhotos.length === 0) {
      toast({
        title: "Waarschuwing",
        description: "Selecteer een speeltuin en ten minste één foto",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Get current speeltuin data
      const { data: currentSpeeltuin, error: fetchError } = await supabase
        .from('speeltuinen')
        .select('fotos')
        .eq('id', group.selectedSpeeltuinId)
        .single();

      if (fetchError) throw fetchError;

      // Prepare new photo URLs
      const newPhotoUrls = group.selectedPhotos.map(photoName => {
        return supabase.storage
          .from('lovable-uploads')
          .getPublicUrl(photoName).data.publicUrl;
      });

      // Combine existing and new photos
      const existingPhotos = currentSpeeltuin.fotos || [];
      const updatedPhotos = [...existingPhotos, ...newPhotoUrls];

      // Update speeltuin
      const { error: updateError } = await supabase
        .from('speeltuinen')
        .update({ fotos: updatedPhotos })
        .eq('id', group.selectedSpeeltuinId);

      if (updateError) throw updateError;

      toast({
        title: "Succes",
        description: `${group.selectedPhotos.length} foto's toegevoegd aan speeltuin`,
      });

      // Clear selections for this group
      setLocationGroups(prev => prev.map(g => {
        if (g.locationKey === group.locationKey) {
          return { ...g, selectedPhotos: [] };
        }
        return g;
      }));

    } catch (error) {
      console.error('Error assigning photos:', error);
      toast({
        title: "Fout",
        description: "Kon foto's niet toewijzen aan speeltuin",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadSpeeltuinen();
  }, [loadSpeeltuinen]);

  useEffect(() => {
    if (speeltuinen.length > 0) {
      loadPhotos();
    }
  }, [speeltuinen, loadPhotos]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Foto's laden...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Foto Toewijzer</h1>
          <p className="text-muted-foreground">
            Wijs foto's toe aan speeltuinen op basis van GPS-locatie
          </p>
        </div>
        <Badge variant="secondary">
          {locationGroups.length} locaties gevonden
        </Badge>
      </div>

      {locationGroups.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">Geen foto's gevonden</h3>
            <p className="text-muted-foreground">
              Er zijn geen foto's met GPS-coördinaten gevonden in de bucket.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {locationGroups.map((group) => (
            <Card key={group.locationKey}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      Locatie: {group.latitude.toFixed(6)}, {group.longitude.toFixed(6)}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {group.photos.length} foto's
                    </Badge>
                    {group.suggestedSpeeltuin && (
                      <Badge variant="secondary">
                        Voorgesteld: {group.suggestedSpeeltuin.naam}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Speeltuin Selection */}
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium">Speeltuin:</label>
                    <Select
                      value={group.selectedSpeeltuinId || ''}
                      onValueChange={(value) => handleSpeeltuinSelection(group.locationKey, value)}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Selecteer een speeltuin" />
                      </SelectTrigger>
                      <SelectContent>
                        {speeltuinen.map((speeltuin) => (
                          <SelectItem key={speeltuin.id} value={speeltuin.id}>
                            {speeltuin.naam}
                            {speeltuin.latitude && speeltuin.longitude && (
                              <span className="text-muted-foreground ml-2">
                                ({calculateDistance(
                                  group.latitude,
                                  group.longitude,
                                  speeltuin.latitude,
                                  speeltuin.longitude
                                ).toFixed(2)} km)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Photo Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.photos.map((photo) => (
                      <div
                        key={photo.file.name}
                        className="relative border rounded-lg overflow-hidden group"
                      >
                        <img
                          src={photo.url}
                          alt={photo.file.name}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Checkbox
                            checked={group.selectedPhotos.includes(photo.file.name)}
                            onCheckedChange={(checked) => 
                              handlePhotoSelection(group.locationKey, photo.file.name, checked as boolean)
                            }
                            className="bg-white"
                          />
                        </div>
                        <div className="p-2 bg-background">
                          <p className="text-xs text-muted-foreground truncate">
                            {photo.file.name}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-muted-foreground">
                      {group.selectedPhotos.length} van {group.photos.length} foto's geselecteerd
                    </div>
                    <Button
                      onClick={() => assignPhotosToSpeeltuin(group)}
                      disabled={!group.selectedSpeeltuinId || group.selectedPhotos.length === 0 || uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Toewijzen aan Speeltuin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPhotoManager; 