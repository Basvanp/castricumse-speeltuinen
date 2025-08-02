import React from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Users, ExternalLink } from 'lucide-react';
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
        {/* Image */}
        {speeltuin.afbeelding_url && (
          <div className="mb-4">
            <img
              src={speeltuin.afbeelding_url}
              alt={speeltuin.naam}
              className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
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