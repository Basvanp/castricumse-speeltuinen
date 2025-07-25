-- Create enum for speeltuin grootte
CREATE TYPE speeltuin_grootte AS ENUM ('klein', 'middel', 'groot');

-- Add new columns to speeltuinen table
ALTER TABLE public.speeltuinen 
ADD COLUMN ondergrond_kunstgras boolean DEFAULT false,
ADD COLUMN grootte speeltuin_grootte DEFAULT 'middel',
ADD COLUMN heeft_horeca boolean DEFAULT false,
ADD COLUMN heeft_toilet boolean DEFAULT false,
ADD COLUMN heeft_parkeerplaats boolean DEFAULT false;