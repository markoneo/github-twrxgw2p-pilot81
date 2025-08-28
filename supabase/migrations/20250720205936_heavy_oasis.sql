/*
  # Add Driver Authentication Tokens

  1. Changes
    - Add auth_token column to drivers table for secure direct login
    - Each driver gets a unique token for direct portal access
    - Tokens can be regenerated for security

  2. Security
    - Tokens are UUID-based for security
    - Maintains existing RLS policies
    - Allows direct driver portal access
*/

-- Add auth_token column to drivers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'auth_token'
  ) THEN
    ALTER TABLE drivers ADD COLUMN auth_token uuid DEFAULT gen_random_uuid();
  END IF;
END $$;

-- Ensure all existing drivers have tokens
UPDATE drivers SET auth_token = gen_random_uuid() WHERE auth_token IS NULL;

-- Create function to generate new driver token
CREATE OR REPLACE FUNCTION generate_driver_token(driver_uuid uuid)
RETURNS uuid AS $$
DECLARE
  new_token uuid;
BEGIN
  new_token := gen_random_uuid();
  
  UPDATE drivers 
  SET auth_token = new_token 
  WHERE id = driver_uuid;
  
  RETURN new_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_driver_token(uuid) TO authenticated;

-- Add comment for documentation
COMMENT ON COLUMN drivers.auth_token IS 'Unique token for direct driver portal access';