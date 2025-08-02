export interface Speeltuin {
  id: string;
  naam: string;
  omschrijving?: string;
  latitude: number;
  longitude: number;
  afbeelding_url?: string;
  fotos?: string[] | { id?: number; url: string; naam?: string }[]; // Support both formats
  badge?: string;
  heeft_glijbaan: boolean;
  heeft_schommel: boolean;
  heeft_zandbak: boolean;
  heeft_kabelbaan: boolean;
  heeft_bankjes: boolean;
  heeft_sportveld: boolean;
  type_natuurspeeltuin: boolean;
  type_buurtspeeltuin: boolean;
  type_schoolplein: boolean;
  type_speelbos: boolean;
  is_rolstoeltoegankelijk: boolean;
  heeft_water_pomp: boolean;
  heeft_klimtoestel: boolean;
  heeft_skatebaan: boolean;
  heeft_basketbalveld: boolean;
  heeft_trapveld: boolean;
  heeft_wipwap: boolean;
  heeft_duikelrek: boolean;
  heeft_schaduw: boolean;
  is_omheind: boolean;
  heeft_parkeerplaats: boolean;
  heeft_toilet: boolean;
  heeft_horeca: boolean;
  grootte: 'klein' | 'middel' | 'groot';
  created_at: string;
  updated_at: string;
}

export interface SpeeltuinFilters {
  searchTerm?: string;
  hasGlijbaan?: boolean;
  hasSchommel?: boolean;
  hasZandbak?: boolean;
  hasKabelbaan?: boolean;
  hasBankjes?: boolean;
  hasSportveld?: boolean;
  typeNatuurspeeltuin?: boolean;
  typeBuurtspeeltuin?: boolean;
  typeSchoolplein?: boolean;
  typeSpeelbos?: boolean;
  isRolstoeltoegankelijk?: boolean;
  hasWaterPomp?: boolean;
  hasKlimtoestel?: boolean;
  hasSkatebaan?: boolean;
  hasBasketbalveld?: boolean;
  hasTrapveld?: boolean;
  hasWipwap?: boolean;
  hasDuikelrek?: boolean;
  hasSchaduw?: boolean;
  isOmheind?: boolean;
  hasParkeerplaats?: boolean;
  hasToilet?: boolean;
  hasHoreca?: boolean;
  grootte?: 'klein' | 'middel' | 'groot';
  userLocation?: [number, number];
  maxDistance?: number;
}

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

export interface Review {
  id: string;
  speeltuin_id: string;
  user_id: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  pros?: string; // Positive aspects
  cons?: string; // Negative aspects
  visit_date?: string; // When they visited
  created_at: string;
  updated_at: string;
  is_verified: boolean; // Whether the review is verified
  speeltuin?: Speeltuin; // For joined queries
  user?: {
    name: string;
    avatar_url?: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'new_speeltuin' | 'review_response' | 'favorite_update' | 'system';
  title: string;
  message: string;
  speeltuin_id?: string;
  review_id?: string;
  is_read: boolean;
  created_at: string;
  speeltuin?: Speeltuin; // For joined queries
}

export interface UserPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  favorite_notifications: boolean;
  review_notifications: boolean;
  new_speeltuin_notifications: boolean;
  created_at: string;
  updated_at: string;
}