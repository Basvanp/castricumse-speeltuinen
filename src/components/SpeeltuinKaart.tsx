import React, { useEffect, useRef } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';

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

  const handleLocationClick = () => {
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView(userLocation, 14);
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

      // Center on Castricum
      const center: [number, number] = [52.5485, 4.6698];
      mapInstanceRef.current = L.map(mapRef.current).setView(center, 13);

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
  }, []);

  // Update markers when speeltuinen or userLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    import('leaflet').then((L) => {
      // Clear existing playground markers
      playgroundMarkersRef.current.forEach(marker => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.removeLayer(marker);
        }
      });
      playgroundMarkersRef.current = [];

      // Remove existing user location marker
      if (userLocationMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        userLocationMarkerRef.current = null;
      }

      // Add user location marker if available
      if (userLocation) {
        const userIcon = L.divIcon({
          html: `<div style="background-color: #ef4444; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
          className: 'user-location-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        userLocationMarkerRef.current = L.marker(userLocation, { 
          icon: userIcon 
        }).addTo(mapInstanceRef.current);

        userLocationMarkerRef.current.bindPopup('<div class="p-2"><strong>Uw locatie</strong></div>');
      }

      // Add markers for speeltuinen
      speeltuinen.forEach((speeltuin) => {
        if (speeltuin.latitude && speeltuin.longitude) {
          const color = speeltuin.heeft_glijbaan ? '#22c55e' : '#3b82f6';
          
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

          // Add popup
          const popupContent = `
            <div class="p-2">
              <h3 class="font-semibold text-lg">${speeltuin.naam}</h3>
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
  }, [speeltuinen, userLocation, onSpeeltuinSelect]);

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