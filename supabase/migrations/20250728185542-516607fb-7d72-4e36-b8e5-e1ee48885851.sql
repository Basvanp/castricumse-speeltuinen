-- Add fotos column to support multiple photos per playground
ALTER TABLE public.speeltuinen 
ADD COLUMN fotos jsonb DEFAULT '[]'::jsonb;

-- Create an index on the fotos column for better performance
CREATE INDEX idx_speeltuinen_fotos ON public.speeltuinen USING GIN(fotos);

-- Add a comment to explain the structure
COMMENT ON COLUMN public.speeltuinen.fotos IS 'Array of photo objects with structure: [{"url": "string", "naam": "optional_string"}]';