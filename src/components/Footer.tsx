import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { MapPin, Clock, Heart, ExternalLink, ArrowUp, Mail, Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

interface FooterProps {
  lastUpdated?: string | Date | number;
}

const Footer = ({ lastUpdated }: FooterProps) => {
  const { data: settings } = useSiteSettings();

  const formatLastUpdated = (date: string | Date | number | undefined) => {
    if (!date) return 'Onbekend';
    
    try {
      let dateObj: Date;
      
      if (typeof date === 'number') {
        // Timestamp in milliseconds
        dateObj = new Date(date);
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        dateObj = date;
      }
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return 'Onbekend';
      }
      
      return format(dateObj, 'dd MMMM yyyy', { locale: nl });
    } catch {
      return 'Onbekend';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if we have any contact information
  const hasContactInfo = settings?.contact_email || settings?.contact_phone;
  
  // Check if we have any social media links
  const hasSocialMedia = settings?.facebook_url || settings?.instagram_url || settings?.twitter_url;

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
                {settings?.site_description || 'Ontdek alle speeltuinen in Castricum en omgeving. Van kleine buurtpleintjes tot grotere speeltuinen voor uren speelplezier.'}
              </blockquote>
            </div>
          </div>

          {/* Decorative separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gradient-to-r from-transparent to-border w-20"></div>
            <img 
              src="/lovable-uploads/c0bf8c44-fa41-463d-8c65-11c75f715265.png" 
              alt="Speeltuinen logo" 
              className="w-20 h-20 opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="h-px bg-gradient-to-l from-transparent to-border w-20"></div>
          </div>

          {/* Contact Information - Only show if we have contact data */}
          {hasContactInfo && (
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground flex-wrap">
              {settings?.contact_email && (
                <a 
                  href={`mailto:${settings.contact_email}`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{settings.contact_email}</span>
                </a>
              )}
              {settings?.contact_phone && (
                <a 
                  href={`tel:${settings.contact_phone}`}
                  className="hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{settings.contact_phone}</span>
                </a>
              )}
            </div>
          )}

          {/* Social Media Links - Only show if we have social media data */}
          {hasSocialMedia && (
            <div className="flex items-center justify-center gap-4">
              {settings?.facebook_url && (
                <a 
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-primary/10"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.instagram_url && (
                <a 
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-primary/10"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.twitter_url && (
                <a 
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-full hover:bg-primary/10"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
            </div>
          )}

          {/* Last updated section */}
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span className="text-sm">
              Laatst bijgewerkt: <span className="font-medium text-foreground">{formatLastUpdated(lastUpdated)}</span>
            </span>
          </div>

          {/* Legal Links */}
          <div className="pt-6 border-t border-border/30">
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
              <a href="/privacy" className="hover:text-foreground transition-colors flex items-center gap-1">
                🔒 Privacybeleid
              </a>
              <span>•</span>
              <a href="/terms" className="hover:text-foreground transition-colors flex items-center gap-1">
                📄 Algemene Voorwaarden
              </a>
              <span>•</span>
              <a href="https://www.castricum.nl" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                🏛️ Gemeente Castricum
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Copyright section */}
          <div className="pt-4 border-t border-border/30">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
              <span>© 2025 {settings?.site_name || 'Castricum Speeltuinen Gids'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Gemaakt met <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" /> voor families in Castricum
              </span>
            </div>
          </div>

          {/* Scroll to top button */}
          <div className="pt-4">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
              aria-label="Terug naar boven"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-sm">Terug naar boven</span>
            </button>
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

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;