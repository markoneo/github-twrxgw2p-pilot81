/*
  # Add last_login column to drivers table

  1. Changes
    - Add last_login column to drivers table for tracking login activity
    - Column is optional (nullable) with timestamptz type
    - No default value needed as it will be set on login

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions needed
*/

-- Add last_login column to drivers table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'last_login'
  ) THEN
    ALTER TABLE drivers ADD COLUMN last_login timestamptz;
  END IF;
END $$;

-- Add comment for documentation
COMMENT ON COLUMN drivers.last_login IS 'Timestamp of driver''s last portal login';