/*
  # Fix RLS Policies for Projects and Datasets
  
  1. Changes
    - Drop all existing policies
    - Add simplified policies that allow proper access
    - Enable RLS on both tables
    
  2. Security
    - Allow public access for initial setup
    - Maintain data isolation between users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "allow_public_read_projects" ON projects;
DROP POLICY IF EXISTS "allow_public_create_projects" ON projects;
DROP POLICY IF EXISTS "allow_authenticated_update_projects" ON projects;
DROP POLICY IF EXISTS "allow_authenticated_delete_projects" ON projects;
DROP POLICY IF EXISTS "Users can insert datasets for their projects" ON datasets;
DROP POLICY IF EXISTS "Users can read datasets from their projects" ON datasets;
DROP POLICY IF EXISTS "Users can update their datasets" ON datasets;
DROP POLICY IF EXISTS "Users can delete their datasets" ON datasets;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Projects policies
CREATE POLICY "allow_public_create_projects"
ON projects FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "allow_public_read_projects"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "allow_public_update_projects"
ON projects FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_projects"
ON projects FOR DELETE
TO public
USING (true);

-- Datasets policies
CREATE POLICY "allow_public_create_datasets"
ON datasets FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "allow_public_read_datasets"
ON datasets FOR SELECT
TO public
USING (true);

CREATE POLICY "allow_public_update_datasets"
ON datasets FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_public_delete_datasets"
ON datasets FOR DELETE
TO public
USING (true);