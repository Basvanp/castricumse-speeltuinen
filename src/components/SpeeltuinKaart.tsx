import React, { useEffect, useRef } from 'react';
import { Speeltuin } from '@/types/speeltuin';

interface SpeeltuinKaartProps {
  speeltuinen: Speeltuin[];
  onSpeeltuinSelect?: (speeltuin: Speeltuin) => void;
}

const SpeeltuinKaart: React.FC<SpeeltuinKaartProps> = ({ speeltuinen, onSpeeltuinSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current) return;

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

      // Create map if it doesn't exist
      if (!mapInstanceRef.current && mapRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(center, 13);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstanceRef.current);
      }

      // Clear existing markers
      if (mapInstanceRef.current) {
        mapInstanceRef.current.eachLayer((layer: any) => {
          if (layer instanceof L.Marker) {
            mapInstanceRef.current.removeLayer(layer);
          }
        });

        // Add markers for speeltuinen
        speeltuinen.forEach((speeltuin) => {
          if (speeltuin.latitude && speeltuin.longitude) {
            const color = speeltuin.heeft_glijbaan ? '#22c55e' : '#3b82f6';
            
            const customIcon = L.divIcon({
              html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
              className: 'custom-marker',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });

            const marker = L.marker([speeltuin.latitude, speeltuin.longitude], { 
              icon: customIcon 
            }).addTo(mapInstanceRef.current);

            // Add popup
            const popupContent = `
              <div class="p-2">
                <h3 class="font-semibold text-lg">${speeltuin.naam}</h3>
                ${speeltuin.omschrijving ? `<p class="text-sm text-gray-600 mt-1">${speeltuin.omschrijving}</p>` : ''}
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
      }
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
  }, [speeltuinen, onSpeeltuinSelect]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default SpeeltuinKaart;