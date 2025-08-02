import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, MapPin, Map, AlertCircle, ChevronLeft, ChevronRight, X, Lightbulb, Heart } from 'lucide-react';
import { Speeltuin } from '@/types/speeltuin';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/hooks/useAnalytics';
import { calculateDistance } from '@/lib/utils';
import SpeeltuinBadge, { BadgeType } from '@/components/SpeeltuinBadge';
import { useAuth } from '@/hooks/useAuth';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '@/hooks/useSpeeltuinen';

interface SpeeltuinCardProps {
  speeltuin: Speeltuin;
  userLocation?: [number, number] | null;
  showFavoriteButton?: boolean;
}

const SpeeltuinCard: React.FC<SpeeltuinCardProps> = ({ speeltuin, userLocation, showFavoriteButton = true }) => {
  const { user } = useAuth();
  const { data: isFavorite = false } = useIsFavorite(speeltuin.id, user?.id);
  const addFavorite = useAddFavorite();
  const removeFavorite = useRemoveFavorite();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFixiPopupOpen, setIsFixiPopupOpen] = useState(false);

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

  // Keyboard navigation and popup escape handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFixiPopupOpen) {
        setIsFixiPopupOpen(false);
      } else if (hasMultiplePhotos && !isFixiPopupOpen) {
        if (e.key === 'ArrowLeft') {
          goToPrevious();
        } else if (e.key === 'ArrowRight') {
          goToNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasMultiplePhotos, goToPrevious, goToNext, isFixiPopupOpen]);

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

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Inloggen vereist",
        description: "Je moet ingelogd zijn om favorieten toe te voegen.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite.mutateAsync({ 
          speeltuinId: speeltuin.id, 
          userId: user.id 
        });
        toast({
          title: "Verwijderd uit favorieten",
          description: `${speeltuin.naam} is verwijderd uit je favorieten.`,
        });
      } else {
        await addFavorite.mutateAsync({ 
          speeltuinId: speeltuin.id, 
          userId: user.id 
        });
        toast({
          title: "Toegevoegd aan favorieten",
          description: `${speeltuin.naam} is toegevoegd aan je favorieten!`,
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden. Probeer het opnieuw.",
        variant: "destructive",
      });
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
          {/* Badge overlay - positioned over the photo */}
          {speeltuin.badge && (
            <div className="absolute top-2 left-2 z-10">
              <SpeeltuinBadge type={speeltuin.badge as BadgeType} />
            </div>
          )}
          
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
          
          {/* Probleem melden button */}
          <Button 
            onClick={() => setIsFixiPopupOpen(true)}
            className="w-full mb-3 bg-white hover:bg-gray-50 text-black px-4 py-2 rounded font-semibold border border-gray-300 flex items-center justify-center gap-2"
          >
            <AlertCircle size={18} />
            Probleem melden
          </Button>

          {showFavoriteButton && (
            <Button
              onClick={handleFavoriteClick}
              className={`w-full h-12 ${
                isFavorite 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              } font-semibold rounded-lg py-3 px-4 flex items-center justify-center gap-2`}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} 
              />
              {isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
            </Button>
          )}
        </div>

        {/* Fixi Popup */}
        {isFixiPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Probleem melden</h3>
                <button
                  onClick={() => setIsFixiPopupOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Popup sluiten"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* Fixi explanation */}
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium mb-1">Over Fixi</h4>
                    <p className="text-sm text-gray-600">
                      Fixi is een app waarmee je snel en gemakkelijk problemen kunt melden aan de gemeente. 
                      Van kapotte speeltoestellen tot onderhoud - jouw melding komt direct bij de juiste dienst terecht.
                    </p>
                  </div>
                </div>

                {/* Location info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm font-medium">Locatie: {speeltuin.naam}</p>
                </div>

                {/* Action buttons */}
                <div className="space-y-3">
                  <Button 
                    asChild 
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium"
                  >
                    <a 
                      href="https://www.fixi.nl" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Probleem melden via Fixi
                    </a>
                  </Button>

                  {speeltuin.latitude && speeltuin.longitude && (
                    <Button 
                      onClick={() => {
                        copyToClipboard();
                        setIsFixiPopupOpen(false);
                      }}
                      className="w-full bg-white hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg border border-gray-300 flex items-center justify-center gap-2"
                    >
                      <Copy size={18} />
                      Locatie kopiëren voor Fixi
                    </Button>
                  )}
                </div>

                {/* Help text */}
                <div className="flex items-start gap-2 text-sm text-gray-500 pt-2">
                  <span>💡</span>
                  <span>Geef toestemming voor je locatie in Fixi voor automatisch inzoomen</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SpeeltuinCard;