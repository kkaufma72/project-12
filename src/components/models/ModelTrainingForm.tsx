import React, { useState } from 'react';
import { BarChart2, Sliders, Settings, Check } from 'lucide-react';
import { Dataset, ModelTrainingConfig } from '../../types';
import { useMLContext } from '../../context/MLContext';
import Button from '../common/Button';
import Card from '../common/Card';

interface ModelTrainingFormProps {
  dataset: Dataset;
  onSubmit: (config: ModelTrainingConfig) => void;
}

const ModelTrainingForm: React.FC<ModelTrainingFormProps> = ({
  dataset,
  onSubmit,
}) => {
  const [targetVariable, setTargetVariable] = useState('');
  const [modelType, setModelType] = useState('classification');
  const [trainTestSplit, setTrainTestSplit] = useState(0.8);
  const [hyperparameterTuning, setHyperparameterTuning] = useState(true);
  const [optimizationMetric, setOptimizationMetric] = useState('f1');
  const [algorithms, setAlgorithms] = useState<string[]>([
    'random_forest',
    'xgboost',
    'neural_network',
  ]);

  const toggleAlgorithm = (algorithm: string) => {
    if (algorithms.includes(algorithm)) {
      setAlgorithms(algorithms.filter((a) => a !== algorithm));
    } else {
      setAlgorithms([...algorithms, algorithm]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const config: ModelTrainingConfig = {
      datasetId: dataset.id,
      targetVariable,
      modelType,
      trainTestSplit,
      hyperparameterTuning,
      optimizationMetric,
      algorithms,
    };
    onSubmit(config);
  };

  const algorithmOptions = [
    { id: 'random_forest', name: 'Random Forest', description: 'Ensemble learning method using decision trees' },
    { id: 'xgboost', name: 'XGBoost', description: 'Gradient boosting algorithm optimized for performance' },
    { id: 'neural_network', name: 'Neural Network', description: 'Deep learning model with multiple layers' },
    { id: 'logistic_regression', name: 'Logistic Regression', description: 'Linear model for classification problems' },
    { id: 'svm', name: 'Support Vector Machine', description: 'Efficient for high-dimensional spaces' },
  ];

  // Get available columns from dataset
  const availableColumns = dataset.previewData?.columns || [];

  // Reset target variable if it's not in the new dataset's columns
  React.useEffect(() => {
    if (!availableColumns.includes(targetVariable)) {
      setTargetVariable('');
    }
  }, [dataset.id, availableColumns, targetVariable]);

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="targetVariable" className="block text-sm font-medium text-gray-700">
            Target Variable
          </label>
          <select
            id="targetVariable"
            name="targetVariable"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={targetVariable}
            onChange={(e) => setTargetVariable(e.target.value)}
            required
          >
            <option value="">Select target variable</option>
            {availableColumns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
          {availableColumns.length === 0 && (
            <p className="mt-1 text-sm text-red-600">
              No columns available. Please ensure the dataset has been properly loaded.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Model Type</label>
          <div className="mt-2 space-y-4">
            <div className="flex items-center">
              <input
                id="modelType-classification"
                name="modelType"
                type="radio"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                value="classification"
                checked={modelType === 'classification'}
                onChange={(e) => setModelType(e.target.value)}
              />
              <label htmlFor="modelType-classification" className="block ml-3 text-sm font-medium text-gray-700">
                Classification
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="modelType-regression"
                name="modelType"
                type="radio"
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                value="regression"
                checked={modelType === 'regression'}
                onChange={(e) => setModelType(e.target.value)}
              />
              <label htmlFor="modelType-regression" className="block ml-3 text-sm font-medium text-gray-700">
                Regression
              </label>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="trainTestSplit" className="block text-sm font-medium text-gray-700">
            Training/Test Split: {Math.round(trainTestSplit * 100)}% / {100 - Math.round(trainTestSplit * 100)}%
          </label>
          <input
            type="range"
            id="trainTestSplit"
            min="0.5"
            max="0.9"
            step="0.05"
            value={trainTestSplit}
            onChange={(e) => setTrainTestSplit(parseFloat(e.target.value))}
            className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>50/50</span>
            <span>90/10</span>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="hyperparameterTuning"
              name="hyperparameterTuning"
              type="checkbox"
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={hyperparameterTuning}
              onChange={(e) => setHyperparameterTuning(e.target.checked)}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="hyperparameterTuning" className="font-medium text-gray-700">
              Hyperparameter Tuning
            </label>
            <p className="text-gray-500">
              Automatically optimize model parameters for best performance
            </p>
          </div>
        </div>

        {hyperparameterTuning && (
          <div>
            <label htmlFor="optimizationMetric" className="block text-sm font-medium text-gray-700">
              Optimization Metric
            </label>
            <select
              id="optimizationMetric"
              name="optimizationMetric"
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={optimizationMetric}
              onChange={(e) => setOptimizationMetric(e.target.value)}
            >
              {modelType === 'classification' ? (
                <>
                  <option value="accuracy">Accuracy</option>
                  <option value="precision">Precision</option>
                  <option value="recall">Recall</option>
                  <option value="f1">F1 Score</option>
                  <option value="auc">AUC</option>
                </>
              ) : (
                <>
                  <option value="mse">Mean Squared Error</option>
                  <option value="rmse">Root Mean Squared Error</option>
                  <option value="mae">Mean Absolute Error</option>
                  <option value="r2">R² Score</option>
                </>
              )}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Algorithms to Train</label>
          <p className="mt-1 text-sm text-gray-500">
            Select at least one algorithm to include in the training
          </p>
          <div className="mt-4 space-y-4">
            {algorithmOptions.map((algorithm) => (
              <div key={algorithm.id} className="relative flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={`algorithm-${algorithm.id}`}
                    name="algorithms"
                    type="checkbox"
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    checked={algorithms.includes(algorithm.id)}
                    onChange={() => toggleAlgorithm(algorithm.id)}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor={`algorithm-${algorithm.id}`}
                    className="font-medium text-gray-700"
                  >
                    {algorithm.name}
                  </label>
                  <p className="text-gray-500">{algorithm.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-5">
          <Button
            type="submit"
            icon={<BarChart2 className="w-4 h-4" />}
            disabled={!targetVariable || algorithms.length === 0}
          >
            Start Training
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ModelTrainingForm;