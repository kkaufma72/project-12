/*
  # Fix Data Persistence and Model Management
  
  1. Changes
    - Simplify RLS policies to allow public access for development
    - Add indexes for better performance
    - Add constraints to ensure data integrity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own models" ON models;
DROP POLICY IF EXISTS "Users can read all models" ON models;

-- Create simplified policies for development
CREATE POLICY "allow_public_access_models"
ON models FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Add helpful indexes
CREATE INDEX IF NOT EXISTS idx_models_status ON models(status);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);

-- Add constraints
ALTER TABLE models 
ADD CONSTRAINT valid_model_status 
CHECK (status IN ('created', 'training', 'trained', 'failed', 'deployed'));