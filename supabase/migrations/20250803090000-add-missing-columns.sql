-- Add missing columns that exist in TypeScript types but not in database
-- This migration adds all the columns from the 20250727185441 migration that might not be applied

-- Type speeltuin
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS type_natuurspeeltuin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS type_buurtspeeltuin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS type_schoolplein boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS type_speelbos boolean DEFAULT false;

-- Leeftijdsgroep (more specific than existing)
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS leeftijd_0_2_jaar boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_2_6_jaar boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_6_12_jaar boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_12_plus_jaar boolean DEFAULT false;

-- Additional Voorzieningen / speeltoestellen
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS heeft_klimtoestel boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_water_pomp boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_panakooi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_skatebaan boolean DEFAULT false;

-- Toegankelijkheid
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS toegang_zichtbaar_omheind boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS toegang_zonder_drempel boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS speeltoestellen_voor_beperking boolean DEFAULT false;

-- Veiligheid & toezicht
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS veiligheid_in_zicht_huizen boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS veiligheid_rustige_ligging boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS veiligheid_verkeersluw boolean DEFAULT false;

-- Voorzieningen voor ouders / begeleiders
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS ouders_picknicktafels boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ouders_horeca_buurt boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ouders_wc_buurt boolean DEFAULT false;

-- Ligging / omgeving
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS ligging_woonwijk boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_bos_natuur boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_bij_school boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_fietspad boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_parkeerplaats boolean DEFAULT false;



-- Add missing columns from our previous migration
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS heeft_panakooi boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_basketbalveld boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_wipwap boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_duikelrek boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_toilet boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_parkeerplaats boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_horeca boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS ondergrond_kunstgras boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS grootte text DEFAULT 'middel' CHECK (grootte IN ('klein', 'middel', 'groot')),
ADD COLUMN IF NOT EXISTS badge text DEFAULT 'geen' CHECK (badge IN ('rolstoelvriendelijk', 'babytoegankelijk', 'natuurspeeltuin', 'waterspeeltuin', 'avonturenspeeltuin', 'toiletten', 'parkeren', 'horeca', 'geen')),
ADD COLUMN IF NOT EXISTS fotos text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bouwjaar integer;

-- Update existing rows to have default values for new columns
UPDATE public.speeltuinen SET
  type_natuurspeeltuin = COALESCE(type_natuurspeeltuin, false),
  type_buurtspeeltuin = COALESCE(type_buurtspeeltuin, false),
  type_schoolplein = COALESCE(type_schoolplein, false),
  type_speelbos = COALESCE(type_speelbos, false),
  leeftijd_0_2_jaar = COALESCE(leeftijd_0_2_jaar, false),
  leeftijd_2_6_jaar = COALESCE(leeftijd_2_6_jaar, false),
  leeftijd_6_12_jaar = COALESCE(leeftijd_6_12_jaar, false),
  leeftijd_12_plus_jaar = COALESCE(leeftijd_12_plus_jaar, false),
  heeft_klimtoestel = COALESCE(heeft_klimtoestel, false),
  heeft_water_pomp = COALESCE(heeft_water_pomp, false),
  heeft_panakooi = COALESCE(heeft_panakooi, false),
  heeft_skatebaan = COALESCE(heeft_skatebaan, false),
  toegang_zichtbaar_omheind = COALESCE(toegang_zichtbaar_omheind, false),
  toegang_zonder_drempel = COALESCE(toegang_zonder_drempel, false),
  speeltoestellen_voor_beperking = COALESCE(speeltoestellen_voor_beperking, false),
  veiligheid_in_zicht_huizen = COALESCE(veiligheid_in_zicht_huizen, false),
  veiligheid_rustige_ligging = COALESCE(veiligheid_rustige_ligging, false),
  veiligheid_verkeersluw = COALESCE(veiligheid_verkeersluw, false),
  ouders_picknicktafels = COALESCE(ouders_picknicktafels, false),
  ouders_horeca_buurt = COALESCE(ouders_horeca_buurt, false),
  ouders_wc_buurt = COALESCE(ouders_wc_buurt, false),
  ligging_woonwijk = COALESCE(ligging_woonwijk, false),
  ligging_bos_natuur = COALESCE(ligging_bos_natuur, false),
  ligging_bij_school = COALESCE(ligging_bij_school, false),
  ligging_fietspad = COALESCE(ligging_fietspad, false),
  ligging_parkeerplaats = COALESCE(ligging_parkeerplaats, false),

  heeft_panakooi = COALESCE(heeft_panakooi, false),
  heeft_basketbalveld = COALESCE(heeft_basketbalveld, false),
  heeft_wipwap = COALESCE(heeft_wipwap, false),
  heeft_duikelrek = COALESCE(heeft_duikelrek, false),
  heeft_toilet = COALESCE(heeft_toilet, false),
  heeft_parkeerplaats = COALESCE(heeft_parkeerplaats, false),
  heeft_horeca = COALESCE(heeft_horeca, false),
  ondergrond_kunstgras = COALESCE(ondergrond_kunstgras, false),
  grootte = COALESCE(grootte, 'middel'),
  badge = COALESCE(badge, 'geen'),
  fotos = COALESCE(fotos, '{}');

-- Add comments for documentation
COMMENT ON COLUMN public.speeltuinen.type_natuurspeeltuin IS 'Natuurspeeltuin type';
COMMENT ON COLUMN public.speeltuinen.type_buurtspeeltuin IS 'Buurt speeltuin type';
COMMENT ON COLUMN public.speeltuinen.type_schoolplein IS 'Schoolplein type';
COMMENT ON COLUMN public.speeltuinen.type_speelbos IS 'Speelbos type';
COMMENT ON COLUMN public.speeltuinen.leeftijd_0_2_jaar IS 'Geschikt voor 0-2 jaar';
COMMENT ON COLUMN public.speeltuinen.leeftijd_2_6_jaar IS 'Geschikt voor 2-6 jaar';
COMMENT ON COLUMN public.speeltuinen.leeftijd_6_12_jaar IS 'Geschikt voor 6-12 jaar';
COMMENT ON COLUMN public.speeltuinen.leeftijd_12_plus_jaar IS 'Geschikt voor 12+ jaar';


-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_natuurspeeltuin ON public.speeltuinen(type_natuurspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_buurtspeeltuin ON public.speeltuinen(type_buurtspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_schoolplein ON public.speeltuinen(type_schoolplein);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_speelbos ON public.speeltuinen(type_speelbos);
 