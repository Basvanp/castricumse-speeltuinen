import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useSpeeltuinen, useDeleteSpeeltuin, useUpdateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search, Edit, Trash2, Eye } from 'lucide-react';
import EditSpeeltuinDialog from '@/components/EditSpeeltuinDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminSpeeltuinen = () => {
  const { data: speeltuinen = [] } = useSpeeltuinen();
  const deleteSpeeltuin = useDeleteSpeeltuin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState(null);
  const [editingSpeeltuin, setEditingSpeeltuin] = useState(null);

  const filteredSpeeltuinen = speeltuinen.filter(speeltuin =>
    speeltuin.naam.toLowerCase().includes(searchTerm.toLowerCase()) ||
    speeltuin.omschrijving?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (speeltuin) => {
    setSelectedSpeeltuin(speeltuin);
  };

  const handleEdit = (speeltuin) => {
    setEditingSpeeltuin(speeltuin);
  };

  const handleDelete = (id) => {
    deleteSpeeltuin.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Speeltuin verwijderd",
          description: "De speeltuin is succesvol verwijderd.",
        });
      },
      onError: (error) => {
        toast({
          title: "Fout bij verwijderen",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

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
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => handleView(speeltuin)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>{speeltuin.naam}</DialogTitle>
                                <DialogDescription>
                                  Bekijk alle details van deze speeltuin
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                {speeltuin.afbeelding_url && (
                                  <img
                                    src={speeltuin.afbeelding_url}
                                    alt={speeltuin.naam}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium">Omschrijving</h4>
                                  <p className="text-muted-foreground">{speeltuin.omschrijving || 'Geen omschrijving'}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Locatie</h4>
                                  <p className="text-muted-foreground">
                                    {speeltuin.latitude?.toFixed(6)}, {speeltuin.longitude?.toFixed(6)}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Voorzieningen</h4>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {speeltuin.heeft_glijbaan && <Badge variant="secondary">Glijbaan</Badge>}
                                    {speeltuin.heeft_schommel && <Badge variant="secondary">Schommel</Badge>}
                                    {speeltuin.heeft_zandbak && <Badge variant="secondary">Zandbak</Badge>}
                                    {speeltuin.heeft_kabelbaan && <Badge variant="secondary">Kabelbaan</Badge>}
                                    {speeltuin.heeft_bankjes && <Badge variant="secondary">Bankjes</Badge>}
                                    {speeltuin.heeft_sportveld && <Badge variant="secondary">Sportveld</Badge>}
                                    {!speeltuin.heeft_glijbaan && !speeltuin.heeft_schommel && !speeltuin.heeft_zandbak && 
                                     !speeltuin.heeft_kabelbaan && !speeltuin.heeft_bankjes && !speeltuin.heeft_sportveld && (
                                      <span className="text-muted-foreground">Geen voorzieningen opgegeven</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button size="sm" variant="outline" onClick={() => handleEdit(speeltuin)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Speeltuin verwijderen</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Weet je zeker dat je "{speeltuin.naam}" wilt verwijderen? 
                                  Deze actie kan niet ongedaan worden gemaakt.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(speeltuin.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Verwijderen
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

        {/* Edit Dialog */}
        <EditSpeeltuinDialog
          speeltuin={editingSpeeltuin}
          open={!!editingSpeeltuin}
          onOpenChange={(open) => !open && setEditingSpeeltuin(null)}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSpeeltuinen;