import React from 'react';
import { BarChart, GitBranch, Activity, Clock } from 'lucide-react';
import { MLModel } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface ModelCardProps {
  model: MLModel;
  onDeploy: (model: MLModel) => void;
  onEvaluate: (model: MLModel) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onDeploy, onEvaluate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = () => {
    const statusClasses = {
      training: 'bg-yellow-100 text-yellow-800',
      trained: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      deployed: 'bg-blue-100 text-blue-800',
    };

    const statusIcons = {
      training: <Clock className="w-3 h-3 mr-1" />,
      trained: <Activity className="w-3 h-3 mr-1" />,
      failed: <Clock className="w-3 h-3 mr-1" />,
      deployed: <GitBranch className="w-3 h-3 mr-1" />,
    };

    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          statusClasses[model.status]
        }`}
      >
        {statusIcons[model.status]}
        {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
      </span>
    );
  };

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg">
              <BarChart className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">{model.name}</h3>
              <p className="mt-1 text-sm text-gray-500">{model.description}</p>
            </div>
          </div>
        </div>
        <div className="ml-4">{getStatusBadge()}</div>
      </div>

      {model.metrics && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Performance Metrics</h4>
          <div className="grid grid-cols-3 gap-4 mt-2 sm:grid-cols-5">
            {Object.entries(model.metrics).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  {key === 'f1Score' ? 'F1 Score' : key === 'auc' ? 'AUC' : key}
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {typeof value === 'number' ? value.toFixed(2) : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {model.hyperparameters && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Hyperparameters</h4>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {Object.entries(model.hyperparameters)
              .slice(0, 3)
              .map(([key, value]) => (
                <div key={key}>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
                </div>
              ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        Created on {formatDate(model.createdAt)}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEvaluate(model)}
          disabled={model.status === 'training' || model.status === 'failed'}
        >
          Evaluate
        </Button>
        <Button
          size="sm"
          variant={model.status === 'deployed' ? 'secondary' : 'primary'}
          onClick={() => onDeploy(model)}
          disabled={model.status === 'training' || model.status === 'failed'}
        >
          {model.status === 'deployed' ? 'Redeploy' : 'Deploy'}
        </Button>
      </div>
    </Card>
  );
};

export default ModelCard;