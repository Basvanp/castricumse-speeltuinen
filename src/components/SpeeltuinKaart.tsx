import React, { useEffect, useRef, useState } from 'react';
import { Speeltuin } from '@/types/speeltuin';
import { Button } from '@/components/ui/button';
import { MapPin, Target } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SpeeltuinKaartProps {
  speeltuinen: Speeltuin[];
  onSpeeltuinSelect?: (speeltuin: Speeltuin) => void;
}

// Helper function to calculate distance between two coordinates
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const SpeeltuinKaart: React.FC<SpeeltuinKaartProps> = ({ speeltuinen, onSpeeltuinSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userLocationMarkerRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocatie niet ondersteund",
        description: "Uw browser ondersteunt geen geolocatie.",
        variant: "destructive",
      });
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation: [number, number] = [
          position.coords.latitude,
          position.coords.longitude
        ];
        setUserLocation(newLocation);
        
        // Center map on user location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newLocation, 14);
        }
        
        setIsLocating(false);
        toast({
          title: "Locatie gevonden",
          description: "De kaart is gecentreerd op uw locatie.",
        });
      },
      (error) => {
        setIsLocating(false);
        let message = "Er is een fout opgetreden bij het ophalen van uw locatie.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Locatietoegang geweigerd. U kunt dit wijzigen in uw browserinstellingen.";
        }
        toast({
          title: "Locatie niet beschikbaar",
          description: message,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    );
  };

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

        // Add user location marker if available
        if (userLocation && userLocationMarkerRef.current) {
          mapInstanceRef.current.removeLayer(userLocationMarkerRef.current);
        }
        
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
  }, [speeltuinen, onSpeeltuinSelect, userLocation]);

  return (
    <div className="relative h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      <Button
        onClick={getCurrentLocation}
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