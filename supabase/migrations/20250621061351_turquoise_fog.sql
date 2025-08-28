/*
  # Add driver fee field to projects

  1. Changes
    - Add driver_fee column to projects table
    - This allows separate fees for drivers vs total price for clients
    - Field is optional (can be null)

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions needed
*/

-- Add driver_fee column to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'driver_fee'
  ) THEN
    ALTER TABLE projects ADD COLUMN driver_fee numeric(10,2);
  END IF;
END $$;