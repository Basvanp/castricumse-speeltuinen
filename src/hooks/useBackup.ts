import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const { toast } = useToast();

  const exportSpeeltuinenCSV = async () => {
    setIsExporting(true);
    try {
      const { data: speeltuinen, error } = await supabase
        .from('speeltuinen')
        .select('*')
        .order('naam');

      if (error) throw error;

      if (!speeltuinen || speeltuinen.length === 0) {
        toast({
          title: "Geen data gevonden",
          description: "Er zijn geen speeltuinen om te exporteren.",
          variant: "destructive"
        });
        return;
      }

      // Convert to CSV
      const headers = Object.keys(speeltuinen[0]).join(',');
      const csvContent = [
        headers,
        ...speeltuinen.map(row => 
          Object.values(row).map(value => {
            // Handle arrays and objects
            if (Array.isArray(value)) {
              return `"${value.join(';')}"`;
            }
            if (typeof value === 'object' && value !== null) {
              return `"${JSON.stringify(value)}"`;
            }
            // Escape quotes and wrap in quotes if contains comma
            const stringValue = String(value || '');
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',')
        )
      ].join('\n');

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `speeltuinen_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export succesvol!",
        description: `${speeltuinen.length} speeltuinen geëxporteerd naar CSV.`,
      });

    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export mislukt",
        description: "Er is een fout opgetreden bij het exporteren van de data.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const createBackup = async () => {
    setIsBackingUp(true);
    try {
      // Get all relevant data
      const [speeltuinenResult, reviewsResult, settingsResult] = await Promise.all([
        supabase.from('speeltuinen').select('*'),
        supabase.from('reviews').select('*'),
        supabase.from('site_settings').select('*')
      ]);

      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          speeltuinen: speeltuinenResult.data || [],
          reviews: reviewsResult.data || [],
          site_settings: settingsResult.data || []
        }
      };

      // Download backup as JSON
      const blob = new Blob([JSON.stringify(backup, null, 2)], { 
        type: 'application/json;charset=utf-8;' 
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `backup_${new Date().toISOString().split('T')[0]}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Backup succesvol!",
        description: "Database backup is gedownload.",
      });

    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: "Backup mislukt",
        description: "Er is een fout opgetreden bij het maken van de backup.",
        variant: "destructive"
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  return {
    exportSpeeltuinenCSV,
    createBackup,
    isExporting,
    isBackingUp
  };
};