-- Final Schema Cleanup Migration
-- This migration fixes all frontend/backend alignment issues

-- 1. Fix latitude/longitude to be nullable (frontend expects this)
ALTER TABLE public.speeltuinen 
ALTER COLUMN latitude DROP NOT NULL,
ALTER COLUMN longitude DROP NOT NULL;

-- 2. Ensure all required columns exist
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS type_natuurspeeltuin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS type_buurtspeeltuin BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS type_schoolplein BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS type_speelbos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_0_2_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_2_6_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_6_12_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_12_plus_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_klimtoestel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_water_pomp BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_panakooi BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_skatebaan BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_basketbalveld BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_wipwap BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_duikelrek BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_toilet BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_parkeerplaats BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS heeft_horeca BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ondergrond_kunstgras BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS toegang_zichtbaar_omheind BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS toegang_zonder_drempel BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS speeltoestellen_voor_beperking BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS veiligheid_in_zicht_huizen BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS veiligheid_rustige_ligging BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS veiligheid_verkeersluw BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ouders_picknicktafels BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ouders_horeca_buurt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ouders_wc_buurt BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_woonwijk BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_bos_natuur BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_bij_school BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_fietspad BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS ligging_parkeerplaats BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS grootte TEXT DEFAULT 'middel' CHECK (grootte IN ('klein', 'middel', 'groot')),
ADD COLUMN IF NOT EXISTS badge TEXT DEFAULT 'geen' CHECK (badge IN ('rolstoelvriendelijk', 'babytoegankelijk', 'natuurspeeltuin', 'waterspeeltuin', 'avonturenspeeltuin', 'toiletten', 'parkeren', 'horeca', 'geen')),
ADD COLUMN IF NOT EXISTS fotos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bouwjaar INTEGER,
ADD COLUMN IF NOT EXISTS fixi_copy_tekst TEXT;

-- 3. Update all existing rows to have proper default values
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
  heeft_basketbalveld = COALESCE(heeft_basketbalveld, false),
  heeft_wipwap = COALESCE(heeft_wipwap, false),
  heeft_duikelrek = COALESCE(heeft_duikelrek, false),
  heeft_toilet = COALESCE(heeft_toilet, false),
  heeft_parkeerplaats = COALESCE(heeft_parkeerplaats, false),
  heeft_horeca = COALESCE(heeft_horeca, false),
  ondergrond_kunstgras = COALESCE(ondergrond_kunstgras, false),
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
  grootte = COALESCE(grootte, 'middel'),
  badge = COALESCE(badge, 'geen'),
  fotos = COALESCE(fotos, '{}'),
  fixi_copy_tekst = COALESCE(fixi_copy_tekst, CONCAT('Kapot speeltoestel bij ', naam, ' (geen GPS-coördinaten beschikbaar)'));

-- 4. Make all boolean columns NOT NULL after setting defaults
ALTER TABLE public.speeltuinen 
ALTER COLUMN type_natuurspeeltuin SET NOT NULL,
ALTER COLUMN type_buurtspeeltuin SET NOT NULL,
ALTER COLUMN type_schoolplein SET NOT NULL,
ALTER COLUMN type_speelbos SET NOT NULL,
ALTER COLUMN leeftijd_0_2_jaar SET NOT NULL,
ALTER COLUMN leeftijd_2_6_jaar SET NOT NULL,
ALTER COLUMN leeftijd_6_12_jaar SET NOT NULL,
ALTER COLUMN leeftijd_12_plus_jaar SET NOT NULL,
ALTER COLUMN heeft_klimtoestel SET NOT NULL,
ALTER COLUMN heeft_water_pomp SET NOT NULL,
ALTER COLUMN heeft_panakooi SET NOT NULL,
ALTER COLUMN heeft_skatebaan SET NOT NULL,
ALTER COLUMN heeft_basketbalveld SET NOT NULL,
ALTER COLUMN heeft_wipwap SET NOT NULL,
ALTER COLUMN heeft_duikelrek SET NOT NULL,
ALTER COLUMN heeft_toilet SET NOT NULL,
ALTER COLUMN heeft_parkeerplaats SET NOT NULL,
ALTER COLUMN heeft_horeca SET NOT NULL,
ALTER COLUMN ondergrond_kunstgras SET NOT NULL,
ALTER COLUMN toegang_zichtbaar_omheind SET NOT NULL,
ALTER COLUMN toegang_zonder_drempel SET NOT NULL,
ALTER COLUMN speeltoestellen_voor_beperking SET NOT NULL,
ALTER COLUMN veiligheid_in_zicht_huizen SET NOT NULL,
ALTER COLUMN veiligheid_rustige_ligging SET NOT NULL,
ALTER COLUMN veiligheid_verkeersluw SET NOT NULL,
ALTER COLUMN ouders_picknicktafels SET NOT NULL,
ALTER COLUMN ouders_horeca_buurt SET NOT NULL,
ALTER COLUMN ouders_wc_buurt SET NOT NULL,
ALTER COLUMN ligging_woonwijk SET NOT NULL,
ALTER COLUMN ligging_bos_natuur SET NOT NULL,
ALTER COLUMN ligging_bij_school SET NOT NULL,
ALTER COLUMN ligging_fietspad SET NOT NULL,
ALTER COLUMN ligging_parkeerplaats SET NOT NULL,
ALTER COLUMN grootte SET NOT NULL,
ALTER COLUMN badge SET NOT NULL,
ALTER COLUMN fotos SET NOT NULL;

-- 5. Create comprehensive indexes for performance
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_natuurspeeltuin ON public.speeltuinen(type_natuurspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_buurtspeeltuin ON public.speeltuinen(type_buurtspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_schoolplein ON public.speeltuinen(type_schoolplein);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_speelbos ON public.speeltuinen(type_speelbos);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_0_2_jaar ON public.speeltuinen(leeftijd_0_2_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_2_6_jaar ON public.speeltuinen(leeftijd_2_6_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_6_12_jaar ON public.speeltuinen(leeftijd_6_12_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_12_plus_jaar ON public.speeltuinen(leeftijd_12_plus_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_klimtoestel ON public.speeltuinen(heeft_klimtoestel);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_water_pomp ON public.speeltuinen(heeft_water_pomp);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_panakooi ON public.speeltuinen(heeft_panakooi);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_skatebaan ON public.speeltuinen(heeft_skatebaan);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_basketbalveld ON public.speeltuinen(heeft_basketbalveld);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_wipwap ON public.speeltuinen(heeft_wipwap);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_duikelrek ON public.speeltuinen(heeft_duikelrek);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_toilet ON public.speeltuinen(heeft_toilet);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_parkeerplaats ON public.speeltuinen(heeft_parkeerplaats);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_horeca ON public.speeltuinen(heeft_horeca);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_kunstgras ON public.speeltuinen(ondergrond_kunstgras);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_toegang_zichtbaar_omheind ON public.speeltuinen(toegang_zichtbaar_omheind);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_toegang_zonder_drempel ON public.speeltuinen(toegang_zonder_drempel);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_speeltoestellen_voor_beperking ON public.speeltuinen(speeltoestellen_voor_beperking);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_veiligheid_in_zicht_huizen ON public.speeltuinen(veiligheid_in_zicht_huizen);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_veiligheid_rustige_ligging ON public.speeltuinen(veiligheid_rustige_ligging);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_veiligheid_verkeersluw ON public.speeltuinen(veiligheid_verkeersluw);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ouders_picknicktafels ON public.speeltuinen(ouders_picknicktafels);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ouders_horeca_buurt ON public.speeltuinen(ouders_horeca_buurt);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ouders_wc_buurt ON public.speeltuinen(ouders_wc_buurt);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ligging_woonwijk ON public.speeltuinen(ligging_woonwijk);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ligging_bos_natuur ON public.speeltuinen(ligging_bos_natuur);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ligging_bij_school ON public.speeltuinen(ligging_bij_school);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ligging_fietspad ON public.speeltuinen(ligging_fietspad);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ligging_parkeerplaats ON public.speeltuinen(ligging_parkeerplaats);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_grootte ON public.speeltuinen(grootte);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_badge ON public.speeltuinen(badge);

-- 6. Add comprehensive comments
COMMENT ON COLUMN public.speeltuinen.latitude IS 'Latitude coordinate (nullable for frontend compatibility)';
COMMENT ON COLUMN public.speeltuinen.longitude IS 'Longitude coordinate (nullable for frontend compatibility)';
COMMENT ON COLUMN public.speeltuinen.fixi_copy_tekst IS 'Fixi copy text for reporting broken equipment';
COMMENT ON COLUMN public.speeltuinen.fotos IS 'Array of photo URLs in TEXT[] format';
COMMENT ON COLUMN public.speeltuinen.grootte IS 'Size of playground: klein, middel, groot';
COMMENT ON COLUMN public.speeltuinen.badge IS 'Badge for playground card display'; 