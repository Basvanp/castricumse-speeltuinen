import React from 'react';
import { Trees, MapPin, Heart } from 'lucide-react';
import AdminButton from './AdminButton';

interface HeaderProps {
  siteName?: string;
  siteDescription?: string;
}

const Header = ({ 
  siteName = 'Speeltuinen in Castricum', 
  siteDescription = 'Ontdek alle speeltuinen in Castricum en omgeving' 
}: HeaderProps) => {
  return (
    <header className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-accent/5 border-b border-border/50 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Playground equipment silhouettes */}
        <div className="absolute top-8 left-1/4 opacity-10">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
            {/* Swing set */}
            <path d="M4 2h2v20H4V2zm14 0h2v20h-2V2zM8 6h8v2H8V6zm0 4h8v2l-2 6h-4l-2-6V10z"/>
          </svg>
        </div>
        
        <div className="absolute top-4 right-1/4 opacity-10">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
            {/* Slide */}
            <path d="M22 2H2v20h20V2zM8 18H4v-4h4v4zm0-6H4V8h4v4zm6 6h-4v-4h4v4zm0-6h-4V8h4v4zm6 6h-4v-4h4v4zm0-6h-4V8h4v4z"/>
          </svg>
        </div>

        <div className="absolute bottom-4 left-1/3 opacity-8">
          <Trees className="w-16 h-16 text-muted-foreground/20" />
        </div>

        <div className="absolute top-1/2 right-1/5 opacity-8">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor" className="text-secondary/20">
            {/* Sandbox */}
            <path d="M2 12h4l3-8h6l3 8h4v8H2v-8z"/>
          </svg>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-8 lg:py-12">
          <div className="flex-1">
            {/* Main title with decorative elements */}
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-3">
                <img 
                  src="/lovable-uploads/c0bf8c44-fa41-463d-8c65-11c75f715265.png" 
                  alt="Speeltuinen logo" 
                  className="w-12 h-12 lg:w-16 lg:h-16"
                />
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                    {siteName}
                  </h1>
                </div>
              </div>
            </div>
            
            {/* Description with icon */}
            <div className="flex items-center gap-2 text-foreground/80 text-lg max-w-2xl">
              <Heart className="w-4 h-4 text-accent" />
              <p>{siteDescription}</p>
            </div>

            {/* Fun stats or badges */}
            <div className="flex items-center gap-6 mt-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-sm text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span>Gecontroleerde speeltuinen</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-sm text-accent">
                <Trees className="w-4 h-4" />
                <span>Natuurvriendelijk</span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-sm text-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                </svg>
                <span>Regelmatig bijgewerkt</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <AdminButton />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </header>
  );
};

export default Header;