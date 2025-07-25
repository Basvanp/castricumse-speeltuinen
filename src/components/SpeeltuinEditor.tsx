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
import * as exifr from 'exifr';

const SpeeltuinEditor = () => {
  const [formData, setFormData] = useState({
    naam: '',
    latitude: 0,
    longitude: 0,
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
    // Leeftijd
    geschikt_peuters: false,
    geschikt_kleuters: false,
    geschikt_kinderen: false,
    // Overig
    is_omheind: false,
    heeft_schaduw: false,
    is_rolstoeltoegankelijk: false,
  });

  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    
    try {
      // Extract EXIF data for GPS coordinates
      const exifData = await exifr.parse(file);
      
      if (exifData?.latitude && exifData?.longitude) {
        setFormData(prev => ({
          ...prev,
          latitude: exifData.latitude,
          longitude: exifData.longitude,
        }));
        toast({
          title: "GPS-locatie gevonden!",
          description: `Coördinaten automatisch ingesteld: ${exifData.latitude.toFixed(6)}, ${exifData.longitude.toFixed(6)}`,
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
    
    if (!formData.naam || !formData.latitude || !formData.longitude) {
      toast({
        title: "Verplichte velden",
        description: "Vul minimaal naam en locatie in.",
        variant: "destructive",
      });
      return;
    }

    // Generate Fixi copy text
    const fixiText = `Kapot speeltoestel bij ${formData.naam}, ${formData.latitude}, ${formData.longitude}`;

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
          latitude: 0,
          longitude: 0,
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
          geschikt_peuters: false,
          geschikt_kleuters: false,
          geschikt_kinderen: false,
          is_omheind: false,
          heeft_schaduw: false,
          is_rolstoeltoegankelijk: false,
        });
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
                EXIF GPS-data wordt automatisch uitgelezen
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
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
              required
            />
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

        {/* Overig */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-4">Overige kenmerken</h3>
            <div className="space-y-3">
              {[
                { key: 'is_omheind', label: 'Omheind' },
                { key: 'heeft_schaduw', label: 'Schaduw' },
                { key: 'is_rolstoeltoegankelijk', label: 'Rolstoeltoegankelijk' },
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