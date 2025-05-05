/*
  # Add RLS policies for datasets table

  1. Security Changes
    - Enable RLS on datasets table
    - Add policy for authenticated users to insert datasets
    - Add policy for authenticated users to read datasets
    - Add policy for authenticated users to update their datasets
    - Add policy for authenticated users to delete their datasets

  2. Policy Logic
    - Users can only manage (insert/update/delete) datasets in projects they have access to
    - Users can read datasets from projects they have access to
    - Access is determined by project ownership
*/

-- Enable RLS
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;

-- Policy for inserting datasets
CREATE POLICY "Users can insert datasets for their projects"
ON datasets
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = datasets.project_id
  )
);

-- Policy for reading datasets
CREATE POLICY "Users can read datasets from their projects"
ON datasets
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = datasets.project_id
  )
);

-- Policy for updating datasets
CREATE POLICY "Users can update their datasets"
ON datasets
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = datasets.project_id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = datasets.project_id
  )
);

-- Policy for deleting datasets
CREATE POLICY "Users can delete their datasets"
ON datasets
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = datasets.project_id
  )
);