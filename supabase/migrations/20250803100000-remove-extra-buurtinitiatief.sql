-- Remove problematic extra columns if they exist
-- This migration removes the problematic extra_buurtinitiatief, extra_educatief, extra_kunstwerk_thema, and extra_waterpomp columns
-- Also removes duplicate columns like heeft_trapveld (use heeft_panakooi instead)

-- Drop the indexes if they exist
DROP INDEX IF EXISTS idx_speeltuinen_extra_buurtinitiatief;

-- Remove the columns if they exist
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS extra_buurtinitiatief;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS extra_educatief;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS extra_kunstwerk_thema;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS extra_waterpomp;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS heeft_trapveld; 