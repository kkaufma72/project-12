/*
  # Fix Projects RLS Policies

  1. Changes
    - Enable RLS on projects table
    - Add policies to allow authenticated users to:
      - Create projects
      - Read projects
      - Update their own projects
      - Delete their own projects

  2. Security
    - Only authenticated users can create projects
    - Users can only read/update/delete their own projects
*/

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "users_can_create_projects" ON projects;
DROP POLICY IF EXISTS "users_can_read_projects" ON projects;
DROP POLICY IF EXISTS "users_can_update_own_projects" ON projects;
DROP POLICY IF EXISTS "users_can_delete_own_projects" ON projects;

-- Create new policies
CREATE POLICY "users_can_create_projects"
ON projects FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "users_can_read_own_projects"
ON projects FOR SELECT
TO authenticated
USING (auth.uid() IN (
  SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "users_can_update_own_projects"
ON projects FOR UPDATE
TO authenticated
USING (auth.uid() IN (
  SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
))
WITH CHECK (auth.uid() IN (
  SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
));

CREATE POLICY "users_can_delete_own_projects"
ON projects FOR DELETE
TO authenticated
USING (auth.uid() IN (
  SELECT user_id FROM user_profiles WHERE user_id = auth.uid()
));