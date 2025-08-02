-- Fix search path security issue for update_site_settings_updated_at function
-- Drop existing function and recreate with explicit search path

DROP FUNCTION IF EXISTS update_site_settings_updated_at();

-- Recreate function with explicit search path for security
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Recreate trigger (it should automatically use the new function)
DROP TRIGGER IF EXISTS trigger_update_site_settings_updated_at ON site_settings;
CREATE TRIGGER trigger_update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at(); 