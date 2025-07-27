import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Crown, AlertTriangle } from 'lucide-react';

const AdminSetup = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const promoteToAdmin = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if any admin users exist
      const { data: existingAdmins, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('role', 'admin');

      if (checkError) {
        throw checkError;
      }

      if (existingAdmins && existingAdmins.length > 0) {
        toast({
          title: "Admin bestaat al",
          description: "Er is al een admin gebruiker. Vraag deze om je admin rechten te geven.",
          variant: "destructive",
        });
        return;
      }

      // No admin exists, promote current user
      const { error: updateError } = await supabase
        .from('user_roles')
        .update({ role: 'admin' })
        .eq('user_id', user.id);

      if (updateError) {
        throw updateError;
      }

      toast({
        title: "Admin rechten toegekend",
        description: "Je bent nu admin! Ververs de pagina om toegang te krijgen tot het admin panel.",
      });

      // Refresh the page after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('Error promoting to admin:', error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toekennen van admin rechten.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Crown className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <CardDescription>
            Er zijn nog geen admin gebruikers. Als eigenaar van deze site kun je jezelf admin maken.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-2 p-3 bg-orange-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              <p className="font-medium">Let op:</p>
              <p>Doe dit alleen als je de eigenaar bent van deze website. Admin rechten geven volledige toegang tot het beheer van speeltuinen.</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Je account:</strong> {user?.email}
            </p>
            <p className="text-sm text-muted-foreground">
              Dit zal je account promoveren tot admin als er nog geen admin bestaat.
            </p>
          </div>

          <Button 
            onClick={promoteToAdmin} 
            className="w-full" 
            disabled={loading}
            variant="default"
          >
            {loading ? 'Bezig...' : 'Maak mij admin'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;