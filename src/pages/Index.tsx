import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useIsMobile } from '@/hooks/use-mobile';
import { Speeltuin, SpeeltuinFilters } from '@/types/speeltuin';
import SpeeltuinKaart from '@/components/SpeeltuinKaart';
import SpeeltuinCard from '@/components/SpeeltuinCard';
import SpeeltuinFiltersComponent from '@/components/SpeeltuinFilters';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebsiteSchema } from '@/utils/structuredData';

const Index = () => {
  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen();
  const { data: settings = {} } = useSiteSettings();
  const { trackEvent } = useAnalytics();
  const isMobile = useIsMobile();
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState<Speeltuin | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Refs voor scroll-functionaliteit
  const topRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const speeltuinenRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<SpeeltuinFilters>({
    typeSpeeltuin: {
      natuurspeeltuin: false,
      buurtspeeltuin: false,
      schoolplein: false,
      speelbos: false,
    },
    leeftijd: {
      peuters: false,
      kleuters: false,
      kinderen: false,
    },
    leeftijdSpecifiek: {
      '0_2_jaar': false,
      '2_6_jaar': false,
      '6_12_jaar': false,
      '12_plus_jaar': false,
    },
    voorzieningen: {
      glijbaan: false,
      schommel: false,
      zandbak: false,
      kabelbaan: false,
      bankjes: false,
      sportveld: false,
      klimtoestel: false,
      water_pomp: false,
      trapveld: false,
      skatebaan: false,
      toilet: false,
      parkeerplaats: false,
      horeca: false,
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
    toegankelijkheid: {
      rolstoeltoegankelijk: false,
      zichtbaar_omheind: false,
      zonder_drempel: false,
      speeltoestellen_beperking: false,
    },
    veiligheid: {
      omheind: false,
      in_zicht_huizen: false,
      rustige_ligging: false,
      verkeersluw: false,
    },
    voorzieningen_ouders: {
      bankjes: false,
      schaduw: false,
      picknicktafels: false,
      horeca_buurt: false,
      wc_buurt: false,
    },
    ligging: {
      woonwijk: false,
      bos_natuur: false,
      bij_school: false,
      fietspad: false,
      parkeerplaats: false,
    },
    extras: {
      waterpomp: false,
      educatief: false,
      kunstwerk_thema: false,
      buurtinitiatief: false,
    },
  });

  const clearAllFilters = () => {
    setFilters({
      typeSpeeltuin: {
        natuurspeeltuin: false,
        buurtspeeltuin: false,
        schoolplein: false,
        speelbos: false,
      },
      leeftijd: {
        peuters: false,
        kleuters: false,
        kinderen: false,
      },
      leeftijdSpecifiek: {
        '0_2_jaar': false,
        '2_6_jaar': false,
        '6_12_jaar': false,
        '12_plus_jaar': false,
      },
      voorzieningen: {
        glijbaan: false,
        schommel: false,
        zandbak: false,
        kabelbaan: false,
        bankjes: false,
        sportveld: false,
        klimtoestel: false,
        water_pomp: false,
        trapveld: false,
        skatebaan: false,
        toilet: false,
        parkeerplaats: false,
        horeca: false,
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
      toegankelijkheid: {
        rolstoeltoegankelijk: false,
        zichtbaar_omheind: false,
        zonder_drempel: false,
        speeltoestellen_beperking: false,
      },
      veiligheid: {
        omheind: false,
        in_zicht_huizen: false,
        rustige_ligging: false,
        verkeersluw: false,
      },
      voorzieningen_ouders: {
        bankjes: false,
        schaduw: false,
        picknicktafels: false,
        horeca_buurt: false,
        wc_buurt: false,
      },
      ligging: {
        woonwijk: false,
        bos_natuur: false,
        bij_school: false,
        fietspad: false,
        parkeerplaats: false,
      },
      extras: {
        waterpomp: false,
        educatief: false,
        kunstwerk_thema: false,
        buurtinitiatief: false,
      },
    });
  };

  const handleApplyFilters = () => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view');
  }, [trackEvent]);

  // Handle responsive sidebar behavior
  useEffect(() => {
    // On desktop, auto-expand sidebar; on mobile, keep collapsed
    if (!isMobile && sidebarCollapsed) {
      setSidebarCollapsed(false);
    } else if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  // Generate structured data
  const structuredData = useMemo(() => {
    const schemas = [
      generateWebsiteSchema(settings),
      generateOrganizationSchema(settings),
      generateLocalBusinessSchema(settings)
    ];
    return schemas;
  }, [settings]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocatie niet ondersteund",
        description: "Uw browser ondersteunt geen geolocatie.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ];
        setUserLocation(newLocation);
        setIsLocating(false);
        toast({
          title: "Locatie gevonden",
          description: "De kaart is gecentreerd op uw locatie.",
        });
      },
      (error) => {
        setIsLocating(false);
        let message = "Er is een fout opgetreden bij het ophalen van uw locatie.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Locatietoegang geweigerd. U kunt dit wijzigen in uw browserinstellingen.";
        }
        toast({
          title: "Locatie niet beschikbaar",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

  // Scroll-functies voor navigatie
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToMap = () => {
    if (mapRef.current) {
      const headerHeight = 80; // Hoogte van sticky header + wat extra ruimte
      const offsetTop = mapRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const scrollToSpeeltuinen = () => {
    if (speeltuinenRef.current) {
      const headerHeight = 80; // Hoogte van sticky header + wat extra ruimte
      const offsetTop = speeltuinenRef.current.offsetTop - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  // Calculate last updated date from speeltuinen data
  const lastUpdated = useMemo(() => {
    if (!speeltuinen.length) return null;
    
    const dates = speeltuinen
      .map(s => s.updated_at || s.created_at)
      .filter(Boolean)
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());
    
    return dates.length > 0 ? dates[0] : null;
  }, [speeltuinen]);

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
        (filters.voorzieningen.sportveld && speeltuin.heeft_sportveld) ||
        (filters.voorzieningen.klimtoestel && speeltuin.heeft_klimtoestel) ||
        (filters.voorzieningen.water_pomp && speeltuin.heeft_water_pomp) ||
        (filters.voorzieningen.trapveld && speeltuin.heeft_trapveld) ||
        (filters.voorzieningen.skatebaan && speeltuin.heeft_skatebaan) ||
        (filters.voorzieningen.toilet && speeltuin.heeft_toilet) ||
        (filters.voorzieningen.parkeerplaats && speeltuin.heeft_parkeerplaats) ||
        (filters.voorzieningen.horeca && speeltuin.heeft_horeca);

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

      return leeftijdMatch && voorzieningenMatch && ondergrondMatch && grootteMatch;
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
    <div ref={topRef} className="min-h-screen bg-background">
      <SEOHead 
        title={settings.meta_title}
        description={settings.meta_description}
        keywords={settings.meta_keywords}
        structuredData={structuredData}
      />
      
      <Header 
        siteName={settings.site_name}
        siteDescription={settings.site_description}
        onScrollToTop={scrollToTop}
        onScrollToMap={scrollToMap}
        onScrollToSpeeltuinen={scrollToSpeeltuinen}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">{/* pt-24 = 96px voor sticky nav + padding */}
        <div className="flex gap-8 relative">
          {/* Filters Sidebar */}
          <div className={`transition-all duration-300 ease-in-out ${
            sidebarCollapsed 
              ? isMobile 
                ? 'fixed inset-0 -translate-x-full opacity-0 pointer-events-none z-20' 
                : '-ml-80 opacity-0 pointer-events-none'
              : isMobile
                ? 'fixed inset-0 translate-x-0 opacity-100 z-20 bg-background'
                : 'ml-0 opacity-100'
          } ${isMobile ? 'w-full' : 'w-80'} flex-shrink-0`}>
            {isMobile && !sidebarCollapsed && (
              <div className="absolute inset-0 bg-black/20" onClick={() => setSidebarCollapsed(true)} />
            )}
            <div className={`${isMobile ? 'w-80 bg-background shadow-lg' : 'w-full'} relative`}>
              <SpeeltuinFiltersComponent 
                filters={filters} 
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={clearAllFilters}
              />
            </div>
          </div>

          {/* Toggle Button */}
          <div className="absolute left-0 top-0 z-30">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`transition-all duration-300 ease-in-out ${
                sidebarCollapsed ? 'translate-x-0' : isMobile ? 'translate-x-0' : 'translate-x-80'
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
            {/* Map - Only show when sidebar is collapsed or on desktop */}
            {(sidebarCollapsed || !isMobile) && !isLoading && (
              <div ref={mapRef}>
                <h2 className="text-xl font-semibold mb-4">Kaart</h2>
                <SpeeltuinKaart 
                  speeltuinen={speeltuinen} 
                  onSpeeltuinSelect={setSelectedSpeeltuin}
                  userLocation={userLocation}
                  isLocating={isLocating}
                  onLocationRequest={getCurrentLocation}
                />
              </div>
            )}

            {/* Selected Speeltuin */}
            {selectedSpeeltuin && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Geselecteerde speeltuin</h2>
                <SpeeltuinCard speeltuin={selectedSpeeltuin} userLocation={userLocation} />
              </div>
            )}

            {/* Speeltuinen Grid */}
            <div ref={speeltuinenRef}>
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
                    <SpeeltuinCard key={speeltuin.id} speeltuin={speeltuin} userLocation={userLocation} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer lastUpdated={lastUpdated} />
    </div>
  );
};

export default Index;
