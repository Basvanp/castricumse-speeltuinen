import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Edit, Trash2, Eye } from 'lucide-react';

const AdminSpeeltuinen = () => {
  const { data: speeltuinen = [] } = useSpeeltuinen();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSpeeltuinen = speeltuinen.filter(speeltuin =>
    speeltuin.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speeltuin.omschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout 
      title="Speeltuinen Beheer" 
      description={`Beheer alle ${speeltuinen.length} speeltuinen`}
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Zoek speeltuinen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Speeltuinen List */}
        <div className="grid gap-4">
          {filteredSpeeltuinen.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">
                  {searchTerm ? 'Geen speeltuinen gevonden.' : 'Nog geen speeltuinen toegevoegd.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredSpeeltuinen.map((speeltuin) => (
              <Card key={speeltuin.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {speeltuin.afbeelding_url && (
                      <img
                        src={speeltuin.afbeelding_url}
                        alt={speeltuin.naam}
                        className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                      />
                    )}
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{speeltuin.naam}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {speeltuin.omschrijving || 'Geen omschrijving'}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{speeltuin.latitude?.toFixed(6)}, {speeltuin.longitude?.toFixed(6)}</span>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-2 ml-4">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {speeltuin.heeft_glijbaan && (
                          <Badge variant="secondary">Glijbaan</Badge>
                        )}
                        {speeltuin.heeft_schommel && (
                          <Badge variant="secondary">Schommel</Badge>
                        )}
                        {speeltuin.heeft_zandbak && (
                          <Badge variant="secondary">Zandbak</Badge>
                        )}
                        {speeltuin.heeft_kabelbaan && (
                          <Badge variant="secondary">Kabelbaan</Badge>
                        )}
                        {speeltuin.heeft_bankjes && (
                          <Badge variant="secondary">Bankjes</Badge>
                        )}
                        {speeltuin.heeft_sportveld && (
                          <Badge variant="secondary">Sportveld</Badge>
                        )}
                      </div>
                      
                      {/* Metadata */}
                      <div className="text-xs text-muted-foreground mt-3">
                        Toegevoegd: {new Date(speeltuin.created_at).toLocaleDateString('nl-NL')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSpeeltuinen;