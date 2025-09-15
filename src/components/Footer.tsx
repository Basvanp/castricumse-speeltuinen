import React from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { Clock, Heart, ArrowUp, Mail, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
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
        dateObj = new Date(date);
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else {
        dateObj = date;
      }
      
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

  const menuLinks = [
    { label: "Home", href: "/", type: "internal" },
    { label: "Aanbod", href: "/#speeltuinen", type: "scroll" },
    { label: "Over", href: "/privacy", type: "internal" },
    { label: "Contact", href: "mailto:hallo@speeltuincastricum.nl", type: "external" }
  ];

  const socialLinks = [
    { platform: "Facebook", href: "https://facebook.com", icon: Facebook },
    { platform: "Twitter", href: "https://twitter.com", icon: Twitter },
    { platform: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { platform: "Instagram", href: "https://instagram.com", icon: Instagram }
  ];

  return (
    <footer className="bg-footer-bg text-footer-text mt-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          {/* Menu Section */}
          <div className="space-y-4 animate-fade-in-up">
            <h3 className="text-lg font-semibold text-footer-text">Menu</h3>
            <nav className="space-y-2">
              {menuLinks.map((link, index) => (
                link.type === "internal" ? (
                  <Link
                    key={index}
                    to={link.href}
                    className="block text-footer-text/80 hover:text-footer-text transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </Link>
                ) : link.type === "scroll" ? (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-footer-text/80 hover:text-footer-text transition-colors duration-200 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector('#speeltuinen');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/';
                      }
                    }}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a
                    key={index}
                    href={link.href}
                    className="block text-footer-text/80 hover:text-footer-text transition-colors duration-200 hover:underline"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </nav>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4 animate-fade-in-up [animation-delay:0.2s]">
            <h3 className="text-lg font-semibold text-footer-text">Socials</h3>
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-footer-text/80 hover:text-white hover:scale-115 transition-all duration-250 ease-in-out p-2 rounded-full hover:bg-footer-text/10"
                    aria-label={social.platform}
                  >
                    <IconComponent size={24} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-4 animate-fade-in-up [animation-delay:0.4s]">
            <h3 className="text-lg font-semibold text-footer-text">Contact</h3>
            <div className="space-y-2">
              <a
                href="mailto:hallo@speeltuincastricum.nl"
                className="flex items-center justify-center md:justify-start gap-2 text-footer-text/80 hover:text-footer-text transition-colors duration-200 hover:underline"
              >
                <Mail size={16} />
                <span>hallo@speeltuincastricum.nl</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom with copyright */}
        <div className="mt-8 pt-6 border-t border-footer-text/20 animate-fade-in-up [animation-delay:0.6s]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
            {/* Copyright - Left */}
            <div className="text-footer-text/70 text-center sm:text-left">
              © 2025 Speeltuin Castricum. Alle rechten voorbehouden.
            </div>
            
            {/* Last Updated - Center */}
            <div className="flex items-center justify-center gap-2 text-footer-text/80 order-first sm:order-none">
              <Clock className="w-4 h-4" />
              <span>
                Laatst bijgewerkt: <span className="font-medium text-footer-text">{formatLastUpdated(lastUpdated)}</span>
              </span>
            </div>
            
            {/* Made with love - Right */}
            <div className="flex items-center justify-center sm:justify-end gap-1 text-footer-text/70">
              <span>Gemaakt met</span>
              <Heart className="w-4 h-4 text-red-400 fill-current animate-pulse" />
              <span>voor families in Castricum</span>
            </div>
          </div>
        </div>

        {/* Scroll to top button */}
        <div className="mt-6 text-center">
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 bg-footer-text/10 hover:bg-footer-text/20 text-footer-text px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
            aria-label="Terug naar boven"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-sm">Terug naar boven</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;