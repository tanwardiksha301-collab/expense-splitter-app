/*
  # Create Expense Splitter Schema

  1. New Tables
    - `participants`
      - `id` (uuid, primary key)
      - `name` (text) - Participant's name
      - `created_at` (timestamptz) - When participant was added
    
    - `expenses`
      - `id` (uuid, primary key)
      - `description` (text) - What the expense was for
      - `total_amount` (numeric) - Total amount spent
      - `created_at` (timestamptz) - When expense was created
    
    - `expense_participants`
      - `id` (uuid, primary key)
      - `expense_id` (uuid) - Foreign key to expenses
      - `participant_id` (uuid) - Foreign key to participants
      - `amount_owed` (numeric) - How much this participant owes
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on all tables
    - Add public access policies for demonstration purposes
    - In production, these should be restricted to authenticated users
*/

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount > 0),
  created_at timestamptz DEFAULT now()
);

-- Create expense_participants junction table
CREATE TABLE IF NOT EXISTS expense_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id uuid NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  amount_owed numeric(10, 2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(expense_id, participant_id)
);

-- Enable RLS
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demonstration)
CREATE POLICY "Anyone can view participants"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert participants"
  ON participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update participants"
  ON participants FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete participants"
  ON participants FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view expenses"
  ON expenses FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert expenses"
  ON expenses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update expenses"
  ON expenses FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete expenses"
  ON expenses FOR DELETE
  USING (true);

CREATE POLICY "Anyone can view expense participants"
  ON expense_participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert expense participants"
  ON expense_participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update expense participants"
  ON expense_participants FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete expense participants"
  ON expense_participants FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expense_participants_expense_id ON expense_participants(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_participants_participant_id ON expense_participants(participant_id);