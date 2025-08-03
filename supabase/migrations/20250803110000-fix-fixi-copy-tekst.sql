-- Fix fixi_copy_tekst column if it doesn't exist
-- This migration ensures the fixi_copy_tekst column is properly configured

-- Add fixi_copy_tekst column if it doesn't exist
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS fixi_copy_tekst TEXT;

-- Add comment for documentation
COMMENT ON COLUMN public.speeltuinen.fixi_copy_tekst IS 'Fixi copy text for reporting broken equipment';

-- Update existing rows to have a default fixi_copy_tekst if it's NULL
UPDATE public.speeltuinen 
SET fixi_copy_tekst = CONCAT('Kapot speeltoestel bij ', naam, ' (geen GPS-coördinaten beschikbaar)')
WHERE fixi_copy_tekst IS NULL;

-- Create index for performance if needed
CREATE INDEX IF NOT EXISTS idx_speeltuinen_fixi_copy_tekst ON public.speeltuinen(fixi_copy_tekst); 