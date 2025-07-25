import React, { useState, useCallback } from 'react';
import { useCreateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, CheckCircle } from 'lucide-react';
import exifr from 'exifr';

const SpeeltuinEditor = () => {
  const [formData, setFormData] = useState({
    naam: '',
    latitude: null as number | null,
    longitude: null as number | null,
    omschrijving: '',
    afbeelding_url: '',
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
  const { mutate: createSpeeltuin, isPending } = useCreateSpeeltuin();
  const { toast } = useToast();

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

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setGpsFromPhoto(false);
    
    // Enhanced file validation
    const maxSizeInMB = 10;
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    
    if (file.size > maxSizeInBytes) {
      toast({
        title: "Bestand te groot",
        description: `Het bestand mag niet groter zijn dan ${maxSizeInMB}MB.`,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    
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
    
    try {
      let latitude = null;
      let longitude = null;

      // Method 1: Simple EXIF parsing (primary method)
      try {
        const exifData = await exifr.parse(file, { gps: true });
        console.log('Method 1 - Simple EXIF:', exifData);
        
        if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
          latitude = convertGPSToDecimal(exifData.GPSLatitude, exifData.GPSLatitudeRef || 'N');
          longitude = convertGPSToDecimal(exifData.GPSLongitude, exifData.GPSLongitudeRef || 'E');
          
          if (isValidGPS(latitude, longitude)) {
            console.log('Method 1 success:', { latitude, longitude });
          } else {
            latitude = longitude = null;
          }
        }
      } catch (error) {
        console.log('Method 1 failed:', error);
      }

      // Method 2: Alternative field names (fallback)
      if (!isValidGPS(latitude, longitude)) {
        try {
          const exifData = await exifr.parse(file, { 
            gps: true,
            pick: ['latitude', 'longitude', 'GPS_Latitude', 'GPS_Longitude']
          });
          console.log('Method 2 - Alternative fields:', exifData);
          
          const latData = exifData?.latitude || exifData?.GPS_Latitude;
          const lonData = exifData?.longitude || exifData?.GPS_Longitude;
          
          if (latData && lonData) {
            latitude = typeof latData === 'number' ? latData : convertGPSToDecimal(latData, 'N');
            longitude = typeof lonData === 'number' ? lonData : convertGPSToDecimal(lonData, 'E');
            
            if (isValidGPS(latitude, longitude)) {
              console.log('Method 2 success:', { latitude, longitude });
            } else {
              latitude = longitude = null;
            }
          }
        } catch (error) {
          console.log('Method 2 failed:', error);
        }
      }

      // Method 3: Full EXIF scan (last resort)
      if (!isValidGPS(latitude, longitude)) {
        try {
          const exifData = await exifr.parse(file);
          console.log('Method 3 - Full scan:', exifData);
          
          // Look for any GPS-related fields
          for (const [key, value] of Object.entries(exifData || {})) {
            if (key.toLowerCase().includes('lat') && !latitude) {
              const converted = convertGPSToDecimal(value, 'N');
              if (converted && converted >= -90 && converted <= 90) {
                latitude = converted;
              }
            }
            if (key.toLowerCase().includes('lon') && !longitude) {
              const converted = convertGPSToDecimal(value, 'E');
              if (converted && converted >= -180 && converted <= 180) {
                longitude = converted;
              }
            }
          }
          
          if (isValidGPS(latitude, longitude)) {
            console.log('Method 3 success:', { latitude, longitude });
          }
        } catch (error) {
          console.log('Method 3 failed:', error);
        }
      }

      // Update form if GPS data was found
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
      } else {
        toast({
          title: "Geen GPS in foto",
          description: "Deze foto bevat geen GPS-coördinaten. Voer handmatig de locatie in.",
          variant: "default",
        });
      }

      // Generate description from filename
      const description = generateDescriptionFromFilename(file.name);
      setFormData(prev => ({
        ...prev,
        omschrijving: description,
      }));

      // Generate suggested name from filename
      const suggestedName = file.name
        .replace(/\.(jpg|jpeg|png|gif)$/i, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      setFormData(prev => ({
        ...prev,
        naam: `Speeltuin ${suggestedName}`,
      }));

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('speeltuin-fotos')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('speeltuin-fotos')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        afbeelding_url: publicUrl,
      }));

      toast({
        title: "Afbeelding geüpload!",
        description: "Afbeelding is succesvol geüpload en omschrijving gegenereerd.",
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

    // Generate Fixi copy text
    const fixiText = formData.latitude && formData.longitude 
      ? `Kapot speeltoestel bij ${formData.naam}, ${formData.latitude}, ${formData.longitude}`
      : `Kapot speeltoestel bij ${formData.naam} (geen GPS-coördinaten beschikbaar)`;

    createSpeeltuin({
      ...formData,
      fixi_copy_tekst: fixiText,
    }, {
      onSuccess: () => {
        toast({
          title: "Speeltuin toegevoegd!",
          description: "De nieuwe speeltuin is succesvol toegevoegd.",
        });
        // Reset form
        setFormData({
          naam: '',
          latitude: null,
          longitude: null,
          omschrijving: '',
          afbeelding_url: '',
          heeft_glijbaan: false,
          heeft_schommel: false,
          heeft_zandbak: false,
          heeft_kabelbaan: false,
          heeft_bankjes: false,
          heeft_sportveld: false,
          ondergrond_zand: false,
          ondergrond_gras: false,
          ondergrond_rubber: false,
          ondergrond_tegels: false,
          ondergrond_kunstgras: false,
          grootte: 'middel' as 'klein' | 'middel' | 'groot',
          geschikt_peuters: false,
          geschikt_kleuters: false,
          geschikt_kinderen: false,
          is_omheind: false,
          heeft_schaduw: false,
          is_rolstoeltoegankelijk: false,
          heeft_horeca: false,
          heeft_toilet: false,
          heeft_parkeerplaats: false,
        });
        setGpsFromPhoto(false);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {uploading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        ) : formData.afbeelding_url ? (
          <div className="space-y-4">
            <img
              src={formData.afbeelding_url}
              alt="Preview"
              className="w-full h-32 object-cover rounded mx-auto"
            />
            <p className="text-sm text-muted-foreground">
              Afbeelding geüpload! Sleep een nieuwe afbeelding om te vervangen.
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
  );
};

export default SpeeltuinEditor;