import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUpdateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, Camera, RefreshCw, X, GripVertical, Plus, Eye } from 'lucide-react';
import exifr from 'exifr';
import { Speeltuin } from '@/types/speeltuin';
import { compressImage, shouldCompress, getCompressionStats } from '@/utils/imageCompression';
import SpeeltuinBadge, { BadgeType } from '@/components/SpeeltuinBadge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FotoItem {
  id: number;
  url: string;
  naam: string;
}

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
    fotos: [] as FotoItem[],
    selected_badge: '' as BadgeType | '',
    // Bouwjaar
    bouwjaar: null as number | null,
    // Grootte
    grootte: 'middel' as 'klein' | 'middel' | 'groot',
    // Voorzieningen
    heeft_glijbaan: false,
    heeft_schommel: false,
    heeft_zandbak: false,
    heeft_kabelbaan: false,
    heeft_bankjes: false,
    heeft_sportveld: false,
    heeft_klimtoestel: false,
    heeft_water_pomp: false,
    heeft_trapveld: false,
    heeft_skatebaan: false,
    heeft_basketbalveld: false,
    heeft_wipwap: false,
    heeft_duikelrek: false,
    heeft_toilet: false,
    heeft_parkeerplaats: false,
    heeft_horeca: false,
    // Ondergrond
    ondergrond_zand: false,
    ondergrond_gras: false,
    ondergrond_rubber: false,
    ondergrond_tegels: false,
    ondergrond_kunstgras: false,
    // Leeftijd
    geschikt_peuters: false,
    geschikt_kleuters: false,
    geschikt_kinderen: false,
    // Overig
    is_omheind: false,
    heeft_schaduw: false,
    is_rolstoeltoegankelijk: false,
    heeft_horeca_aanwezig: false,
    heeft_toilet_beschikbaar: false,
    heeft_parkeerplaats_nabij: false,
  });

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [gpsFromPhoto, setGpsFromPhoto] = useState(false);
  const [draggedPhoto, setDraggedPhoto] = useState<number | null>(null);
  const [dragOverPhoto, setDragOverPhoto] = useState<number | null>(null);
  const { mutate: updateSpeeltuin, isPending } = useUpdateSpeeltuin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initialize form when speeltuin changes
  useEffect(() => {
    if (speeltuin) {
      // Convert fotos to FotoItem array
      let fotosArray: FotoItem[] = [];
      if (speeltuin.fotos) {
        if (Array.isArray(speeltuin.fotos)) {
          fotosArray = speeltuin.fotos.map((foto, index) => ({
            id: Date.now() + index,
            url: typeof foto === 'string' ? foto : foto.url,
            naam: `Foto ${index + 1}`,
          }));
        }
      }
      
      setFormData({
        naam: speeltuin.naam || '',
        latitude: speeltuin.latitude || null,
        longitude: speeltuin.longitude || null,
        omschrijving: speeltuin.omschrijving || '',
        afbeelding_url: speeltuin.afbeelding_url || '',
        fotos: fotosArray,
        selected_badge: (speeltuin.badge as BadgeType) || '',
        bouwjaar: speeltuin.bouwjaar || null,
        grootte: speeltuin.grootte || 'middel',
        heeft_glijbaan: speeltuin.heeft_glijbaan || false,
        heeft_schommel: speeltuin.heeft_schommel || false,
        heeft_zandbak: speeltuin.heeft_zandbak || false,
        heeft_kabelbaan: speeltuin.heeft_kabelbaan || false,
        heeft_bankjes: speeltuin.heeft_bankjes || false,
        heeft_sportveld: speeltuin.heeft_sportveld || false,
        heeft_klimtoestel: speeltuin.heeft_klimtoestel || false,
        heeft_water_pomp: speeltuin.heeft_water_pomp || false,
        heeft_trapveld: speeltuin.heeft_trapveld || false,
        heeft_skatebaan: speeltuin.heeft_skatebaan || false,
        heeft_basketbalveld: speeltuin.heeft_basketbalveld || false,
        heeft_wipwap: speeltuin.heeft_wipwap || false,
        heeft_duikelrek: speeltuin.heeft_duikelrek || false,
        heeft_toilet: speeltuin.heeft_toilet || false,
        heeft_parkeerplaats: speeltuin.heeft_parkeerplaats || false,
        heeft_horeca: speeltuin.heeft_horeca || false,
        ondergrond_zand: speeltuin.ondergrond_zand || false,
        ondergrond_gras: speeltuin.ondergrond_gras || false,
        ondergrond_rubber: speeltuin.ondergrond_rubber || false,
        ondergrond_tegels: speeltuin.ondergrond_tegels || false,
        ondergrond_kunstgras: speeltuin.ondergrond_kunstgras || false,
        geschikt_peuters: speeltuin.geschikt_peuters || false,
        geschikt_kleuters: speeltuin.geschikt_kleuters || false,
        geschikt_kinderen: speeltuin.geschikt_kinderen || false,
        is_omheind: speeltuin.is_omheind || false,
        heeft_schaduw: speeltuin.heeft_schaduw || false,
        is_rolstoeltoegankelijk: speeltuin.is_rolstoeltoegankelijk || false,
        heeft_horeca_aanwezig: speeltuin.heeft_horeca_aanwezig || false,
        heeft_toilet_beschikbaar: speeltuin.heeft_toilet_beschikbaar || false,
        heeft_parkeerplaats_nabij: speeltuin.heeft_parkeerplaats_nabij || false,
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

  const handleFileUpload = useCallback(async (file: File, replacePhotoId?: number) => {
    setUploading(true);
    const isFirstPhoto = formData.fotos.length === 0;
    if (isFirstPhoto) {
      setGpsFromPhoto(false);
    }
    
    const allowedTypes = ['image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Alleen JPEG toegestaan",
        description: "Alleen JPEG-afbeeldingen zijn toegestaan voor GPS-data extractie.",
        variant: "destructive",
      });
      setUploading(false);
      throw new Error(`Invalid file type: ${file.type}`);
    }
    
    try {
      let latitude = null;
      let longitude = null;

      try {
        const exifData = await exifr.parse(file, { gps: true });
        
        if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
          latitude = convertGPSToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef || 'N');
          longitude = convertGPSToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef || 'E');
          
          if (isValidGPS(latitude, longitude) && isFirstPhoto) {
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
        // GPS extraction failed silently
      }

      // Compress large images automatically (>2MB)
      let fileToUpload = file;
      if (shouldCompress(file)) {
        try {
          fileToUpload = await compressImage(file);
          
          const stats = getCompressionStats(file, fileToUpload);
          toast({
            title: "Foto gecomprimeerd",
            description: `Grootte gereduceerd van ${stats.originalSize} naar ${stats.compressedSize} (-${stats.compressionRatio})`,
          });
        } catch (error) {
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

      // Create new photo item
      const newFoto: FotoItem = {
        id: Date.now() + Math.random(),
        url: publicUrl,
        naam: file.name,
      };

      // Update form data based on whether this is a replacement or addition
      setFormData(prev => {
        if (replacePhotoId) {
          // Replace specific photo
          const newFotos = prev.fotos.map(foto => 
            foto.id === replacePhotoId ? newFoto : foto
          );
          return {
            ...prev,
            fotos: newFotos,
            afbeelding_url: newFotos.length > 0 ? newFotos[0].url : '', // Keep first photo as main
          };
        } else {
          // Add as new photo
          const newFotos = [...prev.fotos, newFoto];
          return {
            ...prev,
            fotos: newFotos,
            afbeelding_url: prev.fotos.length === 0 ? publicUrl : prev.afbeelding_url, // Set as main if first
          };
        }
      });

      const actionText = replacePhotoId ? "vervangen" : "toegevoegd";
      toast({
        title: `Foto ${actionText}!`,
        description: `Foto is succesvol ${actionText}.`,
      });

    } catch (error) {
      toast({
        title: "Upload mislukt",
        description: `Er is een fout opgetreden bij het uploaden van ${file.name}.`,
        variant: "destructive",
      });
      throw error; // Re-throw to be caught by the calling function
    } finally {
      setUploading(false);
    }
  }, [toast, formData.fotos.length]);

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

  // Photo management functions
  const removeFoto = useCallback((id: number) => {
    setFormData(prev => {
      const newFotos = prev.fotos.filter(foto => foto.id !== id);
      return {
        ...prev,
        fotos: newFotos,
        afbeelding_url: newFotos.length > 0 ? newFotos[0].url : '', // Update main image
      };
    });
    toast({
      title: "Foto verwijderd",
      description: "De foto is verwijderd van de lijst.",
    });
  }, [toast]);

  // Drag and drop reordering for photos
  const handlePhototDragStart = useCallback((e: React.DragEvent, photoId: number) => {
    setDraggedPhoto(photoId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handlePhotoDragOver = useCallback((e: React.DragEvent, photoId: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverPhoto(photoId);
  }, []);

  const handlePhotoDragLeave = useCallback(() => {
    setDragOverPhoto(null);
  }, []);

  const handlePhotoDrop = useCallback((e: React.DragEvent, targetPhotoId: number) => {
    e.preventDefault();
    
    if (draggedPhoto === null || draggedPhoto === targetPhotoId) {
      setDraggedPhoto(null);
      setDragOverPhoto(null);
      return;
    }

    setFormData(prev => {
      const newFotos = [...prev.fotos];
      const draggedIndex = newFotos.findIndex(foto => foto.id === draggedPhoto);
      const targetIndex = newFotos.findIndex(foto => foto.id === targetPhotoId);
      
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const draggedItem = newFotos[draggedIndex];
        newFotos.splice(draggedIndex, 1);
        newFotos.splice(targetIndex, 0, draggedItem);
      }
      
      return { 
        ...prev, 
        fotos: newFotos,
        afbeelding_url: newFotos.length > 0 ? newFotos[0].url : '', // Update main image
      };
    });

    setDraggedPhoto(null);
    setDragOverPhoto(null);
    
    toast({
      title: "Foto volgorde gewijzigd",
      description: "De volgorde van de foto's is aangepast.",
    });
  }, [draggedPhoto, toast]);

  // Gallery upload handler
  const handleGallerySelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Upload files sequentially to avoid concurrent upload issues
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        await handleFileUpload(file);
        
        // Add small delay between uploads to prevent rate limiting
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        // Error is already handled in handleFileUpload
        continue;
      }
    }

    // Reset input value to allow same file selection
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.naam || !formData.latitude || !formData.longitude || !formData.grootte) {
      toast({
        title: "Verplichte velden",
        description: "Vul alle verplichte velden in (naam, coördinaten, grootte).",
        variant: "destructive",
      });
      return;
    }

    // Validate coordinate ranges
    if (formData.latitude < -90 || formData.latitude > 90) {
      toast({
        title: "Ongeldige breedtegraad",
        description: "Breedtegraad moet tussen -90 en 90 liggen.",
        variant: "destructive",
      });
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      toast({
        title: "Ongeldige lengtegraad",
        description: "Lengtegraad moet tussen -180 en 180 liggen.",
        variant: "destructive",
      });
      return;
    }

    if (!speeltuin) return;

    // Generate Fixi copy text
    const fixiText = formData.latitude && formData.longitude 
      ? `Kapot speeltoestel bij ${formData.naam}, ${formData.latitude}, ${formData.longitude}`
      : `Kapot speeltoestel bij ${formData.naam} (geen GPS-coördinaten beschikbaar)`;

    // Convert fotos to URL array and save badge to database
    const { selected_badge, fotos, ...speeltuinData } = formData;
    const fotosUrls = fotos.map(foto => foto.url);
    const afbeelding_url = fotos.length > 0 ? fotos[0].url : '';
    const badge = selected_badge || undefined;

    updateSpeeltuin({
      id: speeltuin.id,
      ...speeltuinData,
      afbeelding_url,
      fotos: fotosUrls,
      badge,
      fixi_copy_tekst: fixiText,
    }, {
      onSuccess: () => {
        toast({
          title: "Speeltuin bijgewerkt!",
          description: "De speeltuin is succesvol bijgewerkt.",
        });
        onOpenChange(false);
        navigate('/');
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

        <form onSubmit={handleSubmit} className="space-y-6 p-4">
          {/* Multi-Photo Upload */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">Foto's beheren</Label>
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
              ) : formData.fotos.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center">
                    Sleep foto's om de volgorde te wijzigen. De eerste foto wordt gebruikt als hoofdfoto.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground/50" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Sleep foto's hier</p>
                    <p className="text-sm text-muted-foreground">
                      EXIF GPS-data wordt automatisch uitgelezen (optioneel)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Photo Upload Buttons */}
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading}
                className="transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4 mr-2" />
                ➕ Extra foto toevoegen
              </Button>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/jpeg,image/jpg"
                multiple
                onChange={handleGallerySelect}
                className="hidden"
              />
            </div>

            {/* Photo Thumbnails Grid */}
            {formData.fotos.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Geüploade foto's ({formData.fotos.length})</h3>
                  {gpsFromPhoto && formData.fotos.length > 0 && (
                    <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                      📍 GPS uit eerste foto gebruikt
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {formData.fotos.map((foto, index) => (
                    <div
                      key={foto.id}
                      draggable
                      onDragStart={(e) => handlePhototDragStart(e, foto.id)}
                      onDragOver={(e) => handlePhotoDragOver(e, foto.id)}
                      onDragLeave={handlePhotoDragLeave}
                      onDrop={(e) => handlePhotoDrop(e, foto.id)}
                      className={`relative h-20 aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-move hover:border-primary/50 ${
                        dragOverPhoto === foto.id ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                      } ${draggedPhoto === foto.id ? 'opacity-50' : ''}`}
                    >
                      <img
                        src={foto.url}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Grip Handle */}
                      <div className="absolute top-1 left-1 bg-black/50 text-white rounded p-1">
                        <GripVertical className="h-3 w-3" />
                      </div>
                      
                      {/* Replace Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/jpeg,image/jpg';
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) {
                              toast({
                                title: "🔄 Foto wordt vervangen",
                                description: "De nieuwe foto wordt geüpload...",
                              });
                              handleFileUpload(file, foto.id);
                            }
                          };
                          input.click();
                        }}
                        className="absolute bottom-1 left-1 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors"
                        title="🔄 Foto vervangen"
                      >
                        <RefreshCw className="h-3 w-3" />
                      </button>
                      
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFoto(foto.id)}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                        title="🗑️ Foto verwijderen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      
                      {/* Photo Number */}
                      <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs rounded px-1">
                        {index + 1}
                      </div>
                      
                      {/* Main Photo Indicator */}
                      {index === 0 && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs rounded px-1">
                          Hoofd
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {gpsFromPhoto && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
              <p className="text-green-800 font-medium">📍 GPS-locatie automatisch ingevuld</p>
              <p className="text-green-700 mt-1">
                De coördinaten zijn uitgelezen uit de EXIF-data van je foto.
              </p>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="naam">Naam *</Label>
              <Input
                id="naam"
                value={formData.naam}
                onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="omschrijving">Omschrijving</Label>
              <Textarea
                id="omschrijving"
                value={formData.omschrijving}
                onChange={(e) => setFormData(prev => ({ ...prev, omschrijving: e.target.value }))}
                rows={3}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Breedtegraad *</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  latitude: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="Bijv. 52.370216"
                required
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Lengtegraad *</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  longitude: e.target.value ? parseFloat(e.target.value) : null 
                }))}
                placeholder="Bijv. 4.895168"
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Bouwjaar */}
          <div className="space-y-2">
            <Label htmlFor="bouwjaar">Bouwjaar (optioneel)</Label>
            <Input
              id="bouwjaar"
              type="number"
              value={formData.bouwjaar || ''}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                bouwjaar: e.target.value ? parseInt(e.target.value) : null 
              }))}
              placeholder="Bijvoorbeeld: 2020"
              min={1900}
              max={2025}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Grootte */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Grootte *</Label>
            <RadioGroup 
              value={formData.grootte} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, grootte: value as 'klein' | 'middel' | 'groot' }))}
              required
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="klein" id="grootte-klein" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <Label htmlFor="grootte-klein">Klein (buurt speeltuintje)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="middel" id="grootte-middel" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <Label htmlFor="grootte-middel">Middel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="groot" id="grootte-groot" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                  <Label htmlFor="grootte-groot">Groot (speelpark)</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Voorzieningen */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Voorzieningen</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'heeft_glijbaan', label: 'Glijbaan', id: 'voorz-glijbaan' },
                { key: 'heeft_schommel', label: 'Schommel', id: 'voorz-schommel' },
                { key: 'heeft_zandbak', label: 'Zandbak', id: 'voorz-zandbak' },
                { key: 'heeft_kabelbaan', label: 'Kabelbaan', id: 'voorz-kabelbaan' },
                { key: 'heeft_bankjes', label: 'Bankjes', id: 'voorz-bankjes' },
                { key: 'heeft_sportveld', label: 'Sportveld', id: 'voorz-sportveld' },
                { key: 'heeft_klimtoestel', label: 'Klimtoestel', id: 'voorz-klimtoestel' },
                { key: 'heeft_water_pomp', label: 'Water / pomp', id: 'voorz-water-pomp' },
                { key: 'heeft_trapveld', label: 'Panakooi', id: 'voorz-panakooi' },
                { key: 'heeft_skatebaan', label: 'Skatebaan', id: 'voorz-skatebaan' },
                { key: 'heeft_basketbalveld', label: 'Basketbalveld', id: 'voorz-basketbal' },
                { key: 'heeft_wipwap', label: 'Wipwap', id: 'voorz-wipwap' },
                { key: 'heeft_duikelrek', label: 'Duikelrek', id: 'voorz-duikelrek' },
                { key: 'heeft_toilet', label: 'Toilet', id: 'voorz-toilet' },
                { key: 'heeft_parkeerplaats', label: 'Parkeerplaats', id: 'voorz-parkeer' },
                { key: 'heeft_horeca', label: 'Horeca', id: 'voorz-horeca' },
              ].map(({ key, label, id }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor={id} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Ondergrond */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Ondergrond</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'ondergrond_zand', label: 'Zand', id: 'ond-zand' },
                { key: 'ondergrond_gras', label: 'Gras', id: 'ond-gras' },
                { key: 'ondergrond_rubber', label: 'Rubber', id: 'ond-rubber' },
                { key: 'ondergrond_tegels', label: 'Tegels', id: 'ond-tegels' },
                { key: 'ondergrond_kunstgras', label: 'Kunstgras', id: 'ond-kunstgras' },
              ].map(({ key, label, id }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor={id} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Geschikt voor */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Geschikt voor</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'geschikt_peuters', label: 'Peuters (0-2 jaar)', id: 'leef-peuters' },
                { key: 'geschikt_kleuters', label: 'Kleuters (3-5 jaar)', id: 'leef-kleuters' },
                { key: 'geschikt_kinderen', label: 'Kinderen (6+ jaar)', id: 'leef-kinderen' },
              ].map(({ key, label, id }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor={id} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Overige eigenschappen */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">Overige eigenschappen</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'is_omheind', label: 'Omheind', id: 'over-omheind' },
                { key: 'heeft_schaduw', label: 'Schaduw', id: 'over-schaduw' },
                { key: 'is_rolstoeltoegankelijk', label: 'Rolstoeltoegankelijk', id: 'over-rolstoel' },
                { key: 'heeft_horeca_aanwezig', label: 'Horeca aanwezig', id: 'over-horeca-aan' },
                { key: 'heeft_toilet_beschikbaar', label: 'Toilet beschikbaar', id: 'over-toilet-besch' },
                { key: 'heeft_parkeerplaats_nabij', label: 'Parkeerplaats nabij', id: 'over-parkeer-nabij' },
              ].map(({ key, label, id }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <Label htmlFor={id} className="text-sm">{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Selectie */}
          <div className="space-y-3 mb-6">
            <Label className="text-sm font-medium text-gray-700">Badge Selectie</Label>
            <p className="text-xs text-gray-500 mt-1">
              Selecteer welke badge getoond wordt op de speeltuinkaart. Kies er slechts één voor een clean design.
            </p>
            <div className="space-y-3">
              {[
                { key: 'rolstoelvriendelijk', label: 'Rolstoelvriendelijk', description: 'Voor toegankelijke speeltuinen', id: 'badge-rolstoel' },
                { key: 'babytoegankelijk', label: 'Babytoegankelijk', description: 'Voor peuters en baby\'s', id: 'badge-baby' },
                { key: 'natuurspeeltuin', label: 'Natuurspeeltuin', description: 'Voor speeltuinen met natuurlijke elementen', id: 'badge-natuur' },
                { key: 'waterspeeltuin', label: 'Waterspeeltuin', description: 'Voor speeltuinen met waterelementen', id: 'badge-water' },
                { key: 'avonturenspeeltuin', label: 'Avonturenspeeltuin', description: 'Voor avontuurlijke speeltuinen', id: 'badge-avontuur' },
                { key: 'toiletten', label: 'Toiletten', description: 'Voor speeltuinen met toilet voorzieningen', id: 'badge-toiletten' },
                { key: 'parkeren', label: 'Parkeren', description: 'Voor speeltuinen met parkeervoorzieningen', id: 'badge-parkeren' },
                { key: 'horeca_badge', label: 'Horeca', description: 'Voor speeltuinen met horeca voorzieningen', id: 'badge-horeca' },
              ].map(({ key, label, description, id }) => (
                <div key={key} className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50">
                  <input
                    type="radio"
                    id={id}
                    name="selected_badge"
                    checked={formData.selected_badge === key}
                    onChange={() => setFormData(prev => ({ ...prev, selected_badge: key as BadgeType }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={id} className="font-medium">{label}</Label>
                      {formData.selected_badge === key && (
                        <SpeeltuinBadge type={key as BadgeType} />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{description}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50">
                <input
                  type="radio"
                  id="badge-geen"
                  name="selected_badge"
                  checked={formData.selected_badge === ''}
                  onChange={() => setFormData(prev => ({ ...prev, selected_badge: '' }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-0.5"
                />
                <div className="flex-1">
                  <Label htmlFor="badge-geen" className="font-medium">Geen badge</Label>
                  <p className="text-xs text-gray-500 mt-1">Geen badge tonen op de kaart</p>
                </div>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors" 
            disabled={isPending || uploading}
          >
            {isPending ? (
              'Bezig met bijwerken...'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Speeltuin bijwerken
              </>
            )}
          </Button>
          
          <Button 
            type="button" 
            className="w-full bg-gray-300 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-400 transition-colors mt-2"
            onClick={() => onOpenChange(false)}
          >
            Annuleren
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeeltuinDialog;