import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeType = 
  // Toegankelijkheid
  | 'rolstoelvriendelijk'
  | 'babytoegankelijk' 
  | 'sensory-friendly'
  // Type speeltuin
  | 'natuurspeeltuin'
  | 'waterspeeltuin'
  | 'avonturenspeeltuin'
  | 'creatieve-speeltuin'
  | 'actieve-speeltuin'
  // Leeftijdsgroepen
  | '0-3-jaar'
  | '4-8-jaar'
  | '9-12-jaar'
  | 'alle-leeftijden'
  // Voorzieningen
  | 'toiletten'
  | 'parkeren'
  | 'horeca'
  | 'honden-toegestaan'
  | 'honden-verboden'
  // Bijzondere kenmerken
  | 'premium';

interface SpeeltuinBadgeProps {
  type: BadgeType;
  className?: string;
}

const badgeConfig: Record<BadgeType, {
  label: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}> = {
  // Toegankelijkheid
  'rolstoelvriendelijk': {
    label: 'Rolstoelvriendelijk',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="4" r="2"/>
        <path d="M10.5 20.5a2.5 2.5 0 0 1-2.4-3.1c.2-.9.8-1.8 1.6-2.4l4.5-3.4c.7-.5 1.6-.7 2.4-.4.8.3 1.4 1 1.6 1.8l.5 2.2c.2.9-.1 1.8-.7 2.5l-2.3 2.8c-.6.7-1.5 1.1-2.4 1.1h-2.8z"/>
        <circle cx="12" cy="18" r="3"/>
      </svg>
    ),
  },
  'babytoegankelijk': {
    label: 'Babytoegankelijk',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M2 3h6l2 13h7l2-7H9"/>
        <circle cx="9" cy="19" r="1"/>
        <circle cx="20" cy="19" r="1"/>
        <path d="M7 8L5.5 5.5C5 4.5 4 4 3 4H1"/>
      </svg>
    ),
  },
  'sensory-friendly': {
    label: 'Sensory-friendly',
    bgColor: 'bg-indigo-100',
    textColor: 'text-indigo-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44L2 14.5z"/>
        <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44L22 14.5z"/>
      </svg>
    ),
  },
  // Type speeltuin
  'natuurspeeltuin': {
    label: 'Natuurspeeltuin',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M12 2v20"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
  },
  'waterspeeltuin': {
    label: 'Waterspeeltuin',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
      </svg>
    ),
  },
  'avonturenspeeltuin': {
    label: 'Avonturenspeeltuin',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
  },
  'creatieve-speeltuin': {
    label: 'Creatieve speeltuin',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3z"/>
        <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/>
      </svg>
    ),
  },
  'actieve-speeltuin': {
    label: 'Actieve speeltuin',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M8 3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1l1 2h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-1l-1 1v4a2 2 0 0 1-2 2h-1l-1 2H9l-1-2H7a2 2 0 0 1-2-2v-4l-1-1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h4l1-2V3z"/>
      </svg>
    ),
  },
  // Leeftijdsgroepen
  '0-3-jaar': {
    label: '0-3 jaar',
    bgColor: 'bg-pink-100',
    textColor: 'text-pink-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
      </svg>
    ),
  },
  '4-8-jaar': {
    label: '4-8 jaar',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
        <path d="M12 14v7"/>
      </svg>
    ),
  },
  '9-12-jaar': {
    label: '9-12 jaar',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="5"/>
        <path d="M20 21a8 8 0 1 0-16 0"/>
        <path d="M8 14l4 4 4-4"/>
      </svg>
    ),
  },
  'alle-leeftijden': {
    label: 'Alle leeftijden',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  },
  // Voorzieningen
  'toiletten': {
    label: 'Toiletten',
    bgColor: 'bg-slate-100',
    textColor: 'text-slate-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M9 21V9a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v12"/>
        <path d="M20 8v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4z"/>
        <path d="M12 2v2"/>
      </svg>
    ),
  },
  'parkeren': {
    label: 'Parkeren',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M14 16H9m10 0a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1.5c.8 0 1.6.3 2.1.9l1.4 1.4c.2.2.4.3.7.3H17a2 2 0 0 1 2 2v8z"/>
        <circle cx="8" cy="20" r="2"/>
        <circle cx="16" cy="20" r="2"/>
      </svg>
    ),
  },
  'horeca': {
    label: 'Horeca',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
  },
  'honden-toegestaan': {
    label: 'Honden toegestaan',
    bgColor: 'bg-emerald-100',
    textColor: 'text-emerald-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <path d="M8 5v8.5a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5V5a3 3 0 0 0-3-3h-2a3 3 0 0 0-3 3z"/>
        <path d="M6 5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1"/>
        <path d="M18 5a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-1"/>
      </svg>
    ),
  },
  'honden-verboden': {
    label: 'Honden verboden',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"/>
        <path d="M4.93 4.93l14.14 14.14"/>
        <path d="M8 5v8.5a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5V5"/>
      </svg>
    ),
  },
  // Bijzondere kenmerken
  'premium': {
    label: 'Premium',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    icon: (
      <svg className="w-3 h-3" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
      </svg>
    ),
  },
};

export const SpeeltuinBadge: React.FC<SpeeltuinBadgeProps> = ({ type, className }) => {
  const config = badgeConfig[type];
  
  if (!config) {
    return null;
  }

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium",
      config.bgColor,
      config.textColor,
      className
    )}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
};

export default SpeeltuinBadge;