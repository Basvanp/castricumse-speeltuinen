-- Add new facility columns to speeltuinen table
ALTER TABLE public.speeltuinen 
ADD COLUMN heeft_basketbalveld boolean DEFAULT false,
ADD COLUMN heeft_wipwap boolean DEFAULT false,
ADD COLUMN heeft_duikelrek boolean DEFAULT false;