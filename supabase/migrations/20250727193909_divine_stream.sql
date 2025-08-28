/*
  # Add completion tracking columns to projects

  1. Changes
    - Add completed_at column to projects table for tracking completion timestamp
    - Add completed_by column to projects table for tracking who completed the project
    - Both columns are optional (nullable)

  2. Security
    - Maintains existing RLS policies
    - No changes to permissions needed
*/

-- Add completed_at column to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'completed_at'
  ) THEN
    ALTER TABLE projects ADD COLUMN completed_at timestamptz;
  END IF;
END $$;

-- Add completed_by column to projects table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'completed_by'
  ) THEN
    ALTER TABLE projects ADD COLUMN completed_by uuid;
  END IF;
END $$;

-- Add comments for documentation
COMMENT ON COLUMN projects.completed_at IS 'Timestamp when the project was completed';
COMMENT ON COLUMN projects.completed_by IS 'UUID of the driver who completed the project';