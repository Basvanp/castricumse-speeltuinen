-- Fix foreign key constraint to allow playground deletion
-- First, check if there's an existing foreign key constraint and drop it
DO $$ 
BEGIN
    -- Drop existing foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%speeltuin_id%' 
        AND table_name = 'analytics_events'
        AND constraint_type = 'FOREIGN KEY'
    ) THEN
        ALTER TABLE analytics_events DROP CONSTRAINT IF EXISTS analytics_events_speeltuin_id_fkey;
    END IF;
END $$;

-- Add new foreign key constraint with ON DELETE SET NULL
ALTER TABLE analytics_events 
ADD CONSTRAINT analytics_events_speeltuin_id_fkey 
FOREIGN KEY (speeltuin_id) 
REFERENCES speeltuinen(id) 
ON DELETE SET NULL;