/*
  # Fix Payment Functions and Constraints

  1. Changes
    - Add mark_payment_paid RPC function
    - Add total_earnings column to drivers table
    - Ensure payment constraints are properly set
    - Add triggers for automatic earnings updates

  2. Security
    - Maintain RLS policies
    - Add security definer functions for better control
*/

-- Add total_earnings column to drivers if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'drivers' AND column_name = 'total_earnings'
  ) THEN
    ALTER TABLE drivers ADD COLUMN total_earnings numeric(10,2) DEFAULT 0;
  END IF;
END $$;

-- Drop the existing future_date constraint if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'future_date' AND conrelid = 'payments'::regclass
  ) THEN
    ALTER TABLE payments DROP CONSTRAINT future_date;
  END IF;
END $$;

-- Check and update constraints only if they don't exist
DO $$
BEGIN
  -- Check positive_amount constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'positive_amount' AND conrelid = 'payments'::regclass
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT positive_amount CHECK (amount >= 0);
  END IF;
  
  -- Check valid_status constraint
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'valid_status' AND conrelid = 'payments'::regclass
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT valid_status CHECK (status = ANY (ARRAY['pending', 'paid']));
  END IF;
END $$;

-- Create a trigger function to update driver earnings when payment status changes
CREATE OR REPLACE FUNCTION update_driver_earnings()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update earnings when status changes to 'paid'
  IF NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid') THEN
    -- Update the driver's total earnings
    UPDATE drivers
    SET total_earnings = COALESCE(total_earnings, 0) + NEW.amount
    WHERE id = NEW.driver_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger function to automatically set user_id from auth.uid()
CREATE OR REPLACE FUNCTION set_payment_user_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_id := auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the mark_payment_paid function
CREATE OR REPLACE FUNCTION mark_payment_paid(payment_id uuid)
RETURNS SETOF payments AS $$
BEGIN
  RETURN QUERY
  UPDATE payments
  SET 
    status = 'paid',
    completed_at = NOW()
  WHERE id = payment_id
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace triggers
DROP TRIGGER IF EXISTS set_payments_user_id ON payments;
CREATE TRIGGER set_payments_user_id
  BEFORE INSERT ON payments
  FOR EACH ROW
  EXECUTE FUNCTION set_payment_user_id();

DROP TRIGGER IF EXISTS update_driver_earnings_on_payment ON payments;
CREATE TRIGGER update_driver_earnings_on_payment
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_driver_earnings();

-- Ensure policy exists (do nothing if it already exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'payments' AND policyname = 'Users can manage their own payments'
  ) THEN
    CREATE POLICY "Users can manage their own payments"
      ON payments
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION mark_payment_paid(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION update_driver_earnings() TO authenticated;
GRANT EXECUTE ON FUNCTION set_payment_user_id() TO authenticated;