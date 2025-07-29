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
      console.error('Upload error:', error);
      toast({
        title: "Upload mislukt",
        description: "Er is een fout opgetreden bij het uploaden van de afbeelding.",
        variant: "destructive",
      });
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
  const handleGallerySelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        handleFileUpload(file);
      });
    }
    // Reset input value to allow same file selection
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  }, [handleFileUpload]);

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

        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Badge Selectie */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4">Badge Selectie</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Selecteer welke badge getoond wordt op de speeltuinkaart. Kies er slechts één voor een clean design.
              </p>
              <div className="space-y-3">
                {[
                  // Toegankelijkheid
                  { key: 'rolstoelvriendelijk', label: 'Rolstoelvriendelijk', description: 'Voor toegankelijke speeltuinen' },
                  { key: 'babytoegankelijk', label: 'Babytoegankelijk', description: 'Voor peuters en baby\'s' },
                  
                  // Type speeltuin
                  { key: 'natuurspeeltuin', label: 'Natuurspeeltuin', description: 'Voor speeltuinen met natuurlijke elementen' },
                  { key: 'waterspeeltuin', label: 'Waterspeeltuin', description: 'Voor speeltuinen met waterelementen' },
                  { key: 'avonturenspeeltuin', label: 'Avonturenspeeltuin', description: 'Voor avontuurlijke speeltuinen' },
                  
                  // Voorzieningen
                  { key: 'toiletten', label: 'Toiletten', description: 'Voor speeltuinen met toilet voorzieningen' },
                  { key: 'parkeren', label: 'Parkeren', description: 'Voor speeltuinen met parkeervoorzieningen' },
                  { key: 'horeca', label: 'Horeca', description: 'Voor speeltuinen met horeca voorzieningen' },
                ].map(({ key, label, description }) => (
                  <div key={key} className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50">
                    <input
                      type="radio"
                      id={`badge-${key}`}
                      name="selected_badge"
                      checked={formData.selected_badge === key}
                      onChange={() => setFormData(prev => ({ ...prev, selected_badge: key as BadgeType }))}
                      className="h-4 w-4 mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`badge-${key}`} className="font-medium">{label}</Label>
                        {formData.selected_badge === key && (
                          <SpeeltuinBadge type={key as BadgeType} />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{description}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-start space-x-3 p-2 border rounded-md hover:bg-muted/50">
                  <input
                    type="radio"
                    id="badge-none"
                    name="selected_badge"
                    checked={formData.selected_badge === ''}
                    onChange={() => setFormData(prev => ({ ...prev, selected_badge: '' }))}
                    className="h-4 w-4 mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="badge-none" className="font-medium">Geen badge</Label>
                    <p className="text-xs text-muted-foreground mt-1">Geen badge tonen op de kaart</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="naam">Naam *</Label>
              <Input
                id="naam"
                value={formData.naam}
                onChange={(e) => setFormData(prev => ({ ...prev, naam: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="omschrijving">Omschrijving</Label>
              <Textarea
                id="omschrijving"
                value={formData.omschrijving}
                onChange={(e) => setFormData(prev => ({ ...prev, omschrijving: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          {/* GPS Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
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
              />
            </div>
          </div>

          {/* Grootte */}
          <div className="space-y-2">
            <Label>Grootte</Label>
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

          {/* Voorzieningen */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Voorzieningen</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                      setFormData(prev => ({ ...prev, [key]: checked }))
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Leeftijd */}
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Geschikt voor</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: 'geschikt_peuters', label: 'Peuters (0-3 jaar)' },
                { key: 'geschikt_kleuters', label: 'Kleuters (3-6 jaar)' },
                { key: 'geschikt_kinderen', label: 'Kinderen (6+ jaar)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'is_omheind', label: 'Omheind' },
                { key: 'heeft_schaduw', label: 'Schaduw' },
                { key: 'is_rolstoeltoegankelijk', label: 'Rolstoeltoegankelijk' },
                { key: 'heeft_horeca', label: 'Horeca nabij' },
                { key: 'heeft_toilet', label: 'Toilet beschikbaar' },
                { key: 'heeft_parkeerplaats', label: 'Parkeerplaats nabij' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
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
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSpeeltuinDialog;