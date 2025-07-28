import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, MapPin, Map } from 'lucide-react';
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

  // Track speeltuin view when card is rendered
  useEffect(() => {
    trackEvent('speeltuin_view', speeltuin.id);
  }, [trackEvent, speeltuin.id]);

  const copyToClipboard = () => {
    if (speeltuin.fixi_copy_tekst) {
      navigator.clipboard.writeText(speeltuin.fixi_copy_tekst);
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
        {/* Playground image - always show (placeholder if no real image) */}
        <div className="h-48 w-full rounded-lg overflow-hidden shadow-lg">
          <img
            src={speeltuin.afbeelding_url || getPlaceholderImage()}
            alt={speeltuin.naam}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
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
              variant="default" 
              onClick={openInGoogleMaps}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 font-semibold"
            >
              <Map size={18} />
              Open in Google Maps
            </Button>
          )}
          
          {/* Fixi buttons side by side */}
          <div className="flex gap-3 mb-3">
            <Button 
              asChild 
              variant="default" 
              className="flex-1 px-2 py-2"
            >
              <a 
                href="https://www.fixi.nl/#/issue/new+map" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-sm"
              >
                <ExternalLink size={12} />
                Fixi
              </a>
            </Button>
            
            {speeltuin.fixi_copy_tekst && (
              <Button 
                variant="default" 
                onClick={copyToClipboard}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-2 text-sm"
              >
                <Copy size={12} />
                Locatie voor fixi melding
              </Button>
            )}
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-2">
            💡 Geef toestemming voor je locatie in Fixi voor automatisch inzoomen
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinCard;