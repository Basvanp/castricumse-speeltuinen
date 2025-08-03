-- Fix Current Schema Issues
-- Based on the actual database schema analysis

-- 1. Add missing columns that exist in frontend but not in database
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS leeftijd_0_2_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_2_6_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_6_12_jaar BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS leeftijd_12_plus_jaar BOOLEAN DEFAULT false,
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
ADD COLUMN IF NOT EXISTS toegevoegd_door UUID;

-- 2. Fix columns that are NOT NULL but should have defaults
ALTER TABLE public.speeltuinen 
ALTER COLUMN heeft_glijbaan SET DEFAULT false,
ALTER COLUMN heeft_schommel SET DEFAULT false,
ALTER COLUMN heeft_zandbak SET DEFAULT false,
ALTER COLUMN heeft_kabelbaan SET DEFAULT false,
ALTER COLUMN heeft_bankjes SET DEFAULT false,
ALTER COLUMN heeft_sportveld SET DEFAULT false,
ALTER COLUMN ondergrond_zand SET DEFAULT false,
ALTER COLUMN ondergrond_gras SET DEFAULT false,
ALTER COLUMN ondergrond_rubber SET DEFAULT false,
ALTER COLUMN ondergrond_tegels SET DEFAULT false,
ALTER COLUMN geschikt_peuters SET DEFAULT false,
ALTER COLUMN geschikt_kleuters SET DEFAULT false,
ALTER COLUMN geschikt_kinderen SET DEFAULT false,
ALTER COLUMN is_omheind SET DEFAULT false,
ALTER COLUMN heeft_schaduw SET DEFAULT false,
ALTER COLUMN is_rolstoeltoegankelijk SET DEFAULT false,
ALTER COLUMN type_natuurspeeltuin SET DEFAULT false,
ALTER COLUMN type_buurtspeeltuin SET DEFAULT false,
ALTER COLUMN type_schoolplein SET DEFAULT false,
ALTER COLUMN type_speelbos SET DEFAULT false,
ALTER COLUMN fotos SET DEFAULT '{}',
ALTER COLUMN badge SET DEFAULT 'geen',
ALTER COLUMN grootte SET DEFAULT 'middel';

-- 3. Update existing rows to have proper default values for NULL columns
UPDATE public.speeltuinen SET
  heeft_glijbaan = COALESCE(heeft_glijbaan, false),
  heeft_schommel = COALESCE(heeft_schommel, false),
  heeft_zandbak = COALESCE(heeft_zandbak, false),
  heeft_kabelbaan = COALESCE(heeft_kabelbaan, false),
  heeft_bankjes = COALESCE(heeft_bankjes, false),
  heeft_sportveld = COALESCE(heeft_sportveld, false),
  ondergrond_zand = COALESCE(ondergrond_zand, false),
  ondergrond_gras = COALESCE(ondergrond_gras, false),
  ondergrond_rubber = COALESCE(ondergrond_rubber, false),
  ondergrond_tegels = COALESCE(ondergrond_tegels, false),
  geschikt_peuters = COALESCE(geschikt_peuters, false),
  geschikt_kleuters = COALESCE(geschikt_kleuters, false),
  geschikt_kinderen = COALESCE(geschikt_kinderen, false),
  is_omheind = COALESCE(is_omheind, false),
  heeft_schaduw = COALESCE(heeft_schaduw, false),
  is_rolstoeltoegankelijk = COALESCE(is_rolstoeltoegankelijk, false),
  type_natuurspeeltuin = COALESCE(type_natuurspeeltuin, false),
  type_buurtspeeltuin = COALESCE(type_buurtspeeltuin, false),
  type_schoolplein = COALESCE(type_schoolplein, false),
  type_speelbos = COALESCE(type_speelbos, false),
  leeftijd_0_2_jaar = COALESCE(leeftijd_0_2_jaar, false),
  leeftijd_2_6_jaar = COALESCE(leeftijd_2_6_jaar, false),
  leeftijd_6_12_jaar = COALESCE(leeftijd_6_12_jaar, false),
  leeftijd_12_plus_jaar = COALESCE(leeftijd_12_plus_jaar, false),
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
  fotos = COALESCE(fotos, '{}'),
  badge = COALESCE(badge, 'geen'),
  grootte = COALESCE(grootte, 'middel'),
  fixi_copy_tekst = COALESCE(fixi_copy_tekst, CONCAT('Kapot speeltoestel bij ', naam, ' (geen GPS-coördinaten beschikbaar)'));

-- 4. Now make all boolean columns NOT NULL after setting defaults
ALTER TABLE public.speeltuinen 
ALTER COLUMN heeft_glijbaan SET NOT NULL,
ALTER COLUMN heeft_schommel SET NOT NULL,
ALTER COLUMN heeft_zandbak SET NOT NULL,
ALTER COLUMN heeft_kabelbaan SET NOT NULL,
ALTER COLUMN heeft_bankjes SET NOT NULL,
ALTER COLUMN heeft_sportveld SET NOT NULL,
ALTER COLUMN ondergrond_zand SET NOT NULL,
ALTER COLUMN ondergrond_gras SET NOT NULL,
ALTER COLUMN ondergrond_rubber SET NOT NULL,
ALTER COLUMN ondergrond_tegels SET NOT NULL,
ALTER COLUMN geschikt_peuters SET NOT NULL,
ALTER COLUMN geschikt_kleuters SET NOT NULL,
ALTER COLUMN geschikt_kinderen SET NOT NULL,
ALTER COLUMN is_omheind SET NOT NULL,
ALTER COLUMN heeft_schaduw SET NOT NULL,
ALTER COLUMN is_rolstoeltoegankelijk SET NOT NULL,
ALTER COLUMN type_natuurspeeltuin SET NOT NULL,
ALTER COLUMN type_buurtspeeltuin SET NOT NULL,
ALTER COLUMN type_schoolplein SET NOT NULL,
ALTER COLUMN type_speelbos SET NOT NULL,
ALTER COLUMN leeftijd_0_2_jaar SET NOT NULL,
ALTER COLUMN leeftijd_2_6_jaar SET NOT NULL,
ALTER COLUMN leeftijd_6_12_jaar SET NOT NULL,
ALTER COLUMN leeftijd_12_plus_jaar SET NOT NULL,
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
ALTER COLUMN fotos SET NOT NULL,
ALTER COLUMN badge SET NOT NULL,
ALTER COLUMN grootte SET NOT NULL;

-- 5. Add constraints for grootte and badge
ALTER TABLE public.speeltuinen 
ADD CONSTRAINT check_grootte CHECK (grootte IN ('klein', 'middel', 'groot')),
ADD CONSTRAINT check_badge CHECK (badge IN ('rolstoelvriendelijk', 'babytoegankelijk', 'natuurspeeltuin', 'waterspeeltuin', 'avonturenspeeltuin', 'toiletten', 'parkeren', 'horeca', 'geen'));

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_glijbaan ON public.speeltuinen(heeft_glijbaan);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_schommel ON public.speeltuinen(heeft_schommel);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_zandbak ON public.speeltuinen(heeft_zandbak);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_kabelbaan ON public.speeltuinen(heeft_kabelbaan);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_bankjes ON public.speeltuinen(heeft_bankjes);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_sportveld ON public.speeltuinen(heeft_sportveld);
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
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_zand ON public.speeltuinen(ondergrond_zand);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_gras ON public.speeltuinen(ondergrond_gras);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_rubber ON public.speeltuinen(ondergrond_rubber);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_tegels ON public.speeltuinen(ondergrond_tegels);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_ondergrond_kunstgras ON public.speeltuinen(ondergrond_kunstgras);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_geschikt_peuters ON public.speeltuinen(geschikt_peuters);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_geschikt_kleuters ON public.speeltuinen(geschikt_kleuters);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_geschikt_kinderen ON public.speeltuinen(geschikt_kinderen);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_is_omheind ON public.speeltuinen(is_omheind);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_schaduw ON public.speeltuinen(heeft_schaduw);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_is_rolstoeltoegankelijk ON public.speeltuinen(is_rolstoeltoegankelijk);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_natuurspeeltuin ON public.speeltuinen(type_natuurspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_buurtspeeltuin ON public.speeltuinen(type_buurtspeeltuin);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_schoolplein ON public.speeltuinen(type_schoolplein);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_type_speelbos ON public.speeltuinen(type_speelbos);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_0_2_jaar ON public.speeltuinen(leeftijd_0_2_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_2_6_jaar ON public.speeltuinen(leeftijd_2_6_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_6_12_jaar ON public.speeltuinen(leeftijd_6_12_jaar);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_leeftijd_12_plus_jaar ON public.speeltuinen(leeftijd_12_plus_jaar);
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

-- 7. Add comments for documentation
COMMENT ON COLUMN public.speeltuinen.latitude IS 'Latitude coordinate (nullable for frontend compatibility)';
COMMENT ON COLUMN public.speeltuinen.longitude IS 'Longitude coordinate (nullable for frontend compatibility)';
COMMENT ON COLUMN public.speeltuinen.fixi_copy_tekst IS 'Fixi copy text for reporting broken equipment';
COMMENT ON COLUMN public.speeltuinen.fotos IS 'Array of photo URLs in TEXT[] format';
COMMENT ON COLUMN public.speeltuinen.grootte IS 'Size of playground: klein, middel, groot';
COMMENT ON COLUMN public.speeltuinen.badge IS 'Badge for playground card display';
COMMENT ON COLUMN public.speeltuinen.toegevoegd_door IS 'User ID who added this playground'; 