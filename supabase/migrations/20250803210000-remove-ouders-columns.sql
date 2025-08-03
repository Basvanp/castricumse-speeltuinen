-- Remove Ouders Columns
-- This migration removes all ouders_ columns that are no longer needed

-- Drop indexes for ouders columns
DROP INDEX IF EXISTS idx_speeltuinen_ouders_picknicktafels;
DROP INDEX IF EXISTS idx_speeltuinen_ouders_horeca_buurt;
DROP INDEX IF EXISTS idx_speeltuinen_ouders_wc_buurt;

-- Drop ouders columns
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ouders_picknicktafels;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ouders_horeca_buurt;
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS ouders_wc_buurt;

-- Add comment for documentation
COMMENT ON TABLE public.speeltuinen IS 'Speeltuinen table with ouders columns removed'; 