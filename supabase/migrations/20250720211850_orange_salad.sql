/*
  # Add driver authentication tokens

  1. New Columns
    - `auth_token` (uuid) - Unique token for direct driver portal access
    - Update existing drivers with tokens

  2. Security
    - Generate random tokens for existing drivers
*/

-- Add auth_token column to drivers table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'auth_token'
  ) THEN
    ALTER TABLE drivers ADD COLUMN auth_token uuid DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Update existing drivers without tokens
UPDATE drivers 
SET auth_token = gen_random_uuid() 
WHERE auth_token IS NULL;

-- Create function to regenerate driver token
CREATE OR REPLACE FUNCTION generate_driver_token(driver_uuid uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_token uuid;
BEGIN
  new_token := gen_random_uuid();
  
  UPDATE drivers 
  SET auth_token = new_token 
  WHERE id = driver_uuid;
  
  RETURN new_token;
END;
$$;