import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, Eye, TrendingUp } from 'lucide-react';

const AdminStats = () => {
  return (
    <AdminLayout 
      title="Statistieken" 
      description="Analytics en gebruiksstatistieken van de speeltuinen website"
    >
      <div className="grid gap-6">
        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Bezoekers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+12% van vorige maand</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Speeltuin Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,436</div>
              <p className="text-xs text-muted-foreground">+5% van vorige week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Populairste Filter</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Leeftijd 6-12</div>
              <p className="text-xs text-muted-foreground">47% van alle searches</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Sessie Tijd</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3m 42s</div>
              <p className="text-xs text-muted-foreground">+8s van vorige maand</p>
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
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speeltuin Bakkum</span>
                  <span className="text-sm font-medium">847 views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speeltuin Centrum</span>
                  <span className="text-sm font-medium">612 views</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Speeltuin De Woude</span>
                  <span className="text-sm font-medium">435 views</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Verdeling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mobiel</span>
                  <span className="text-sm font-medium">68%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Desktop</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tablet</span>
                  <span className="text-sm font-medium">4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note about future implementation */}
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground text-center">
              Uitgebreide analytics dashboard wordt binnenkort geïmplementeerd met real-time data uit de database.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStats;