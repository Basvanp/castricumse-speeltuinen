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
import Hero from '@/components/Hero';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SpeeltuinFilters>({
    leeftijd: {
      geschikt_peuters: false,
      geschikt_kleuters: false,
      geschikt_kinderen: false,
    },
    voorzieningen: {
      heeft_glijbaan: false,
      heeft_schommel: false,
      heeft_zandbak: false,
      heeft_klimtoestel: false,
      heeft_kabelbaan: false,
      heeft_water_pomp: false,
      heeft_trapveld: false,
      heeft_skatebaan: false,
      heeft_basketbalveld: false,
      heeft_wipwap: false,
      heeft_duikelrek: false,
    },
    praktisch: {
      heeft_parkeerplaats: false,
      heeft_toilet: false,
      is_omheind: false,
      heeft_schaduw: false,
      is_rolstoeltoegankelijk: false,
    },
    type: {
      type_natuurspeeltuin: false,
      type_buurtspeeltuin: false,
      type_schoolplein: false,
      type_speelbos: false,
    },
    grootte: {
      klein: false,
      middel: false,
      groot: false,
    },
    ondergrond: {
      ondergrond_zand: false,
      ondergrond_gras: false,
      ondergrond_rubber: false,
      ondergrond_tegels: false,
      ondergrond_kunstgras: false,
    },
  });

  const clearAllFilters = () => {
    setFilters({
      leeftijd: {
        geschikt_peuters: false,
        geschikt_kleuters: false,
        geschikt_kinderen: false,
      },
      voorzieningen: {
        heeft_glijbaan: false,
        heeft_schommel: false,
        heeft_zandbak: false,
        heeft_klimtoestel: false,
        heeft_kabelbaan: false,
        heeft_water_pomp: false,
        heeft_trapveld: false,
        heeft_skatebaan: false,
        heeft_basketbalveld: false,
        heeft_wipwap: false,
        heeft_duikelrek: false,
      },
      praktisch: {
        heeft_parkeerplaats: false,
        heeft_toilet: false,
        is_omheind: false,
        heeft_schaduw: false,
        is_rolstoeltoegankelijk: false,
      },
      type: {
        type_natuurspeeltuin: false,
        type_buurtspeeltuin: false,
        type_schoolplein: false,
        type_speelbos: false,
      },
      grootte: {
        klein: false,
        middel: false,
        groot: false,
      },
      ondergrond: {
        ondergrond_zand: false,
        ondergrond_gras: false,
        ondergrond_rubber: false,
        ondergrond_tegels: false,
        ondergrond_kunstgras: false,
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

  const handleHeroSearch = (query: string) => {
    // Set search query and apply smart search
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If query is empty, clear all filters
      clearAllFilters();
      scrollToSpeeltuinen();
      return;
    }

    const lowerQuery = query.toLowerCase().trim();
    const newFilters = { ...filters };

    // Reset all filters first
    Object.keys(newFilters).forEach(category => {
      Object.keys(newFilters[category as keyof SpeeltuinFilters]).forEach(key => {
        newFilters[category as keyof SpeeltuinFilters][key as any] = false;
      });
    });

    // Smart search logic
    const searchTerms = lowerQuery.split(' ').filter(term => term.length > 0);
    
    searchTerms.forEach(term => {
      // Voorzieningen matching
      if (term.includes('glijbaan') || term.includes('glij')) {
        newFilters.voorzieningen.heeft_glijbaan = true;
      }
      if (term.includes('schommel') || term.includes('schom')) {
        newFilters.voorzieningen.heeft_schommel = true;
      }
      if (term.includes('zandbak') || term.includes('zand')) {
        newFilters.voorzieningen.heeft_zandbak = true;
      }
      if (term.includes('klimtoestel') || term.includes('klim')) {
        newFilters.voorzieningen.heeft_klimtoestel = true;
      }
      if (term.includes('kabelbaan') || term.includes('kabel')) {
        newFilters.voorzieningen.heeft_kabelbaan = true;
      }
      if (term.includes('water') || term.includes('pomp')) {
        newFilters.voorzieningen.heeft_water_pomp = true;
      }
      if (term.includes('panakooi') || term.includes('panda')) {
        newFilters.voorzieningen.heeft_panakooi = true;
      }
      if (term.includes('skate') || term.includes('skatebaan')) {
        newFilters.voorzieningen.heeft_skatebaan = true;
      }
      if (term.includes('basketbal') || term.includes('basket')) {
        newFilters.voorzieningen.heeft_basketbalveld = true;
      }
      if (term.includes('wipwap') || term.includes('wip')) {
        newFilters.voorzieningen.heeft_wipwap = true;
      }
      if (term.includes('duikelrek') || term.includes('duikel')) {
        newFilters.voorzieningen.heeft_duikelrek = true;
      }

      // Praktische zaken
      if (term.includes('toilet') || term.includes('wc')) {
        newFilters.praktisch.heeft_toilet = true;
      }
      if (term.includes('parkeer') || term.includes('auto')) {
        newFilters.praktisch.heeft_parkeerplaats = true;
      }
      if (term.includes('omheind') || term.includes('hek')) {
        newFilters.praktisch.is_omheind = true;
      }
      if (term.includes('schaduw') || term.includes('schaduwrijk')) {
        newFilters.praktisch.heeft_schaduw = true;
      }
      if (term.includes('rolstoel') || term.includes('toegankelijk')) {
        newFilters.praktisch.is_rolstoeltoegankelijk = true;
      }

      // Leeftijd
      if (term.includes('peuter') || term.includes('baby')) {
        newFilters.leeftijd.geschikt_peuters = true;
      }
      if (term.includes('kleuter') || term.includes('klein')) {
        newFilters.leeftijd.geschikt_kleuters = true;
      }
      if (term.includes('kind') || term.includes('groot')) {
        newFilters.leeftijd.geschikt_kinderen = true;
      }

      // Type speeltuin
      if (term.includes('natuur') || term.includes('bos')) {
        newFilters.type.type_natuurspeeltuin = true;
      }
      if (term.includes('buurt') || term.includes('wijk')) {
        newFilters.type.type_buurtspeeltuin = true;
      }
      if (term.includes('school') || term.includes('schoolplein')) {
        newFilters.type.type_schoolplein = true;
      }
      if (term.includes('speelbos') || term.includes('bos')) {
        newFilters.type.type_speelbos = true;
      }

      // Grootte
      if (term.includes('klein') || term.includes('kleintje')) {
        newFilters.grootte.klein = true;
      }
      if (term.includes('middel') || term.includes('medium')) {
        newFilters.grootte.middel = true;
      }
      if (term.includes('groot') || term.includes('speelpark')) {
        newFilters.grootte.groot = true;
      }

      // Ondergrond
      if (term.includes('zand') || term.includes('zandbak')) {
        newFilters.ondergrond.ondergrond_zand = true;
      }
      if (term.includes('gras') || term.includes('grasveld')) {
        newFilters.ondergrond.ondergrond_gras = true;
      }
      if (term.includes('rubber') || term.includes('valdemping')) {
        newFilters.ondergrond.ondergrond_rubber = true;
      }
      if (term.includes('tegel') || term.includes('beton')) {
        newFilters.ondergrond.ondergrond_tegels = true;
      }
      if (term.includes('kunstgras') || term.includes('kunst')) {
        newFilters.ondergrond.ondergrond_kunstgras = true;
      }
    });

    setFilters(newFilters);
    scrollToSpeeltuinen();
  };

  const handleCategoryClick = (category: string) => {
    // Set filter for the selected category and scroll to results
    const newFilters = { ...filters };
    
    // Map category names to filter properties
    const categoryMap: { [key: string]: string } = {
      'glijbaan': 'heeft_glijbaan',
      'pandakooi': 'heeft_panakooi',
      'waterpomp': 'heeft_water_pomp'
    };
    
    const filterKey = categoryMap[category];
    if (filterKey) {
      newFilters.voorzieningen[filterKey as keyof typeof newFilters.voorzieningen] = true;
      setFilters(newFilters);
      scrollToSpeeltuinen();
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
      // Text search - check if speeltuin name or description matches search query
      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        const nameMatch = speeltuin.naam.toLowerCase().includes(lowerQuery);
        const descriptionMatch = speeltuin.omschrijving?.toLowerCase().includes(lowerQuery) || false;
        
        if (!nameMatch && !descriptionMatch) {
          return false;
        }
      }

      // Check if any filters are active
      const hasActiveFilters = Object.values(filters).some((category) =>
        Object.values(category).some((value) => value)
      );

      if (!hasActiveFilters) return true;

      // Leeftijd filter
      const leeftijdMatch = 
        (!Object.values(filters.leeftijd).some(v => v)) ||
        (filters.leeftijd.geschikt_peuters && speeltuin.geschikt_peuters) ||
        (filters.leeftijd.geschikt_kleuters && speeltuin.geschikt_kleuters) ||
        (filters.leeftijd.geschikt_kinderen && speeltuin.geschikt_kinderen);

      // Type filter
      const typeMatch = 
        (!Object.values(filters.type).some(v => v)) ||
        (filters.type.type_natuurspeeltuin && speeltuin.type_natuurspeeltuin) ||
        (filters.type.type_buurtspeeltuin && speeltuin.type_buurtspeeltuin) ||
        (filters.type.type_schoolplein && speeltuin.type_schoolplein) ||
        (filters.type.type_speelbos && speeltuin.type_speelbos);

      // Voorzieningen filter
      const voorzieningenMatch = 
        (!Object.values(filters.voorzieningen).some(v => v)) ||
        (filters.voorzieningen.heeft_glijbaan && speeltuin.heeft_glijbaan) ||
        (filters.voorzieningen.heeft_schommel && speeltuin.heeft_schommel) ||
        (filters.voorzieningen.heeft_zandbak && speeltuin.heeft_zandbak) ||
        (filters.voorzieningen.heeft_kabelbaan && speeltuin.heeft_kabelbaan) ||
        (filters.voorzieningen.heeft_klimtoestel && speeltuin.heeft_klimtoestel) ||
        (filters.voorzieningen.heeft_water_pomp && speeltuin.heeft_water_pomp) ||
        (filters.voorzieningen.heeft_trapveld && speeltuin.heeft_trapveld) ||
        (filters.voorzieningen.heeft_skatebaan && speeltuin.heeft_skatebaan) ||
        (filters.voorzieningen.heeft_basketbalveld && speeltuin.heeft_basketbalveld) ||
        (filters.voorzieningen.heeft_wipwap && speeltuin.heeft_wipwap) ||
        (filters.voorzieningen.heeft_duikelrek && speeltuin.heeft_duikelrek);

      // Praktische zaken filter
      const praktischMatch = 
        (!Object.values(filters.praktisch).some(v => v)) ||
        (filters.praktisch.heeft_toilet && speeltuin.heeft_toilet) ||
        (filters.praktisch.heeft_parkeerplaats && speeltuin.heeft_parkeerplaats) ||
        (filters.praktisch.is_omheind && speeltuin.is_omheind) ||
        (filters.praktisch.heeft_schaduw && speeltuin.heeft_schaduw) ||
        (filters.praktisch.is_rolstoeltoegankelijk && speeltuin.is_rolstoeltoegankelijk);

      // Ondergrond filter
      const ondergrondMatch = 
        (!Object.values(filters.ondergrond).some(v => v)) ||
        (filters.ondergrond.ondergrond_zand && speeltuin.ondergrond_zand) ||
        (filters.ondergrond.ondergrond_gras && speeltuin.ondergrond_gras) ||
        (filters.ondergrond.ondergrond_rubber && speeltuin.ondergrond_rubber) ||
        (filters.ondergrond.ondergrond_tegels && speeltuin.ondergrond_tegels) ||
        (filters.ondergrond.ondergrond_kunstgras && speeltuin.ondergrond_kunstgras);

      // Grootte filter
      const grootteMatch = 
        (!Object.values(filters.grootte).some(v => v)) ||
        (filters.grootte.klein && speeltuin.grootte === 'klein') ||
        (filters.grootte.middel && speeltuin.grootte === 'middel') ||
        (filters.grootte.groot && speeltuin.grootte === 'groot');

      return leeftijdMatch && typeMatch && voorzieningenMatch && praktischMatch && ondergrondMatch && grootteMatch;
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

      {/* Hero Section */}
      <Hero 
        onSearch={handleHeroSearch}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            {(sidebarCollapsed || !isMobile) && (
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
