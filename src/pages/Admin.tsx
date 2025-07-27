import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/AdminLayout';
import AdminDashboard from '@/components/AdminDashboard';
import AdminSetup from '@/components/AdminSetup';

const Admin = () => {
  const { user, loading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [checkingAdminExists, setCheckingAdminExists] = useState(true);

  // Check if any admin exists in the system
  useEffect(() => {
    const checkAdminExists = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('*')
          .eq('role', 'admin')
          .limit(1);

        if (error) {
          console.error('Error checking admin existence:', error);
          setAdminExists(true); // Assume admin exists on error to be safe
        } else {
          setAdminExists(data && data.length > 0);
        }
      } catch (error) {
        console.error('Error checking admin existence:', error);
        setAdminExists(true); // Assume admin exists on error to be safe
      } finally {
        setCheckingAdminExists(false);
      }
    };

    checkAdminExists();
  }, []);

  useEffect(() => {
    console.log('🚀 Admin: Auth state check:', { user: !!user, loading, roleLoading, isAdmin, adminExists });
    
    // Add timeout to prevent infinite waiting
    const timeout = setTimeout(() => {
      if (loading || roleLoading || checkingAdminExists) {
        console.log('🚀 Admin: Auth timeout, redirecting to auth');
        navigate('/auth');
      }
    }, 10000); // 10 second timeout
    
    if (!loading && !roleLoading && !checkingAdminExists) {
      clearTimeout(timeout);
      if (!user) {
        console.log('🚀 Admin: No user, redirecting to auth');
        navigate('/auth');
      } else if (!isAdmin && adminExists) {
        console.log('🚀 Admin: User is not admin and admin exists, redirecting to home');
        navigate('/');
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin panel.",
          variant: "destructive",
        });
      } else {
        console.log('🚀 Admin: User access granted or admin setup needed');
      }
    }
    
    return () => clearTimeout(timeout);
  }, [user, loading, roleLoading, isAdmin, adminExists, checkingAdminExists, navigate, toast]);


  if (loading || roleLoading || checkingAdminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Laden...</p>
        </div>
      </div>
    );
  }

  // If no user, redirect happens in useEffect
  if (!user) {
    return null;
  }

  // If user is not admin but admin exists, show access denied
  if (!isAdmin && adminExists) {
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

  // If user is not admin and no admin exists, show admin setup
  if (!isAdmin && !adminExists) {
    return <AdminSetup />;
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
