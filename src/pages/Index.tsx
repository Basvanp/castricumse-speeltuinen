import React, { useState, useMemo, useEffect } from 'react';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Speeltuin, SpeeltuinFilters } from '@/types/speeltuin';
import SpeeltuinKaart from '@/components/SpeeltuinKaart';
import SpeeltuinCard from '@/components/SpeeltuinCard';
import SpeeltuinFiltersComponent from '@/components/SpeeltuinFilters';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen();
  const { trackEvent } = useAnalytics();
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState<Speeltuin | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filters, setFilters] = useState<SpeeltuinFilters>({
    leeftijd: {
      peuters: false,
      kleuters: false,
      kinderen: false,
    },
    voorzieningen: {
      glijbaan: false,
      schommel: false,
      zandbak: false,
      kabelbaan: false,
      bankjes: false,
      sportveld: false,
    },
    ondergrond: {
      zand: false,
      gras: false,
      rubber: false,
      tegels: false,
      kunstgras: false,
    },
    grootte: {
      klein: false,
      middel: false,
      groot: false,
    },
    overig: {
      omheind: false,
      schaduw: false,
      rolstoeltoegankelijk: false,
      horeca: false,
      toilet: false,
      parkeerplaats: false,
    },
  });

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view');
  }, [trackEvent]);

  const filteredSpeeltuinen = useMemo(() => {
    return speeltuinen.filter((speeltuin) => {
      // Check if any filters are active
      const hasActiveFilters = Object.values(filters).some((category) =>
        Object.values(category).some((value) => value)
      );

      if (!hasActiveFilters) return true;

      // Leeftijd filter
      const leeftijdMatch = 
        (!filters.leeftijd.peuters && !filters.leeftijd.kleuters && !filters.leeftijd.kinderen) ||
        (filters.leeftijd.peuters && speeltuin.geschikt_peuters) ||
        (filters.leeftijd.kleuters && speeltuin.geschikt_kleuters) ||
        (filters.leeftijd.kinderen && speeltuin.geschikt_kinderen);

      // Voorzieningen filter
      const voorzieningenMatch = 
        (!Object.values(filters.voorzieningen).some(v => v)) ||
        (filters.voorzieningen.glijbaan && speeltuin.heeft_glijbaan) ||
        (filters.voorzieningen.schommel && speeltuin.heeft_schommel) ||
        (filters.voorzieningen.zandbak && speeltuin.heeft_zandbak) ||
        (filters.voorzieningen.kabelbaan && speeltuin.heeft_kabelbaan) ||
        (filters.voorzieningen.bankjes && speeltuin.heeft_bankjes) ||
        (filters.voorzieningen.sportveld && speeltuin.heeft_sportveld);

      // Ondergrond filter
      const ondergrondMatch = 
        (!Object.values(filters.ondergrond).some(v => v)) ||
        (filters.ondergrond.zand && speeltuin.ondergrond_zand) ||
        (filters.ondergrond.gras && speeltuin.ondergrond_gras) ||
        (filters.ondergrond.rubber && speeltuin.ondergrond_rubber) ||
        (filters.ondergrond.tegels && speeltuin.ondergrond_tegels) ||
        (filters.ondergrond.kunstgras && speeltuin.ondergrond_kunstgras);

      // Grootte filter
      const grootteMatch = 
        (!Object.values(filters.grootte).some(v => v)) ||
        (filters.grootte.klein && speeltuin.grootte === 'klein') ||
        (filters.grootte.middel && speeltuin.grootte === 'middel') ||
        (filters.grootte.groot && speeltuin.grootte === 'groot');

      // Overig filter
      const overigMatch = 
        (!Object.values(filters.overig).some(v => v)) ||
        (filters.overig.omheind && speeltuin.is_omheind) ||
        (filters.overig.schaduw && speeltuin.heeft_schaduw) ||
        (filters.overig.rolstoeltoegankelijk && speeltuin.is_rolstoeltoegankelijk) ||
        (filters.overig.horeca && speeltuin.heeft_horeca) ||
        (filters.overig.toilet && speeltuin.heeft_toilet) ||
        (filters.overig.parkeerplaats && speeltuin.heeft_parkeerplaats);

      return leeftijdMatch && voorzieningenMatch && ondergrondMatch && grootteMatch && overigMatch;
    });
  }, [speeltuinen, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Speeltuinen laden...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-destructive">Fout bij het laden</h1>
          <p className="text-muted-foreground">Er is een fout opgetreden bij het laden van de speeltuinen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Speeltuinen in Castricum</h1>
              <p className="text-muted-foreground mt-1">
                Ontdek alle speeltuinen in Castricum en omgeving
              </p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link to="/admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Filters Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? '-ml-80 opacity-0 pointer-events-none' : 'ml-0 opacity-100'
          } w-80 flex-shrink-0`}>
            <SpeeltuinFiltersComponent filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Toggle Button */}
          <div className="absolute left-0 top-0 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`transition-all duration-300 ease-in-out ${
                sidebarCollapsed ? 'translate-x-0' : 'translate-x-80'
              } bg-white shadow-md hover:shadow-lg`}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Map */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Kaart</h2>
              <SpeeltuinKaart 
                speeltuinen={filteredSpeeltuinen} 
                onSpeeltuinSelect={setSelectedSpeeltuin}
              />
            </div>

            {/* Selected Speeltuin */}
            {selectedSpeeltuin && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Geselecteerde speeltuin</h2>
                <SpeeltuinCard speeltuin={selectedSpeeltuin} />
              </div>
            )}

            {/* Speeltuinen Grid */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Alle speeltuinen ({filteredSpeeltuinen.length})
              </h2>
              {filteredSpeeltuinen.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Geen speeltuinen gevonden met de huidige filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredSpeeltuinen.map((speeltuin) => (
                    <SpeeltuinCard key={speeltuin.id} speeltuin={speeltuin} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
