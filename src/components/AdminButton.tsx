import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';

const AdminButton = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleAdminClick = async () => {
    setIsNavigating(true);
    
    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsNavigating(false);
      // If still loading after 5 seconds, navigate to auth
      if (authLoading || roleLoading) {
        navigate('/auth');
      }
    }, 5000);

    try {
      // Wait a bit for loading states to resolve if needed
      if (authLoading || roleLoading) {
        // Wait maximum 2 seconds for auth to resolve
        await new Promise(resolve => setTimeout(resolve, 100));
        if (authLoading || roleLoading) {
          clearTimeout(timeout);
          setIsNavigating(false);
          navigate('/auth');
          return;
        }
      }

      clearTimeout(timeout);

      if (!user) {
        // Not authenticated, go to auth page
        navigate('/auth');
      } else if (isAdmin) {
        // Authenticated and admin, go to admin dashboard
        navigate('/admin');
      } else {
        // Authenticated but not admin, go to auth page anyway
        navigate('/auth');
      }
    } finally {
      setIsNavigating(false);
    }
  };

  const isLoading = authLoading || roleLoading || isNavigating;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleAdminClick}
      disabled={isLoading}
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Settings className="h-4 w-4" />
      )}
      Admin
    </Button>
  );
};

export default AdminButton;