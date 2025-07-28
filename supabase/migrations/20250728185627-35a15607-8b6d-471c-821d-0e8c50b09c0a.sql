-- Migrate existing single photos to the new fotos array structure
UPDATE public.speeltuinen 
SET fotos = jsonb_build_array(
  jsonb_build_object('url', afbeelding_url)
)
WHERE afbeelding_url IS NOT NULL 
AND afbeelding_url != '' 
AND (fotos = '[]'::jsonb OR fotos IS NULL);