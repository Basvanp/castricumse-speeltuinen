-- Properly add two photos to Dokter Teenstralaan
UPDATE public.speeltuinen 
SET fotos = jsonb_build_array(
  jsonb_build_object('url', 'https://kkgddsiddegqxinuepcw.supabase.co/storage/v1/object/public/speeltuin-fotos/1753729133113.jpeg'),
  jsonb_build_object('url', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80')
)
WHERE naam = 'Speeltuin Dokter Teenstralaan';