import React from 'react';
import { Badge } from '@/components/ui/badge';

export type BadgeType = 
  | 'natuurspeeltuin'
  | 'buurtspeeltuin'
  | 'schoolplein'
  | 'speelbos'
  | 'rolstoeltoegankelijk'
  | 'waterpomp'
  | 'klimtoestel'
  | 'kabelbaan'
  | 'skatebaan'
  | 'basketbalveld'
  | 'trapveld'
  | 'wipwap'
  | 'duikelrek'
  | 'zandbak'
  | 'glijbaan'
  | 'schommel'
  | 'bankjes'
  | 'sportveld'
  | 'omheind'
  | 'schaduw'
  | 'parkeerplaats'
  | 'toilet'
  | 'horeca'
  | 'klein'
  | 'middel'
  | 'groot';

interface SpeeltuinBadgeProps {
  type: BadgeType;
  className?: string;
}

const SpeeltuinBadge: React.FC<SpeeltuinBadgeProps> = ({ type, className = '' }) => {
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

  const config = badgeConfig[type];
  if (!config) return null;

  return (
    <Badge variant="secondary" className={`${config.color} ${className}`}>
      {config.text}
    </Badge>
  );
};

export default SpeeltuinBadge;