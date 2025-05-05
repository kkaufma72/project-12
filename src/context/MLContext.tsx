import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Dataset, MLModel, Project } from '../types';
import { supabase, initializeSupabase, checkSupabaseHealth } from '../lib/supabase';
import { storage } from '../lib/storage';
import { generateSampleDatasets } from '../lib/sampleData';

interface MLContextType {
  currentProject: Project | null;
  datasets: Dataset[];
  models: MLModel[];
  isLoading: boolean;
  error: string | null;
  setCurrentProject: (project: Project) => void;
  addDataset: (dataset: Dataset) => Promise<Dataset>;
  addModel: (model: MLModel) => void;
  updateModelStatus: (id: string, status: string, metrics?: Record<string, number>) => void;
}

const MLContext = createContext<MLContextType | undefined>(undefined);

export const useMLContext = () => {
  const context = useContext(MLContext);
  if (context === undefined) {
    throw new Error('useMLContext must be used within a MLProvider');
  }
  return context;
};

interface MLProviderProps {
  children: ReactNode;
}

export const MLProvider = ({ children }: MLProviderProps) => {
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [models, setModels] = useState<MLModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const createDefaultProject = async () => {
    try {
      const { data: newProject, error: createError } = await supabase
        .from('projects')
        .insert([{
          name: 'Default Project',
          description: 'Default project created automatically'
        }])
        .select()
        .single();

      if (createError) throw createError;
      return newProject;
    } catch (err) {
      console.error('Error creating default project:', err);
      throw err;
    }
  };

  const initializeSampleData = async () => {
    try {
      // Get existing datasets from storage
      let localDatasets = await storage.getAllDatasets();
      
      // If no datasets exist, generate and save sample datasets
      if (localDatasets.length === 0) {
        console.log('Initializing sample datasets...');
        const sampleDatasets = generateSampleDatasets();
        
        // Save each dataset to IndexedDB
        await Promise.all(sampleDatasets.map(dataset => storage.saveDataset(dataset)));
        
        // Update local datasets
        localDatasets = sampleDatasets;
        console.log('Sample datasets initialized:', localDatasets.length);
      }

      return localDatasets;
    } catch (error) {
      console.error('Error initializing sample data:', error);
      throw error;
    }
  };

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize sample data and load from storage
      const localDatasets = await initializeSampleData();
      setDatasets(localDatasets);

      const isConnected = await initializeSupabase();
      if (!isConnected) {
        throw new Error('Failed to connect to database');
      }

      let { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (!project && !projectError) {
        try {
          project = await createDefaultProject();
        } catch (createError) {
          throw new Error('Failed to create default project');
        }
      } else if (projectError) {
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
          return loadInitialData();
        }
        throw projectError;
      }

      if (project) {
        setCurrentProject({
          id: project.id,
          name: project.name,
          description: project.description || '',
          createdAt: project.created_at
        });

        const [datasetsResponse, modelsResponse] = await Promise.all([
          supabase
            .from('datasets')
            .select('*')
            .eq('project_id', project.id),
          supabase
            .from('models')
            .select('*')
            .eq('project_id', project.id)
        ]);

        if (datasetsResponse.error) throw datasetsResponse.error;
        if (modelsResponse.error) throw modelsResponse.error;

        // Merge remote datasets with local ones, preferring local versions
        const remoteDatasets = datasetsResponse.data || [];
        const mergedDatasets = [...localDatasets];
        
        for (const remoteDataset of remoteDatasets) {
          const localIndex = mergedDatasets.findIndex(d => d.id === remoteDataset.id);
          if (localIndex === -1) {
            mergedDatasets.push(remoteDataset);
          }
        }

        setDatasets(mergedDatasets);
        setModels(modelsResponse.data || []);
      } else {
        throw new Error('Failed to load or create project');
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error loading initial data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load application data');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    const healthCheckInterval = setInterval(async () => {
      const isHealthy = await checkSupabaseHealth();
      if (!isHealthy && !error) {
        setError('Database connection lost');
      } else if (isHealthy && error) {
        setError(null);
      }
    }, 30000);

    return () => clearInterval(healthCheckInterval);
  }, []);

  const addDataset = async (dataset: Dataset) => {
    if (!currentProject?.id) {
      setError('No active project found');
      throw new Error('No active project found');
    }

    try {
      // Save to IndexedDB first
      await storage.saveDataset(dataset);
      
      // Update local state
      setDatasets(prevDatasets => [...prevDatasets, dataset]);

      // Try to save to Supabase
      const { data, error } = await supabase
        .from('datasets')
        .insert([{
          name: dataset.name,
          description: dataset.description,
          file_type: dataset.fileType,
          file_size: dataset.fileSize,
          row_count: dataset.rows,
          column_count: dataset.columns,
          preview_data: dataset.previewData,
          project_id: currentProject.id,
        }])
        .select()
        .single();

      if (error) {
        console.warn('Failed to save dataset to remote database:', error);
        // Continue with local data only
      }

      return dataset;
    } catch (err) {
      console.error('Error adding dataset:', err);
      setError('Failed to add dataset');
      throw err;
    }
  };

  const addModel = async (model: MLModel) => {
    if (!currentProject?.id) {
      setError('No active project found');
      return;
    }

    try {
      // For non-UUID dataset IDs, set dataset_id to null in the database
      // but keep the reference in the local model object
      const localDatasetId = model.datasetId;
      
      const { data, error } = await supabase
        .from('models')
        .insert([{
          name: model.name,
          description: model.description,
          model_type: model.modelType || 'classification',
          status: model.status,
          dataset_id: null, // Set to null since we're using local dataset references
          project_id: currentProject.id,
          hyperparameters: model.hyperparameters || {},
          training_config: {},
          metadata: {
            local_dataset_id: localDatasetId // Store the local dataset ID in metadata
          }
        }])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error('Failed to create model in database');
      }

      if (!data) {
        throw new Error('No data returned from database');
      }

      const newModel: MLModel = {
        ...model,
        id: data.id,
        projectId: currentProject.id,
        createdAt: data.created_at,
        modelType: data.model_type,
        datasetId: localDatasetId // Keep the local dataset ID in the frontend model
      };

      setModels(prevModels => [...prevModels, newModel]);
      return newModel;
    } catch (err) {
      console.error('Error adding model:', err);
      setError(err instanceof Error ? err.message : 'Failed to add model');
      throw err;
    }
  };

  const updateModelStatus = async (
    id: string,
    status: string,
    metrics?: Record<string, number>
  ) => {
    try {
      const { error } = await supabase
        .from('models')
        .update({ 
          status,
          metadata: { metrics },
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setModels(prevModels =>
        prevModels.map(model =>
          model.id === id
            ? {
                ...model,
                status,
                ...(metrics ? { metrics } : {}),
              }
            : model
        )
      );
    } catch (err) {
      console.error('Error updating model status:', err);
      setError('Failed to update model status');
      throw err;
    }
  };

  return (
    <MLContext.Provider
      value={{
        currentProject,
        datasets,
        models,
        isLoading,
        error,
        setCurrentProject,
        addDataset,
        addModel,
        updateModelStatus,
      }}
    >
      {children}
    </MLContext.Provider>
  );
};