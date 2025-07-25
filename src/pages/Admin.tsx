import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';

const Admin = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🚀 Admin: Auth state check:', { user: !!user, loading, roleLoading, isAdmin });
    
    if (!loading && !roleLoading) {
      if (!user) {
        console.log('🚀 Admin: No user, redirecting to auth');
        navigate('/auth');
      } else if (!isAdmin) {
        console.log('🚀 Admin: User is not admin, redirecting to home');
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
      } else {
        console.log('🚀 Admin: User is admin, staying on admin page');
      }
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
    <AdminLayout 
      title="Dashboard" 
      description="Overzicht van je speeltuinen beheer systeem"
    >
      <AdminDashboard />
    </AdminLayout>
  );
};

export default Admin;
