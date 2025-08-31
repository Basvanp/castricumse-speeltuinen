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
                  title={(settings as any).site_name || "Speeltuinen Castricum - Interactieve Kaart & Gids"}
                  description={(settings as any).site_description || "Ontdek alle speeltuinen in Castricum met onze interactieve kaart. Vind de perfecte speelplek voor jouw kinderen - van peuters tot tieners!"}
        keywords="speeltuinen Castricum, speeltuin Castricum, kinderen spelen Castricum, speelplaats Castricum, buitenspelen Castricum, peuterspeeltuin Castricum, speelpark Castricum, Noord-Holland speeltuinen, familie uitje Castricum, kindvriendelijk Castricum, glijbaan Castricum, schommel Castricum, zandbak Castricum"
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
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Alle Speeltuinen in Castricum</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ontdek alle {speeltuinen.length} speeltuinen in Castricum. 
              Gebruik de filters om de perfecte speelplek te vinden voor jouw kinderen.
            </p>
          </div>

          {/* Filters and Speeltuinen Grid */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <SpeeltuinFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={clearAllFilters}
              />
            </div>

            {/* Speeltuinen Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredSpeeltuinen.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-semibold mb-2">Geen speeltuinen gevonden</h3>
                  <p className="text-muted-foreground mb-4">
                    Probeer je filters aan te passen of je zoekopdracht te wijzigen.
                  </p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Alle filters wissen
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSpeeltuinen.map((speeltuin) => (
                    <SpeeltuinCard
                      key={speeltuin.id}
                      speeltuin={speeltuin}
                      onSelect={setSelectedSpeeltuin}
                      userLocation={userLocation}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FAQ Section - SEO Optimization for "People Also Ask" */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Veelgestelde Vragen over Speeltuinen in Castricum
              </h2>
              <p className="text-muted-foreground">
                Antwoorden op de meest gestelde vragen van ouders en verzorgers
              </p>
            </div>

            <div className="space-y-6">
              {/* FAQ Item 1 */}
              <Collapsible className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-6 h-auto text-left">
                    <h3 className="text-lg font-semibold">Welke speeltuinen zijn geschikt voor peuters in Castricum?</h3>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      In Castricum zijn er verschillende speeltuinen die perfect geschikt zijn voor peuters:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Speeltuin Albertshoeve:</strong> Kleine glijbaan, veilige schommels en zandbak</li>
                      <li><strong>Speeltuin De Oude Keuken:</strong> Peutervriendelijke speeltoestellen en zachte ondergrond</li>
                      <li><strong>Alle speeltuinen</strong> hebben veilige speeltoestellen voor kinderen vanaf 2 jaar</li>
                    </ul>
                    <p className="text-sm text-primary">
                      💡 Tip: Gebruik de filters bovenaan om speeltuinen te vinden met specifieke voorzieningen voor peuters.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ Item 2 */}
              <Collapsible className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-6 h-auto text-left">
                    <h3 className="text-lg font-semibold">Zijn de speeltuinen in Castricum gratis toegankelijk?</h3>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong>Ja, alle speeltuinen in Castricum zijn volledig gratis toegankelijk!</strong> Dit maakt Castricum een ideale bestemming voor gezinnen met kinderen.
                    </p>
                    <p>
                      De speeltuinen zijn openbaar eigendom van de gemeente en staan open voor iedereen. Je hoeft geen entree te betalen en kunt zo lang blijven spelen als je wilt.
                    </p>
                    <p className="text-sm text-primary">
                      🎯 Perfect voor: Dagjes uit, regelmatige bezoeken, en spontane speelmomenten zonder kosten.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ Item 3 */}
              <Collapsible className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-6 h-auto text-left">
                    <h3 className="text-lg font-semibold">Wat zijn de openingstijden van de speeltuinen?</h3>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong>Alle speeltuinen in Castricum zijn 24/7 open en gratis toegankelijk!</strong> Dit betekent dat je kunt spelen wanneer het jou uitkomt.
                    </p>
                    <p>
                      <strong>Beste speeltijden:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Ochtend:</strong> 9:00 - 12:00 (minder druk, frisse lucht)</li>
                      <li><strong>Middag:</strong> 14:00 - 17:00 (meeste kinderen, gezellige sfeer)</li>
                      <li><strong>Avond:</strong> 18:00 - 20:00 (zomermaanden, koeler weer)</li>
                    </ul>
                    <p className="text-sm text-primary">
                      🌞 Let op: In de wintermaanden kan het vroeg donker worden, dus plan je bezoek overdag.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ Item 4 */}
              <Collapsible className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-6 h-auto text-left">
                    <h3 className="text-lg font-semibold">Welke speeltuinen hebben de beste voorzieningen?</h3>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      Elke speeltuin in Castricum heeft unieke voorzieningen. Hier is een overzicht van de beste:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🎠 Speeltuin Albertshoeve</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Grote glijbaan</li>
                          <li>• Meerdere schommels</li>
                          <li>• Zandbak met speelgoed</li>
                          <li>• Picknicktafels</li>
                        </ul>
                      </div>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">🏰 Speeltuin De Oude Keuken</h4>
                        <ul className="text-sm space-y-1">
                          <li>• Klimtoestellen</li>
                          <li>• Wipwap</li>
                          <li>• Veilige ondergrond</li>
                          <li>• Schaduwrijke plekken</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-sm text-primary mt-4">
                      🔍 Gebruik de filters bovenaan om speeltuinen te vinden met specifieke voorzieningen die jij zoekt.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* FAQ Item 5 */}
              <Collapsible className="border border-border rounded-lg">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-6 h-auto text-left">
                    <h3 className="text-lg font-semibold">Is er parkeergelegenheid bij de speeltuinen?</h3>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 transition-transform" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-6">
                  <div className="space-y-3 text-muted-foreground">
                    <p>
                      <strong>Ja, alle speeltuinen in Castricum hebben goede parkeermogelijkheden:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li><strong>Gratis parkeren:</strong> Alle parkeerplaatsen zijn kosteloos</li>
                      <li><strong>Ruime parkeerplaatsen:</strong> Voldoende plek voor meerdere auto's</li>
                      <li><strong>Veilige locaties:</strong> Goed verlichte parkeerplaatsen</li>
                      <li><strong>Fietsenstallingen:</strong> Ook perfect bereikbaar met de fiets</li>
                    </ul>
                    <p>
                      <strong>Openbaar vervoer:</strong> Alle speeltuinen zijn ook goed bereikbaar met de bus. Kijk op de kaart voor de exacte locaties en routes.
                    </p>
                    <p className="text-sm text-primary">
                      🚗 Tip: Kom je met de auto? Plan je bezoek buiten de spitsuren voor de beste parkeerplek.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </section>
      </main>

      {/* SEO Content Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl font-bold text-foreground mb-6">Speeltuinen in Castricum - Complete Gids voor Gezinnen</h1>
          
          <div className="text-muted-foreground space-y-4">
            <p>
              Welkom bij de meest complete gids van alle speeltuinen in Castricum! Of je nu op zoek bent naar een 
              veilige peuterspeeltuin voor je kleine, een uitdagende natuurspeeltuin voor avontuurlijke kinderen, 
              of een complete speelvoorziening met toiletten en parkeerplaatsen - wij hebben alle informatie die je nodig hebt.
            </p>
            
            <p>
              Castricum biedt een rijke diversiteit aan speelmogelijkheden verspreid door de hele gemeente. 
              Van de gezellige buurtparken tot de grote speelbossen, elke speeltuin heeft zijn eigen charme en unieke faciliteiten. 
              Onze interactieve kaart toont je precies waar elke speeltuin zich bevindt, compleet met foto's, 
              faciliteitsoverzicht en praktische informatie zoals openingstijden en bereikbaarheid.
            </p>

            <p>
              Gebruik onze handige filters om speeltuinen te vinden die perfect aansluiten bij de leeftijd van je kinderen. 
              Zoek bijvoorbeeld naar speeltuinen met glijbanen voor de liefhebbers van snelheid, schommels voor ontspanning, 
              of zandbakken voor creatief spel. Daarnaast kun je filteren op praktische zaken zoals de aanwezigheid van 
              toiletten, parkeerplaatsen of schaduwplekken voor die warme zomerdagen.
            </p>

            <p>
              Elke speeltuin in onze database is zorgvuldig gecontroleerd en voorzien van actuele informatie. 
              We werken nauw samen met de gemeente Castricum om ervoor te zorgen dat alle gegevens up-to-date blijven. 
              Zo weet je altijd zeker dat je naar een goed onderhouden en veilige speelplek gaat met je gezin.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer lastUpdated={speeltuinen.length > 0 ? Math.max(...speeltuinen.map(s => new Date(s.updated_at).getTime())) : Date.now()} />
    </div>
  );
};

export default Index;
