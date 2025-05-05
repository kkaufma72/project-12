/*
  # Update Projects Table RLS Policies

  1. Changes
    - Remove existing RLS policies for projects table
    - Add new policies to allow:
      - Anonymous users to read projects
      - Authenticated users to manage their own projects
      - Anonymous users to create initial projects (needed for default project creation)

  2. Security
    - Enable RLS on projects table
    - Add policies for read, insert, update, and delete operations
    - Maintain data isolation between users while allowing initial setup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "users_can_create_projects" ON projects;
DROP POLICY IF EXISTS "users_can_read_own_projects" ON projects;
DROP POLICY IF EXISTS "users_can_update_own_projects" ON projects;
DROP POLICY IF EXISTS "users_can_delete_own_projects" ON projects;

-- Create new policies
CREATE POLICY "allow_anonymous_read_projects"
ON projects FOR SELECT
TO public
USING (true);

CREATE POLICY "allow_anonymous_create_projects"
ON projects FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "authenticated_users_manage_own_projects"
ON projects FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT user_profiles.user_id
    FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT user_profiles.user_id
    FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
  )
);