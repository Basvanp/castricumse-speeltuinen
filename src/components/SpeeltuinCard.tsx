import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, MapPin, Map, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Speeltuin } from '@/types/speeltuin';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { calculateDistance } from '@/lib/utils';

interface SpeeltuinCardProps {
  speeltuin: Speeltuin;
  userLocation?: [number, number] | null;
}

const SpeeltuinCard: React.FC<SpeeltuinCardProps> = ({ speeltuin, userLocation }) => {
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Get photos array from speeltuin data (backwards compatible)
  const getPhotos = useCallback(() => {
    // Check if speeltuin has a fotos property (new format)
    if (speeltuin.fotos && Array.isArray(speeltuin.fotos) && speeltuin.fotos.length > 0) {
      return speeltuin.fotos.map(foto => foto.url || foto);
    }
    // Fall back to single afbeelding_url (old format)
    if (speeltuin.afbeelding_url) {
      return [speeltuin.afbeelding_url];
    }
    // No photos available
    return [];
  }, [speeltuin]);

  const photos = getPhotos();
  const hasMultiplePhotos = photos.length > 1;

  // Track speeltuin view when card is rendered
  useEffect(() => {
    trackEvent('speeltuin_view', speeltuin.id);
  }, [trackEvent, speeltuin.id]);

  // Reset photo index when speeltuin changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [speeltuin.id]);

  // Carousel navigation functions
  const goToPrevious = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  }, [photos.length]);

  const goToNext = useCallback(() => {
    setCurrentPhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  }, [photos.length]);

  const goToPhoto = useCallback((index: number) => {
    setCurrentPhotoIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (hasMultiplePhotos) {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasMultiplePhotos, goToPrevious, goToNext]);

  const copyToClipboard = () => {
    if (speeltuin.latitude && speeltuin.longitude) {
      const coordinates = `${speeltuin.latitude},${speeltuin.longitude}`;
      navigator.clipboard.writeText(coordinates);
      toast({
        title: "Gekopieerd!",
        description: "Locatie is gekopieerd naar het klembord.",
      });
    }
  };

  const openInGoogleMaps = () => {
    if (speeltuin.latitude && speeltuin.longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${speeltuin.latitude},${speeltuin.longitude}`;
      window.open(url, '_blank');
      trackEvent('google_maps_opened', speeltuin.id);
    }
  };

  const getVoorzieningen = () => {
    const voorzieningen = [];
    if (speeltuin.heeft_glijbaan) voorzieningen.push('Glijbaan');
    if (speeltuin.heeft_schommel) voorzieningen.push('Schommel');
    if (speeltuin.heeft_zandbak) voorzieningen.push('Zandbak');
    if (speeltuin.heeft_kabelbaan) voorzieningen.push('Kabelbaan');
    if (speeltuin.heeft_bankjes) voorzieningen.push('Bankjes');
    if (speeltuin.heeft_sportveld) voorzieningen.push('Sportveld');
    return voorzieningen;
  };

  const getOndergrond = () => {
    const ondergrond = [];
    if (speeltuin.ondergrond_zand) ondergrond.push('Zand');
    if (speeltuin.ondergrond_gras) ondergrond.push('Gras');
    if (speeltuin.ondergrond_rubber) ondergrond.push('Rubber');
    if (speeltuin.ondergrond_tegels) ondergrond.push('Tegels');
    return ondergrond;
  };

  const getLeeftijd = () => {
    const leeftijd = [];
    if (speeltuin.geschikt_peuters) leeftijd.push('Peuters');
    if (speeltuin.geschikt_kleuters) leeftijd.push('Kleuters');
    if (speeltuin.geschikt_kinderen) leeftijd.push('Kinderen');
    return leeftijd;
  };

  const getOverig = () => {
    const overig = [];
    if (speeltuin.is_omheind) overig.push('Omheind');
    if (speeltuin.heeft_schaduw) overig.push('Schaduw');
    if (speeltuin.is_rolstoeltoegankelijk) overig.push('Rolstoeltoegankelijk');
    return overig;
  };

  // Calculate distance from user location
  const getDistance = () => {
    if (!userLocation || !speeltuin.latitude || !speeltuin.longitude) return null;
    
    const distance = calculateDistance(
      userLocation[0], userLocation[1],
      speeltuin.latitude, speeltuin.longitude
    );
    
    return distance < 1 
      ? `${Math.round(distance * 1000)}m`
      : `${distance.toFixed(1)}km`;
  };

  // Get a consistent placeholder image based on speeltuin name
  const getPlaceholderImage = () => {
    const placeholders = [
      'photo-1472396961693-142e6e269027', // deer beside trees and mountain
      'photo-1465146344425-f00d5f5c8f07', // orange flowers
      'photo-1509316975850-ff9c5deb0cd9', // pine trees
      'photo-1513836279014-a89f7a76ae86', // trees at daytime
      'photo-1518495973542-4542c06a5843', // sun light through trees
      'photo-1506744038136-46273834b3fb', // water surrounded by trees
    ];
    
    // Use name hash to consistently pick the same image for the same playground
    const hash = speeltuin.naam.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const index = Math.abs(hash) % placeholders.length;
    return `https://images.unsplash.com/${placeholders[index]}?auto=format&fit=crop&w=800&q=80`;
  };

  const distance = getDistance();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{speeltuin.naam}</CardTitle>
          {distance && (
            <Badge variant="outline" className="flex items-center gap-1 text-xs">
              <MapPin className="h-3 w-3" />
              {distance}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Photo Carousel */}
        <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-lg">
          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentPhotoIndex]}
                alt={`${speeltuin.naam} - foto ${currentPhotoIndex + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                loading="lazy"
              />
              
              {/* Navigation arrows - only show if multiple photos */}
              {hasMultiplePhotos && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full transition-all duration-200"
                    aria-label="Vorige foto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full transition-all duration-200"
                    aria-label="Volgende foto"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
              
              {/* Photo counter - only show if multiple photos */}
              {hasMultiplePhotos && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              )}
            </>
          ) : (
            <img
              src={getPlaceholderImage()}
              alt={speeltuin.naam}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          )}
        </div>
        
        {/* Dot indicators - only show if multiple photos */}
        {hasMultiplePhotos && (
          <div className="flex justify-center space-x-1 mt-2">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPhoto(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentPhotoIndex 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ga naar foto ${index + 1}`}
              />
            ))}
          </div>
        )}
        
        {speeltuin.omschrijving && (
          <p className="text-muted-foreground">{speeltuin.omschrijving}</p>
        )}

        <div className="space-y-3">
          {getVoorzieningen().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Voorzieningen:</h4>
              <div className="flex flex-wrap gap-1">
                {getVoorzieningen().map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getOndergrond().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Ondergrond:</h4>
              <div className="flex flex-wrap gap-1">
                {getOndergrond().map((item) => (
                  <Badge key={item} variant="outline" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getLeeftijd().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Geschikt voor:</h4>
              <div className="flex flex-wrap gap-1">
                {getLeeftijd().map((item) => (
                  <Badge key={item} variant="default" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {getOverig().length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-1">Overig:</h4>
              <div className="flex flex-wrap gap-1">
                {getOverig().map((item) => (
                  <Badge key={item} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-4">
          {/* Google Maps button */}
          {speeltuin.latitude && speeltuin.longitude && (
            <Button 
              onClick={openInGoogleMaps}
              className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg py-3 px-4 flex items-center justify-center gap-2"
            >
              <Map className="text-white" />
              Open in Google Maps
            </Button>
          )}
          
          {/* Fixi buttons side by side */}
          <div className="flex gap-3 mt-3">
            <Button 
              asChild 
              className="flex-1 h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg px-4 flex items-center justify-center"
            >
              <a 
                href="https://www.fixi.nl" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <ExternalLink className="text-white" />
                Fixi
              </a>
            </Button>
            
            {speeltuin.latitude && speeltuin.longitude && (
              <Button 
                onClick={copyToClipboard}
                className="flex-1 h-12 bg-white hover:bg-gray-100 text-black border border-gray-300 font-medium rounded-xl px-4 flex items-center justify-center gap-2"
              >
                <Copy className="text-black" />
                Locatie voor fixi melding
              </Button>
            )}
          </div>
          
          <div className="flex items-start gap-1 mt-3 text-sm text-gray-500">
            <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Geef toestemming voor je locatie in Fixi voor automatisch inzoomen</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinCard;