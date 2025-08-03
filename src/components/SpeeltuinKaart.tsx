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
  const isInitializedRef = useRef(false);
  
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
    if (typeof window === 'undefined' || !mapRef.current || isInitializedRef.current) return;

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

      isInitializedRef.current = true;
    }).catch((error) => {
      console.error('Error loading Leaflet:', error);
    });

    return () => {
      // Cleanup map when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Only run once on mount

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
        if (!speeltuin.latitude || !speeltuin.longitude) return;

        // Determine marker color based on speeltuin type or use default
        let finalMarkerColor = markerColor;
        if (speeltuin.heeft_glijbaan) {
          finalMarkerColor = '#22c55e'; // Green for slides
        } else if (speeltuin.heeft_schommel) {
          finalMarkerColor = '#f59e0b'; // Orange for swings
        } else if (speeltuin.heeft_zandbak) {
          finalMarkerColor = '#eab308'; // Yellow for sandbox
        }

        // Create custom marker icon
        const markerIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              background-color: ${finalMarkerColor};
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
            ">
              🎪
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const marker = L.marker([speeltuin.latitude, speeltuin.longitude], { icon: markerIcon })
          .addTo(mapInstanceRef.current);

        // Create popup content
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
          if (!config) return '';

          return `<span class="inline-block px-2 py-1 text-xs font-medium rounded-full ${config.color} mr-1 mb-1">${config.text}</span>`;
        };

        // Determine badges to show
        const badges: BadgeType[] = [];
        
        // Type badges
        if (speeltuin.type_natuurspeeltuin) badges.push('natuurspeeltuin');
        if (speeltuin.type_buurtspeeltuin) badges.push('buurtspeeltuin');
        if (speeltuin.type_schoolplein) badges.push('schoolplein');
        if (speeltuin.type_speelbos) badges.push('speelbos');
        
        // Accessibility badges
        // is_rolstoeltoegankelijk removed
        if (speeltuin.heeft_schaduw) badges.push('schaduw');
        if (speeltuin.is_omheind) badges.push('omheind');
        
        // Facility badges (top 3 most important)
        if (speeltuin.heeft_water_pomp) badges.push('waterpomp');
        if (speeltuin.heeft_klimtoestel) badges.push('klimtoestel');
        if (speeltuin.heeft_kabelbaan) badges.push('kabelbaan');
        if (speeltuin.heeft_skatebaan) badges.push('skatebaan');
        if (speeltuin.heeft_basketbalveld) badges.push('basketbalveld');
        // heeft_panakooi badge removed
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

        const badgesHTML = badges.slice(0, 6).map(getBadgeHTML).join('');

        const popupContent = `
          <div class="min-w-64">
            <h3 class="font-bold text-lg mb-2">${speeltuin.naam}</h3>
            ${speeltuin.omschrijving ? `<p class="text-sm text-gray-600 mb-3">${speeltuin.omschrijving}</p>` : ''}
            <div class="mb-3">
              ${badgesHTML}
            </div>
            <div class="flex gap-2">
              <button onclick="window.selectSpeeltuin('${speeltuin.id}')" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Bekijk details
              </button>
              ${speeltuin.latitude && speeltuin.longitude ? 
                `<button onclick="window.openGoogleMaps(${speeltuin.latitude}, ${speeltuin.longitude})" class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm">
                  Open in Maps
                </button>` 
                : ''
              }
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        playgroundMarkersRef.current.push(marker);

        // Handle marker click
        marker.on('click', () => {
          if (onSpeeltuinSelect) {
            onSpeeltuinSelect(speeltuin);
          }
        });
      });
    });
  }, [speeltuinen, siteSettings?.marker_color]); // Update when speeltuinen or marker color changes

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Remove existing user location marker
      if (userLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }

      // Add new user location marker
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'user-location-marker',
          html: `
            <div style="
              background-color: #3b82f6;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              animation: pulse 2s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.7; }
                100% { transform: scale(1); opacity: 1; }
              }
            </style>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        userLocationMarkerRef.current = L.marker(userLocation, { icon: userIcon })
          .addTo(mapInstanceRef.current)
          .bindPopup('Jouw locatie');
      }
    });
  }, [userLocation]);

  // Add global functions for popup buttons
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).selectSpeeltuin = (speeltuinId: string) => {
        const speeltuin = speeltuinen.find(s => s.id === speeltuinId);
        if (speeltuin && onSpeeltuinSelect) {
          onSpeeltuinSelect(speeltuin);
        }
      };

      (window as any).openGoogleMaps = (lat: number | null, lng: number | null) => {
        if (lat && lng) {
          window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        }
      };
    }
  }, [speeltuinen, onSpeeltuinSelect]);

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full h-[600px] rounded-lg shadow-lg"
        style={{ zIndex: 1 }}
      />
      
      {/* Location Button */}
      <Button
        onClick={handleLocationClick}
        disabled={isLocating}
        className="absolute top-4 right-4 z-10 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-md"
        size="sm"
      >
        <Target className="h-4 w-4 mr-2" />
        {isLocating ? 'Locatie zoeken...' : 'Mijn locatie'}
      </Button>

      {/* Distance Info */}
      {userLocation && speeltuinen.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <h4 className="font-medium text-sm mb-2">Dichtstbijzijnde speeltuinen:</h4>
          <div className="space-y-1">
            {speeltuinen
              .map(speeltuin => ({
                ...speeltuin,
                distance: calculateDistance(
                  userLocation[0], 
                  userLocation[1], 
                  speeltuin.latitude, 
                  speeltuin.longitude
                )
              }))
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3)
              .map(speeltuin => (
                <div key={speeltuin.id} className="text-xs text-gray-600">
                  <span className="font-medium">{speeltuin.naam}</span>
                  <span className="ml-2">({speeltuin.distance.toFixed(1)} km)</span>
                </div>
              ))
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeeltuinKaart;