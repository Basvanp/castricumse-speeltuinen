import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeType = 
  // Toegankelijkheid
  | 'rolstoelvriendelijk'
  | 'babytoegankelijk' 
  // Type speeltuin
  | 'natuurspeeltuin'
  | 'waterspeeltuin'
  | 'avonturenspeeltuin'
  // Voorzieningen
  | 'toiletten'
  | 'parkeren'
  | 'horeca';

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