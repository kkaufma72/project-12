export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Dataset {
  id: string;
  name: string;
  description: string;
  rows: number;
  columns: number;
  dateUploaded: string;
  fileType: string;
  fileSize: string;
  projectId: string;
  previewData?: {
    columns: string[];
    rows: string[][];
  };
}

export interface MLModel {
  id: string;
  name: string;
  description: string;
  status: 'training' | 'trained' | 'failed' | 'deployed';
  datasetId: string;
  projectId: string;
  createdAt: string;
  metrics?: Record<string, number>;
  hyperparameters?: Record<string, number | string>;
  deploymentEndpoint?: string;
  deployedAt?: string;
  modelType?: string;
}

export interface ModelTrainingConfig {
  datasetId: string;
  targetVariable: string;
  modelType: string;
  trainTestSplit: number;
  hyperparameterTuning: boolean;
  optimizationMetric: string;
  algorithms: string[];
  customParameters?: Record<string, any>;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
}

export interface DeploymentConfig {
  modelId: string;
  endpoint: string;
  scalingOptions: {
    minInstances: number;
    maxInstances: number;
  };
  authentication: 'api_key' | 'oauth' | 'none';
}

export interface ModelMonitoring {
  modelId: string;
  performance: {
    timestamp: string;
    metrics: Record<string, number>;
  }[];
  predictionCount: number;
  lastUpdated: string;
  driftDetected: boolean;
}