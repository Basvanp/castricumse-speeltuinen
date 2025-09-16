import React, { useState } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import SpeeltuinFilters from '@/components/SpeeltuinFilters';
import SpeeltuinKaart from '@/components/SpeeltuinKaart';
import SpeeltuinCard from '@/components/SpeeltuinCard';
import Hero from '@/components/Hero';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import { generateWebsiteSchema } from '@/utils/structuredData';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid3X3, MapPin } from 'lucide-react';

interface FilterOptions {
  searchTerm?: string;
  hasGlijbaan?: boolean;
  hasSchommel?: boolean;
  hasZandbak?: boolean;
  hasKlimtoestel?: boolean;
  geschiktPeuters?: boolean;
  geschiktKleuters?: boolean;
  geschiktKinderen?: boolean;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [viewMode, setViewMode] = useState<'grid' | 'kaart'>('kaart');
  const [selectedSpeeltuin, setSelectedSpeeltuin] = useState<Speeltuin | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const { data: settings } = useSiteSettings();

  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen(
    searchQuery ? { searchTerm: searchQuery, ...filters } : filters
  );

  // Automatically request location on page load
  React.useEffect(() => {
    if (!userLocation && !isLocating && navigator.geolocation) {
      // Small delay to let the page load first
      const timer = setTimeout(() => {
        handleLocationRequest();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []); // Only run once on mount

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: 'grid' | 'kaart') => {
    setViewMode(mode);
    // Clear selected speeltuin when switching to map view manually
    if (mode === 'kaart') {
      setSelectedSpeeltuin(null);
    }
  };

  const handleSpeeltuinSelect = (speeltuin: Speeltuin) => {
    setSelectedSpeeltuin(speeltuin);
    setViewMode('kaart');
  };

  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      alert('Geolocatie wordt niet ondersteund door deze browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Kon locatie niet ophalen. Controleer of locatie-toegang is ingeschakeld.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Scroll functions for header navigation
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToSpeeltuinen = () => {
    // Switch to grid view and scroll to it
    setViewMode('grid');
    setTimeout(() => {
      const speeltuinenSection = document.getElementById('speeltuinen');
      if (speeltuinenSection) {
        speeltuinenSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleScrollToMap = () => {
    // Switch to map view and scroll to it
    setViewMode('kaart');
    setTimeout(() => {
      const speeltuinenSection = document.getElementById('speeltuinen');
      if (speeltuinenSection) {
        speeltuinenSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Generate structured data for the homepage
  const structuredData = React.useMemo(() => {
    if (!settings) return undefined;
    return generateWebsiteSchema(settings as any);
  }, [settings]);

  const faqData = [
    {
      question: "Zijn alle speeltuinen in Castricum gratis toegankelijk?",
      answer: "Ja, alle speeltuinen in Castricum zijn volledig gratis toegankelijk voor alle kinderen en gezinnen."
    },
    {
      question: "Voor welke leeftijden zijn de speeltuinen geschikt?",
      answer: "De speeltuinen zijn geschikt voor verschillende leeftijdsgroepen: peuters (0-2 jaar), kleuters (2-6 jaar), schoolkinderen (6-12 jaar) en soms ook tieners (12+ jaar). Bij elke speeltuin staat aangegeven voor welke leeftijd deze het meest geschikt is."
    },
    {
      question: "Zijn er parkeerplaatsen bij de speeltuinen?",
      answer: "De meeste speeltuinen hebben parkeerplaatsen in de buurt. Kijk bij de details van elke speeltuin om te zien of er specifieke parkeermogelijkheden zijn."
    },
    {
      question: "Zijn de speeltuinen toegankelijk voor rolstoelgebruikers?",
      answer: "De toegankelijkheid verschilt per speeltuin. Moderne speeltuinen zijn meestal goed toegankelijk, maar oudere speeltuinen kunnen beperkingen hebben in de toegankelijkheid."
    },
    {
      question: "Wat zijn de openingstijden van de speeltuinen?",
      answer: "De meeste speeltuinen in Castricum zijn 24/7 open en toegankelijk, tenzij anders vermeld. Sommige speeltuinen kunnen beperkte openingstijden hebben vanwege hun locatie."
    },
    {
      question: "Zijn er toiletten en andere voorzieningen bij de speeltuinen?",
      answer: "De voorzieningen verschillen per speeltuin. Veel speeltuinen hebben bankjes en prullenbakken. Openbare toiletten zijn helaas niet bij alle speeltuinen aanwezig. Controleer bij de details van elke speeltuin welke voorzieningen beschikbaar zijn, of plan een bezoek aan nabijgelegen winkels of horecagelegenheden."
    },
    {
      question: "Wat moet ik doen als ik kapotte of gevaarlijke speeltoestellen tegenkom?",
      answer: "Meld kapotte of onveilige speeltoestellen direct bij de gemeente Castricum.\n\n• Klik op de knop 'Probleem melden' bij de betreffende speeltuin op onze website\n• Kies voor 'Probleem melden via Fixi' om direct naar de Fixi-app te gaan\n• Of kopieer de locatiegegevens en plak deze in de Fixi-app voor automatische locatie-invulling\n• Geef een duidelijke omschrijving van het probleem en voeg indien mogelijk foto's toe"
    },
    {
      question: "Zijn honden toegestaan op de speeltuinen?",
      answer: "Honden zijn meestal wel toegestaan op de speeltuinen, maar moeten altijd aangelijnd zijn. Per speeltuin kunnen er verschillende regels gelden. Houd rekening met andere kinderen en zorg ervoor dat je hond geen overlast veroorzaakt. Ruim altijd hondenpoep op en neem afvalzakjes mee."
    }
  ];

  return (
    <>
      <SEOHead
        title="Speeltuinen in Castricum - Complete Gids voor Gezinnen"
        description="Ontdek alle speeltuinen in Castricum! Gratis toegang, foto's, locaties en faciliteiten. Perfect voor peuters, kleuters en schoolkinderen. FAQ over openingstijden, parkeren en voorzieningen."
        keywords="speeltuinen Castricum, speeltuin Castricum, kinderen spelen Castricum, speelplaats Castricum, buitenspelen Castricum, peuterspeeltuin Castricum, speelpark Castricum, Noord-Holland speeltuinen, familie uitje Castricum, kindvriendelijk Castricum"
        image="https://speeltuincastricum.nl/og-playground-hero.jpg"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-background">
        <Header 
          onScrollToTop={handleScrollToTop}
          onScrollToMap={handleScrollToMap}
          onScrollToSpeeltuinen={handleScrollToSpeeltuinen}
        />
        <BreadcrumbNav />
        
        <Hero onSearch={handleSearch} />
        
        <main className="container mx-auto px-4 py-8" id="speeltuinen">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Alle Speeltuinen in Castricum
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Castricum heeft {speeltuinen.length} prachtige speeltuinen, elk met unieke voorzieningen. 
              Vind de perfecte speeltuin voor jouw kinderen met onze handige filters en kaart.
            </p>
          </header>

          {/* Side-by-side layout for filters and map */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {/* Filters - Takes 1 column on large screens */}
            <div className="lg:col-span-1">
              <SpeeltuinFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
            
            {/* Map/Content area - Takes 4 columns on large screens */}
            <div className="lg:col-span-4">

              {/* View Mode Switcher */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="text-center sm:text-left">
                  <p className="text-muted-foreground">
                    {speeltuinen.length} speeltuinen gevonden
                  </p>
                </div>
                
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && handleViewModeChange(value as 'grid' | 'kaart')}>
                  <ToggleGroupItem value="grid" aria-label="Grid weergave">
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </ToggleGroupItem>
                  <ToggleGroupItem value="kaart" aria-label="Kaart weergave">
                    <MapPin className="h-4 w-4 mr-2" />
                    Kaart
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {error && (
                <div className="text-center py-8">
                  <p className="text-destructive">Er is een fout opgetreden bij het laden van de speeltuinen.</p>
                </div>
              )}

              {isLoading ? (
                <div className="text-center py-8">
                  <p>Speeltuinen laden...</p>
                </div>
              ) : viewMode === 'kaart' ? (
                <div className="space-y-8">
                  {/* Map */}
                  <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
                    <SpeeltuinKaart 
                      speeltuinen={speeltuinen} 
                      selectedSpeeltuin={selectedSpeeltuin}
                      userLocation={userLocation}
                      isLocating={isLocating}
                      onLocationRequest={handleLocationRequest}
                    />
                  </div>
                  
                  {/* Speeltuinen cards below the map */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {speeltuinen.map((speeltuin) => (
                      <SpeeltuinCard 
                        key={speeltuin.id} 
                        speeltuin={speeltuin} 
                        onSelect={handleSpeeltuinSelect}
                        userLocation={userLocation}
                        showDistance={true}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {speeltuinen.map((speeltuin) => (
                    <SpeeltuinCard 
                      key={speeltuin.id} 
                      speeltuin={speeltuin} 
                      onSelect={handleSpeeltuinSelect}
                      userLocation={userLocation}
                      showDistance={true}
                    />
                  ))}
                </div>
              )}

              {speeltuinen.length === 0 && !isLoading && !error && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Geen speeltuinen gevonden die voldoen aan je filters.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              Veelgestelde Vragen over Speeltuinen in Castricum
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        </main>
        
        <Footer lastUpdated={Date.now()} />
        
        {/* Back to Top Button */}
        <BackToTop />
      </div>
    </>
  );
};

export default Index;