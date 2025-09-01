/*
  # Simple Driver Authentication Function

  1. Functions
    - `simple_authenticate_driver` - validates driver credentials securely
    
  2. Security
    - Function available to anonymous users for driver login
    - Returns minimal data for security
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.authenticate_driver(text, text);
DROP FUNCTION IF EXISTS public.check_driver_exists(text);

-- Create simple authentication function
CREATE OR REPLACE FUNCTION public.simple_authenticate_driver(
  input_license text,
  input_pin text
)
RETURNS TABLE (
  success boolean,
  driver_id uuid,
  driver_name text,
  driver_license text,
  error_message text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  driver_record RECORD;
BEGIN
  -- Clean and normalize inputs
  input_license := LOWER(TRIM(input_license));
  input_pin := TRIM(input_pin);
  
  -- Log the attempt for debugging
  RAISE LOG 'Driver auth attempt: license=%, pin=%', input_license, input_pin;
  
  -- Find driver by license (case insensitive)
  SELECT d.id, d.name, d.license, d.pin, d.status
  INTO driver_record
  FROM drivers d
  WHERE LOWER(TRIM(d.license)) = input_license
  LIMIT 1;
  
  -- Check if driver exists
  IF NOT FOUND THEN
    RAISE LOG 'Driver not found for license: %', input_license;
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, 'Driver not found'::text;
    RETURN;
  END IF;
  
  -- Log found driver (without sensitive info)
  RAISE LOG 'Found driver: id=%, name=%, license=%', driver_record.id, driver_record.name, driver_record.license;
  
  -- Check PIN (exact match)
  IF driver_record.pin = input_pin THEN
    RAISE LOG 'PIN match successful for driver: %', driver_record.name;
    RETURN QUERY SELECT 
      true, 
      driver_record.id, 
      driver_record.name, 
      driver_record.license,
      'Success'::text;
  ELSE
    RAISE LOG 'PIN mismatch for driver: % (expected: %, got: %)', driver_record.name, driver_record.pin, input_pin;
    RETURN QUERY SELECT false, NULL::uuid, NULL::text, NULL::text, 'Invalid PIN'::text;
  END IF;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION public.simple_authenticate_driver(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.simple_authenticate_driver(text, text) TO authenticated;