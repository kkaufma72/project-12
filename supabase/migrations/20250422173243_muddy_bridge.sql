/*
  # Reset Schema with Improved Structure
  
  1. New Tables
    - projects: Core project information with improved constraints
    - datasets: Dataset management with proper indexing
    - models: ML model tracking with enhanced metadata
  
  2. Security
    - RLS policies with explicit permissions
    - Improved access control
    
  3. Performance
    - Added indexes for common queries
    - Optimized constraints
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS models CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create projects table
CREATE TABLE projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) > 0),
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT projects_name_length CHECK (char_length(name) <= 100)
);

CREATE INDEX idx_projects_created_at ON projects(created_at);

-- Create datasets table
CREATE TABLE datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) > 0),
  description text,
  file_type text NOT NULL,
  file_size text NOT NULL,
  row_count integer NOT NULL CHECK (row_count > 0),
  column_count integer NOT NULL CHECK (column_count > 0),
  preview_data jsonb DEFAULT '{}',
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT datasets_name_length CHECK (char_length(name) <= 100)
);

CREATE INDEX idx_datasets_project_id ON datasets(project_id);
CREATE INDEX idx_datasets_created_at ON datasets(created_at);

-- Create models table
CREATE TABLE models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) > 0),
  description text,
  model_type text NOT NULL,
  status text NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'training', 'trained', 'failed', 'deployed')),
  dataset_id uuid REFERENCES datasets(id) ON DELETE SET NULL,
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  hyperparameters jsonb DEFAULT '{}',
  training_config jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT models_name_length CHECK (char_length(name) <= 100),
  CONSTRAINT models_type_check CHECK (model_type IN ('classification', 'regression'))
);

CREATE INDEX idx_models_project_id ON models(project_id);
CREATE INDEX idx_models_dataset_id ON models(dataset_id);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_created_at ON models(created_at);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow authenticated users to manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage datasets"
  ON datasets
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage models"
  ON models
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create triggers
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default project if it doesn't exist
INSERT INTO projects (name, description)
SELECT 'Default Project', 'My AutoML Project'
WHERE NOT EXISTS (
  SELECT 1 FROM projects LIMIT 1
);