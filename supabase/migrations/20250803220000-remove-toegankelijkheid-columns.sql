-- Remove Toegankelijkheid and Beperking Columns
-- This migration removes all toegankelijkheid and beperking columns that are no longer needed

-- Drop indexes for toegankelijkheid columns
DROP INDEX IF EXISTS idx_speeltuinen_toegang_zichtbaar_omheind;
DROP INDEX IF EXISTS idx_speeltuinen_toegang_zonder_drempel;
DROP INDEX IF EXISTS idx_speeltuinen_speeltoestellen_voor_beperking;
DROP INDEX IF EXISTS idx_speeltuinen_is_rolstoeltoegankelijk;

-- Drop toegankelijkheid columns
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS toegang_zichtbaar_omheind;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS toegang_zonder_drempel;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS speeltoestellen_voor_beperking;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS is_rolstoeltoegankelijk;

-- Add comment for documentation
COMMENT ON TABLE public.speeltuinen IS 'Speeltuinen table with toegankelijkheid and beperking columns removed'; 