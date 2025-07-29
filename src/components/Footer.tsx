import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MapPin, Clock, Heart } from 'lucide-react';

interface FooterProps {
  lastUpdated?: string | Date;
}

const Footer = ({ lastUpdated }: FooterProps) => {
  const formatLastUpdated = (date: string | Date | undefined) => {
    if (!date) return 'Onbekend';
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd MMMM yyyy', { locale: nl });
    } catch {
      return 'Onbekend';
    }
  };

  return (
    <footer className="relative bg-gradient-to-t from-primary/5 via-background to-background border-t border-border/50 mt-16">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-8">
          {/* Quote section */}
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Quote marks */}
              <div className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">"</div>
              <div className="absolute -bottom-8 -right-4 text-6xl text-primary/20 font-serif">"</div>
              
              <blockquote className="text-xl lg:text-2xl font-medium text-foreground leading-relaxed italic">
                Ontdek alle speeltuinen in Castricum en omgeving. Van kleine buurtpleintjes tot grotere speeltuinen voor uren speelplezier.
              </blockquote>
            </div>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent to-border w-20"></div>
            <img 
              src="/lovable-uploads/c0bf8c44-fa41-463d-8c65-11c75f715265.png" 
              alt="Speeltuinen logo" 
              className="w-20 h-20 opacity-80"
            />
            <div className="h-px bg-gradient-to-l from-transparent to-border w-20"></div>
          </div>

          {/* Last updated section */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Laatst bijgewerkt: <span className="font-medium text-foreground">{formatLastUpdated(lastUpdated)}</span>
            </span>
          </div>

          {/* Copyright section */}
          <div className="pt-8 border-t border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>© 2025 Castricum Speeltuinen Gids</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Gemaakt met <Heart className="w-4 h-4 text-red-500 fill-current" /> voor families in Castricum
              </span>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute bottom-4 left-1/4 opacity-5">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-primary">
              {/* Playground swing */}
              <path d="M4 2h2v20H4V2zm14 0h2v20h-2V2zM8 6h8v2H8V6zm0 4h8v2l-2 6h-4l-2-6V10z"/>
            </svg>
          </div>
          
          <div className="absolute bottom-8 right-1/3 opacity-5">
            <svg width="35" height="35" viewBox="0 0 24 24" fill="currentColor" className="text-accent">
              {/* Slide */}
              <path d="M22 2H2v20h20V2zM8 18H4v-4h4v4zm0-6H4V8h4v4zm6 6h-4v-4h4v4zm0-6h-4V8h4v4zm6 6h-4v-4h4v4zm0-6h-4V8h4v4z"/>
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;