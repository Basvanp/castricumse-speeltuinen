-- Fix function search path for security
DROP TRIGGER IF EXISTS update_speeltuinen_updated_at ON public.speeltuinen;
DROP FUNCTION IF EXISTS public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate trigger
CREATE TRIGGER update_speeltuinen_updated_at
BEFORE UPDATE ON public.speeltuinen
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();