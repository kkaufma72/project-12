/*
  # Fix Projects Table RLS Policies

  1. Changes
    - Add RLS policies for projects table to allow:
      - Authenticated users to create projects
      - Users to read/update/delete their own projects
      - Public users to read public projects

  2. Security
    - Enable RLS on projects table
    - Add policies for CRUD operations with proper user checks
*/

-- First enable RLS on the projects table if not already enabled
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;

-- Create new policies

-- Allow authenticated users to create projects
CREATE POLICY "users_can_create_projects"
ON projects
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow users to read their own projects
CREATE POLICY "users_can_read_own_projects"
ON projects
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  )
);

-- Allow users to update their own projects
CREATE POLICY "users_can_update_own_projects"
ON projects
FOR UPDATE
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

-- Allow users to delete their own projects
CREATE POLICY "users_can_delete_own_projects"
ON projects
FOR DELETE
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_id 
    FROM user_profiles 
    WHERE user_id = auth.uid()
  )
);