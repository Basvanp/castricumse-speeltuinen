import React, { useState } from 'react';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
import SpeeltuinFilters from '@/components/SpeeltuinFilters';
import SpeeltuinKaart from '@/components/SpeeltuinKaart';
import SpeeltuinCard from '@/components/SpeeltuinCard';
import Hero from '@/components/Hero';
import SEOHead from '@/components/SEOHead';
import BreadcrumbNav from '@/components/BreadcrumbNav';
import Footer from '@/components/Footer';
import { generateWebsiteSchema } from '@/utils/structuredData';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
  const [viewMode, setViewMode] = useState<'grid' | 'kaart'>('grid');
  const { data: settings } = useSiteSettings();

  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen(
    searchQuery ? { searchTerm: searchQuery, ...filters } : filters
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleViewModeChange = (mode: 'grid' | 'kaart') => {
    setViewMode(mode);
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
        <BreadcrumbNav />
        
        <Hero onSearch={handleSearch} />
        
        <main className="container mx-auto px-4 py-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Alle Speeltuinen in Castricum
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Castricum heeft {speeltuinen.length} prachtige speeltuinen, elk met unieke voorzieningen. 
              Vind de perfecte speeltuin voor jouw kinderen met onze handige filters en kaart.
            </p>
          </header>

          <SpeeltuinFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />

          <div className="text-center mb-4">
            <p className="text-muted-foreground">
              {speeltuinen.length} speeltuinen gevonden
            </p>
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
            <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
              <SpeeltuinKaart 
                speeltuinen={speeltuinen} 
                userLocation={null}
                isLocating={false}
                onLocationRequest={() => {}}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {speeltuinen.map((speeltuin) => (
                <SpeeltuinCard key={speeltuin.id} speeltuin={speeltuin} />
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
      </div>
    </>
  );
};

export default Index;