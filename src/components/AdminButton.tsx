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
    
    // Wait a bit for loading states to resolve if needed
    if (authLoading || roleLoading) {
      setTimeout(() => {
        handleAdminClick();
      }, 100);
      return;
    }

    if (!user) {
      // Not authenticated, go to auth page
      navigate('/auth');
    } else if (isAdmin) {
      // Authenticated and admin, go to admin dashboard
      navigate('/admin');
    } else {
      // Authenticated but not admin, go to auth page anyway
      // (the auth page will redirect authenticated users to admin if they become admin)
      navigate('/auth');
    }
    
    setIsNavigating(false);
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