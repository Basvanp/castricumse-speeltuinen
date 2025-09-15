import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShareButton } from '@/components/ui/share-button';
import { Search } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';
interface HeroProps {
  onSearch: (query: string) => void;
}
const Hero: React.FC<HeroProps> = ({
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: siteSettings } = useSiteSettings();
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Remove instant search to prevent stuttering
  };
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
            <div className="flex-1 relative">
              <Input 
                type="text" 
                placeholder="Vind jouw speeltuin..." 
                value={searchQuery} 
                onChange={handleInputChange}
                autoComplete="off"
                spellCheck="false"
                className="w-full px-4 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-xl text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 touch-target" 
              />
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