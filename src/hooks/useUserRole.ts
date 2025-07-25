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
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user role:', error);
          setRole('user'); // Default to user role on error
        } else if (data && data.length > 0) {
          // Priority: admin > user
          // If user has multiple roles, return the highest priority role
          const roles = data.map(item => item.role);
          if (roles.includes('admin')) {
            setRole('admin');
          } else {
            setRole('user');
          }
        } else {
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

  return {
    role,
    isAdmin,
    loading,
  };
};