import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Database
} from 'lucide-react';

const AdminSettings = () => {
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
                  <Input id="site-name" defaultValue="Speeltuinen Castricum" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Beschrijving</Label>
                  <Textarea id="site-description" defaultValue="Ontdek alle speeltuinen in Castricum" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input id="contact-email" type="email" defaultValue="info@castricum.nl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Telefoonnummer</Label>
                  <Input id="contact-phone" defaultValue="0251-656565" />
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
                  <Input id="facebook" placeholder="https://facebook.com/gemeente-castricum" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram URL</Label>
                  <Input id="instagram" placeholder="https://instagram.com/gemeente_castricum" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter/X URL</Label>
                  <Input id="twitter" placeholder="https://twitter.com/gem_castricum" />
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
                  <Input id="meta-title" defaultValue="Speeltuinen Castricum - Vind de perfecte speeltuin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea 
                    id="meta-description" 
                    defaultValue="Ontdek alle speeltuinen in Castricum. Zoek op leeftijd, faciliteiten en locatie. Inclusief foto's, openingstijden en toegankelijkheidsinformatie."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input id="keywords" defaultValue="speeltuinen, castricum, kinderen, speelplaats, recreatie" />
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
                  <Input id="default-zoom" type="number" defaultValue="13" min="10" max="18" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="center-lat">Center Latitude</Label>
                    <Input id="center-lat" defaultValue="52.5455" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="center-lng">Center Longitude</Label>
                    <Input id="center-lng" defaultValue="4.6583" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marker-color">Marker Kleur</Label>
                  <Input id="marker-color" type="color" defaultValue="#3b82f6" />
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
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Backup Database</h4>
                    <p className="text-sm text-muted-foreground">Maak een volledige backup van de database</p>
                  </div>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Nu
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
                  <Switch />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenance-message">Onderhoud Bericht</Label>
                  <Textarea 
                    id="maintenance-message" 
                    defaultValue="We zijn bezig met onderhoud aan de website. Probeer het later opnieuw."
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
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analytics Tracking</h4>
                    <p className="text-sm text-muted-foreground">Gebruiksstatistieken bijhouden</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="privacy-policy">Privacy Policy</Label>
                  <Textarea 
                    id="privacy-policy" 
                    rows={6}
                    defaultValue="Deze website verzamelt minimale gegevens voor het verbeteren van de gebruikerservaring..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button size="lg">
            Instellingen Opslaan
          </Button>
        </div>

        {/* Note about future implementation */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Instellingen worden binnenkort gekoppeld aan de database voor persistent storage.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;