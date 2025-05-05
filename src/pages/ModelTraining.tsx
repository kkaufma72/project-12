import React, { useState } from 'react';
import { AlertCircle, Plus, Layers, Check, BarChart2 } from 'lucide-react';
import { useMLContext } from '../context/MLContext';
import { Dataset, ModelTrainingConfig, MLModel } from '../types';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import ModelCard from '../components/models/ModelCard';
import ModelTrainingForm from '../components/models/ModelTrainingForm';
import { useNavigate } from 'react-router-dom';

const ModelTraining: React.FC = () => {
  const { datasets, models, addModel } = useMLContext();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [currentTraining, setCurrentTraining] = useState<MLModel | null>(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const trainingModels = models.filter((model) => model.status === 'training');
  const trainedModels = models.filter(
    (model) => model.status === 'trained' || model.status === 'deployed'
  );

  const handleDatasetSelect = (datasetId: string) => {
    if (!datasetId) {
      setSelectedDataset(null);
      return;
    }
    const dataset = datasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
    }
  };

  const handleDeploy = (model: MLModel) => {
    navigate(`/deploy?model=${model.id}`);
  };

  const handleEvaluate = (model: MLModel) => {
    navigate(`/evaluate?model=${model.id}`);
  };

  const handleTrainingSubmit = (config: ModelTrainingConfig) => {
    setIsTraining(true);
    setProgress(0);

    // Create a new model in "training" state
    const newModel: MLModel = {
      id: `model-${Date.now()}`,
      name: `${config.modelType === 'classification' ? 'Classification' : 'Regression'} Model (${
        config.algorithms.length > 1 ? 'Ensemble' : config.algorithms[0].split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      })`,
      description: `${config.modelType === 'classification' ? 'Classification' : 'Regression'} model trained on ${
        datasets.find((d) => d.id === config.datasetId)?.name || 'dataset'
      }`,
      status: 'training',
      datasetId: config.datasetId,
      projectId: '1',
      createdAt: new Date().toISOString(),
    };

    addModel(newModel);
    setCurrentTraining(newModel);
    setSelectedDataset(null);

    // Simulate training progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Update model to trained status with metrics
            const completedModel: MLModel = {
              ...newModel,
              status: 'trained',
              metrics: {
                accuracy: 0.8 + Math.random() * 0.15,
                precision: 0.75 + Math.random() * 0.2,
                recall: 0.7 + Math.random() * 0.25,
                f1Score: 0.75 + Math.random() * 0.2,
                auc: 0.8 + Math.random() * 0.15,
              },
              hyperparameters: {
                ...(config.algorithms.includes('random_forest')
                  ? {
                      n_estimators: Math.floor(Math.random() * 150) + 50,
                      max_depth: Math.floor(Math.random() * 15) + 5,
                      min_samples_split: Math.floor(Math.random() * 10) + 2,
                    }
                  : {}),
                ...(config.algorithms.includes('xgboost')
                  ? {
                      learning_rate: (Math.random() * 0.2 + 0.01).toFixed(2),
                      max_depth: Math.floor(Math.random() * 10) + 3,
                      n_estimators: Math.floor(Math.random() * 200) + 50,
                    }
                  : {}),
                ...(config.algorithms.includes('neural_network')
                  ? {
                      hidden_layers: Math.floor(Math.random() * 3) + 1,
                      neurons_per_layer: Math.floor(Math.random() * 64) + 16,
                      learning_rate: (Math.random() * 0.01 + 0.001).toFixed(4),
                    }
                  : {}),
              },
            };

            addModel(completedModel);
            setIsTraining(false);
            setCurrentTraining(null);
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div>
      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Training</h1>
          <p className="mt-1 text-sm text-gray-500">
            Train and manage machine learning models
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          {datasets.length > 0 && !isTraining && (
            <div className="flex items-center space-x-2">
              {selectedDataset ? (
                <div className="flex items-center space-x-2">
                  <select
                    className="block w-48 px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedDataset.id}
                    onChange={(e) => handleDatasetSelect(e.target.value)}
                  >
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedDataset(null)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <select
                    className="block w-48 px-3 py-2 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value=""
                    onChange={(e) => handleDatasetSelect(e.target.value)}
                  >
                    <option value="">Select a dataset</option>
                    {datasets.map((dataset) => (
                      <option key={dataset.id} value={dataset.id}>
                        {dataset.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    icon={<Plus className="w-4 h-4" />}
                    onClick={() => handleDatasetSelect(datasets[0].id)}
                  >
                    Train New Model
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {datasets.length === 0 && (
        <Card className="flex flex-col items-center justify-center p-12 mb-6 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No datasets available</h3>
          <p className="mt-1 text-sm text-gray-500">
            You need to upload a dataset before you can train models
          </p>
          <Button
            className="mt-4"
            onClick={() => navigate('/app/data')}
          >
            Upload Dataset
          </Button>
        </Card>
      )}

      {selectedDataset && (
        <Card className="mb-6" title={`Train New Model on ${selectedDataset.name}`}>
          <ModelTrainingForm 
            dataset={selectedDataset} 
            onSubmit={handleTrainingSubmit} 
          />
        </Card>
      )}

      {isTraining && currentTraining && (
        <Card className="mb-6" title="Training in Progress">
          <div className="space-y-4">
            <div className="flex items-center">
              <Layers className="w-5 h-5 mr-2 text-indigo-600" />
              <span className="text-sm font-medium text-gray-900">
                {currentTraining.name}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Training progress</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 transition-all duration-300 bg-indigo-600 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-start p-4 mt-4 bg-blue-50 rounded-md">
              <div className="flex-shrink-0">
                <BarChart2 className="w-5 h-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Training Information</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Evaluating multiple algorithms in parallel</li>
                    <li>Performing hyperparameter optimization</li>
                    <li>Validation using cross-validation</li>
                    <li>Generating model evaluation metrics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {trainingModels.length > 0 && !isTraining && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Models in Training</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainingModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onDeploy={handleDeploy}
                onEvaluate={handleEvaluate}
              />
            ))}
          </div>
        </div>
      )}

      {trainedModels.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-medium text-gray-900">Trained Models</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainedModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                onDeploy={handleDeploy}
                onEvaluate={handleEvaluate}
              />
            ))}
          </div>
        </div>
      )}

      {trainedModels.length === 0 && trainingModels.length === 0 && !isTraining && (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
            <Layers className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No models trained yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Start training your first model to see it here
          </p>
          {datasets.length > 0 && !selectedDataset && (
            <Button
              className="mt-4"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => handleDatasetSelect(datasets[0].id)}
            >
              Train New Model
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default ModelTraining;