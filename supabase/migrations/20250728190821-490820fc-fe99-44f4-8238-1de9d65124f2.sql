-- Add a second test photo to Dokter Teenstralaan to test the carousel
UPDATE public.speeltuinen 
SET fotos = fotos || jsonb_build_array(
  jsonb_build_object('url', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80')
)
WHERE naam = 'Speeltuin Dokter Teenstralaan';