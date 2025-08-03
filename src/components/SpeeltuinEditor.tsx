import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle, Camera, MapPin, AlertTriangle, Eye, X, Image, GripVertical, Plus } from 'lucide-react';
import exifr from 'exifr';
import { compressImage, validateJPEGFile, shouldCompress, getCompressionStats } from '@/utils/imageCompression';
import SpeeltuinBadge, { BadgeType } from '@/components/SpeeltuinBadge';

interface FotoItem {
  id: number;
  url: string;
  naam: string;
}

const SpeeltuinEditor = () => {
  const [formData, setFormData] = useState({
    naam: '',
    latitude: null as number | null,
    longitude: null as number | null,
    omschrijving: '',
    fotos: [] as FotoItem[],
    bouwjaar: null as number | null,
    // Type speeltuin
    type_natuurspeeltuin: false,
    type_buurtspeeltuin: false,
    type_schoolplein: false,
    type_speelbos: false,
    // Voorzieningen - existing
    heeft_glijbaan: false,
    heeft_schommel: false,
    heeft_zandbak: false,
    heeft_kabelbaan: false,
    heeft_bankjes: false,
    heeft_sportveld: false,
    // Voorzieningen - new
    heeft_klimtoestel: false,
    heeft_water_pomp: false,
    heeft_panakooi: false,
    heeft_skatebaan: false,
    heeft_basketbalveld: false,
    heeft_wipwap: false,
    heeft_duikelrek: false,
    // Ondergrond
    ondergrond_zand: false,
    ondergrond_gras: false,
    ondergrond_rubber: false,
    ondergrond_tegels: false,
    ondergrond_kunstgras: false,
    // Grootte
    grootte: 'middel' as 'klein' | 'middel' | 'groot',
    // Leeftijd - existing
    geschikt_peuters: false,
    geschikt_kleuters: false,
    geschikt_kinderen: false,
    // Leeftijd - new specific
    leeftijd_0_2_jaar: false,
    leeftijd_2_6_jaar: false,
    leeftijd_6_12_jaar: false,
    leeftijd_12_plus_jaar: false,
    // Overig - existing
    is_omheind: false,
    heeft_schaduw: false,
    heeft_horeca: false,
    heeft_toilet: false,
    heeft_parkeerplaats: false,
    // Toegankelijkheid fields removed
    // Veiligheid & toezicht fields removed


    
    // Badge selectie (vereenvoudigd)
    selected_badge: '' as BadgeType | '',
  });

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [gpsFromPhoto, setGpsFromPhoto] = useState(false);
  const [gpsData, setGpsData] = useState<{ lat: number; lng: number; date?: string } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [draggedPhoto, setDraggedPhoto] = useState<number | null>(null);
  const [dragOverPhoto, setDragOverPhoto] = useState<number | null>(null);
  const { mutate: createSpeeltuin, isPending } = useCreateSpeeltuin();
  const { toast } = useToast();
  const navigate = useNavigate();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const generateDescriptionFromFilename = (filename: string) => {
    const name = filename.toLowerCase().replace(/\.(jpg|jpeg|png|gif)$/i, '');
    const keywords = {
      glijbaan: 'een glijbaan',
      schommel: 'schommels',
      zandbak: 'een zandbak',
      kabelbaan: 'een kabelbaan',
      bankje: 'bankjes',
      sport: 'een sportveld',
      klim: 'klimtoestellen',
      wip: 'wippen',
    };

    const found = [];
    for (const [key, description] of Object.entries(keywords)) {
      if (name.includes(key)) {
        found.push(description);
      }
    }

    if (found.length === 0) {
      return 'Een speeltuin met diverse speeltoestellen.';
    }

    if (found.length === 1) {
      return `Bevat ${found[0]}.`;
    }

    const last = found.pop();
    return `Bevat ${found.join(', ')} en ${last}.`;
  };

  // Convert GPS coordinates from various formats to decimal
  const convertGPSToDecimal = (gpsData: any, ref: string): number | null => {
    console.log('GPS conversion input:', { gpsData, ref, type: typeof gpsData });
    
    if (!gpsData) return null;
    
    let degrees = 0, minutes = 0, seconds = 0;
    
    // Handle different GPS data formats
    if (Array.isArray(gpsData) && gpsData.length >= 3) {
      // Standard array format: [degrees, minutes, seconds]
      [degrees, minutes, seconds] = gpsData;
    } else if (typeof gpsData === 'string') {
      // String format like "52 deg 33' 2.41" N" or "52°33'2.41""
      const matches = gpsData.match(/(\d+(?:\.\d+)?)[°\s]*(?:deg)?[\s]*(\d+(?:\.\d+)?)['\s]*(?:(\d+(?:\.\d+)?)["'\s]*)?/);
      if (matches) {
        degrees = parseFloat(matches[1]) || 0;
        minutes = parseFloat(matches[2]) || 0;
        seconds = parseFloat(matches[3]) || 0;
      }
    } else if (typeof gpsData === 'number') {
      // Already in decimal format
      return ref === 'S' || ref === 'W' ? -gpsData : gpsData;
    } else if (typeof gpsData === 'object' && gpsData.degrees !== undefined) {
      // Object format: {degrees: 52, minutes: 33, seconds: 2.41}
      degrees = gpsData.degrees || 0;
      minutes = gpsData.minutes || 0;
      seconds = gpsData.seconds || 0;
    }
    
    console.log('GPS components:', { degrees, minutes, seconds });
    
    // Convert to decimal
    let decimal = degrees + minutes / 60 + seconds / 3600;
    
    // Apply negative for South/West
    if (ref === 'S' || ref === 'W') {
      decimal = -decimal;
    }
    
    console.log('Final decimal:', decimal);
    return decimal;
  };

  // Validate GPS coordinates
  const isValidGPS = (lat: number | null, lng: number | null): boolean => {
    if (lat === null || lng === null) return false;
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  };

  // Get location name from coordinates using reverse geocoding
  const getLocationName = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CastriumSpeeltuinen/1.0'
          }
        }
      );
      
      if (!response.ok) throw new Error('Geocoding failed');
      
      const data = await response.json();
      const address = data.address;
      
      // Try to get street name, fallback to neighbourhood or suburb
      const streetName = address?.road || 
                        address?.pedestrian || 
                        address?.footway || 
                        address?.neighbourhood || 
                        address?.suburb || 
                        address?.hamlet || 
                        address?.village || 
                        address?.town || 
                        'Onbekende locatie';
      
      return streetName;
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return 'Onbekende locatie';
    }
  };

  // Get current device location
  const getCurrentLocation = useCallback(async (): Promise<{ lat: number; lng: number } | null> => {
    if (!navigator.geolocation) {
      toast({
        title: "Geen GPS ondersteuning",
        description: "Je apparaat ondersteunt geen GPS-locatie.",
        variant: "destructive",
      });
      return null;
    }

    setGettingLocation(true);
    
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGettingLocation(false);
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          setGettingLocation(false);
          console.error('GPS error:', error);
          toast({
            title: "GPS-locatie mislukt",
            description: "Kon huidige locatie niet verkrijgen. Controleer je locatie-instellingen.",
            variant: "destructive",
          });
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes cache
        }
      );
    });
  }, [toast]);

  const handleFileUpload = useCallback(async (file: File, fromCamera = false) => {
    setUploading(true);
    const isFirstPhoto = formData.fotos.length === 0;
    if (isFirstPhoto) {
      setGpsFromPhoto(false);
      setGpsData(null);
    }
    
    // Validate JPEG for camera uploads
    if (fromCamera) {
      const validation = validateJPEGFile(file);
      if (!validation.isValid) {
        toast({
          title: "Ongeldig bestandstype",
          description: validation.errorMessage,
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
    } else {
      // Validate file type - JPEG only for simplicity
      const allowedTypes = ['image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        const isHEIC = file.name.toLowerCase().includes('.heic');
        toast({
          title: "Alleen JPEG toegestaan",
          description: isHEIC 
            ? "HEIC-bestanden worden niet ondersteund. Maak JPEG-foto's in je camera-instellingen."
            : "Alleen JPEG-afbeeldingen zijn toegestaan voor GPS-data extractie.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }
    }
    
    try {
      let latitude = null;
      let longitude = null;
      let photoDate = null;

      // Extract EXIF data including GPS and date
      try {
        const exifData = await exifr.parse(file, { 
          gps: true, 
          pick: ['GPSLatitude', 'GPSLongitude', 'GPSLatitudeRef', 'GPSLongitudeRef', 'DateTimeOriginal', 'DateTime']
        });
        console.log('EXIF data:', exifData);
        
        // Extract GPS coordinates
        if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
          latitude = convertGPSToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef || 'N');
          longitude = convertGPSToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef || 'E');
          
          if (isValidGPS(latitude, longitude)) {
            console.log('GPS extraction success:', { latitude, longitude });
          } else {
            latitude = longitude = null;
          }
        }

        // Extract photo date
        photoDate = exifData?.DateTimeOriginal || exifData?.DateTime;
        if (photoDate) {
          console.log('Photo date:', photoDate);
        }
      } catch (error) {
        console.log('EXIF extraction failed:', error);
      }

      // Compress large images automatically (>2MB)
      let fileToUpload = file;
      if (shouldCompress(file)) {
        setCompressing(true);
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
            description: "Originele foto wordt gebruikt.",
            variant: "default",
          });
        }
        setCompressing(false);
      } else if (file.size > 10 * 1024 * 1024) {
        // Final fallback for files that don't need compression but are still too large
        toast({
          title: "Bestand te groot",
          description: "De foto mag maximaal 10MB zijn.",
          variant: "destructive",
        });
        setUploading(false);
        return;
      }

      // Generate description from filename for first photo
      if (isFirstPhoto) {
        const description = generateDescriptionFromFilename(file.name);
        setFormData(prev => ({
          ...prev,
          omschrijving: description,
        }));
      }

      // Update form if GPS data was found and it's the first photo
      if (isValidGPS(latitude, longitude) && isFirstPhoto) {
        setFormData(prev => ({
          ...prev,
          latitude,
          longitude,
        }));
        setGpsFromPhoto(true);
        setGpsData({ 
          lat: latitude!, 
          lng: longitude!, 
          date: photoDate ? new Date(photoDate).toLocaleString() : undefined 
        });
        
        // Get location name and update the speeltuin name
        try {
          console.log('Getting location name for:', latitude, longitude);
          const locationName = await getLocationName(latitude!, longitude!);
          console.log('Location name received:', locationName);
          setFormData(prev => ({
            ...prev,
            naam: `Speeltuin ${locationName}`,
          }));
        } catch (error) {
          console.error('Failed to get location name:', error);
          // Fallback to generic name
          setFormData(prev => ({
            ...prev,
            naam: `Speeltuin GPS-locatie`,
          }));
        }
        
        const dateInfo = photoDate ? ` (foto: ${new Date(photoDate).toLocaleString()})` : '';
        toast({
          title: "📍 GPS-locatie gevonden!",
          description: `Coördinaten: ${latitude?.toFixed(6)}, ${longitude?.toFixed(6)}${dateInfo}`,
        });
      } else if (isFirstPhoto) {
        // Handle cases for first photo without GPS
        if (fromCamera) {
          toast({
            title: "Geen GPS in foto",
            description: "Proberen huidige locatie te verkrijgen...",
            variant: "default",
          });
          
          const currentLocation = await getCurrentLocation();
          if (currentLocation) {
            setFormData(prev => ({
              ...prev,
              latitude: currentLocation.lat,
              longitude: currentLocation.lng,
            }));
            setGpsData({ 
              lat: currentLocation.lat, 
              lng: currentLocation.lng 
            });
            
            // Get location name and update the speeltuin name
            try {
              console.log('Getting location name for current location:', currentLocation);
              const locationName = await getLocationName(currentLocation.lat, currentLocation.lng);
              console.log('Current location name received:', locationName);
              setFormData(prev => ({
                ...prev,
                naam: `Speeltuin ${locationName}`,
              }));
            } catch (error) {
              console.error('Failed to get location name for current location:', error);
              // Fallback to generic name
              setFormData(prev => ({
                ...prev,
                naam: `Speeltuin Huidige locatie`,
              }));
            }
            
            toast({
              title: "📍 Huidige locatie gebruikt",
              description: `Coördinaten: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`,
            });
          } else {
            // No GPS available, use filename-based name
            const suggestedName = file.name
              .replace(/\.(jpg|jpeg|png|gif)$/i, '')
              .replace(/[_-]/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
            
            setFormData(prev => ({
              ...prev,
              naam: `Speeltuin ${suggestedName}`,
            }));
          }
        } else {
          // Drag & drop without GPS - use filename
          const suggestedName = file.name
            .replace(/\.(jpg|jpeg|png|gif)$/i, '')
            .replace(/[_-]/g, ' ')
            .replace(/\b\w/g, l => l.toUpperCase());
          
          setFormData(prev => ({
            ...prev,
            naam: `Speeltuin ${suggestedName}`,
          }));
          
          if (isFirstPhoto) {
            toast({
              title: "Geen GPS in foto",
              description: "Deze foto bevat geen GPS-coördinaten. Voer handmatig de locatie in.",
              variant: "default",
            });
          }
        }
      }

      // Upload file to Supabase Storage
      const fileExt = fileToUpload.name.split('.').pop();
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

      // Add photo to fotos array
      const newFoto: FotoItem = {
        id: Date.now() + Math.random(),
        url: publicUrl,
        naam: file.name,
      };

      setFormData(prev => ({
        ...prev,
        fotos: [...prev.fotos, newFoto],
      }));

      toast({
        title: "Foto toegevoegd!",
        description: `Foto ${formData.fotos.length + 1} is succesvol geüpload.`,
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
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    // Upload all image files
    imageFiles.forEach(file => {
      handleFileUpload(file);
    });
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  // Camera upload handler
  const handleCameraCapture = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, true);
    }
    // Reset input value to allow same file selection
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  const openCamera = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  // Gallery upload handler
  const handleGallerySelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        handleFileUpload(file, false);
      });
    }
    // Reset input value to allow same file selection
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  }, [handleFileUpload]);

  // Photo management functions
  const removeFoto = useCallback((id: number) => {
    setFormData(prev => ({
      ...prev,
      fotos: prev.fotos.filter(foto => foto.id !== id),
    }));
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
      
      return { ...prev, fotos: newFotos };
    });

    setDraggedPhoto(null);
    setDragOverPhoto(null);
    
    toast({
      title: "Foto volgorde gewijzigd",
      description: "De volgorde van de foto's is aangepast.",
    });
  }, [draggedPhoto, toast]);

  // Generate badges based on form data (simplified)
  const getActiveBadges = (): BadgeType[] => {
    const badges: BadgeType[] = [];
    
    // Type speeltuin
    if (formData.type_natuurspeeltuin) badges.push('natuurspeeltuin' as BadgeType);
    if (formData.heeft_water_pomp) badges.push('waterspeeltuin' as BadgeType);
    
    // Voorzieningen
    if (formData.heeft_toilet) badges.push('toiletten' as BadgeType);
    if (formData.heeft_parkeerplaats) badges.push('parkeren' as BadgeType);
    if (formData.heeft_horeca) badges.push('horeca' as BadgeType);
    
    // Return only the first badge for clean design
    return badges.slice(0, 1);
  };

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

    // Generate Fixi copy text
    const fixiText = formData.latitude && formData.longitude 
      ? `Kapot speeltoestel bij ${formData.naam}, ${formData.latitude}, ${formData.longitude}`
      : `Kapot speeltoestel bij ${formData.naam} (geen GPS-coördinaten beschikbaar)`;

    // Save selected_badge to database
    const { selected_badge, fotos, ...speeltuinData } = formData;
    
    const fotosUrls = fotos.map(foto => foto.url);
    const badge = (selected_badge || 'geen') as 'rolstoelvriendelijk' | 'babytoegankelijk' | 'natuurspeeltuin' | 'waterspeeltuin' | 'avonturenspeeltuin' | 'toiletten' | 'parkeren' | 'horeca' | 'geen';
    
    // Log the data being sent for debugging
    const speeltuinToCreate = {
      ...speeltuinData,
      fotos: fotosUrls,
      badge,
      fixi_copy_tekst: fixiText,
    };
    console.log('Creating speeltuin with data:', speeltuinToCreate);
    
    createSpeeltuin(speeltuinToCreate, {
      onSuccess: () => {
        toast({
          title: "Speeltuin toegevoegd!",
          description: "De nieuwe speeltuin is succesvol toegevoegd.",
        });
        // Navigate to overview page
        navigate('/');
        // Reset form
        setFormData({
          naam: '',
          latitude: null,
          longitude: null,
          omschrijving: '',
          fotos: [],
          bouwjaar: null,
          // Type speeltuin
          type_natuurspeeltuin: false,
          type_buurtspeeltuin: false,
          type_schoolplein: false,
          type_speelbos: false,
          // Voorzieningen - existing
          heeft_glijbaan: false,
          heeft_schommel: false,
          heeft_zandbak: false,
          heeft_kabelbaan: false,
          heeft_bankjes: false,
          heeft_sportveld: false,
          // Voorzieningen - new
          heeft_klimtoestel: false,
          heeft_water_pomp: false,
          heeft_panakooi: false,
          heeft_skatebaan: false,
          heeft_basketbalveld: false,
          heeft_wipwap: false,
          heeft_duikelrek: false,
          // Ondergrond
          ondergrond_zand: false,
          ondergrond_gras: false,
          ondergrond_rubber: false,
          ondergrond_tegels: false,
          ondergrond_kunstgras: false,
          // Grootte
          grootte: 'middel' as 'klein' | 'middel' | 'groot',
          // Leeftijd - existing
          geschikt_peuters: false,
          geschikt_kleuters: false,
          geschikt_kinderen: false,
          // Leeftijd - new specific
          leeftijd_0_2_jaar: false,
          leeftijd_2_6_jaar: false,
          leeftijd_6_12_jaar: false,
          leeftijd_12_plus_jaar: false,
          // Overig - existing
          is_omheind: false,
          heeft_schaduw: false,
          heeft_horeca: false,
          heeft_toilet: false,
          heeft_parkeerplaats: false,
          // Toegankelijkheid fields removed
          // Veiligheid & toezicht fields removed


          
  
  
  
          // Badge selectie (vereenvoudigd)
          selected_badge: '' as BadgeType | '',
        });
        setGpsFromPhoto(false);
        setGpsData(null);
      },
      onError: (error) => {
        toast({
          title: "Fout bij toevoegen",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const activeBadges = getActiveBadges();

  return (
    <div className="space-y-6">
      {/* Badge Preview */}
      {activeBadges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Badge Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {activeBadges.map((badgeType, index) => (
                <SpeeltuinBadge key={index} type={badgeType} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Deze badge zal zichtbaar zijn op de speeltuinkaart (alleen de eerste badge wordt getoond voor een clean design).
            </p>
          </CardContent>
        </Card>
      )}

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Multi-Photo Upload */}
      <div className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-gray-200'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {uploading || compressing || gettingLocation ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                {gettingLocation ? 'GPS-locatie verkrijgen...' : compressing ? 'Foto wordt gecomprimeerd...' : 'Uploaden...'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">Sleep afbeelding hier</p>
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
            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg gap-2"
            onClick={openCamera}
            disabled={uploading || compressing || gettingLocation}
          >
            <Camera className="h-4 w-4" />
            Maak foto
          </Button>
          <Button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-2 rounded-lg gap-2"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading || compressing || gettingLocation}
          >
            <Image className="h-4 w-4" />
            Kies uit gallery
          </Button>
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/jpeg"
            capture="environment"
            onChange={handleCameraCapture}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGallerySelect}
            className="hidden"
          />
        </div>

        {/* Photo Thumbnails Grid */}
        {formData.fotos.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Toegevoegde foto's ({formData.fotos.length})</h3>
              {gpsFromPhoto && formData.fotos.length > 0 && (
                <div className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  📍 GPS uit eerste foto gebruikt
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Sleep foto's om de volgorde te wijzigen. De eerste foto wordt gebruikt als hoofdfoto.
            </p>
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
                    dragOverPhoto === foto.id ? 'border-primary bg-primary/5' : 'border-gray-200'
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
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFoto(foto.id)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  
                  {/* Photo Number */}
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                  
                  {/* Main Photo Indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-1 right-1 bg-green-500 text-white text-xs px-1 rounded">
                      Hoofd
                    </div>
                  )}
                  
                  {/* GPS Indicator for first photo */}
                  {index === 0 && gpsFromPhoto && (
                    <div className="absolute top-1 right-8 bg-green-500 text-white rounded-full p-1">
                      <MapPin className="h-2 w-2" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add More Button */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={uploading || compressing || gettingLocation}
                className="h-20 aspect-square border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Plus className="h-6 w-6" />
                <span className="text-xs mt-1">Voeg toe</span>
              </button>
            </div>
            
            {/* GPS Data Display */}
            {gpsData && (
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                📍 GPS: {gpsData.lat.toFixed(6)}, {gpsData.lng.toFixed(6)}
                {gpsData.date && <><br />📅 {gpsData.date}</>}
              </div>
            )}
          </div>
        )}

        {/* GPS Warning for photos without location */}
        {formData.fotos.length > 0 && !gpsFromPhoto && (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-md">
            <AlertTriangle className="h-4 w-4 text-orange-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-orange-700">Geen GPS-locatie gevonden</p>
              <p className="text-orange-600">Voer handmatig de coördinaten in of maak een nieuwe foto met locatieservices aan.</p>
            </div>
          </div>
        )}
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

      <div>
        <Label htmlFor="bouwjaar">Bouwjaar (optioneel)</Label>
        <Input
          id="bouwjaar"
          type="number"
          min="1900"
          max={new Date().getFullYear()}
          value={formData.bouwjaar || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, bouwjaar: e.target.value ? parseInt(e.target.value) : null }))}
          placeholder="Bijv. 2020"
        />
      </div>

      {/* Checkboxes in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Voorzieningen */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Voorzieningen</h3>
            <div className="space-y-3">
              {[
                { key: 'heeft_glijbaan', label: 'Glijbaan' },
                { key: 'heeft_schommel', label: 'Schommel' },
                { key: 'heeft_zandbak', label: 'Zandbak' },
                { key: 'heeft_kabelbaan', label: 'Kabelbaan' },
                { key: 'heeft_bankjes', label: 'Bankjes' },
                { key: 'heeft_sportveld', label: 'Sportveld' },
                { key: 'heeft_klimtoestel', label: 'Klimtoestel' },
                { key: 'heeft_water_pomp', label: 'Water / pomp' },
                { key: 'heeft_panakooi', label: 'Panakooi' },
                { key: 'heeft_skatebaan', label: 'Skatebaan' },
                { key: 'heeft_basketbalveld', label: 'Basketbalveld' },
                { key: 'heeft_wipwap', label: 'Wipwap' },
                { key: 'heeft_duikelrek', label: 'Duikelrek' },
                { key: 'heeft_toilet', label: 'Toilet' },
                { key: 'heeft_parkeerplaats', label: 'Parkeerplaats' },
                { key: 'heeft_horeca', label: 'Horeca' },
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
          </CardContent>
        </Card>

        {/* Ondergrond */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Ondergrond</h3>
            <div className="space-y-3">
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
          </CardContent>
        </Card>

        {/* Leeftijd */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Geschikt voor</h3>
            <div className="space-y-3">
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
                      setFormData(prev => ({ ...prev, [key]: checked }))
                    }
                  />
                  <Label htmlFor={key}>{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grootte */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Grootte</h3>
            <div className="space-y-3">
              {[
                { key: 'klein', label: 'Klein (buurt speeltuintje)' },
                { key: 'middel', label: 'Middel' },
                { key: 'groot', label: 'Groot (speelpark)' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={`grootte-${key}`}
                    name="grootte"
                    checked={formData.grootte === key}
                    onChange={() => setFormData(prev => ({ ...prev, grootte: key as 'klein' | 'middel' | 'groot' }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor={`grootte-${key}`}>{label}</Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overig */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Overige kenmerken</h3>
            <div className="space-y-3">
              {[
                { key: 'is_omheind', label: 'Omheind' },
                { key: 'heeft_schaduw', label: 'Schaduw' },
                { key: 'is_rolstoeltoegankelijk', label: 'Rolstoeltoegankelijk' },
                { key: 'heeft_horeca', label: 'Horeca aanwezig' },
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
          </CardContent>
        </Card>

        {/* Type Speeltuin */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Type Speeltuin</h3>
            <div className="space-y-3">
              {[
                { key: 'type_natuurspeeltuin', label: 'Natuurspeeltuin' },
                { key: 'type_buurtspeeltuin', label: 'Buurt speeltuin' },
                { key: 'type_schoolplein', label: 'Schoolplein' },
                { key: 'type_speelbos', label: 'Speelbos' },
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
          </CardContent>
        </Card>

        {/* Leeftijdsgroep (Specifiek) */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Leeftijdsgroep (Specifiek)</h3>
            <div className="space-y-3">
              {[
                { key: 'leeftijd_0_2_jaar', label: '0-2 jaar' },
                { key: 'leeftijd_2_6_jaar', label: '2-6 jaar' },
                { key: 'leeftijd_6_12_jaar', label: '6-12 jaar' },
                { key: 'leeftijd_12_plus_jaar', label: '12+ jaar' },
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
          </CardContent>
        </Card>

        {/* Toegankelijkheid */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Toegankelijkheid</h3>
            <div className="space-y-3">
              {[
                { key: 'toegang_zichtbaar_omheind', label: 'Zichtbaar omheind' },
                { key: 'toegang_zonder_drempel', label: 'Zonder drempel' },
                { key: 'speeltoestellen_voor_beperking', label: 'Speeltoestellen voor beperking' },
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
          </CardContent>
        </Card>

        {/* Veiligheid & Toezicht section removed */}





        {/* Badge Selectie (vereenvoudigd) */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Badge Selectie</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Selecteer welke badge getoond wordt op de speeltuinkaart. Kies er slechts één voor een clean design.
            </p>
            <div className="space-y-3">
              {[
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

      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isPending || uploading}
      >
        {isPending ? (
          'Bezig met toevoegen...'
        ) : (
          <>
            <CheckCircle className="h-4 w-4 mr-2" />
            ✅ Publiceer speeltuin
          </>
        )}
      </Button>
    </form>
    </div>
  );
};

export default SpeeltuinEditor;