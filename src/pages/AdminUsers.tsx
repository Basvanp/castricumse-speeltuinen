import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserPlus, Shield, Mail } from 'lucide-react';

const AdminUsers = () => {
  return (
    <AdminLayout 
      title="Gebruikers Beheer" 
      description="Beheer gebruikers, rollen en toegangsrechten"
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="text-lg font-semibold">Alle Gebruikers</span>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Gebruiker Uitnodigen
          </Button>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Gebruikersoverzicht</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* User Row 1 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">AD</span>
                  </div>
                  <div>
                    <div className="font-medium">Admin Gebruiker</div>
                    <div className="text-sm text-muted-foreground">admin@castricum.nl</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default">
                    <Shield className="h-3 w-3 mr-1" />
                    Admin
                  </Badge>
                  <Button variant="outline" size="sm">
                    Bewerken
                  </Button>
                </div>
              </div>

              {/* User Row 2 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">MB</span>
                  </div>
                  <div>
                    <div className="font-medium">Medewerker Beheer</div>
                    <div className="text-sm text-muted-foreground">medewerker@castricum.nl</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Editor
                  </Badge>
                  <Button variant="outline" size="sm">
                    Bewerken
                  </Button>
                </div>
              </div>

              {/* User Row 3 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">GU</span>
                  </div>
                  <div>
                    <div className="font-medium">Gast Gebruiker</div>
                    <div className="text-sm text-muted-foreground">gast@example.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Viewer
                  </Badge>
                  <Button variant="outline" size="sm">
                    Bewerken
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role Management */}
        <Card>
          <CardHeader>
            <CardTitle>Rol Beheer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-primary" />
                  <span className="font-medium">Admin</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Volledige toegang tot alle functies en instellingen
                </p>
                <div className="text-xs text-muted-foreground">1 gebruiker</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Editor</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Kan speeltuinen beheren en bewerken
                </p>
                <div className="text-xs text-muted-foreground">1 gebruiker</div>
              </div>

              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Viewer</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Alleen lezen toegang tot statistieken
                </p>
                <div className="text-xs text-muted-foreground">1 gebruiker</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note about future implementation */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Uitgebreid gebruikersbeheer met rol-gebaseerde toegangscontrole wordt binnenkort geïmplementeerd.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;