import React, { useState, useCallback, useEffect } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GoogleMapsButton } from '@/components/ui/google-maps-button';
import { GoogleMapsRouteButton } from '@/components/ui/google-maps-route-button';
import { ProblemReportButton } from '@/components/ui/problem-report-button';
import { MapPin, Star, Clock, Users, ExternalLink, ChevronLeft, ChevronRight, AlertTriangle, X, Copy } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';
import { BadgeType } from '@/components/SpeeltuinBadge';
import { useToast } from '@/hooks/use-toast';
import { generateGoogleMapsUrl } from '@/utils/googleMaps';

interface SpeeltuinCardProps {
  speeltuin: Speeltuin;
  onSelect?: (speeltuin: Speeltuin) => void;
  userLocation?: [number, number];
  showDistance?: boolean;
}

const SpeeltuinCard: React.FC<SpeeltuinCardProps> = ({
  speeltuin,
  onSelect,
  userLocation,
  showDistance = true,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFixiPopupOpen, setIsFixiPopupOpen] = useState(false);
  const { toast } = useToast();

  // Get photos array from speeltuin data
  const getPhotos = useCallback(() => {
    return Array.isArray(speeltuin.fotos) && speeltuin.fotos.length > 0
      ? speeltuin.fotos
      : [];
  }, [speeltuin]);

  const photos = getPhotos();
  const hasMultiplePhotos = photos.length > 1;

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

  const getBadgeHTML = (badgeType: BadgeType) => {
    const badgeConfig = {
      // Voorzieningen
      'zandbak': { text: 'Zandbak', color: 'bg-yellow-100 text-yellow-800' },
      'glijbaan': { text: 'Glijbaan', color: 'bg-green-100 text-green-800' },
      'schommel': { text: 'Schommel', color: 'bg-orange-100 text-orange-800' },
      'kabelbaan': { text: 'Kabelbaan', color: 'bg-pink-100 text-pink-800' },
      'bankjes': { text: 'Bankjes', color: 'bg-brown-100 text-brown-800' },
      'sportveld': { text: 'Sportveld', color: 'bg-red-100 text-red-800' },
      'klimtoestel': { text: 'Klimtoestel', color: 'bg-indigo-100 text-indigo-800' },
      'water_pomp': { text: 'Water/Pomp', color: 'bg-cyan-100 text-cyan-800' },
      'panakooi': { text: 'Panakooi', color: 'bg-purple-100 text-purple-800' },
      'skatebaan': { text: 'Skatebaan', color: 'bg-gray-100 text-gray-800' },
      'basketbalveld': { text: 'Basketbalveld', color: 'bg-amber-100 text-amber-800' },
      'wipwap': { text: 'Wipwap', color: 'bg-emerald-100 text-emerald-800' },
      'duikelrek': { text: 'Duikelrek', color: 'bg-teal-100 text-teal-800' },
      'toilet': { text: 'Toilet', color: 'bg-purple-100 text-purple-800' },
      'parkeerplaats': { text: 'Parkeerplaats', color: 'bg-gray-100 text-gray-800' },
      'horeca': { text: 'Horeca', color: 'bg-pink-100 text-pink-800' },
      
      // Ondergrond
      'ondergrond_zand': { text: 'Zand', color: 'bg-yellow-100 text-yellow-800' },
      'ondergrond_gras': { text: 'Gras', color: 'bg-green-100 text-green-800' },
      'ondergrond_rubber': { text: 'Rubber', color: 'bg-red-100 text-red-800' },
      'ondergrond_tegels': { text: 'Tegels', color: 'bg-gray-100 text-gray-800' },
      'ondergrond_kunstgras': { text: 'Kunstgras', color: 'bg-green-100 text-green-800' },
      
      // Leeftijd
      'geschikt_peuters': { text: 'Peuters', color: 'bg-pink-100 text-pink-800' },
      'geschikt_kleuters': { text: 'Kleuters', color: 'bg-blue-100 text-blue-800' },
      'geschikt_kinderen': { text: 'Kinderen', color: 'bg-green-100 text-green-800' },
      
      // Overige kenmerken
      'omheind': { text: 'Omheind', color: 'bg-gray-100 text-gray-800' },
      'schaduw': { text: 'Schaduw', color: 'bg-blue-100 text-blue-800' },
      'rolstoeltoegankelijk': { text: 'Rolstoeltoegankelijk', color: 'bg-red-100 text-red-800' },
      
      // Grootte
      'klein': { text: 'Klein', color: 'bg-gray-100 text-gray-800' },
      'middel': { text: 'Middel', color: 'bg-blue-100 text-blue-800' },
      'groot': { text: 'Groot', color: 'bg-green-100 text-green-800' },
    };

    const config = badgeConfig[badgeType];
    if (!config) return null;

    return (
      <Badge key={badgeType} variant="secondary" className={config.color}>
        {config.text}
      </Badge>
    );
  };

  // Determine badges to show (alleen de belangrijkste)
  const badges: BadgeType[] = [];
  
  // Basis voorzieningen
  if (speeltuin.heeft_glijbaan) badges.push('glijbaan');
  if (speeltuin.heeft_schommel) badges.push('schommel');
  if (speeltuin.heeft_zandbak) badges.push('zandbak');
  if (speeltuin.heeft_kabelbaan) badges.push('kabelbaan');
  if (speeltuin.heeft_bankjes) badges.push('bankjes');
  if (speeltuin.heeft_sportveld) badges.push('sportveld');
  
  // Overige kenmerken
  if (speeltuin.is_omheind) badges.push('omheind');
  if (speeltuin.heeft_schaduw) badges.push('schaduw');
      // is_rolstoeltoegankelijk removed
  
  // Grootte badge
  badges.push(speeltuin.grootte);

  // Calculate distance if user location is provided and speeltuin has coordinates
  const distance = userLocation && showDistance && speeltuin.latitude && speeltuin.longitude
    ? calculateDistance(
        userLocation[0],
        userLocation[1],
        speeltuin.latitude,
        speeltuin.longitude
      )
    : null;

  const handleGoogleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speeltuin.latitude && speeltuin.longitude) {
      const mapsUrl = generateGoogleMapsUrl({
        latitude: speeltuin.latitude,
        longitude: speeltuin.longitude,
        name: speeltuin.naam
      });
      window.open(mapsUrl, '_blank');
    } else {
      toast({
        title: "Locatie niet beschikbaar",
        description: "Deze speeltuin heeft geen coördinaten.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card 
        className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20 flex flex-col h-full touch-target"
        onClick={() => onSelect?.(speeltuin)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors" style={{ marginBottom: '0px' }}>
                {speeltuin.naam}
              </CardTitle>
              
              {/* Distance info below title */}
              {distance && distance !== Infinity && (
                <div className="text-sm text-muted-foreground" style={{ marginTop: '4px', marginLeft: '0px', fontSize: '14px', color: '#666666' }}>
                  {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
                </div>
              )}
            </div>
            
            {/* Top right controls - Route and Problem Report buttons */}
            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              {speeltuin.latitude && speeltuin.longitude && (
                <GoogleMapsRouteButton
                  href={generateGoogleMapsUrl({
                    latitude: speeltuin.latitude,
                    longitude: speeltuin.longitude,
                    name: speeltuin.naam
                  })}
                  variant="outline"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  Route
                </GoogleMapsRouteButton>
              )}
              <ProblemReportButton 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFixiPopupOpen(true);
                }}
                variant="outline"
                size="sm"
              >
                Probleem melden
              </ProblemReportButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 flex flex-col flex-1">
          {/* Photo Carousel */}
          <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg mb-4">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 touch-target"
                      aria-label="Vorige foto"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-200 touch-target"
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
          
          {/* Dot indicators - always show for consistent layout */}
          <div className="flex justify-center space-x-3 py-6 bg-gray-50">
            {hasMultiplePhotos ? (
              photos.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPhoto(index);
                  }}
                  className="w-4 h-4 rounded-full cursor-pointer"
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: index === currentPhotoIndex ? '#3b82f6' : '#d1d5db',
                    minWidth: '16px',
                    maxWidth: '16px',
                    minHeight: '16px',
                    maxHeight: '16px',
                    transition: 'all 0.2s ease',
                    boxShadow: index === currentPhotoIndex ? '0 2px 4px rgba(59, 130, 246, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentPhotoIndex) {
                      e.currentTarget.style.backgroundColor = '#9ca3af';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentPhotoIndex) {
                      e.currentTarget.style.backgroundColor = '#d1d5db';
                    }
                  }}
                  aria-label={`Ga naar foto ${index + 1}`}
                />
              ))
            ) : (
              // Show single dot for single photo to maintain consistent spacing
              <div className="w-4 h-4 rounded-full bg-blue-500" style={{
                width: '16px',
                height: '16px',
                minWidth: '16px',
                maxWidth: '16px',
                minHeight: '16px',
                maxHeight: '16px',
              }} />
            )}
          </div>

          {/* Content area that grows to fill space */}
          <div className="flex flex-col flex-1">
            {/* Description with URL parsing */}
            {speeltuin.omschrijving && (
              <div className="text-sm text-muted-foreground mb-4">
                {(() => {
                  const text = speeltuin.omschrijving;
                  const urlRegex = /(https?:\/\/[^\s]+)/g;
                  const parts = text.split(urlRegex);
                  
                  return parts.map((part, index) => {
                    if (urlRegex.test(part)) {
                      // This is a URL
                      const cleanUrl = part.trim();
                      const displayUrl = cleanUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
                      
                      return (
                        <div key={index} className="my-1">
                          <a
                            href={cleanUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-3 w-3" />
                            {displayUrl}
                          </a>
                        </div>
                      );
                    } else {
                      // This is regular text
                      return part ? (
                        <span key={index} className="line-clamp-3">
                          {part}
                        </span>
                      ) : null;
                    }
                  });
                })()}
              </div>
            )}

            {/* Badges - Fixed height for consistent layout */}
            <div className="flex flex-wrap gap-1 mb-4 min-h-[60px]">
              {badges.slice(0, 6).map(getBadgeHTML)}
            </div>

            {/* Quick stats - Always at bottom */}
            <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>Altijd open</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <AlertTriangle className="text-blue-500 mt-1 flex-shrink-0" size={20} />
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
    </>
  );
};

export default SpeeltuinCard;