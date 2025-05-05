/*
  # Initial Schema Setup
  
  1. New Tables
    - projects: Stores project information
    - datasets: Manages uploaded datasets
    - models: Tracks ML models and their states
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for authenticated users
    
  3. Triggers
    - Adds updated_at triggers for all tables
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create datasets table
CREATE TABLE IF NOT EXISTS datasets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  file_type text NOT NULL,
  file_size text NOT NULL,
  row_count integer NOT NULL,
  column_count integer NOT NULL,
  preview_data jsonb DEFAULT '{}',
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create models table
CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  model_type text NOT NULL,
  status text NOT NULL DEFAULT 'created',
  dataset_id uuid REFERENCES datasets(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  hyperparameters jsonb DEFAULT '{}',
  training_config jsonb DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE IF EXISTS projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS models ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Allow authenticated users to read projects" ON projects;
  DROP POLICY IF EXISTS "Allow authenticated users to insert projects" ON projects;
  DROP POLICY IF EXISTS "Allow authenticated users to read datasets" ON datasets;
  DROP POLICY IF EXISTS "Allow authenticated users to insert datasets" ON datasets;
  DROP POLICY IF EXISTS "Allow authenticated users to read models" ON models;
  DROP POLICY IF EXISTS "Allow authenticated users to insert models" ON models;
END $$;

CREATE POLICY "Allow authenticated users to read projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read datasets"
  ON datasets
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert datasets"
  ON datasets
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to read models"
  ON models
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert models"
  ON models
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create updated_at triggers
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_projects_updated_at' AND tgrelid = 'projects'::regclass) THEN
    CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_datasets_updated_at' AND tgrelid = 'datasets'::regclass) THEN
    CREATE TRIGGER update_datasets_updated_at
    BEFORE UPDATE ON datasets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_models_updated_at' AND tgrelid = 'models'::regclass) THEN
    CREATE TRIGGER update_models_updated_at
    BEFORE UPDATE ON models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END$$;