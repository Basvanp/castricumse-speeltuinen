import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Plus, Home, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import SpeeltuinEditor from '@/components/SpeeltuinEditor';

const Admin = () => {
  const { user, signOut, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { data: speeltuinen = [] } = useSpeeltuinen();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) {
        navigate('/auth');
      } else if (!isAdmin) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
      }
    }
  }, [user, loading, roleLoading, isAdmin, navigate, toast]);

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) {
        throw error;
      }
      
      // Clear any cached data
      localStorage.clear();
      sessionStorage.clear();
      
      navigate('/auth');
      toast({
        title: "Uitgelogd",
        description: "Je bent succesvol uitgelogd.",
      });
    } catch (error: any) {
      toast({
        title: "Fout",
        description: error?.message || "Er is een fout opgetreden bij het uitloggen.",
        variant: "destructive",
      });
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Access Denied</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Beheer speeltuinen in Castricum
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Terug naar site
                </Link>
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Uitloggen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Speeltuin Editor */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nieuwe Speeltuin Toevoegen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SpeeltuinEditor />
              </CardContent>
            </Card>
          </div>

          {/* Existing Speeltuinen Overview */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Bestaande Speeltuinen ({speeltuinen.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {speeltuinen.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nog geen speeltuinen toegevoegd.
                    </p>
                  ) : (
                    speeltuinen.map((speeltuin) => (
                      <div
                        key={speeltuin.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{speeltuin.naam}</h3>
                          <p className="text-sm text-muted-foreground">
                            {speeltuin.omschrijving || 'Geen omschrijving'}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {speeltuin.heeft_glijbaan && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                Glijbaan
                              </span>
                            )}
                            {speeltuin.heeft_schommel && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                Schommel
                              </span>
                            )}
                            {speeltuin.heeft_zandbak && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                Zandbak
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(speeltuin.created_at).toLocaleDateString('nl-NL')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
