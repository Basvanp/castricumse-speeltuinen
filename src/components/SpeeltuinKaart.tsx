import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Speeltuin } from '@/types/speeltuin';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SpeeltuinKaartProps {
  speeltuinen: Speeltuin[];
  onSpeeltuinSelect?: (speeltuin: Speeltuin) => void;
}

const SpeeltuinKaart: React.FC<SpeeltuinKaartProps> = ({ speeltuinen, onSpeeltuinSelect }) => {
  // Center on Castricum
  const center: [number, number] = [52.5485, 4.6698];

  const createIcon = (speeltuin: Speeltuin) => {
    const color = speeltuin.heeft_glijbaan ? '#22c55e' : '#3b82f6';
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      className: 'custom-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
  };

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {speeltuinen.map((speeltuin) => (
          <Marker
            key={speeltuin.id}
            position={[speeltuin.latitude, speeltuin.longitude]}
            icon={createIcon(speeltuin)}
            eventHandlers={{
              click: () => onSpeeltuinSelect?.(speeltuin),
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-lg">{speeltuin.naam}</h3>
                {speeltuin.omschrijving && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {speeltuin.omschrijving}
                  </p>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {speeltuin.heeft_glijbaan && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Glijbaan
                    </span>
                  )}
                  {speeltuin.heeft_schommel && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Schommel
                    </span>
                  )}
                  {speeltuin.heeft_zandbak && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      Zandbak
                    </span>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default SpeeltuinKaart;