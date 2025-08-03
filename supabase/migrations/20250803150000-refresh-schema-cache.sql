-- Refresh Schema Cache and Ensure All Columns Exist
-- This migration forces a schema cache refresh and ensures all columns are properly recognized

-- 1. Force a schema cache refresh by making a small change to the table
-- This will trigger Supabase to refresh its internal schema cache
ALTER TABLE public.speeltuinen 
ADD COLUMN IF NOT EXISTS schema_cache_refresh TIMESTAMP DEFAULT now();

-- 2. Double-check that all required columns exist
DO $$
BEGIN
    -- Check if leeftijd_0_2_jaar exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'leeftijd_0_2_jaar'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN leeftijd_0_2_jaar BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if leeftijd_2_6_jaar exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'leeftijd_2_6_jaar'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN leeftijd_2_6_jaar BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if leeftijd_6_12_jaar exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'leeftijd_6_12_jaar'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN leeftijd_6_12_jaar BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if leeftijd_12_plus_jaar exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'leeftijd_12_plus_jaar'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN leeftijd_12_plus_jaar BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if toegang_zichtbaar_omheind exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'toegang_zichtbaar_omheind'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN toegang_zichtbaar_omheind BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if toegang_zonder_drempel exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'toegang_zonder_drempel'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN toegang_zonder_drempel BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if speeltoestellen_voor_beperking exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'speeltoestellen_voor_beperking'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN speeltoestellen_voor_beperking BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if veiligheid_in_zicht_huizen exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'veiligheid_in_zicht_huizen'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN veiligheid_in_zicht_huizen BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if veiligheid_rustige_ligging exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'veiligheid_rustige_ligging'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN veiligheid_rustige_ligging BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if veiligheid_verkeersluw exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'veiligheid_verkeersluw'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN veiligheid_verkeersluw BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ouders_picknicktafels exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ouders_picknicktafels'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ouders_picknicktafels BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ouders_horeca_buurt exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ouders_horeca_buurt'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ouders_horeca_buurt BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ouders_wc_buurt exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ouders_wc_buurt'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ouders_wc_buurt BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ligging_woonwijk exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ligging_woonwijk'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ligging_woonwijk BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ligging_bos_natuur exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ligging_bos_natuur'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ligging_bos_natuur BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ligging_bij_school exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ligging_bij_school'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ligging_bij_school BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ligging_fietspad exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ligging_fietspad'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ligging_fietspad BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if ligging_parkeerplaats exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'ligging_parkeerplaats'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN ligging_parkeerplaats BOOLEAN DEFAULT false NOT NULL;
    END IF;

    -- Check if toegevoegd_door exists, if not add it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'speeltuinen' 
        AND column_name = 'toegevoegd_door'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.speeltuinen ADD COLUMN toegevoegd_door UUID;
    END IF;

END $$;

-- 3. Update all existing rows to have proper default values
UPDATE public.speeltuinen SET
  leeftijd_0_2_jaar = COALESCE(leeftijd_0_2_jaar, false),
  leeftijd_2_6_jaar = COALESCE(leeftijd_2_6_jaar, false),
  leeftijd_6_12_jaar = COALESCE(leeftijd_6_12_jaar, false),
  leeftijd_12_plus_jaar = COALESCE(leeftijd_12_plus_jaar, false),
  toegang_zichtbaar_omheind = COALESCE(toegang_zichtbaar_omheind, false),
  toegang_zonder_drempel = COALESCE(toegang_zonder_drempel, false),
  speeltoestellen_voor_beperking = COALESCE(speeltoestellen_voor_beperking, false),
  veiligheid_in_zicht_huizen = COALESCE(veiligheid_in_zicht_huizen, false),
  veiligheid_rustige_ligging = COALESCE(veiligheid_rustige_ligging, false),
  veiligheid_verkeersluw = COALESCE(veiligheid_verkeersluw, false),
  ouders_picknicktafels = COALESCE(ouders_picknicktafels, false),
  ouders_horeca_buurt = COALESCE(ouders_horeca_buurt, false),
  ouders_wc_buurt = COALESCE(ouders_wc_buurt, false),
  ligging_woonwijk = COALESCE(ligging_woonwijk, false),
  ligging_bos_natuur = COALESCE(ligging_bos_natuur, false),
  ligging_bij_school = COALESCE(ligging_bij_school, false),
  ligging_fietspad = COALESCE(ligging_fietspad, false),
  ligging_parkeerplaats = COALESCE(ligging_parkeerplaats, false);

-- 4. Remove the temporary column
ALTER TABLE public.speeltuinen DROP COLUMN IF EXISTS schema_cache_refresh; 