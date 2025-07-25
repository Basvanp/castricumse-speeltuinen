-- Create the speeltuinen table
CREATE TABLE public.speeltuinen (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  naam TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  omschrijving TEXT,
  afbeelding_url TEXT,
  
  -- Voorzieningen (facilities)
  heeft_glijbaan BOOLEAN DEFAULT false,
  heeft_schommel BOOLEAN DEFAULT false,
  heeft_zandbak BOOLEAN DEFAULT false,
  heeft_kabelbaan BOOLEAN DEFAULT false,
  heeft_bankjes BOOLEAN DEFAULT false,
  heeft_sportveld BOOLEAN DEFAULT false,
  
  -- Ondergrond (surface)
  ondergrond_zand BOOLEAN DEFAULT false,
  ondergrond_gras BOOLEAN DEFAULT false,
  ondergrond_rubber BOOLEAN DEFAULT false,
  ondergrond_tegels BOOLEAN DEFAULT false,
  
  -- Leeftijd (age groups)
  geschikt_peuters BOOLEAN DEFAULT false,
  geschikt_kleuters BOOLEAN DEFAULT false,
  geschikt_kinderen BOOLEAN DEFAULT false,
  
  -- Overig (other features)
  is_omheind BOOLEAN DEFAULT false,
  heeft_schaduw BOOLEAN DEFAULT false,
  is_rolstoeltoegankelijk BOOLEAN DEFAULT false,
  
  -- Fixi integration
  fixi_copy_tekst TEXT,
  
  -- Metadata
  toegevoegd_door UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.speeltuinen ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Speeltuinen zijn publiek zichtbaar" 
ON public.speeltuinen 
FOR SELECT 
USING (true);

-- Create policies for authenticated users to manage speeltuinen
CREATE POLICY "Geauthenticeerde gebruikers kunnen speeltuinen toevoegen" 
ON public.speeltuinen 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Geauthenticeerde gebruikers kunnen speeltuinen updaten" 
ON public.speeltuinen 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Geauthenticeerde gebruikers kunnen speeltuinen verwijderen" 
ON public.speeltuinen 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for playground images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('speeltuin-fotos', 'speeltuin-fotos', true);

-- Create storage policies for speeltuin photos
CREATE POLICY "Speeltuin fotos zijn publiek zichtbaar" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'speeltuin-fotos');

CREATE POLICY "Geauthenticeerde gebruikers kunnen fotos uploaden" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'speeltuin-fotos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Geauthenticeerde gebruikers kunnen fotos updaten" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'speeltuin-fotos' AND auth.uid() IS NOT NULL);

CREATE POLICY "Geauthenticeerde gebruikers kunnen fotos verwijderen" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'speeltuin-fotos' AND auth.uid() IS NOT NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_speeltuinen_updated_at
BEFORE UPDATE ON public.speeltuinen
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
INSERT INTO public.speeltuinen (
  naam, latitude, longitude, omschrijving,
  heeft_glijbaan, heeft_schommel, heeft_zandbak,
  ondergrond_zand, ondergrond_gras,
  geschikt_peuters, geschikt_kleuters,
  is_omheind, heeft_schaduw,
  fixi_copy_tekst
) VALUES 
(
  'Speeltuin Duintuinstraat',
  52.548712, 4.669821,
  'Leuke speeltuin met glijbaan en schommels in een groene omgeving.',
  true, true, true,
  true, true,
  true, true,
  true, true,
  'Kapot speeltoestel bij speeltuin Duintuinstraat, 52.548712, 4.669821'
),
(
  'Speeltuin Hogeweg', 
  52.551234, 4.671234,
  'Moderne speeltuin met kabelbaan en sportfaciliteiten.',
  true, false, false,
  false, false,
  false, true,
  false, false,
  'Kapot speeltoestel bij speeltuin Hogeweg, 52.551234, 4.671234'
);