/*
  # Create driver projects access function

  1. New Functions
    - `get_driver_projects_with_context()` - Retrieves projects for a specific driver with proper RLS context
    - `update_driver_project_status()` - Updates project status with driver context

  2. Security
    - Functions use SECURITY DEFINER to bypass RLS while maintaining security
    - Only return/update data for the specified driver
    - Grant execute permissions to anonymous users for driver portal access
*/

-- Function to get driver projects with proper context
CREATE OR REPLACE FUNCTION public.get_driver_projects_with_context(driver_uuid uuid)
RETURNS SETOF public.projects
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the driver context for RLS policies
  PERFORM set_config('app.driver_id', driver_uuid::text, TRUE);
  
  -- Return projects assigned to this driver
  RETURN QUERY
  SELECT *
  FROM public.projects
  WHERE driver_id = driver_uuid
    AND status = 'active'
  ORDER BY date ASC, time ASC;
END;
$$;

-- Function to update driver project status
CREATE OR REPLACE FUNCTION public.update_driver_project_status(
  project_uuid uuid,
  driver_uuid uuid,
  new_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set the driver context for RLS policies
  PERFORM set_config('app.driver_id', driver_uuid::text, TRUE);
  
  -- Update the project if it belongs to this driver
  IF new_status = 'completed' THEN
    UPDATE public.projects
    SET 
      status = 'completed',
      completed_at = NOW(),
      completed_by = driver_uuid
    WHERE id = project_uuid 
      AND driver_id = driver_uuid;
  ELSE
    UPDATE public.projects
    SET 
      acceptance_status = new_status,
      accepted_at = CASE WHEN new_status = 'accepted' THEN NOW() ELSE accepted_at END,
      accepted_by = CASE WHEN new_status = 'accepted' THEN driver_uuid ELSE accepted_by END,
      started_at = CASE WHEN new_status = 'started' THEN NOW() ELSE started_at END
    WHERE id = project_uuid 
      AND driver_id = driver_uuid;
  END IF;
  
  -- Return true if a row was updated
  RETURN FOUND;
END;
$$;

-- Grant execute permissions to anonymous users (for driver portal)
GRANT EXECUTE ON FUNCTION public.get_driver_projects_with_context(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.update_driver_project_status(uuid, uuid, text) TO anon;