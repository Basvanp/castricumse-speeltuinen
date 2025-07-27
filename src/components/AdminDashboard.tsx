import React from 'react';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Plus, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { data: speeltuinen = [] } = useSpeeltuinen();

  const recentSpeeltuinen = speeltuinen
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const stats = {
    total: speeltuinen.length,
    withImages: speeltuinen.filter(s => s.afbeelding_url).length,
    recentlyAdded: speeltuinen.filter(s => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return new Date(s.created_at) > oneWeekAgo;
    }).length,
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Speeltuinen</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.withImages} met afbeeldingen
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Toegevoegd</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentlyAdded}</div>
            <p className="text-xs text-muted-foreground">
              Deze week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compleet</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.total > 0 ? Math.round((stats.withImages / stats.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Met volledige gegevens
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Snelle Acties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button asChild>
              <Link to="/admin/toevoegen" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nieuwe Speeltuin
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/admin/speeltuinen" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Beheer Speeltuinen
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Toegevoegde Speeltuinen</CardTitle>
        </CardHeader>
        <CardContent>
          {recentSpeeltuinen.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nog geen speeltuinen toegevoegd.
            </p>
          ) : (
            <div className="space-y-4">
              {recentSpeeltuinen.map((speeltuin) => (
                <div
                  key={speeltuin.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {speeltuin.afbeelding_url && (
                      <img
                        src={speeltuin.afbeelding_url}
                        alt={speeltuin.naam}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-medium">{speeltuin.naam}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(speeltuin.created_at).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {speeltuin.heeft_glijbaan && (
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        Glijbaan
                      </span>
                    )}
                    {speeltuin.heeft_schommel && (
                      <span className="px-2 py-1 bg-secondary/10 text-secondary-foreground text-xs rounded">
                        Schommel
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;