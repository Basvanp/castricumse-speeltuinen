-- Make latitude and longitude nullable to allow photo uploads without GPS coordinates
ALTER TABLE public.speeltuinen 
ALTER COLUMN latitude DROP NOT NULL,
ALTER COLUMN longitude DROP NOT NULL;