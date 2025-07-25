import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsStats {
  totalVisitors: number;
  speeltuinViews: number;
  popularFilter: string;
  avgSessionTime: string;
  popularSpeeltuinen: Array<{ naam: string; view_count: number }>;
  deviceStats: Array<{ device: string; percentage: number }>;
}

export const useAnalyticsStats = () => {
  return useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async (): Promise<AnalyticsStats> => {
      // Get basic stats from last 30 days
      const { data: dailyStats } = await supabase
        .from('daily_stats')
        .select('*')
        .limit(30);

      // Get popular speeltuinen
      const { data: popularSpeeltuinen } = await supabase
        .from('popular_speeltuinen')
        .select('*')
        .limit(5);

      // Get filter usage stats
      const { data: filterStats } = await supabase
        .from('analytics_events')
        .select('event_type')
        .eq('event_type', 'filter_used')
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Calculate totals
      const totalVisitors = dailyStats?.reduce((sum, day) => sum + (day.unique_visitors || 0), 0) || 0;
      const speeltuinViews = dailyStats?.reduce((sum, day) => sum + (day.speeltuin_views || 0), 0) || 0;

      // Mock device stats (would need user agent parsing for real data)
      const deviceStats = [
        { device: 'Mobiel', percentage: 68 },
        { device: 'Desktop', percentage: 28 },
        { device: 'Tablet', percentage: 4 }
      ];

      return {
        totalVisitors,
        speeltuinViews,
        popularFilter: 'Leeftijd 6-12', // Mock for now
        avgSessionTime: '3m 42s', // Mock for now
        popularSpeeltuinen: popularSpeeltuinen || [],
        deviceStats
      };
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};