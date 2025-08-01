import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Eye, TrendingUp, Loader2 } from 'lucide-react';
import { useAnalyticsStats } from '@/hooks/useAnalyticsStats';

const AdminStats = () => {
  const { data: stats, isLoading, error } = useAnalyticsStats();

  if (isLoading) {
    return (
      <AdminLayout 
        title="Statistieken" 
        description="Analytics en gebruiksstatistieken van de speeltuinen website"
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout 
        title="Statistieken" 
        description="Analytics en gebruiksstatistieken van de speeltuinen website"
      >
        <div className="text-center text-muted-foreground">
          Fout bij het laden van statistieken
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Statistieken" 
      description="Analytics en gebruiksstatistieken van de speeltuinen website"
    >
      <div className="grid gap-6">
        {/* Data Source Indicator */}
        {stats?.isRealData === false && (
          <div className="col-span-full">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-amber-800">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium">Demo Data</span>
                </div>
                <p className="text-xs text-amber-700 mt-1">
                  Deze statistieken zijn demonstratie data. Echte analytics worden getoond zodra er meer bezoekers zijn.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Bezoekers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVisitors.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Afgelopen 7 dagen</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speeltuin Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.speeltuinViews.toLocaleString() || 0}</div>
              <p className="text-xs text-muted-foreground">Afgelopen 7 dagen</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Populairste Filter</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.popularFilter || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Meest gebruikt filter</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Sessie Tijd</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.avgSessionTime || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Gemiddelde bezoektijd</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Meest Bekeken Speeltuinen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.popularSpeeltuinen && stats.popularSpeeltuinen.length > 0 ? (
                  stats.popularSpeeltuinen.map((speeltuin, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{speeltuin.naam}</span>
                      <span className="text-sm font-medium">{speeltuin.view_count} views</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Nog geen data beschikbaar</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Verdeling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.deviceStats.map((device, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{device.device}</span>
                    <span className="text-sm font-medium">{device.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time note */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              📊 Real-time analytics geïmplementeerd! Data wordt automatisch bijgewerkt elke 5 minuten.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;