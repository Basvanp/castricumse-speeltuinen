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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronLeft, ChevronRight, Filter, ChevronDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SEOHead from '@/components/SEOHead';
import { generateOrganizationSchema, generateLocalBusinessSchema, generateWebsiteSchema } from '@/utils/structuredData';

const Index = () => {
  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen();
  const { data: settings = {} } = useSiteSettings();
  const { trackEvent } = useAnalytics();
  const isMobile = useIsMobile();
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState<Speeltuin | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Refs voor scroll-functionaliteit
  const topRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const speeltuinenRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SpeeltuinFilters>({});
  const [isFiltersOpen, setIsFiltersOpen] = useState(!isMobile);

  const clearAllFilters = () => {
    setFilters({});
  };

  const handleApplyFilters = () => {
    // Track filter usage
    const activeFilters = Object.entries(filters).filter(([_, value]) => value === true);
    if (activeFilters.length > 0) {
      trackEvent('filter_used', undefined, {
        filter_count: activeFilters.length,
        filters: activeFilters.map(([key]) => key).join(',')
      });
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Locatie niet ondersteund",
        description: "Je browser ondersteunt geen geolocatie.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
        toast({
          title: "Locatie gevonden!",
          description: "Je locatie is gebruikt om nabijgelegen speeltuinen te vinden.",
        });
      },
      (error) => {
        setIsLocating(false);
        let errorMessage = "Er is een fout opgetreden bij het ophalen van je locatie.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Locatie toegang is geweigerd. Controleer je browser instellingen.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Locatie informatie is niet beschikbaar.";
            break;
          case error.TIMEOUT:
            errorMessage = "Het ophalen van je locatie duurde te lang.";
            break;
        }
        
        toast({
          title: "Locatie fout",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Scroll functions
  const scrollToTop = () => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSpeeltuinen = () => {
    speeltuinenRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Search functionality
  const createSearchableContent = (speeltuin: Speeltuin): string => {
    const content = [
      speeltuin.naam,
      speeltuin.omschrijving || '',
      speeltuin.badge || '',
      // Add facility names
      speeltuin.heeft_glijbaan ? 'glijbaan' : '',
      speeltuin.heeft_schommel ? 'schommel' : '',
      speeltuin.heeft_zandbak ? 'zandbak' : '',
      speeltuin.heeft_kabelbaan ? 'kabelbaan' : '',
      speeltuin.heeft_bankjes ? 'bankjes' : '',
      speeltuin.heeft_sportveld ? 'sportveld' : '',
      speeltuin.heeft_water_pomp ? 'waterpomp' : '',
      speeltuin.heeft_klimtoestel ? 'klimtoestel' : '',
      speeltuin.heeft_skatebaan ? 'skatebaan' : '',
      speeltuin.heeft_basketbalveld ? 'basketbalveld' : '',
              speeltuin.heeft_panakooi ? 'panakooi' : '',
      speeltuin.heeft_wipwap ? 'wipwap' : '',
      speeltuin.heeft_duikelrek ? 'duikelrek' : '',
      // Add type names
      speeltuin.type_natuurspeeltuin ? 'natuurspeeltuin' : '',
      speeltuin.type_buurtspeeltuin ? 'buurtspeeltuin' : '',
      speeltuin.type_schoolplein ? 'schoolplein' : '',
      speeltuin.type_speelbos ? 'speelbos' : '',
      // Add practical features
      speeltuin.heeft_parkeerplaats ? 'parkeerplaats' : '',
      speeltuin.heeft_toilet ? 'toilet' : '',
      speeltuin.heeft_horeca ? 'horeca' : '',
      speeltuin.is_omheind ? 'omheind' : '',
      speeltuin.heeft_schaduw ? 'schaduw' : '',
              // is_rolstoeltoegankelijk removed
      // Add size
      speeltuin.grootte,
    ].join(' ').toLowerCase();
    
    return content;
  };

  const fuzzySearch = (query: string, content: string): number => {
    const queryWords = query.toLowerCase().split(' ').filter(word => word.length > 0);
    const contentWords = content.split(' ');
    
    let totalScore = 0;
    
    for (const queryWord of queryWords) {
      let bestScore = 0;
      
      for (const contentWord of contentWords) {
        if (contentWord.includes(queryWord)) {
          bestScore = Math.max(bestScore, queryWord.length / contentWord.length);
        }
      }
      
      totalScore += bestScore;
    }
    
    return totalScore / queryWords.length;
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    scrollToSpeeltuinen();
  };

  const handleCategoryClick = (category: string) => {
    // Set appropriate filter based on category
    const categoryFilters: Record<string, Partial<SpeeltuinFilters>> = {
      'glijbanen': { hasGlijbaan: true },
      'schommels': { hasSchommel: true },
      'zandbakken': { hasZandbak: true },
      'klimtoestellen': { hasKlimtoestel: true },
      'natuurspeeltuinen': { isTypeNatuurspeeltuin: true },
      'rolstoeltoegankelijk': { isRolstoeltoegankelijk: true },
    };
    
    setFilters(categoryFilters[category] || {});
    scrollToSpeeltuinen();
  };

  // Filter and search speeltuinen
  const filteredSpeeltuinen = useMemo(() => {
    let filtered = speeltuinen;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(speeltuin => {
        const searchableContent = createSearchableContent(speeltuin);
        const score = fuzzySearch(searchQuery, searchableContent);
        return score > 0.3; // Threshold for relevance
      });
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      filtered = filtered.filter(speeltuin => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          
          switch (key) {
            case 'hasGlijbaan': return speeltuin.heeft_glijbaan;
            case 'hasSchommel': return speeltuin.heeft_schommel;
            case 'hasZandbak': return speeltuin.heeft_zandbak;
            case 'hasKabelbaan': return speeltuin.heeft_kabelbaan;
            case 'hasBankjes': return speeltuin.heeft_bankjes;
            case 'hasSportveld': return speeltuin.heeft_sportveld;
            case 'hasWaterPomp': return speeltuin.heeft_water_pomp;
            case 'hasKlimtoestel': return speeltuin.heeft_klimtoestel;
            case 'hasSkatebaan': return speeltuin.heeft_skatebaan;
            case 'hasBasketbalveld': return speeltuin.heeft_basketbalveld;
            case 'hasPanakooi': return speeltuin.heeft_panakooi;
            case 'hasWipwap': return speeltuin.heeft_wipwap;
            case 'hasDuikelrek': return speeltuin.heeft_duikelrek;
            case 'typeNatuurspeeltuin': return speeltuin.type_natuurspeeltuin;
            case 'typeBuurtspeeltuin': return speeltuin.type_buurtspeeltuin;
            case 'typeSchoolplein': return speeltuin.type_schoolplein;
            case 'typeSpeelbos': return speeltuin.type_speelbos;
            case 'isRolstoeltoegankelijk': return false; // is_rolstoeltoegankelijk removed
            case 'hasSchaduw': return speeltuin.heeft_schaduw;
            case 'isOmheind': return speeltuin.is_omheind;
            case 'hasParkeerplaats': return speeltuin.heeft_parkeerplaats;
            case 'hasToilet': return speeltuin.heeft_toilet;
            case 'hasHoreca': return speeltuin.heeft_horeca;
            case 'grootte': return speeltuin.grootte === value;
            default: return true;
          }
        });
      });
    }

    return filtered;
  }, [speeltuinen, searchQuery, filters]);

  // Track page view
  useEffect(() => {
    trackEvent('page_view');
  }, [trackEvent]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Er is een fout opgetreden</h1>
          <p className="text-muted-foreground">Probeer de pagina te verversen.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={(settings as any).site_name || "Speeltuinen Castricum - Ontdek alle speeltuinen in Castricum"}
        description={(settings as any).site_description || "Ontdek alle speeltuinen in Castricum en omgeving. Van kleine buurtpleintjes tot grotere speeltuinen voor uren speelplezier."}
        keywords="speeltuinen, castricum, speeltuin, kinderen, spelen, buitenspelen, glijbaan, schommel, zandbak"
        structuredData={[
          generateOrganizationSchema(settings),
          generateLocalBusinessSchema(settings),
          generateWebsiteSchema(settings)
        ]}
      />
      
      {/* Top section for scroll reference */}
      <div ref={topRef} />
      
      {/* Header */}
      <Header
        onScrollToTop={scrollToTop}
        onScrollToMap={scrollToMap}
        onScrollToSpeeltuinen={scrollToSpeeltuinen}
      />

      {/* Hero Section */}
      <Hero
        onSearch={handleHeroSearch}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Map Section with Filters Sidebar */}
        <section ref={mapRef} className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Speeltuinen Kaart</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bekijk alle speeltuinen in Castricum op de interactieve kaart. 
              Klik op een marker voor meer informatie.
            </p>
          </div>
          
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4">
            <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                    {Object.values(filters).some(v => v) && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                        {Object.values(filters).filter(v => v).length}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <SpeeltuinFiltersComponent
                  filters={filters}
                  onFiltersChange={setFilters}
                  onApplyFilters={handleApplyFilters}
                  onClearFilters={clearAllFilters}
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Desktop Layout: Filters + Map */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters Sidebar */}
            <div className="hidden lg:block lg:w-72 xl:w-80 flex-shrink-0">
              <SpeeltuinFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={clearAllFilters}
              />
            </div>

            {/* Map */}
            <div className="flex-1 min-h-[400px] lg:min-h-[500px]">
              <SpeeltuinKaart
                speeltuinen={filteredSpeeltuinen as any}
                onSpeeltuinSelect={setSelectedSpeeltuin}
                userLocation={userLocation}
                isLocating={isLocating}
                onLocationRequest={getCurrentLocation}
              />
            </div>
          </div>
        </section>

        {/* Speeltuinen Section */}
        <section ref={speeltuinenRef} className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Alle Speeltuinen
              </h2>
              <p className="text-muted-foreground">
                {filteredSpeeltuinen.length} van {speeltuinen.length} speeltuinen
                {searchQuery && ` voor "${searchQuery}"`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
                  <div className="h-48 bg-muted rounded-lg mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : filteredSpeeltuinen.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎪</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Geen speeltuinen gevonden</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery 
                  ? `Geen speeltuinen gevonden voor "${searchQuery}". Probeer andere zoektermen.`
                  : "Er zijn momenteel geen speeltuinen beschikbaar."
                }
              </p>
              {(searchQuery || Object.keys(filters).length > 0) && (
                <Button onClick={clearAllFilters} variant="outline">
                  Alle filters wissen
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpeeltuinen.map((speeltuin) => (
                <SpeeltuinCard
                  key={speeltuin.id}
                  speeltuin={speeltuin as any}
                  onSelect={setSelectedSpeeltuin}
                  userLocation={userLocation}
                  showDistance={true}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <Footer lastUpdated={(settings as any).last_updated} />
    </div>
  );
};

export default Index;
