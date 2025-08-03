-- Remove Veiligheid & Toezicht Columns
-- This migration removes all veiligheid columns that are no longer needed

-- Drop indexes for veiligheid columns
DROP INDEX IF EXISTS idx_speeltuinen_veiligheid_in_zicht_huizen;
DROP INDEX IF EXISTS idx_speeltuinen_veiligheid_rustige_ligging;
DROP INDEX IF EXISTS idx_speeltuinen_veiligheid_verkeersluw;

-- Drop veiligheid columns
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS veiligheid_in_zicht_huizen;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS veiligheid_rustige_ligging;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS veiligheid_verkeersluw;

-- Add comment for documentation
COMMENT ON TABLE public.speeltuinen IS 'Speeltuinen table with veiligheid columns removed'; 