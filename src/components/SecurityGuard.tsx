import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield } from 'lucide-react';

interface SecurityGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  requireAuth?: boolean;
}

const SecurityGuard: React.FC<SecurityGuardProps> = ({
  children,
  requireAdmin = false,
  requireAuth = true
}) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);

  // Session timeout warning for admin users
  useEffect(() => {
    if (user && isAdmin && !sessionTimeout) {
      // Set session timeout warning for 50 minutes (assuming 1 hour session)
      const timeout = setTimeout(() => {
        const shouldExtend = window.confirm(
          'Je sessie verloopt binnenkort. Wil je je sessie verlengen?'
        );
        if (shouldExtend) {
          // Simple activity to refresh the session  
          try {
            fetch(window.location.href, { method: 'HEAD' });
            setSessionTimeout(null);
          } catch (error) {
            console.error('Failed to refresh session:', error);
          }
        }
      }, 50 * 60 * 1000); // 50 minutes

      setSessionTimeout(timeout);
    }

    return () => {
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
      }
    };
  }, [user, isAdmin, sessionTimeout]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Beveiliging controleren...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>Authenticatie Vereist</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Je moet ingelogd zijn om deze pagina te bekijken.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <Shield className="h-5 w-5" />
              <span>Admin Toegang Vereist</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Je hebt administrator rechten nodig om deze pagina te bekijken.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default SecurityGuard;