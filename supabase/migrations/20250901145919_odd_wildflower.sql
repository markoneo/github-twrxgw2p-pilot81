/*
  # Fix Driver RLS Policies for Direct Access

  1. RLS Policy Updates
     - Update existing driver policies to work with auth tokens
     - Add proper token validation
     - Ensure anonymous drivers can access their projects

  2. Database Functions
     - Update get_driver_uuid_from_token function
     - Add debugging for RLS policies
*/

-- First, ensure the get_driver_uuid_from_token function exists and works correctly
CREATE OR REPLACE FUNCTION get_driver_uuid_from_token(token_value UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    driver_uuid UUID;
BEGIN
    -- Log the token being checked (for debugging)
    RAISE LOG 'Checking token: %', token_value;
    
    -- Look up driver by auth_token
    SELECT id INTO driver_uuid 
    FROM drivers 
    WHERE auth_token = token_value;
    
    -- Log the result
    RAISE LOG 'Found driver UUID: %', driver_uuid;
    
    RETURN driver_uuid;
END;
$$;

-- Drop existing driver policies that might conflict
DROP POLICY IF EXISTS "Drivers can read their own projects via token" ON projects;
DROP POLICY IF EXISTS "Drivers can update their own projects via token" ON projects;

-- Create new RLS policies for drivers accessing via token
CREATE POLICY "Drivers can read their projects via token"
ON projects
FOR SELECT
TO anon
USING (
    driver_id = get_driver_uuid_from_token(
        COALESCE(
            (current_setting('request.headers.x-driver-token', true))::uuid,
            (current_setting('app.driver_token', true))::uuid
        )
    )
);

CREATE POLICY "Drivers can update their projects via token"
ON projects
FOR UPDATE
TO anon
USING (
    driver_id = get_driver_uuid_from_token(
        COALESCE(
            (current_setting('request.headers.x-driver-token', true))::uuid,
            (current_setting('app.driver_token', true))::uuid
        )
    )
)
WITH CHECK (
    driver_id = get_driver_uuid_from_token(
        COALESCE(
            (current_setting('request.headers.x-driver-token', true))::uuid,
            (current_setting('app.driver_token', true))::uuid
        )
    )
);

-- Also allow anonymous users to read companies (needed for driver portal)
CREATE POLICY "Allow anonymous to read companies"
ON companies
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to read car_types (needed for driver portal)
CREATE POLICY "Allow anonymous to read car_types"
ON car_types
FOR SELECT
TO anon
USING (true);

-- Create a helper function for debugging driver access
CREATE OR REPLACE FUNCTION debug_driver_access(token_value UUID)
RETURNS TABLE(
    token_provided UUID,
    driver_found UUID,
    driver_name TEXT,
    can_access BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    found_driver_uuid UUID;
    found_driver_name TEXT;
BEGIN
    -- Get driver info
    SELECT id, name INTO found_driver_uuid, found_driver_name
    FROM drivers 
    WHERE auth_token = token_value;
    
    RETURN QUERY SELECT 
        token_value,
        found_driver_uuid,
        found_driver_name,
        (found_driver_uuid IS NOT NULL);
END;
$$;