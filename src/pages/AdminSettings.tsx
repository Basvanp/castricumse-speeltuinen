import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useSiteSettings, useUpdateSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettingsFormData } from '@/types/siteSettings';
import { useBackup } from '@/hooks/useBackup';
import { 
  Settings, 
  Globe, 
  Search, 
  Map, 
  Download, 
  Shield, 
  Cookie,
  Mail,
  Palette,
  Database,
  Save,
  CheckCircle
} from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const { data: settings, isLoading, error } = useSiteSettings();
  const updateSettings = useUpdateSiteSettings();
  const { exportSpeeltuinenCSV, createBackup, isExporting, isBackingUp } = useBackup();
  const [formData, setFormData] = useState<SiteSettingsFormData>({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    facebook_url: '',
    instagram_url: '',
    twitter_url: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    default_zoom: 13,
    center_lat: 52.5455,
    center_lng: 4.6583,
    marker_color: '#3b82f6',
    cookie_consent_enabled: true,
    analytics_tracking_enabled: true,
    privacy_policy_text: '',
    maintenance_mode: false,
    maintenance_message: ''
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Update form data when settings are loaded
  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  // Check for changes
  useEffect(() => {
    if (settings) {
      const hasFormChanges = Object.keys(formData).some(key => {
        const k = key as keyof SiteSettingsFormData;
        return formData[k] !== settings[k];
      });
      setHasChanges(hasFormChanges);
    }
  }, [formData, settings]);

  const handleInputChange = (key: keyof SiteSettingsFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(formData);
      
      // Check if we're using default settings (database not available)
      const isUsingDefaults = formData.site_name === 'Speeltuinen Castricum' && 
                             formData.contact_email === 'info@castricum.nl';
      
      if (isUsingDefaults) {
        toast({
          title: "Instellingen bijgewerkt!",
          description: "Wijzigingen zijn toegepast (database tabel nog niet beschikbaar).",
        });
      } else {
        toast({
          title: "Instellingen opgeslagen!",
          description: "Alle wijzigingen zijn succesvol opgeslagen in de database.",
          
        });
      }
      
      setHasChanges(false);
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de instellingen.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Instellingen" description="Site-brede instellingen en configuratie">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Instellingen laden...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Instellingen" description="Site-brede instellingen en configuratie">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-4">Fout bij het laden van instellingen</p>
            <Button onClick={() => window.location.reload()}>Opnieuw proberen</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Instellingen" 
      description="Site-brede instellingen en configuratie"
    >
      <div className="max-w-4xl">
        <Tabs defaultValue="site" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="site" className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Site
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              SEO
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1">
              <Map className="h-3 w-3" />
              Kaart
            </TabsTrigger>
            <TabsTrigger value="backup" className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Onderhoud
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-1">
              <Cookie className="h-3 w-3" />
              Privacy
            </TabsTrigger>
          </TabsList>

          {/* Site Settings */}
          <TabsContent value="site" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Site Informatie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Naam</Label>
                  <Input 
                    id="site-name" 
                    value={formData.site_name}
                    onChange={(e) => handleInputChange('site_name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Beschrijving</Label>
                  <Textarea 
                    id="site-description" 
                    value={formData.site_description}
                    onChange={(e) => handleInputChange('site_description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email" 
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Telefoonnummer</Label>
                  <Input 
                    id="contact-phone" 
                    value={formData.contact_phone}
                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input 
                    id="facebook" 
                    placeholder="https://facebook.com/gemeente-castricum"
                    value={formData.facebook_url}
                    onChange={(e) => handleInputChange('facebook_url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input 
                    id="instagram" 
                    placeholder="https://instagram.com/gemeente_castricum"
                    value={formData.instagram_url}
                    onChange={(e) => handleInputChange('instagram_url', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X URL</Label>
                  <Input 
                    id="twitter" 
                    placeholder="https://twitter.com/gem_castricum"
                    value={formData.twitter_url}
                    onChange={(e) => handleInputChange('twitter_url', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  SEO Instellingen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta-title">Meta Title</Label>
                  <Input 
                    id="meta-title" 
                    value={formData.meta_title}
                    onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea 
                    id="meta-description" 
                    value={formData.meta_description}
                    onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input 
                    id="keywords" 
                    value={formData.keywords}
                    onChange={(e) => handleInputChange('keywords', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map Settings */}
          <TabsContent value="map" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Kaart Configuratie
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-zoom">Default Zoom Level</Label>
                  <Input 
                    id="default-zoom" 
                    type="number" 
                    min="10" 
                    max="18"
                    value={formData.default_zoom}
                    onChange={(e) => handleInputChange('default_zoom', Number(e.target.value))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="center-lat">Center Latitude</Label>
                    <Input 
                      id="center-lat" 
                      type="number"
                      step="0.0001"
                      value={formData.center_lat}
                      onChange={(e) => handleInputChange('center_lat', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="center-lng">Center Longitude</Label>
                    <Input 
                      id="center-lng" 
                      type="number"
                      step="0.0001"
                      value={formData.center_lng}
                      onChange={(e) => handleInputChange('center_lng', Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marker-color">Marker Kleur</Label>
                  <Input 
                    id="marker-color" 
                    type="color" 
                    value={formData.marker_color}
                    onChange={(e) => handleInputChange('marker_color', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Data Beheer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export Speeltuinen Data</h4>
                    <p className="text-sm text-muted-foreground">Download alle speeltuin gegevens als CSV</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={exportSpeeltuinenCSV}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporteren...' : 'Export CSV'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup Database</h4>
                    <p className="text-sm text-muted-foreground">Maak een volledige backup van de database</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={createBackup}
                    disabled={isBackingUp}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isBackingUp ? 'Backup maken...' : 'Backup Nu'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Settings */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Onderhoud Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Maintenance Mode</h4>
                    <p className="text-sm text-muted-foreground">Zet de site in onderhoudsmodus</p>
                  </div>
                  <Switch 
                    checked={formData.maintenance_mode}
                    onCheckedChange={(checked) => handleInputChange('maintenance_mode', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Onderhoud Bericht</Label>
                  <Textarea 
                    id="maintenance-message" 
                    value={formData.maintenance_message}
                    onChange={(e) => handleInputChange('maintenance_message', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cookie className="h-5 w-5" />
                  Privacy & Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Cookie Consent</h4>
                    <p className="text-sm text-muted-foreground">GDPR compliant cookie banner</p>
                  </div>
                  <Switch 
                    checked={formData.cookie_consent_enabled}
                    onCheckedChange={(checked) => handleInputChange('cookie_consent_enabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics Tracking</h4>
                    <p className="text-sm text-muted-foreground">Gebruiksstatistieken bijhouden</p>
                  </div>
                  <Switch 
                    checked={formData.analytics_tracking_enabled}
                    onCheckedChange={(checked) => handleInputChange('analytics_tracking_enabled', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacy-policy">Privacy Policy</Label>
                  <Textarea 
                    id="privacy-policy" 
                    rows={6}
                    value={formData.privacy_policy_text}
                    onChange={(e) => handleInputChange('privacy_policy_text', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button 
            size="lg" 
            onClick={handleSave}
            disabled={!hasChanges || updateSettings.isPending}
            className="min-w-[200px]"
          >
            {updateSettings.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Opslaan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Instellingen Opslaan
              </>
            )}
          </Button>
        </div>

        {/* Status indicator */}
        {!hasChanges && settings && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Instellingen zijn geladen</span>
              </div>
              <p className="text-xs text-green-700 text-center mt-1">
                {settings.site_name === 'Speeltuinen Castricum' && 
                 settings.contact_email === 'info@castricum.nl' ? 
                 'Gebruikt standaard instellingen (database tabel nog niet beschikbaar)' : 
                 'Instellingen zijn opgeslagen in de database'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;