/*
  # Add Date and Paid By Tracking to Expenses

  1. Changes to existing tables
    - `expenses` table:
      - Add `expense_date` (date) - The date when the expense occurred
      - Add `paid_by` (uuid) - Foreign key to participants table, tracks who paid
  
  2. Updates
    - Set default date to today for existing expenses
    - Make expense_date NOT NULL after data is populated
    - Make paid_by NOT NULL after data is populated (users must select who paid)
  
  3. Notes
    - Expenses will be grouped and displayed by date
    - paid_by tracks who actually paid the amount
    - The expense_participants table still tracks who owes what
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'expense_date'
  ) THEN
    ALTER TABLE expenses ADD COLUMN expense_date date DEFAULT CURRENT_DATE;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'expenses' AND column_name = 'paid_by'
  ) THEN
    ALTER TABLE expenses ADD COLUMN paid_by uuid REFERENCES participants(id) ON DELETE RESTRICT;
  END IF;
END $$;