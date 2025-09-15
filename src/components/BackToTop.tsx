import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Look for the Leaflet map container specifically
      // Try multiple selectors to find the map container
      const mapContainer = document.querySelector('.leaflet-container') || 
                          document.querySelector('[class*="leaflet-map"]') ||
                          document.querySelector('div[style*="z-index: 1"]') ||
                          document.querySelector('.leaflet-map-pane');
      
      // If map is not visible (grid mode), use the content area instead
      const contentArea = document.querySelector('[class*="lg:col-span-3"]');
      
      const targetElement = mapContainer || contentArea;
      if (!targetElement) return;

      // Get the position of the target element
      const elementRect = targetElement.getBoundingClientRect();
      
      // Show button when we've scrolled past the element
      // Add some offset to show it when the element is mostly out of view
      const offset = 100;
      const shouldShow = elementRect.bottom < window.innerHeight - offset;
      
      setIsVisible(shouldShow);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Check initial state
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={scrollToTop}
        size="sm"
        className="bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm rounded-full p-3 group"
        aria-label="Terug naar boven"
      >
        <ChevronUp className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
      </Button>
    </div>
  );
};

export default BackToTop;
