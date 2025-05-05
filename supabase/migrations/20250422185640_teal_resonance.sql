/*
  # Fix Models Table RLS Policies

  1. Changes
    - Add RLS policy to allow authenticated users to insert new models
    - Add RLS policy to allow users to manage their own models
    - Add RLS policy to allow users to read all models

  2. Security
    - Ensures users can only modify their own models
    - Allows read access to all authenticated users
    - Requires authentication for all operations
*/

-- First ensure RLS is enabled
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to manage models" ON models;

-- Add new comprehensive RLS policies
CREATE POLICY "Users can manage their own models"
ON models
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Allow all authenticated users to read models
CREATE POLICY "Users can read all models"
ON models
FOR SELECT
TO authenticated
USING (true);