import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserRole } from '../hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { Card, CardContent } from '../components/ui/card';
import AdminLayout from '../components/AdminLayout';
import AdminPhotoManager from '../components/AdminPhotoManager';
import SecurityGuard from '../components/SecurityGuard';
import SEOHead from '../components/SEOHead';

const AdminFotos = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!loading && !roleLoading) {
      if (!user) {
        navigate('/auth');
        return;
      }
      
      if (user && isAdmin === null) {
        return;
      }
      
      if (!isAdmin) {
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        return;
      }
    }
  }, [user, loading, roleLoading, isAdmin, navigate, toast]);

  if (loading || roleLoading) {
    return (
      <>
        <SEOHead 
          title="Foto Toewijzer - Laden"
          description="Foto toewijzer voor speeltuinen"
          keywords="admin, foto, toewijzer, speeltuinen"
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Laden...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user || !isAdmin) {
    return (
      <>
        <SEOHead 
          title="Toegang Geweigerd - Admin"
          description="U heeft geen toegang tot het admin panel"
          keywords="admin, toegang, geweigerd"
        />
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
      </>
    );
  }

  return (
    <>
      <SEOHead 
        title="Foto Toewijzer - Admin"
        description="Wijs foto's toe aan speeltuinen op basis van GPS-locatie"
        keywords="admin, foto, toewijzer, gps, speeltuinen"
      />
      <SecurityGuard requireAdmin={true}>
        <AdminLayout 
          title="Foto Toewijzer" 
          description="Wijs foto's uit de bucket toe aan speeltuinen op basis van GPS-coördinaten"
        >
          <AdminPhotoManager />
        </AdminLayout>
      </SecurityGuard>
    </>
  );
};

export default AdminFotos; 