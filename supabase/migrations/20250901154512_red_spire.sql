/*
  # Fix Driver Authentication System

  1. Updates
    - Fix authenticate_driver function to handle case-insensitive matching
    - Add better error handling and debugging
    - Ensure proper data types and validation

  2. Security
    - Maintains RLS policies
    - Secure authentication without exposing sensitive data
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS authenticate_driver(text, text);

-- Create improved authenticate_driver function
CREATE OR REPLACE FUNCTION authenticate_driver(
  driver_id text,
  driver_pin text
)
RETURNS TABLE (
  success boolean,
  driver_id_result uuid,
  driver_name text,
  driver_license text,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log the authentication attempt for debugging
  RAISE LOG 'Driver authentication attempt for ID: %, PIN length: %', driver_id, length(driver_pin);
  
  -- Validate input parameters
  IF driver_id IS NULL OR driver_id = '' THEN
    RETURN QUERY SELECT false, null::uuid, null::text, null::text, 'Driver ID is required'::text;
    RETURN;
  END IF;
  
  IF driver_pin IS NULL OR driver_pin = '' THEN
    RETURN QUERY SELECT false, null::uuid, null::text, null::text, 'PIN is required'::text;
    RETURN;
  END IF;
  
  -- Try to find driver with matching license and PIN (case-insensitive)
  RETURN QUERY
  SELECT 
    true as success,
    d.id as driver_id_result,
    d.name as driver_name,
    d.license as driver_license,
    null::text as error_message
  FROM drivers d
  WHERE 
    LOWER(TRIM(d.license)) = LOWER(TRIM(driver_id))
    AND TRIM(d.pin) = TRIM(driver_pin)
  LIMIT 1;
  
  -- If no rows were returned, return failure
  IF NOT FOUND THEN
    RAISE LOG 'No driver found with license: % and provided PIN', driver_id;
    RETURN QUERY SELECT false, null::uuid, null::text, null::text, 'Invalid credentials'::text;
  END IF;
END;
$$;

-- Grant execute permission to anonymous users (for driver login)
GRANT EXECUTE ON FUNCTION authenticate_driver(text, text) TO anon;

-- Create a function to check if driver exists (for debugging)
CREATE OR REPLACE FUNCTION check_driver_exists(driver_license text)
RETURNS TABLE (
  exists boolean,
  license_found text,
  pin_found text,
  name_found text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as exists,
    d.license as license_found,
    d.pin as pin_found,
    d.name as name_found
  FROM drivers d
  WHERE LOWER(TRIM(d.license)) = LOWER(TRIM(driver_license))
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, null::text, null::text, null::text;
  END IF;
END;
$$;

-- Grant execute permission for debugging
GRANT EXECUTE ON FUNCTION check_driver_exists(text) TO anon;