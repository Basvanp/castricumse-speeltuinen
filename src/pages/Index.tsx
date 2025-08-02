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

  // Keyword associations for fuzzy search
  const keywordAssociations = {
    koffie: ['horeca', 'cafe', 'restaurant', 'terras', 'eten', 'drinken'],
    glij: ['glijbaan', 'slide', 'klimtoestel', 'glijden'],
    wippen: ['wipwap', 'wip', 'seesaw', 'balanceren'],
    schommelen: ['schommel', 'swing', 'schommels'],
    klimmen: ['klimtoestel', 'klimrek', 'klimmuur', 'klimmen'],
    water: ['waterspeelplaats', 'fontein', 'sproei', 'nat', 'spetteren'],
    sport: ['voetbalveld', 'basketbal', 'fitness', 'sporten'],
    baby: ['peuters', '0-4 jaar', 'zandbak', 'kleintjes'],
    groot: ['12+', 'tieners', 'oudere kinderen'],
    klein: ['0-4', '4-8', 'peuters', 'kleuters'],
    parkeren: ['parking', 'auto', 'parkeerplaats'],
    toilet: ['wc', 'sanitair', 'voorzieningen']
  };

  // Create searchable content for each playground
  const createSearchableContent = (speeltuin: Speeltuin): string => {
    const facilities = [];
    if (speeltuin.heeft_glijbaan) facilities.push('glijbaan', 'slide', 'glijden');
    if (speeltuin.heeft_schommel) facilities.push('schommel', 'swing', 'schommelen');
    if (speeltuin.heeft_zandbak) facilities.push('zandbak', 'zand');
    if (speeltuin.heeft_klimtoestel) facilities.push('klimtoestel', 'klimmen', 'klimrek');
    if (speeltuin.heeft_kabelbaan) facilities.push('kabelbaan', 'kabel');
    if (speeltuin.heeft_water_pomp) facilities.push('water', 'pomp', 'waterspeelplaats');
    if (speeltuin.heeft_trapveld) facilities.push('trapveld', 'panakooi', 'voetbal');
    if (speeltuin.heeft_skatebaan) facilities.push('skatebaan', 'skate', 'skaten');
    if (speeltuin.heeft_basketbalveld) facilities.push('basketbal', 'basket', 'sport');
    if (speeltuin.heeft_wipwap) facilities.push('wipwap', 'wip', 'seesaw', 'balanceren');
    if (speeltuin.heeft_duikelrek) facilities.push('duikelrek', 'duikel', 'rekstok');

    const amenities = [];
    if (speeltuin.heeft_toilet) amenities.push('toilet', 'wc', 'sanitair');
    if (speeltuin.heeft_parkeerplaats) amenities.push('parkeren', 'parking', 'auto', 'parkeerplaats');
    if (speeltuin.heeft_horeca) amenities.push('horeca', 'koffie', 'cafe', 'restaurant', 'eten', 'drinken');
    if (speeltuin.is_omheind) amenities.push('omheind', 'hek', 'veilig');
    if (speeltuin.heeft_schaduw) amenities.push('schaduw', 'schaduwrijk', 'bomen');
    if (speeltuin.is_rolstoeltoegankelijk) amenities.push('rolstoel', 'toegankelijk', 'mindervaliden');

    const ageGroups = [];
    if (speeltuin.geschikt_peuters) ageGroups.push('peuters', 'baby', 'kleintjes', '0-4');
    if (speeltuin.geschikt_kleuters) ageGroups.push('kleuters', 'klein', '4-8');
    if (speeltuin.geschikt_kinderen) ageGroups.push('kinderen', 'groot', '8-12', '12+');

    const types = [];
    if (speeltuin.type_natuurspeeltuin) types.push('natuur', 'natuurspeeltuin');
    if (speeltuin.type_buurtspeeltuin) types.push('buurt', 'buurtspeeltuin', 'wijk');
    if (speeltuin.type_schoolplein) types.push('school', 'schoolplein');
    if (speeltuin.type_speelbos) types.push('speelbos', 'bos', 'natuur');

    return [
      speeltuin.naam,
      speeltuin.omschrijving || '',
      ...facilities,
      ...amenities,
      ...ageGroups,
      ...types,
      speeltuin.grootte || '',
      'castricum'
    ].join(' ').toLowerCase();
  };

  // Fuzzy search function
  const fuzzySearch = (query: string, content: string): number => {
    if (!query.trim()) return 0;
    
    const lowerQuery = query.toLowerCase().trim();
    const lowerContent = content.toLowerCase();
    
    // Exact match - highest weight
    if (lowerContent.includes(lowerQuery)) return 100;
    
    // Check for keyword associations
    let associationScore = 0;
    Object.entries(keywordAssociations).forEach(([key, values]) => {
      if (lowerQuery.includes(key)) {
        values.forEach(value => {
          if (lowerContent.includes(value)) {
            associationScore = Math.max(associationScore, 50);
          }
        });
      }
    });
    
    if (associationScore > 0) return associationScore;
    
    // Partial matches
    const queryWords = lowerQuery.split(' ').filter(word => word.length > 0);
    let partialScore = 0;
    
    queryWords.forEach(word => {
      if (lowerContent.includes(word)) {
        partialScore += 30;
      } else {
        // Check for partial word matches (fuzzy)
        const contentWords = lowerContent.split(' ');
        contentWords.forEach(contentWord => {
          if (contentWord.includes(word) || word.includes(contentWord)) {
            partialScore += 15;
          }
        });
      }
    });
    
    return partialScore;
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      clearAllFilters();
    }

    // Always scroll to results when search is performed
    setTimeout(() => scrollToSpeeltuinen(), 100);
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
    // Create searchable content and scores for each playground
    const speeltuinenWithScores = speeltuinen.map((speeltuin) => {
      const searchableContent = createSearchableContent(speeltuin);
      const searchScore = searchQuery.trim() ? fuzzySearch(searchQuery, searchableContent) : 0;
      return { speeltuin, searchScore };
    });

    // Filter based on search and filters
    return speeltuinenWithScores
      .filter(({ speeltuin, searchScore }) => {
        // If there's a search query, only show results with a score > 0
        if (searchQuery.trim() && searchScore === 0) {
          return false;
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
      })
      .sort((a, b) => b.searchScore - a.searchScore) // Sort by search relevance
      .map(({ speeltuin }) => speeltuin);
  }, [speeltuinen, filters, searchQuery, createSearchableContent, fuzzySearch]);

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
