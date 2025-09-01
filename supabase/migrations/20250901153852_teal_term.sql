/*
  # Create secure driver authentication function

  1. New Functions
    - `authenticate_driver(license_id, pin_code)` - Securely authenticates driver credentials
    
  2. Security
    - Function allows anonymous access for driver authentication
    - Only returns success/failure and basic driver info (no sensitive data)
    - Validates license and PIN against drivers table
*/

-- Create a secure function for driver authentication that can be called by anonymous users
CREATE OR REPLACE FUNCTION authenticate_driver(
  license_id text,
  pin_code text
)
RETURNS TABLE(
  success boolean,
  driver_id uuid,
  driver_name text,
  driver_license text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Try to find the driver with matching license and PIN
  RETURN QUERY
  SELECT 
    true as success,
    d.id as driver_id,
    d.name as driver_name,
    d.license as driver_license
  FROM drivers d
  WHERE d.license = license_id 
    AND d.pin = pin_code
    AND d.status != 'offline'
  LIMIT 1;
  
  -- If no rows returned, the authentication failed
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      false as success,
      null::uuid as driver_id,
      null::text as driver_name,
      null::text as driver_license;
  END IF;
END;
$$;

-- Grant execute permission to anonymous users for driver authentication
GRANT EXECUTE ON FUNCTION authenticate_driver(text, text) TO anon;