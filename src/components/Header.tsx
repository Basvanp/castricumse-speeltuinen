import React from 'react';
import { Settings, Star, Home, MapPin } from 'lucide-react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, NavigationMenuLink } from './ui/navigation-menu';
import { Button } from './ui/button';
import AdminButton from './AdminButton';
import ThemeToggle from './ThemeToggle';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';

interface HeaderProps {
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
  onScrollToTop,
  onScrollToMap,
  onScrollToSpeeltuinen
}: HeaderProps) => {
  const { data: settings } = usePublicSiteSettings();
  const siteName = settings?.site_name || 'Castricum Speeltuinen Gids';
  return (
    <>
      {/* Sticky navigation bar */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border shadow-sm backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo section */}
            <div className="flex items-center gap-3">
              <PlaygroundLogo />
              <div>
                <h1 className="text-lg font-semibold text-foreground leading-tight">
                  {siteName}
                </h1>
                <p className="text-xs text-muted-foreground leading-tight">
                  Gemeente Castricum
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={onScrollToTop}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary bg-primary/10 rounded-md hover:bg-primary/20 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>
                <button
                  onClick={onScrollToSpeeltuinen}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  Alle Speeltuinen
                </button>
                <button
                  onClick={onScrollToMap}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Kaart
                </button>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Admin button */}
              <AdminButton />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <AdminButton />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;