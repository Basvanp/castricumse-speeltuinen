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

  const handleAdminClick = () => {
    setIsNavigating(true);
    
    // Force stop loading after 3 seconds
    setTimeout(() => {
      setIsNavigating(false);
    }, 3000);

    // Navigate based on current auth state
    if (!user) {
      navigate('/auth');
    } else if (isAdmin) {
      navigate('/admin');
    } else {
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