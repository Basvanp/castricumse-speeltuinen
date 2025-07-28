-- Manually migrate this specific playground's photo to fotos array
UPDATE public.speeltuinen 
SET fotos = jsonb_build_array(
  jsonb_build_object('url', afbeelding_url)
)
WHERE naam = 'Speeltuin Dokter Teenstralaan' 
AND afbeelding_url IS NOT NULL 
AND afbeelding_url != '' 
AND (fotos = '[]'::jsonb OR fotos IS NULL);