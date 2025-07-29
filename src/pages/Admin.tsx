import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';
import SecurityGuard from '@/components/SecurityGuard';

const Admin = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🚀 Admin: Auth state check:', { 
      user: !!user, 
      loading, 
      roleLoading, 
      isAdmin,
      userExists: !!user,
      loadingComplete: !loading && !roleLoading 
    });
    
    // Only proceed with navigation decisions when both auth and role loading are complete
    if (!loading && !roleLoading) {
      console.log('🚀 Admin: Both loading states complete, making navigation decision');
      
      if (!user) {
        console.log('🚀 Admin: No user, redirecting to auth');
        navigate('/auth');
        return;
      }
      
      // Wait a bit more to ensure role is properly determined after login
      if (user && isAdmin === null) {
        console.log('🚀 Admin: User exists but role not yet determined, waiting...');
        return;
      }
      
      // User exists, check admin status
      if (!isAdmin) {
        console.log('🚀 Admin: User exists but is not admin, redirecting to home');
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
        return;
      }
      
      console.log('🚀 Admin: User is admin, staying on admin page');
    } else {
      console.log('🚀 Admin: Still loading, waiting for completion');
    }
  }, [user, loading, roleLoading, isAdmin, navigate, toast]);


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
    <SecurityGuard requireAdmin={true}>
      <AdminLayout 
        title="Dashboard" 
        description="Overzicht van je speeltuinen beheer systeem"
      >
        <AdminDashboard />
      </AdminLayout>
    </SecurityGuard>
  );
};

export default Admin;
