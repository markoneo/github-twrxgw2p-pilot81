/*
  # Add Driver Access Policies for Direct Links

  1. Changes
    - Add RLS policies to allow drivers to access their own projects via auth token
    - Create helper function to get driver ID from token
    - Enable anonymous access for drivers using valid tokens

  2. Security
    - Only allows access to projects assigned to the specific driver
    - Token-based authentication for driver portal access
    - Maintains security while enabling direct driver access
*/

-- Create function to get driver UUID from auth token
CREATE OR REPLACE FUNCTION get_driver_uuid_from_token(token_value uuid)
RETURNS uuid
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  driver_uuid uuid;
BEGIN
  -- Get driver UUID if token is valid and driver is active
  SELECT id INTO driver_uuid
  FROM drivers
  WHERE auth_token = token_value
    AND status != 'offline';
    
  RETURN driver_uuid;
END;
$$;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION get_driver_uuid_from_token(uuid) TO anon;

-- Add policy to allow drivers to read their own projects via token
CREATE POLICY "Drivers can read their own projects via token"
  ON projects
  FOR SELECT
  TO anon
  USING (
    driver_id = get_driver_uuid_from_token(
      COALESCE(
        current_setting('request.headers.x-driver-token', true)::uuid,
        current_setting('app.driver_token', true)::uuid
      )
    )
  );

-- Add policy to allow drivers to update their own project status via token
CREATE POLICY "Drivers can update their own projects via token"
  ON projects
  FOR UPDATE
  TO anon
  USING (
    driver_id = get_driver_uuid_from_token(
      COALESCE(
        current_setting('request.headers.x-driver-token', true)::uuid,
        current_setting('app.driver_token', true)::uuid
      )
    )
  )
  WITH CHECK (
    driver_id = get_driver_uuid_from_token(
      COALESCE(
        current_setting('request.headers.x-driver-token', true)::uuid,
        current_setting('app.driver_token', true)::uuid
      )
    )
  );

-- Allow anonymous users to read companies and car_types (needed for driver portal)
CREATE POLICY "Allow anonymous to read companies"
  ON companies
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous to read car_types"
  ON car_types
  FOR SELECT
  TO anon
  USING (true);