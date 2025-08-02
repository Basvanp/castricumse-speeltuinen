import React, { useEffect, useRef } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';
import { BadgeType } from '@/components/SpeeltuinBadge';
import { usePublicSiteSettings } from '@/hooks/useSiteSettings';

interface SpeeltuinKaartProps {
  speeltuinen: Speeltuin[];
  onSpeeltuinSelect?: (speeltuin: Speeltuin) => void;
  userLocation: [number, number] | null;
  isLocating: boolean;
  onLocationRequest: () => void;
}

const SpeeltuinKaart: React.FC<SpeeltuinKaartProps> = ({ 
  speeltuinen, 
  onSpeeltuinSelect, 
  userLocation, 
  isLocating, 
  onLocationRequest 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const playgroundMarkersRef = useRef<any[]>([]);
  
  // Get site settings for map configuration
  const { data: siteSettings } = usePublicSiteSettings();

  const handleLocationClick = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView(userLocation, 15);
    } else {
      onLocationRequest();
    }
  };

  // Initialize map only once
  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then(async (L) => {
      // Import CSS
      await import('leaflet/dist/leaflet.css');
      
      // Fix default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Use site settings for map configuration, fallback to defaults
      const defaultZoom = siteSettings?.default_zoom || 13;
      const defaultCenter: [number, number] = [
        siteSettings?.center_lat || 52.5486, 
        siteSettings?.center_lng || 4.6695
      ];
      
      mapInstanceRef.current = L.map(mapRef.current).setView(defaultCenter, defaultZoom);

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstanceRef.current);
    }).catch((error) => {
      console.error('Error loading Leaflet:', error);
    });

    return () => {
      // Cleanup map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [siteSettings]); // Re-initialize when site settings change

  // Update markers when speeltuinen change or map initializes
  useEffect(() => {
    if (!mapInstanceRef.current || !speeltuinen.length) return;

    import('leaflet').then((L) => {
      // Clear existing playground markers
      playgroundMarkersRef.current.forEach(marker => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      playgroundMarkersRef.current = [];

      // Get marker color from site settings
      const markerColor = siteSettings?.marker_color || '#3b82f6';

      // Add markers for speeltuinen
      speeltuinen.forEach((speeltuin) => {
        if (speeltuin.latitude && speeltuin.longitude) {
          // Use site settings marker color, fallback to logic-based colors
          const color = speeltuin.heeft_glijbaan ? '#22c55e' : markerColor;
          
          // Calculate distance if user location is available
          let distanceText = '';
          if (userLocation) {
            const distance = calculateDistance(
              userLocation[0], userLocation[1],
              speeltuin.latitude, speeltuin.longitude
            );
            distanceText = distance < 1 
              ? `<p class="text-xs text-gray-500 mt-1">${Math.round(distance * 1000)}m van u</p>`
              : `<p class="text-xs text-gray-500 mt-1">${distance.toFixed(1)}km van u</p>`;
          }
          
          const customIcon = L.divIcon({
            html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
            className: 'custom-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          const marker = L.marker([speeltuin.latitude, speeltuin.longitude], { 
            icon: customIcon 
          }).addTo(mapInstanceRef.current);

          playgroundMarkersRef.current.push(marker);

          // Generate badge HTML if badge exists
          const getBadgeHTML = (badgeType: BadgeType) => {
            const badgeConfig: Record<BadgeType, { label: string; bgColor: string; textColor: string; icon: string }> = {
              'rolstoelvriendelijk': { label: 'Rolstoelvriendelijk', bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: '♿' },
              'babytoegankelijk': { label: 'Babytoegankelijk', bgColor: 'bg-pink-100', textColor: 'text-pink-800', icon: '👶' },
              'natuurspeeltuin': { label: 'Natuurspeeltuin', bgColor: 'bg-green-100', textColor: 'text-green-800', icon: '🌿' },
              'waterspeeltuin': { label: 'Waterspeeltuin', bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: '💧' },
              'avonturenspeeltuin': { label: 'Avonturenspeeltuin', bgColor: 'bg-orange-100', textColor: 'text-orange-800', icon: '🏠' },
              'toiletten': { label: 'Toiletten', bgColor: 'bg-slate-100', textColor: 'text-slate-800', icon: '🚻' },
              'parkeren': { label: 'Parkeren', bgColor: 'bg-gray-100', textColor: 'text-gray-800', icon: '🅿️' },
              'horeca': { label: 'Horeca', bgColor: 'bg-amber-100', textColor: 'text-amber-800', icon: '🍽️' },
            };
            
            const config = badgeConfig[badgeType];
            return config ? `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style="background-color: #f3e8ff; color: #7c3aed;">${config.icon} ${config.label}</span>` : '';
          };

          // Add popup
          const popupContent = `
            <div class="p-2">
              <h3 class="font-semibold text-lg">${speeltuin.naam}</h3>
              ${speeltuin.badge ? `<div class="mt-1">${getBadgeHTML(speeltuin.badge as BadgeType)}</div>` : ''}
              ${speeltuin.omschrijving ? `<p class="text-sm text-gray-600 mt-1">${speeltuin.omschrijving}</p>` : ''}
              ${distanceText}
              <div class="flex flex-wrap gap-1 mt-2">
                ${speeltuin.heeft_glijbaan ? '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Glijbaan</span>' : ''}
                ${speeltuin.heeft_schommel ? '<span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Schommel</span>' : ''}
                ${speeltuin.heeft_zandbak ? '<span class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">Zandbak</span>' : ''}
              </div>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Add click handler
          marker.on('click', () => {
            onSpeeltuinSelect?.(speeltuin);
          });
        }
      });
    });
  }, [speeltuinen, userLocation, onSpeeltuinSelect, siteSettings]); // Include siteSettings in dependencies

  // Separate effect for handling user location changes
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation) return;

    import('leaflet').then((L) => {
      // Remove existing user location marker
      if (userLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }

      // Auto-zoom to user location at level 15 and add marker
      mapInstanceRef.current.setView(userLocation, 15);

      const userIcon = L.divIcon({
        html: `<div style="background-color: #f97316; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.5); opacity: 0.9;"></div>`,
        className: 'user-location-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userLocationMarkerRef.current = L.marker(userLocation, { 
        icon: userIcon 
      }).addTo(mapInstanceRef.current);

      userLocationMarkerRef.current.bindPopup('<div class="p-2"><strong>Uw locatie</strong></div>');
    });
  }, [userLocation]);

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <Button
        onClick={handleLocationClick}
        disabled={isLocating}
        className="absolute top-2 right-2 z-[1000] h-10 w-10 p-0 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md"
        variant="outline"
      >
        <Target className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
      </Button>
    </div>
  );
};

export default SpeeltuinKaart;