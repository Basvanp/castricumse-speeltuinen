-- Complete Speeltuinen Schema Migration
-- This migration adds all the desired columns for a comprehensive playground database

-- First, let's add the missing columns to the existing speeltuinen table
ALTER TABLE public.speeltuinen 
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
ADD COLUMN IF NOT EXISTS grootte TEXT CHECK (grootte IN ('klein', 'middel', 'groot')) DEFAULT 'middel',
ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN (
  'rolstoelvriendelijk', 
  'babytoegankelijk', 
  'natuurspeeltuin', 
  'waterspeeltuin', 
  'avonturenspeeltuin', 
  'toiletten', 
  'parkeren', 
  'horeca', 
  'geen'
)) DEFAULT 'geen',
ADD COLUMN IF NOT EXISTS fotos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS bouwjaar INTEGER;

-- Update existing records to have default values
UPDATE public.speeltuinen 
SET 
  heeft_klimtoestel = false,
  heeft_water_pomp = false,
  heeft_panakooi = false,
  heeft_skatebaan = false,
  heeft_basketbalveld = false,
  heeft_wipwap = false,
  heeft_duikelrek = false,
  heeft_toilet = false,
  heeft_parkeerplaats = false,
  heeft_horeca = false,
  ondergrond_kunstgras = false,
  grootte = 'middel',
  badge = 'geen',
  fotos = '{}',
  bouwjaar = NULL
WHERE 
  heeft_klimtoestel IS NULL OR
  heeft_water_pomp IS NULL OR
  heeft_panakooi IS NULL OR
  heeft_skatebaan IS NULL OR
  heeft_basketbalveld IS NULL OR
  heeft_wipwap IS NULL OR
  heeft_duikelrek IS NULL OR
  heeft_toilet IS NULL OR
  heeft_parkeerplaats IS NULL OR
  heeft_horeca IS NULL OR
  ondergrond_kunstgras IS NULL OR
  grootte IS NULL OR
  badge IS NULL OR
  fotos IS NULL;

-- Make sure all columns are NOT NULL after setting defaults
ALTER TABLE public.speeltuinen 
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
ALTER COLUMN grootte SET NOT NULL,
ALTER COLUMN badge SET NOT NULL,
ALTER COLUMN fotos SET NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.speeltuinen.heeft_klimtoestel IS 'Klimtoestel aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_water_pomp IS 'Water/pomp aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_panakooi IS 'Panakooi aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_skatebaan IS 'Skatebaan aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_basketbalveld IS 'Basketbalveld aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_wipwap IS 'Wipwap aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_duikelrek IS 'Duikelrek aanwezig';
COMMENT ON COLUMN public.speeltuinen.heeft_toilet IS 'Toilet beschikbaar';
COMMENT ON COLUMN public.speeltuinen.heeft_parkeerplaats IS 'Parkeerplaats nabij';
COMMENT ON COLUMN public.speeltuinen.heeft_horeca IS 'Horeca aanwezig';
COMMENT ON COLUMN public.speeltuinen.ondergrond_kunstgras IS 'Kunstgras ondergrond';
COMMENT ON COLUMN public.speeltuinen.grootte IS 'Grootte van de speeltuin: klein, middel, groot';
COMMENT ON COLUMN public.speeltuinen.badge IS 'Badge voor de speeltuinkaart';
COMMENT ON COLUMN public.speeltuinen.fotos IS 'Array van foto URLs in TEXT[] format';
COMMENT ON COLUMN public.speeltuinen.bouwjaar IS 'Bouwjaar van de speeltuin (optioneel)';

-- Create indexes for better performance on commonly filtered columns
CREATE INDEX IF NOT EXISTS idx_speeltuinen_grootte ON public.speeltuinen(grootte);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_badge ON public.speeltuinen(badge);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_toilet ON public.speeltuinen(heeft_toilet);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_parkeerplaats ON public.speeltuinen(heeft_parkeerplaats);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_heeft_horeca ON public.speeltuinen(heeft_horeca);
CREATE INDEX IF NOT EXISTS idx_speeltuinen_is_rolstoeltoegankelijk ON public.speeltuinen(is_rolstoeltoegankelijk);

-- Update sample data with new columns
UPDATE public.speeltuinen 
SET 
  heeft_klimtoestel = true,
  heeft_water_pomp = false,
  heeft_panakooi = false,
  heeft_skatebaan = false,
  heeft_basketbalveld = false,
  heeft_wipwap = false,
  heeft_duikelrek = false,
  heeft_toilet = false,
  heeft_parkeerplaats = true,
  heeft_horeca = false,
  ondergrond_kunstgras = false,
  grootte = 'middel',
  badge = 'geen',
  fotos = '[]'::jsonb
WHERE naam = 'Speeltuin Duintuinstraat';

UPDATE public.speeltuinen 
SET 
  heeft_klimtoestel = false,
  heeft_water_pomp = false,
  heeft_panakooi = false,
  heeft_skatebaan = false,
  heeft_basketbalveld = true,
  heeft_wipwap = false,
  heeft_duikelrek = false,
  heeft_toilet = false,
  heeft_parkeerplaats = false,
  heeft_horeca = false,
  ondergrond_kunstgras = false,
  grootte = 'klein',
  badge = 'geen',
  fotos = '[]'::jsonb
WHERE naam = 'Speeltuin Hogeweg'; 