export interface Speeltuin {
  id: string;
  naam: string;
  latitude: number;
  longitude: number;
  omschrijving?: string;
  afbeelding_url?: string;
  
  // Voorzieningen (facilities)
  heeft_glijbaan: boolean;
  heeft_schommel: boolean;
  heeft_zandbak: boolean;
  heeft_kabelbaan: boolean;
  heeft_bankjes: boolean;
  heeft_sportveld: boolean;
  
  // Ondergrond (surface)
  ondergrond_zand: boolean;
  ondergrond_gras: boolean;
  ondergrond_rubber: boolean;
  ondergrond_tegels: boolean;
  ondergrond_kunstgras: boolean;
  
  // Leeftijd (age groups)
  geschikt_peuters: boolean;
  geschikt_kleuters: boolean;
  geschikt_kinderen: boolean;
  
  // Grootte (size)
  grootte: 'klein' | 'middel' | 'groot';
  
  // Overig (other features)
  is_omheind: boolean;
  heeft_schaduw: boolean;
  is_rolstoeltoegankelijk: boolean;
  heeft_horeca: boolean;
  heeft_toilet: boolean;
  heeft_parkeerplaats: boolean;
  
  // Fixi integration
  fixi_copy_tekst?: string;
  
  // Metadata
  toegevoegd_door?: string;
  created_at: string;
  updated_at: string;
}

export interface SpeeltuinFilters {
  leeftijd: {
    peuters: boolean;
    kleuters: boolean;
    kinderen: boolean;
  };
  voorzieningen: {
    glijbaan: boolean;
    schommel: boolean;
    zandbak: boolean;
    kabelbaan: boolean;
    bankjes: boolean;
    sportveld: boolean;
  };
  ondergrond: {
    zand: boolean;
    gras: boolean;
    rubber: boolean;
    tegels: boolean;
    kunstgras: boolean;
  };
  grootte: {
    klein: boolean;
    middel: boolean;
    groot: boolean;
  };
  overig: {
    omheind: boolean;
    schaduw: boolean;
    rolstoeltoegankelijk: boolean;
    horeca: boolean;
    toilet: boolean;
    parkeerplaats: boolean;
  };
}