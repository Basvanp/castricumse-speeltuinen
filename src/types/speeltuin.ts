export interface Speeltuin {
  id: string;
  naam: string;
  latitude: number;
  longitude: number;
  omschrijving?: string;
  afbeelding_url?: string;
  fotos?: string[] | { id?: number; url: string; naam?: string }[]; // Support both formats
  bouwjaar?: number;
  
  // Type speeltuin
  type_natuurspeeltuin: boolean;
  type_buurtspeeltuin: boolean;
  type_schoolplein: boolean;
  type_speelbos: boolean;
  
  // Voorzieningen (facilities) - existing
  heeft_glijbaan: boolean;
  heeft_schommel: boolean;
  heeft_zandbak: boolean;
  heeft_kabelbaan: boolean;
  heeft_bankjes: boolean;
  heeft_sportveld: boolean;
  
  // Voorzieningen (facilities) - new
  heeft_klimtoestel: boolean;
  heeft_water_pomp: boolean;
  heeft_trapveld: boolean;
  heeft_skatebaan: boolean;
  heeft_basketbalveld: boolean;
  heeft_wipwap: boolean;
  heeft_duikelrek: boolean;
  
  // Ondergrond (surface)
  ondergrond_zand: boolean;
  ondergrond_gras: boolean;
  ondergrond_rubber: boolean;
  ondergrond_tegels: boolean;
  ondergrond_kunstgras: boolean;
  
  // Leeftijd (age groups) - existing
  geschikt_peuters: boolean;
  geschikt_kleuters: boolean;
  geschikt_kinderen: boolean;
  
  // Leeftijd (age groups) - new specific
  leeftijd_0_2_jaar: boolean;
  leeftijd_2_6_jaar: boolean;
  leeftijd_6_12_jaar: boolean;
  leeftijd_12_plus_jaar: boolean;
  
  // Grootte (size)
  grootte: 'klein' | 'middel' | 'groot';
  
  // Overig (other features) - existing
  is_omheind: boolean;
  heeft_schaduw: boolean;
  is_rolstoeltoegankelijk: boolean;
  heeft_horeca: boolean;
  heeft_toilet: boolean;
  heeft_parkeerplaats: boolean;
  
  // Toegankelijkheid
  toegang_zichtbaar_omheind: boolean;
  toegang_zonder_drempel: boolean;
  speeltoestellen_voor_beperking: boolean;
  
  // Veiligheid & toezicht
  veiligheid_in_zicht_huizen: boolean;
  veiligheid_rustige_ligging: boolean;
  veiligheid_verkeersluw: boolean;
  
  // Voorzieningen voor ouders / begeleiders
  ouders_picknicktafels: boolean;
  ouders_horeca_buurt: boolean;
  ouders_wc_buurt: boolean;
  
  // Ligging / omgeving
  ligging_woonwijk: boolean;
  ligging_bos_natuur: boolean;
  ligging_bij_school: boolean;
  ligging_fietspad: boolean;
  ligging_parkeerplaats: boolean;
  
  // Extra's
  extra_waterpomp: boolean;
  extra_educatief: boolean;
  extra_kunstwerk_thema: boolean;
  extra_buurtinitiatief: boolean;
  
  // Fixi integration
  fixi_copy_tekst?: string;
  
  // Badge
  badge?: string;
  
  // Metadata
  toegevoegd_door?: string;
  created_at: string;
  updated_at: string;
}

export interface SpeeltuinFilters {
  typeSpeeltuin: {
    natuurspeeltuin: boolean;
    buurtspeeltuin: boolean;
    schoolplein: boolean;
    speelbos: boolean;
  };
  leeftijd: {
    peuters: boolean;
    kleuters: boolean;
    kinderen: boolean;
  };
  leeftijdSpecifiek: {
    '0_2_jaar': boolean;
    '2_6_jaar': boolean;
    '6_12_jaar': boolean;
    '12_plus_jaar': boolean;
  };
  voorzieningen: {
    glijbaan: boolean;
    schommel: boolean;
    zandbak: boolean;
    kabelbaan: boolean;
    bankjes: boolean;
    sportveld: boolean;
    klimtoestel: boolean;
    water_pomp: boolean;
    trapveld: boolean;
    skatebaan: boolean;
    basketbalveld: boolean;
    wipwap: boolean;
    duikelrek: boolean;
    toilet: boolean;
    parkeerplaats: boolean;
    horeca: boolean;
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
  toegankelijkheid: {
    rolstoeltoegankelijk: boolean;
    zichtbaar_omheind: boolean;
    zonder_drempel: boolean;
    speeltoestellen_beperking: boolean;
  };
  veiligheid: {
    omheind: boolean;
    in_zicht_huizen: boolean;
    rustige_ligging: boolean;
    verkeersluw: boolean;
  };
  voorzieningen_ouders: {
    bankjes: boolean;
    schaduw: boolean;
    picknicktafels: boolean;
    horeca_buurt: boolean;
    wc_buurt: boolean;
  };
  ligging: {
    woonwijk: boolean;
    bos_natuur: boolean;
    bij_school: boolean;
    fietspad: boolean;
    parkeerplaats: boolean;
  };
  extras: {
    waterpomp: boolean;
    educatief: boolean;
    kunstwerk_thema: boolean;
    buurtinitiatief: boolean;
  };
}