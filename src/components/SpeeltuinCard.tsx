import React, { useState, useCallback, useEffect } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Users, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';
import { BadgeType } from '@/components/SpeeltuinBadge';

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

  // Get photos array from speeltuin data (backwards compatible)
  const getPhotos = useCallback(() => {
    // Check if speeltuin has a fotos property (new format)
    if (speeltuin.fotos && Array.isArray(speeltuin.fotos) && speeltuin.fotos.length > 0) {
      return speeltuin.fotos.map(foto => typeof foto === 'string' ? foto : foto.url);
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
      'natuurspeeltuin': { text: 'Natuurspeeltuin', color: 'bg-green-100 text-green-800' },
      'buurtspeeltuin': { text: 'Buurtspeeltuin', color: 'bg-blue-100 text-blue-800' },
      'schoolplein': { text: 'Schoolplein', color: 'bg-purple-100 text-purple-800' },
      'speelbos': { text: 'Speelbos', color: 'bg-orange-100 text-orange-800' },
      'rolstoeltoegankelijk': { text: 'Rolstoeltoegankelijk', color: 'bg-red-100 text-red-800' },
      'waterpomp': { text: 'Waterpomp', color: 'bg-cyan-100 text-cyan-800' },
      'klimtoestel': { text: 'Klimtoestel', color: 'bg-indigo-100 text-indigo-800' },
      'kabelbaan': { text: 'Kabelbaan', color: 'bg-pink-100 text-pink-800' },
      'skatebaan': { text: 'Skatebaan', color: 'bg-gray-100 text-gray-800' },
      'basketbalveld': { text: 'Basketbalveld', color: 'bg-amber-100 text-amber-800' },
      'trapveld': { text: 'Trapveld', color: 'bg-lime-100 text-lime-800' },
      'wipwap': { text: 'Wipwap', color: 'bg-emerald-100 text-emerald-800' },
      'duikelrek': { text: 'Duikelrek', color: 'bg-teal-100 text-teal-800' },
      'zandbak': { text: 'Zandbak', color: 'bg-yellow-100 text-yellow-800' },
      'glijbaan': { text: 'Glijbaan', color: 'bg-green-100 text-green-800' },
      'schommel': { text: 'Schommel', color: 'bg-orange-100 text-orange-800' },
      'bankjes': { text: 'Bankjes', color: 'bg-brown-100 text-brown-800' },
      'sportveld': { text: 'Sportveld', color: 'bg-red-100 text-red-800' },
      'omheind': { text: 'Omheind', color: 'bg-gray-100 text-gray-800' },
      'schaduw': { text: 'Schaduw', color: 'bg-blue-100 text-blue-800' },
      'parkeerplaats': { text: 'Parkeerplaats', color: 'bg-gray-100 text-gray-800' },
      'toilet': { text: 'Toilet', color: 'bg-purple-100 text-purple-800' },
      'horeca': { text: 'Horeca', color: 'bg-pink-100 text-pink-800' },
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

  // Determine badges to show
  const badges: BadgeType[] = [];
  
  // Type badges
  if (speeltuin.type_natuurspeeltuin) badges.push('natuurspeeltuin');
  if (speeltuin.type_buurtspeeltuin) badges.push('buurtspeeltuin');
  if (speeltuin.type_schoolplein) badges.push('schoolplein');
  if (speeltuin.type_speelbos) badges.push('speelbos');
  
  // Accessibility badges
  if (speeltuin.is_rolstoeltoegankelijk) badges.push('rolstoeltoegankelijk');
  if (speeltuin.heeft_schaduw) badges.push('schaduw');
  if (speeltuin.is_omheind) badges.push('omheind');
  
  // Facility badges (top 3 most important)
  if (speeltuin.heeft_water_pomp) badges.push('waterpomp');
  if (speeltuin.heeft_klimtoestel) badges.push('klimtoestel');
  if (speeltuin.heeft_kabelbaan) badges.push('kabelbaan');
  if (speeltuin.heeft_skatebaan) badges.push('skatebaan');
  if (speeltuin.heeft_basketbalveld) badges.push('basketbalveld');
  if (speeltuin.heeft_trapveld) badges.push('trapveld');
  if (speeltuin.heeft_wipwap) badges.push('wipwap');
  if (speeltuin.heeft_duikelrek) badges.push('duikelrek');
  if (speeltuin.heeft_zandbak) badges.push('zandbak');
  if (speeltuin.heeft_glijbaan) badges.push('glijbaan');
  if (speeltuin.heeft_schommel) badges.push('schommel');
  if (speeltuin.heeft_bankjes) badges.push('bankjes');
  if (speeltuin.heeft_sportveld) badges.push('sportveld');
  
  // Practical badges
  if (speeltuin.heeft_parkeerplaats) badges.push('parkeerplaats');
  if (speeltuin.heeft_toilet) badges.push('toilet');
  if (speeltuin.heeft_horeca) badges.push('horeca');
  
  // Size badge
  badges.push(speeltuin.grootte);

  // Calculate distance if user location is provided
  const distance = userLocation && showDistance
    ? calculateDistance(
        userLocation[0],
        userLocation[1],
        speeltuin.latitude,
        speeltuin.longitude
      )
    : null;

  const handleGoogleMapsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(
      `https://www.google.com/maps?q=${speeltuin.latitude},${speeltuin.longitude}`,
      '_blank'
    );
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/20"
      onClick={() => onSelect?.(speeltuin)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
            {speeltuin.naam}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoogleMapsClick}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Location and distance */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {speeltuin.latitude.toFixed(6)}, {speeltuin.longitude.toFixed(6)}
          </span>
          {distance && (
            <>
              <span>•</span>
              <span>{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Photo Carousel */}
        <div className="relative h-48 w-full rounded-lg overflow-hidden shadow-lg mb-4">
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-1 rounded-full transition-all duration-200"
                    aria-label="Vorige foto"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
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
          <div className="flex justify-center space-x-1 mb-4">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToPhoto(index);
                }}
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

        {/* Description */}
        {speeltuin.omschrijving && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {speeltuin.omschrijving}
          </p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {badges.slice(0, 6).map(getBadgeHTML)}
        </div>

        {/* Quick stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{speeltuin.grootte}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Altijd open</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinCard;