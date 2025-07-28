import React, { useState, useCallback, useEffect } from 'react';
import { useUpdateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, Camera, RefreshCw } from 'lucide-react';
import exifr from 'exifr';
import { Speeltuin } from '@/types/speeltuin';
import { compressImage, shouldCompress, getCompressionStats } from '@/utils/imageCompression';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface EditSpeeltuinDialogProps {
  speeltuin: Speeltuin | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditSpeeltuinDialog: React.FC<EditSpeeltuinDialogProps> = ({
  speeltuin,
  open,
  onOpenChange,
}) => {
  const [formData, setFormData] = useState({
    naam: '',
    latitude: null as number | null,
    longitude: null as number | null,
    omschrijving: '',
    afbeelding_url: '',
    fotos: [] as string[],
    // Voorzieningen
    heeft_glijbaan: false,
    heeft_schommel: false,
    heeft_zandbak: false,
    heeft_kabelbaan: false,
    heeft_bankjes: false,
    heeft_sportveld: false,
    // Ondergrond
    ondergrond_zand: false,
    ondergrond_gras: false,
    ondergrond_rubber: false,
    ondergrond_tegels: false,
    ondergrond_kunstgras: false,
    // Grootte
    grootte: 'middel' as 'klein' | 'middel' | 'groot',
    // Leeftijd
    geschikt_peuters: false,
    geschikt_kleuters: false,
    geschikt_kinderen: false,
    // Overig
    is_omheind: false,
    heeft_schaduw: false,
    is_rolstoeltoegankelijk: false,
    heeft_horeca: false,
    heeft_toilet: false,
    heeft_parkeerplaats: false,
  });

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gpsFromPhoto, setGpsFromPhoto] = useState(false);
  const { mutate: updateSpeeltuin, isPending } = useUpdateSpeeltuin();
  const { toast } = useToast();

  // Initialize form when speeltuin changes
  useEffect(() => {
    if (speeltuin) {
      // Convert fotos to string array
      let fotosArray: string[] = [];
      if (speeltuin.fotos) {
        if (Array.isArray(speeltuin.fotos)) {
          fotosArray = speeltuin.fotos.map(foto => 
            typeof foto === 'string' ? foto : foto.url
          );
        }
      }
      
      setFormData({
        naam: speeltuin.naam || '',
        latitude: speeltuin.latitude || null,
        longitude: speeltuin.longitude || null,
        omschrijving: speeltuin.omschrijving || '',
        afbeelding_url: speeltuin.afbeelding_url || '',
        fotos: fotosArray,
        heeft_glijbaan: speeltuin.heeft_glijbaan || false,
        heeft_schommel: speeltuin.heeft_schommel || false,
        heeft_zandbak: speeltuin.heeft_zandbak || false,
        heeft_kabelbaan: speeltuin.heeft_kabelbaan || false,
        heeft_bankjes: speeltuin.heeft_bankjes || false,
        heeft_sportveld: speeltuin.heeft_sportveld || false,
        ondergrond_zand: speeltuin.ondergrond_zand || false,
        ondergrond_gras: speeltuin.ondergrond_gras || false,
        ondergrond_rubber: speeltuin.ondergrond_rubber || false,
        ondergrond_tegels: speeltuin.ondergrond_tegels || false,
        ondergrond_kunstgras: speeltuin.ondergrond_kunstgras || false,
        grootte: speeltuin.grootte || 'middel',
        geschikt_peuters: speeltuin.geschikt_peuters || false,
        geschikt_kleuters: speeltuin.geschikt_kleuters || false,
        geschikt_kinderen: speeltuin.geschikt_kinderen || false,
        is_omheind: speeltuin.is_omheind || false,
        heeft_schaduw: speeltuin.heeft_schaduw || false,
        is_rolstoeltoegankelijk: speeltuin.is_rolstoeltoegankelijk || false,
        heeft_horeca: speeltuin.heeft_horeca || false,
        heeft_toilet: speeltuin.heeft_toilet || false,
        heeft_parkeerplaats: speeltuin.heeft_parkeerplaats || false,
      });
      setGpsFromPhoto(false);
    }
  }, [speeltuin]);

  // Convert GPS coordinates from various formats to decimal
  const convertGPSToDecimal = (gpsData: any, ref: string): number | null => {
    if (!gpsData) return null;
    
    let degrees = 0, minutes = 0, seconds = 0;
    
    if (Array.isArray(gpsData) && gpsData.length >= 3) {
      [degrees, minutes, seconds] = gpsData;
    } else if (typeof gpsData === 'string') {
      const matches = gpsData.match(/(\d+(?:\.\d+)?)[°\s]*(?:deg)?[\s]*(\d+(?:\.\d+)?)['\s]*(?:(\d+(?:\.\d+)?)["'\s]*)?/);
      if (matches) {
        degrees = parseFloat(matches[1]) || 0;
        minutes = parseFloat(matches[2]) || 0;
        seconds = parseFloat(matches[3]) || 0;
      }
    } else if (typeof gpsData === 'number') {
      return ref === 'S' || ref === 'W' ? -gpsData : gpsData;
    } else if (typeof gpsData === 'object' && gpsData.degrees !== undefined) {
      degrees = gpsData.degrees || 0;
      minutes = gpsData.minutes || 0;
      seconds = gpsData.seconds || 0;
    }
    
    let decimal = degrees + minutes / 60 + seconds / 3600;
    
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }
    
    return decimal;
  };

  const isValidGPS = (lat: number | null, lng: number | null): boolean => {
    if (lat === null || lng === null) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setGpsFromPhoto(false);
    
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Alleen JPEG toegestaan",
        description: "Alleen JPEG-afbeeldingen zijn toegestaan voor GPS-data extractie.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    
    try {
      let latitude = null;
      let longitude = null;

      try {
        const exifData = await exifr.parse(file, { gps: true });
        
        if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
          latitude = convertGPSToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef || 'N');
          longitude = convertGPSToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef || 'E');
          
          if (isValidGPS(latitude, longitude)) {
            setFormData(prev => ({
              ...prev,
              latitude,
              longitude,
            }));
            setGpsFromPhoto(true);
            toast({
              title: "GPS-locatie gevonden!",
              description: `Coördinaten automatisch ingesteld: ${latitude!.toFixed(6)}, ${longitude!.toFixed(6)}`,
            });
          }
        }
      } catch (error) {
        console.log('GPS extraction failed:', error);
      }

      // Compress large images automatically (>2MB)
      let fileToUpload = file;
      if (shouldCompress(file)) {
        try {
          console.log(`Original file size: ${(file.size / 1024).toFixed(1)}KB`);
          fileToUpload = await compressImage(file);
          console.log(`Compressed file size: ${(fileToUpload.size / 1024).toFixed(1)}KB`);
          
          const stats = getCompressionStats(file, fileToUpload);
          toast({
            title: "Foto gecomprimeerd",
            description: `Grootte gereduceerd van ${stats.originalSize} naar ${stats.compressedSize} (-${stats.compressionRatio})`,
          });
        } catch (error) {
          console.error('Compression failed:', error);
          
          // Final size check - reject if still too large after failed compression
          if (file.size > 10 * 1024 * 1024) {
            toast({
              title: "Bestand te groot",
              description: "Compressie mislukt en bestand is te groot (max 10MB).",
              variant: "destructive",
            });
            setUploading(false);
            return;
          }
          
          toast({
            title: "Compressie mislukt",
            description: "Foto wordt geüpload zonder compressie",
            variant: "destructive",
          });
        }
      } else if (file.size > 10 * 1024 * 1024) {
        // Final fallback for files that don't need compression but are still too large
        toast({
          title: "Bestand te groot",
          description: "De afbeelding mag maximaal 10MB zijn.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('speeltuin-fotos')
        .upload(fileName, fileToUpload);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('speeltuin-fotos')
        .getPublicUrl(fileName);

      // Add to fotos array
      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, publicUrl],
        afbeelding_url: prev.fotos.length === 0 ? publicUrl : prev.afbeelding_url, // Keep first photo as main image
      }));

      toast({
        title: "Afbeelding geüpload!",
        description: "Afbeelding is succesvol geüpload.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload mislukt",
        description: "Er is een fout opgetreden bij het uploaden van de afbeelding.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.naam) {
      toast({
        title: "Verplichte velden",
        description: "Vul een naam in.",
        variant: "destructive",
      });
      return;
    }

    if (!speeltuin) return;

    // Generate Fixi copy text
    const fixiText = formData.latitude && formData.longitude 
      ? `Kapot speeltoestel bij ${formData.naam}, ${formData.latitude}, ${formData.longitude}`
      : `Kapot speeltoestel bij ${formData.naam} (geen GPS-coördinaten beschikbaar)`;

    updateSpeeltuin({
      id: speeltuin.id,
      ...formData,
      fixi_copy_tekst: fixiText,
    }, {
      onSuccess: () => {
        toast({
          title: "Speeltuin bijgewerkt!",
          description: "De speeltuin is succesvol bijgewerkt.",
        });
        onOpenChange(false);
      },
      onError: (error) => {
        toast({
          title: "Fout bij bijwerken",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  if (!speeltuin) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Speeltuin bewerken</DialogTitle>
          <DialogDescription>
            Bewerk de details van {speeltuin.naam}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Afbeelding</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 ${
                dragOver 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/40'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {uploading ? (
                <div className="space-y-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground">Uploaden...</p>
                </div>
              ) : formData.afbeelding_url ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src={formData.afbeelding_url}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mx-auto shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors rounded-lg"></div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Huidige afbeelding
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/jpeg,image/jpg';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              toast({
                                title: "Afbeelding wordt vervangen",
                                description: "De nieuwe afbeelding wordt geüpload...",
                              });
                              handleFileUpload(file);
                            }
                          };
                          input.click();
                        }}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Vervang afbeelding
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/jpeg,image/jpg';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              handleFileUpload(file);
                            }
                          };
                          input.click();
                        }}
                        className="transition-all duration-200 hover:scale-105"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Nieuwe foto
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Of sleep een nieuwe afbeelding hiernaartoe
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Sleep afbeelding hier</p>
                    <p className="text-sm text-muted-foreground">
                      EXIF GPS-data wordt automatisch uitgelezen (optioneel)
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/jpeg,image/jpg';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            handleFileUpload(file);
                          }
                        };
                        input.click();
                      }}
                      className="mt-2"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Selecteer afbeelding
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="naam">Naam</Label>
              <Input
                id="naam"
                value={formData.naam}
                onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              {gpsFromPhoto && (
                <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">GPS-coördinaten uit foto gehaald</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : null }))}
                    disabled={gpsFromPhoto}
                    className={gpsFromPhoto ? "bg-muted text-muted-foreground" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : null }))}
                    disabled={gpsFromPhoto}
                    className={gpsFromPhoto ? "bg-muted text-muted-foreground" : ""}
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="omschrijving">Omschrijving</Label>
            <Textarea
              id="omschrijving"
              value={formData.omschrijving}
              onChange={(e) => setFormData(prev => ({ ...prev, omschrijving: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Voorzieningen */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Voorzieningen</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'heeft_glijbaan', label: 'Glijbaan' },
                { key: 'heeft_schommel', label: 'Schommel' },
                { key: 'heeft_zandbak', label: 'Zandbak' },
                { key: 'heeft_kabelbaan', label: 'Kabelbaan' },
                { key: 'heeft_bankjes', label: 'Bankjes' },
                { key: 'heeft_sportveld', label: 'Sportveld' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ondergrond */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Ondergrond</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { key: 'ondergrond_zand', label: 'Zand' },
                { key: 'ondergrond_gras', label: 'Gras' },
                { key: 'ondergrond_rubber', label: 'Rubber' },
                { key: 'ondergrond_tegels', label: 'Tegels' },
                { key: 'ondergrond_kunstgras', label: 'Kunstgras' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Grootte */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Grootte</Label>
            <RadioGroup
              value={formData.grootte}
              onValueChange={(value) => setFormData(prev => ({ ...prev, grootte: value as 'klein' | 'middel' | 'groot' }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="klein" id="klein" />
                <Label htmlFor="klein">Klein</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="middel" id="middel" />
                <Label htmlFor="middel">Middel</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="groot" id="groot" />
                <Label htmlFor="groot">Groot</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Leeftijd */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Geschikt voor</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: 'geschikt_peuters', label: 'Peuters (0-2 jaar)' },
                { key: 'geschikt_kleuters', label: 'Kleuters (3-5 jaar)' },
                { key: 'geschikt_kinderen', label: 'Kinderen (6+ jaar)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Overige eigenschappen */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Overige eigenschappen</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'is_omheind', label: 'Omheind' },
                { key: 'heeft_schaduw', label: 'Schaduw' },
                { key: 'is_rolstoeltoegankelijk', label: 'Rolstoeltoegankelijk' },
                { key: 'heeft_horeca', label: 'Horeca in de buurt' },
                { key: 'heeft_toilet', label: 'Toilet' },
                { key: 'heeft_parkeerplaats', label: 'Parkeerplaats' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, [key]: !!checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuleren
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Bijwerken...' : 'Bijwerken'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeeltuinDialog;