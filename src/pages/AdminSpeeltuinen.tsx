import React, { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useSpeeltuinen, useDeleteSpeeltuin, useUpdateSpeeltuin } from '@/hooks/useSpeeltuinen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Search, Edit, Trash2, Eye, Download, Upload, FileText, Database, CheckSquare, Square } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AdminSpeeltuinen = () => {
  const { data: speeltuinen = [] } = useSpeeltuinen();
  const deleteSpeeltuin = useDeleteSpeeltuin();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState(null);
  const [editingSpeeltuin, setEditingSpeeltuin] = useState(null);
  const [selectedSpeeltuinen, setSelectedSpeeltuinen] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

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

  // Bulk operations
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedSpeeltuinen(new Set(filteredSpeeltuinen.map(s => s.id)));
    } else {
      setSelectedSpeeltuinen(new Set());
    }
  };

  const handleSelectSpeeltuin = (id, checked) => {
    const newSelected = new Set(selectedSpeeltuinen);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedSpeeltuinen(newSelected);
    setSelectAll(newSelected.size === filteredSpeeltuinen.length);
  };

  const handleBulkDelete = () => {
    const selectedIds = Array.from(selectedSpeeltuinen);
    if (selectedIds.length === 0) return;

    // Delete each selected speeltuin
    selectedIds.forEach(id => {
      deleteSpeeltuin.mutate(id);
    });

    setSelectedSpeeltuinen(new Set());
    setSelectAll(false);

    toast({
      title: "Bulk verwijdering gestart",
      description: `${selectedIds.length} speeltuinen worden verwijderd.`,
    });
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['ID', 'Naam', 'Omschrijving', 'Latitude', 'Longitude', 'Glijbaan', 'Schommel', 'Zandbak', 'Kabelbaan', 'Bankjes', 'Sportveld'];
    const csvContent = [
      headers.join(','),
      ...filteredSpeeltuinen.map(s => [
        s.id,
        `"${s.naam}"`,
        `"${s.omschrijving || ''}"`,
        s.latitude || '',
        s.longitude || '',
        s.heeft_glijbaan ? 'Ja' : 'Nee',
        s.heeft_schommel ? 'Ja' : 'Nee',
        s.heeft_zandbak ? 'Ja' : 'Nee',
        s.heeft_kabelbaan ? 'Ja' : 'Nee',
        s.heeft_bankjes ? 'Ja' : 'Nee',
        s.heeft_sportveld ? 'Ja' : 'Nee'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `speeltuinen_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "CSV Export voltooid",
      description: "Speeltuinen zijn geëxporteerd naar CSV bestand.",
    });
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredSpeeltuinen, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `speeltuinen_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "JSON Export voltooid",
      description: "Speeltuinen zijn geëxporteerd naar JSON bestand.",
    });
  };

  const createBackup = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      speeltuinen: speeltuinen,
      metadata: {
        total: speeltuinen.length,
        version: '1.0'
      }
    };

    const jsonContent = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `speeltuinen_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    toast({
      title: "Backup gemaakt",
      description: "Backup van alle speeltuinen is gedownload.",
    });
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        if (backup.speeltuinen && Array.isArray(backup.speeltuinen)) {
          // Here you would implement the restore logic
          // For now, just show a success message
          toast({
            title: "Backup geladen",
            description: `${backup.speeltuinen.length} speeltuinen gevonden in backup.`,
          });
        } else {
          throw new Error('Invalid backup format');
        }
      } catch (error) {
        toast({
          title: "Fout bij laden backup",
          description: "Het bestand is geen geldige backup.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <AdminLayout 
      title="Speeltuinen Beheer" 
      description={`Beheer alle ${speeltuinen.length} speeltuinen`}
    >
      <div className="space-y-6">
        {/* Search and Actions Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Zoek speeltuinen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Bulk Actions */}
              {selectedSpeeltuinen.size > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {selectedSpeeltuinen.size} geselecteerd
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Verwijder geselecteerd
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bulk verwijdering</AlertDialogTitle>
                        <AlertDialogDescription>
                          Weet je zeker dat je {selectedSpeeltuinen.size} speeltuinen wilt verwijderen? 
                          Deze actie kan niet ongedaan worden gemaakt.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction onClick={handleBulkDelete}>
                          Verwijderen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}

              {/* Export/Backup Actions */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={exportToCSV}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export naar CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToJSON}>
                      <Database className="h-4 w-4 mr-2" />
                      Export naar JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="outline" size="sm" onClick={createBackup}>
                  <Database className="h-4 w-4 mr-2" />
                  Backup maken
                </Button>

                <div className="relative">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleRestore}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
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
            <>
              {/* Select All Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="text-sm font-medium">
                      Selecteer alle ({filteredSpeeltuinen.length})
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Speeltuinen Items */}
              {filteredSpeeltuinen.map((speeltuin) => (
                <Card key={speeltuin.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <Checkbox
                        checked={selectedSpeeltuinen.has(speeltuin.id)}
                        onCheckedChange={(checked) => handleSelectSpeeltuin(speeltuin.id, checked)}
                      />

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
                                  <AlertDialogAction onClick={() => handleDelete(speeltuin.id)}>
                                    Verwijderen
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>

        {/* Edit Dialog */}
        {editingSpeeltuin && (
          <EditSpeeltuinDialog
            speeltuin={editingSpeeltuin}
            onClose={() => setEditingSpeeltuin(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSpeeltuinen;