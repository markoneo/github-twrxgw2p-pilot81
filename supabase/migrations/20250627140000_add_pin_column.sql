/*
  # Add PIN column to drivers table

  1. Changes
    - Add PIN field to drivers table for authentication
    - Set default PIN value for existing drivers
    - Update RLS policies if needed

  2. Security
    - PIN is used for driver portal authentication
    - Maintains existing user access controls
*/

-- Add PIN column to drivers table
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS pin text DEFAULT '1234';

-- Update any existing drivers without PIN to have default PIN
UPDATE drivers SET pin = '1234' WHERE pin IS NULL;

-- Add comment to document the PIN field
COMMENT ON COLUMN drivers.pin IS 'Driver portal authentication PIN (4-6 digits)';