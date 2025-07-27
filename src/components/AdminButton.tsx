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
    // Prevent multiple simultaneous clicks
    if (isNavigating) {
      return;
    }
    
    setIsNavigating(true);
    
    try {
      // Wait for loading states to resolve with a reasonable timeout
      if (authLoading || roleLoading) {
        // Wait up to 2 seconds for auth/role loading to complete
        const maxWaitTime = 2000;
        const startTime = Date.now();
        
        while ((authLoading || roleLoading) && (Date.now() - startTime) < maxWaitTime) {
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }

      // Determine navigation target based on current state
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
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to auth page on error
      navigate('/auth');
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