-- Fix Badge Constraint Violation
-- This migration fixes the badge constraint violation by updating existing data

-- 1. First, let's see what badge values currently exist
-- (This is for debugging - you can run this separately to see the current values)
-- SELECT DISTINCT badge FROM public.speeltuinen WHERE badge IS NOT NULL;

-- 2. Update any invalid badge values to 'geen'
UPDATE public.speeltuinen 
SET badge = 'geen' 
WHERE badge IS NULL 
   OR badge NOT IN ('rolstoelvriendelijk', 'babytoegankelijk', 'natuurspeeltuin', 'waterspeeltuin', 'avonturenspeeltuin', 'toiletten', 'parkeren', 'horeca', 'geen');

-- 3. Now add the constraint safely
ALTER TABLE public.speeltuinen 
ADD CONSTRAINT check_badge CHECK (badge IN ('rolstoelvriendelijk', 'babytoegankelijk', 'natuurspeeltuin', 'waterspeeltuin', 'avonturenspeeltuin', 'toiletten', 'parkeren', 'horeca', 'geen'));

-- 4. Also add the grootte constraint if it doesn't exist
ALTER TABLE public.speeltuinen 
ADD CONSTRAINT check_grootte CHECK (grootte IN ('klein', 'middel', 'groot')); 