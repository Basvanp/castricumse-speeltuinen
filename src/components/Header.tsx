import React from 'react';
import { Settings, Star, Home, MapPin } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from './ui/navigation-menu';
import { Button } from './ui/button';
import AdminButton from './AdminButton';

interface HeaderProps {
  siteName?: string;
  siteDescription?: string;
  onScrollToTop?: () => void;
  onScrollToMap?: () => void;
  onScrollToSpeeltuinen?: () => void;
}

// Custom playground slide logo component using uploaded favicon
const PlaygroundLogo = () => (
  <div className="w-11 h-11 flex items-center justify-center">
    <img 
      src="/lovable-uploads/2ea4b2d6-5537-43cf-a522-d1571d0f5108.png" 
      alt="Castricum Speeltuinen Logo" 
      className="w-11 h-11"
    />
  </div>
);

const Header = ({ 
  siteName = 'Castricum Speeltuinen Gids', 
  siteDescription = 'Ontdek alle speeltuinen in Castricum en omgeving. Complete gids met foto\'s, faciliteiten en locatie-informatie.',
  onScrollToTop,
  onScrollToMap,
  onScrollToSpeeltuinen
}: HeaderProps) => {
  return (
    <>
      {/* Sticky navigation bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo section */}
            <div className="flex items-center gap-3">
              <PlaygroundLogo />
              <div>
                <h1 className="text-lg font-semibold text-[#1a202c] leading-tight">
                  {siteName}
                </h1>
                <p className="text-xs text-[#1a202c]/70 leading-tight">
                  Gemeente Castricum
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={onScrollToTop}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={onScrollToSpeeltuinen}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1a202c]/70 hover:text-[#1a202c] hover:bg-[#1a202c]/5 rounded-md transition-colors"
                >
                  Alle Speeltuinen
                </button>
                <button
                  onClick={onScrollToMap}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1a202c]/70 hover:text-[#1a202c] hover:bg-[#1a202c]/5 rounded-md transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Kaart
                </button>
              </div>

              {/* Admin button */}
              <AdminButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <AdminButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Page header section - not sticky */}
      <header className="bg-orange-50 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <div className="mb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Actuele foto's & informatie
              </div>
            </div>
            <p className="text-slate-600 text-base leading-relaxed">
              {siteDescription}
            </p>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;