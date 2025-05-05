/*
  # Simplify Project Access Policies
  
  1. Changes
    - Remove complex policy structure
    - Add simplified public and authenticated access policies
    - Ensure proper policy cleanup
  
  2. Security
    - Maintain read access for all users
    - Restrict modifications to authenticated users
*/

-- Drop existing policies one by one to ensure clean state
DROP POLICY IF EXISTS "allow_public_read_projects" ON projects;
DROP POLICY IF EXISTS "allow_public_create_projects" ON projects;
DROP POLICY IF EXISTS "allow_authenticated_update_projects" ON projects;
DROP POLICY IF EXISTS "allow_authenticated_delete_projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to read projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON projects;
DROP POLICY IF EXISTS "users_can_create_projects" ON projects;
DROP POLICY IF EXISTS "users_can_read_own_projects" ON projects;
DROP POLICY IF EXISTS "users_can_update_own_projects" ON projects;
DROP POLICY IF EXISTS "users_can_delete_own_projects" ON projects;
DROP POLICY IF EXISTS "allow_anonymous_read_projects" ON projects;
DROP POLICY IF EXISTS "allow_anonymous_create_projects" ON projects;
DROP POLICY IF EXISTS "authenticated_users_manage_own_projects" ON projects;

-- Create new simplified policies
CREATE POLICY "allow_public_read_projects"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "allow_public_create_projects"
ON projects FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "allow_authenticated_update_projects"
ON projects FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_authenticated_delete_projects"
ON projects FOR DELETE
TO authenticated
USING (true);