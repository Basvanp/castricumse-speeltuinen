import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareButton } from '@/components/ui/share-button';
import { Search } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';
interface HeroProps {
  onSearch: (query: string) => void;
}
const Hero: React.FC<HeroProps> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const { data: siteSettings } = useSiteSettings();
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get all speeltuinen for suggestions
  const { data: allSpeeltuinen = [] } = useSpeeltuinen();
  
  // Generate search suggestions
  const getSuggestions = (query: string) => {
    if (!query.trim() || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return allSpeeltuinen
      .filter(speeltuin => 
        speeltuin.naam.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5) // Limit to 5 suggestions
      .map(speeltuin => ({
        id: speeltuin.id,
        name: speeltuin.naam,
        type: speeltuin.type_natuurspeeltuin ? 'Natuurspeeltuin' :
              speeltuin.type_buurtspeeltuin ? 'Buurtspeeltuin' :
              speeltuin.type_schoolplein ? 'Schoolplein' :
              speeltuin.type_speelbos ? 'Speelbos' : 'Speeltuin'
      }));
  };

  const suggestions = getSuggestions(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setSelectedSuggestionIndex(-1);
    
    // Show suggestions if there's a query
    setShowSuggestions(value.trim().length >= 2);
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Set new timeout for debounced search
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      } else {
        // If search is empty, clear the search
        onSearch('');
      }
    }, 300);
  };

  const handleSuggestionClick = (suggestion: { id: string; name: string; type: string }) => {
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    onSearch(suggestion.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e as any);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  return <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-16 z-10">
      {/* Fallback Image for Better SEO */}
      <img 
        src="/lovable-uploads/heroimage.jpg" 
        alt="Speeltuinen in Castricum - Interactieve kaart en gids voor gezinnen" 
        className="absolute inset-0 w-full h-full object-cover -z-10"
        loading="eager"
        fetchPriority="high"
      />
      
      {/* Background Image with Overlay (CSS fallback) */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url('/lovable-uploads/heroimage.jpg')`
      }}>
        {/* Gradient Overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.4) 0%, rgba(6, 182, 212, 0.3) 100%)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Animated Title */}
        <h1 className="font-bold mb-6 animate-fade-in-up" style={{
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        lineHeight: '1.1'
      }}>Ontdek alle speeltuinen in Castricum</h1>

        {/* Animated Subtitle */}
        <p className="mb-8 opacity-90 animate-fade-in-up" style={{
        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
        animationDelay: '0.2s'
      }}>
          Complete gids met foto's, faciliteiten en locatie-informatie. Vind de perfecte speeltuin voor jouw kinderen!
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-8 animate-fade-in-up" style={{
        animationDelay: '0.4s'
      }}>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative" ref={dropdownRef}>
              <Input 
                ref={inputRef}
                type="text" 
                placeholder="Vind jouw speeltuin..." 
                value={searchQuery} 
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck="false"
                className="w-full px-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 touch-target" 
              />
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-60 overflow-y-auto z-50">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                        index === selectedSuggestionIndex ? 'bg-orange-50' : ''
                      } ${index === 0 ? 'rounded-t-xl' : ''} ${
                        index === suggestions.length - 1 ? 'rounded-b-xl' : ''
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{suggestion.name}</span>
                        <span className="text-sm text-gray-500">{suggestion.type}</span>
                      </div>
                      <Search className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2 touch-target">
              <Search className="w-5 h-5" />
              Zoeken
            </Button>
          </div>
        </form>

        {/* Share Section */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <ShareButton 
            title={siteSettings?.site_name || 'Speeltuinen Castricum'}
            description={siteSettings?.site_description || 'Ontdek alle speeltuinen in Castricum! Complete gids met interactieve kaart.'}
            className="mx-auto"
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce z-20" style={{
      animationDelay: '1s'
    }}>
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>


    </section>;
};
export default Hero;