import React from 'react';
import { Settings, Star, Home, MapPin } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from './ui/navigation-menu';
import { Button } from './ui/button';
import AdminButton from './AdminButton';

interface HeaderProps {
  siteName?: string;
  siteDescription?: string;
}

// Custom playground slide logo component
const PlaygroundLogo = () => (
  <div className="w-10 h-10 bg-gradient-to-br from-[#ff6b35] to-[#f7931e] rounded-xl flex items-center justify-center shadow-sm">
    <svg viewBox="0 0 100 100" className="w-6 h-6">
      <path d="M15 85 Q20 80 30 75 Q45 65 60 45 Q65 40 70 35" stroke="white" strokeWidth="3" fill="none"/>
      <path d="M20 85 Q25 80 35 75 Q50 65 65 45 Q70 40 75 35" stroke="white" strokeWidth="3" fill="none"/>
      <path d="M70 35 L70 85" stroke="white" strokeWidth="3"/>
      <path d="M75 35 L75 85" stroke="white" strokeWidth="3"/>
      <path d="M70 45 L75 45" stroke="white" strokeWidth="2"/>
      <path d="M70 55 L75 55" stroke="white" strokeWidth="2"/>
      <path d="M70 65 L75 65" stroke="white" strokeWidth="2"/>
      <path d="M70 75 L75 75" stroke="white" strokeWidth="2"/>
      <path d="M65 35 L80 35" stroke="white" strokeWidth="3"/>
      <path d="M10 85 L85 85" stroke="white" strokeWidth="2"/>
    </svg>
  </div>
);

const Header = ({ 
  siteName = 'Castricum Speeltuinen Gids', 
  siteDescription = 'Ontdek alle speeltuinen in Castricum en omgeving. Complete gids met foto\'s, faciliteiten en locatie-informatie.' 
}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-[#e2e8f0] shadow-sm">
      {/* Main header with logo and navigation */}
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
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/" 
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#ff6b35] bg-[#ff6b35]/5 rounded-md hover:bg-[#ff6b35]/10 transition-colors"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/speeltuinen" 
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1a202c]/70 hover:text-[#1a202c] hover:bg-[#1a202c]/5 rounded-md transition-colors"
                  >
                    Alle Speeltuinen
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink 
                    href="/kaart" 
                    className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#1a202c]/70 hover:text-[#1a202c] hover:bg-[#1a202c]/5 rounded-md transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Kaart
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Admin button */}
            <AdminButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <AdminButton />
          </div>
        </div>
      </div>

      {/* Page header section */}
      <div className="bg-gradient-to-r from-[#ff6b35]/5 to-[#f7931e]/5 border-b border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Gecontroleerde speeltuinen
              </div>
            </div>
            <p className="text-[#1a202c]/80 text-lg leading-relaxed">
              {siteDescription}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;