-- Remove Ligging Columns
-- This migration removes all ligging_ columns that are no longer needed

-- Drop indexes for ligging columns
DROP INDEX IF EXISTS idx_speeltuinen_ligging_woonwijk;
DROP INDEX IF EXISTS idx_speeltuinen_ligging_bos_natuur;
DROP INDEX IF EXISTS idx_speeltuinen_ligging_bij_school;
DROP INDEX IF EXISTS idx_speeltuinen_ligging_fietspad;
DROP INDEX IF EXISTS idx_speeltuinen_ligging_parkeerplaats;

-- Drop ligging columns
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ligging_woonwijk;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ligging_bos_natuur;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ligging_bij_school;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ligging_fietspad;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ligging_parkeerplaats;

-- Add comment for documentation
COMMENT ON TABLE public.speeltuinen IS 'Speeltuinen table with ligging columns removed'; 