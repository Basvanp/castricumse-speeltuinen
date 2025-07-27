import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'user';

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      console.log('🔐 useUserRole: fetchUserRole called with user:', !!user);
      
      if (!user) {
        console.log('🔐 useUserRole: No user found, setting role to null and loading to false');
        setRole(null);
        setLoading(false);
        return;
      }

      console.log('🔐 useUserRole: Fetching role for user:', user.id);
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        console.log('🔐 useUserRole: Database response:', { data, error });

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user role on error
        } else if (data && data.length > 0) {
          // Priority: admin > user
          // If user has multiple roles, return the highest priority role
          const roles = data.map(item => item.role);
          console.log('🔐 useUserRole: Found roles:', roles);
          
          if (roles.includes('admin')) {
            console.log('🔐 useUserRole: Setting role to admin');
            setRole('admin');
          } else {
            console.log('🔐 useUserRole: Setting role to user');
            setRole('user');
          }
        } else {
          console.log('🔐 useUserRole: No roles found, defaulting to user');
          setRole('user'); // Default if no roles found
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';

  console.log('🔐 useUserRole: Current state:', { role, isAdmin, loading });

  return {
    role,
    isAdmin,
    loading,
  };
};