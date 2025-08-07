export interface Speeltuin {
  id: string;
  naam: string;
  omschrijving?: string;
  latitude?: number | null;
  longitude?: number | null;
  fotos: string[]; // Array van foto URLs
  
  // Voorzieningen (facilities)
  heeft_glijbaan: boolean;
  heeft_schommel: boolean;
  heeft_zandbak: boolean;
  heeft_kabelbaan: boolean;
  heeft_bankjes: boolean;
  heeft_sportveld: boolean;
  heeft_klimtoestel: boolean;
  heeft_water_pomp: boolean;
  heeft_panakooi: boolean;
  heeft_skatebaan: boolean;
  heeft_basketbalveld: boolean;
  heeft_wipwap: boolean;
  heeft_duikelrek: boolean;
  heeft_toilet: boolean;
  heeft_parkeerplaats: boolean;
  heeft_horeca: boolean;
  
  // Type speeltuin
  type_natuurspeeltuin: boolean;
  type_buurtspeeltuin: boolean;
  type_schoolplein: boolean;
  type_speelbos: boolean;
  
  // Leeftijdsgroep (more specific)
  leeftijd_0_2_jaar: boolean;
  leeftijd_2_6_jaar: boolean;
  leeftijd_6_12_jaar: boolean;
  leeftijd_12_plus_jaar: boolean;
  
  // Ondergrond (surface)
  ondergrond_zand: boolean;
  ondergrond_gras: boolean;
  ondergrond_rubber: boolean;
  ondergrond_tegels: boolean;
  ondergrond_kunstgras: boolean;
  
  // Geschikt voor (age groups) - legacy
  geschikt_peuters: boolean;
  geschikt_kleuters: boolean;
  geschikt_kinderen: boolean;
  
  // Toegankelijkheid columns removed
  
  // Veiligheid & toezicht columns removed
  

  

  

  
  // Overige kenmerken (other features)
  is_omheind: boolean;
  heeft_schaduw: boolean;
  // is_rolstoeltoegankelijk removed
  
  // Grootte en badge
  grootte: 'klein' | 'middel' | 'groot';
  badge: 'rolstoelvriendelijk' | 'babytoegankelijk' | 'natuurspeeltuin' | 'waterspeeltuin' | 'avonturenspeeltuin' | 'toiletten' | 'parkeren' | 'horeca' | 'geen';
  
  // Metadata
  bouwjaar?: number;
  fixi_copy_tekst?: string;
  toegevoegd_door?: string;
  created_at: string;
  updated_at: string;
}

export interface SpeeltuinFilters {
  searchTerm?: string;
  
  // Voorzieningen filters
  hasGlijbaan?: boolean;
  hasSchommel?: boolean;
  hasZandbak?: boolean;
  hasKabelbaan?: boolean;
  hasBankjes?: boolean;
  hasSportveld?: boolean;
  hasKlimtoestel?: boolean;
  hasWaterPomp?: boolean;
  hasPanakooi?: boolean;
  hasSkatebaan?: boolean;
  hasBasketbalveld?: boolean;
  hasWipwap?: boolean;
  hasDuikelrek?: boolean;
  hasToilet?: boolean;
  hasParkeerplaats?: boolean;
  hasHoreca?: boolean;
  
  // Type speeltuin filters
  isTypeNatuurspeeltuin?: boolean;
  isTypeBuurtspeeltuin?: boolean;
  isTypeSchoolplein?: boolean;
  isTypeSpeelbos?: boolean;
  
  // Leeftijdsgroep filters
  isLeeftijd0_2?: boolean;
  isLeeftijd2_6?: boolean;
  isLeeftijd6_12?: boolean;
  isLeeftijd12Plus?: boolean;
  
  // Ondergrond filters
  hasOndergrondZand?: boolean;
  hasOndergrondGras?: boolean;
  hasOndergrondRubber?: boolean;
  hasOndergrondTegels?: boolean;
  hasOndergrondKunstgras?: boolean;
  
  // Leeftijd filters (legacy)
  isGeschiktPeuters?: boolean;
  isGeschiktKleuters?: boolean;
  isGeschiktKinderen?: boolean;
  
  // Age category filters (new)
  peuters?: boolean;
  kleuters?: boolean;
  kinderen?: boolean;
  
  // Toegankelijkheid filters removed
  
  // Veiligheid filters removed
  

  

  

  
  // Overige filters
  isOmheind?: boolean;
  hasSchaduw?: boolean;
  isRolstoeltoegankelijk?: boolean;
  grootte?: 'klein' | 'middel' | 'groot';
  badge?: 'rolstoelvriendelijk' | 'babytoegankelijk' | 'natuurspeeltuin' | 'waterspeeltuin' | 'avonturenspeeltuin' | 'toiletten' | 'parkeren' | 'horeca' | 'geen';
  
  // Locatie filters
  userLocation?: [number, number];
  maxDistance?: number;
}

export type BadgeType = 
  | 'rolstoelvriendelijk'
  | 'babytoegankelijk'
  | 'natuurspeeltuin'
  | 'waterspeeltuin'
  | 'avonturenspeeltuin'
  | 'toiletten'
  | 'parkeren'
  | 'horeca'
  | 'geen';

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