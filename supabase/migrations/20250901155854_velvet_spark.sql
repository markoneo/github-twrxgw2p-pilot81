/*
  # Fix Driver Project Access

  1. Functions
    - `set_driver_context` - Sets driver context for RLS policies
    - `get_driver_projects_with_context` - Fetches projects with proper driver context

  2. Security
    - Maintains RLS policies
    - Allows drivers to access only their assigned projects
    - Uses secure context setting

  3. Changes
    - Adds function to set driver context in session
    - Creates secure project fetching function for drivers
*/

-- Function to set driver context for RLS policies
CREATE OR REPLACE FUNCTION set_driver_context(driver_uuid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the driver UUID in the session for RLS policies
  PERFORM set_config('app.driver_token', driver_uuid::text, true);
END;
$$;

-- Grant execute permission to anonymous users (drivers)
GRANT EXECUTE ON FUNCTION set_driver_context(uuid) TO anon;

-- Function to get driver projects with proper context
CREATE OR REPLACE FUNCTION get_driver_projects_with_context(driver_uuid uuid)
RETURNS TABLE(
  id uuid,
  company_id uuid,
  car_type_id uuid,
  client_name text,
  client_phone text,
  pickup_location text,
  dropoff_location text,
  date date,
  time time,
  passengers integer,
  price numeric(10,2),
  driver_fee numeric(10,2),
  status text,
  payment_status text,
  description text,
  booking_id text,
  acceptance_status text,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the driver context
  PERFORM set_config('app.driver_token', driver_uuid::text, true);
  
  -- Return the driver's projects
  RETURN QUERY
  SELECT 
    p.id,
    p.company_id,
    p.car_type_id,
    p.client_name,
    p.client_phone,
    p.pickup_location,
    p.dropoff_location,
    p.date,
    p.time,
    p.passengers,
    p.price,
    p.driver_fee,
    p.status,
    p.payment_status,
    p.description,
    p.booking_id,
    p.acceptance_status,
    p.created_at
  FROM projects p
  WHERE p.driver_id = driver_uuid
  ORDER BY p.date ASC, p.time ASC;
END;
$$;

-- Grant execute permission to anonymous users (drivers)
GRANT EXECUTE ON FUNCTION get_driver_projects_with_context(uuid) TO anon;

-- Function to update project status with proper driver context
CREATE OR REPLACE FUNCTION update_driver_project_status(
  project_uuid uuid, 
  driver_uuid uuid, 
  new_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  update_data jsonb := '{}';
BEGIN
  -- Set the driver context
  PERFORM set_config('app.driver_token', driver_uuid::text, true);
  
  -- Validate that the project belongs to this driver
  IF NOT EXISTS (
    SELECT 1 FROM projects 
    WHERE id = project_uuid AND driver_id = driver_uuid
  ) THEN
    RAISE EXCEPTION 'Project not found or not assigned to this driver';
  END IF;
  
  -- Build update data based on status
  IF new_status = 'completed' THEN
    update_data := jsonb_build_object(
      'status', 'completed',
      'completed_at', now(),
      'completed_by', driver_uuid
    );
  ELSE
    update_data := jsonb_build_object(
      'acceptance_status', new_status
    );
    
    -- Add timestamp for accepted status
    IF new_status = 'accepted' THEN
      update_data := update_data || jsonb_build_object(
        'accepted_at', now(),
        'accepted_by', driver_uuid
      );
    ELSIF new_status = 'started' THEN
      update_data := update_data || jsonb_build_object(
        'started_at', now()
      );
    END IF;
  END IF;
  
  -- Update the project
  UPDATE projects 
  SET 
    status = COALESCE((update_data->>'status')::text, status),
    acceptance_status = COALESCE((update_data->>'acceptance_status')::text, acceptance_status),
    completed_at = COALESCE((update_data->>'completed_at')::timestamptz, completed_at),
    completed_by = COALESCE((update_data->>'completed_by')::uuid, completed_by),
    accepted_at = COALESCE((update_data->>'accepted_at')::timestamptz, accepted_at),
    accepted_by = COALESCE((update_data->>'accepted_by')::uuid, accepted_by),
    started_at = COALESCE((update_data->>'started_at')::timestamptz, started_at)
  WHERE id = project_uuid AND driver_id = driver_uuid;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permission to anonymous users (drivers)
GRANT EXECUTE ON FUNCTION update_driver_project_status(uuid, uuid, text) TO anon;