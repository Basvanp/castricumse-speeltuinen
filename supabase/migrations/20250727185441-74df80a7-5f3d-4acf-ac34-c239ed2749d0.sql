-- Add new columns for extensive filter system

-- Type speeltuin
ALTER TABLE public.speeltuinen 
ADD COLUMN type_natuurspeeltuin boolean DEFAULT false,
ADD COLUMN type_buurtspeeltuin boolean DEFAULT false,
ADD COLUMN type_schoolplein boolean DEFAULT false,
ADD COLUMN type_speelbos boolean DEFAULT false;

-- Leeftijdsgroep (more specific than existing)
ALTER TABLE public.speeltuinen 
ADD COLUMN leeftijd_0_2_jaar boolean DEFAULT false,
ADD COLUMN leeftijd_2_6_jaar boolean DEFAULT false,
ADD COLUMN leeftijd_6_12_jaar boolean DEFAULT false,
ADD COLUMN leeftijd_12_plus_jaar boolean DEFAULT false;

-- Additional Voorzieningen / speeltoestellen
ALTER TABLE public.speeltuinen 
ADD COLUMN heeft_klimtoestel boolean DEFAULT false,
ADD COLUMN heeft_water_pomp boolean DEFAULT false,
ADD COLUMN heeft_panakooi boolean DEFAULT false,
ADD COLUMN heeft_skatebaan boolean DEFAULT false;

-- Toegankelijkheid
ALTER TABLE public.speeltuinen 
ADD COLUMN toegang_zichtbaar_omheind boolean DEFAULT false,
ADD COLUMN toegang_zonder_drempel boolean DEFAULT false,
ADD COLUMN speeltoestellen_voor_beperking boolean DEFAULT false;

-- Veiligheid & toezicht
ALTER TABLE public.speeltuinen 
ADD COLUMN veiligheid_in_zicht_huizen boolean DEFAULT false,
ADD COLUMN veiligheid_rustige_ligging boolean DEFAULT false,
ADD COLUMN veiligheid_verkeersluw boolean DEFAULT false;

-- Voorzieningen voor ouders / begeleiders
ALTER TABLE public.speeltuinen 
ADD COLUMN ouders_picknicktafels boolean DEFAULT false,
ADD COLUMN ouders_horeca_buurt boolean DEFAULT false,
ADD COLUMN ouders_wc_buurt boolean DEFAULT false;

-- Ligging / omgeving
ALTER TABLE public.speeltuinen 
ADD COLUMN ligging_woonwijk boolean DEFAULT false,
ADD COLUMN ligging_bos_natuur boolean DEFAULT false,
ADD COLUMN ligging_bij_school boolean DEFAULT false,
ADD COLUMN ligging_fietspad boolean DEFAULT false,
ADD COLUMN ligging_parkeerplaats boolean DEFAULT false;



-- Add bouwjaar column as requested earlier
ALTER TABLE public.speeltuinen 
ADD COLUMN bouwjaar integer;