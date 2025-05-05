import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Server, 
  Check, 
  Copy, 
  ChevronRight, 
  Code, 
  Shield, 
  ExternalLink,
  BarChart2,
  Globe,
  Key,
  Eye,
  Download
} from 'lucide-react';
import { useMLContext } from '../context/MLContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { MLModel, DeploymentConfig } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const Deployment: React.FC = () => {
  const { models, updateModelStatus } = useMLContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    modelId: '',
    endpoint: 'api/predict',
    scalingOptions: {
      minInstances: 1,
      maxInstances: 3,
    },
    authentication: 'api_key',
  });

  const deployedModels = models.filter((model) => model.status === 'deployed');
  const deployableModels = models.filter(
    (model) => model.status === 'trained'
  );

  const modelId = searchParams.get('model');

  useEffect(() => {
    if (modelId) {
      const model = models.find((m) => m.id === modelId);
      if (model && (model.status === 'trained' || model.status === 'deployed')) {
        setSelectedModel(model);
        setDeploymentConfig({
          ...deploymentConfig,
          modelId: model.id,
        });
      }
    } else if (deployableModels.length > 0 && !selectedModel) {
      setSelectedModel(deployableModels[0]);
      setDeploymentConfig({
        ...deploymentConfig,
        modelId: deployableModels[0].id,
      });
    } else if (deployableModels.length === 0 && deployedModels.length > 0 && !selectedModel) {
      setSelectedModel(deployedModels[0]);
      setDeploymentConfig({
        ...deploymentConfig,
        modelId: deployedModels[0].id,
      });
    }
  }, [modelId, models, selectedModel, deployableModels, deployedModels, deploymentConfig]);

  const handleModelSelect = (modelId: string) => {
    const model = models.find((m) => m.id === modelId);
    if (model) {
      setSelectedModel(model);
      setDeploymentConfig({
        ...deploymentConfig,
        modelId: model.id,
      });
    }
  };

  const handleDeploy = () => {
    if (!selectedModel) return;

    setIsDeploying(true);
    setDeployProgress(0);

    // Simulate deployment progress
    const interval = setInterval(() => {
      setDeployProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const deployedModel: MLModel = {
              ...selectedModel,
              status: 'deployed',
              deploymentEndpoint: `https://api.automl-platform.com/v1/models/${selectedModel.id}/predict`,
              deployedAt: new Date().toISOString(),
            };
            updateModelStatus(selectedModel.id, 'deployed');
            setSelectedModel(deployedModel);
            setIsDeploying(false);
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 400);
  };

  const handleExportModel = async (model: MLModel) => {
    if (!model) return;

    const zip = new JSZip();

    // Add model metadata
    const metadata = {
      id: model.id,
      name: model.name,
      description: model.description,
      type: model.modelType,
      metrics: model.metrics,
      hyperparameters: model.hyperparameters,
      createdAt: model.createdAt,
      deployedAt: model.deployedAt,
      endpoint: model.deploymentEndpoint
    };

    zip.file('model-metadata.json', JSON.stringify(metadata, null, 2));

    // Add example code files
    const pythonExample = `
import requests
import json

def predict(data):
    url = "${model.deploymentEndpoint}"
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_KEY"
    }
    response = requests.post(url, json={"data": data}, headers=headers)
    return response.json()

# Example usage
data = {
    "feature1": 0.5,
    "feature2": "category",
    "feature3": 42
}
result = predict(data)
print(result)
`;

    const javascriptExample = `
async function predict(data) {
  const response = await fetch("${model.deploymentEndpoint}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_API_KEY"
    },
    body: JSON.stringify({ data })
  });
  return response.json();
}

// Example usage
const data = {
  feature1: 0.5,
  feature2: "category",
  feature3: 42
};
const result = await predict(data);
console.log(result);
`;

    zip.file('examples/python_client.py', pythonExample);
    zip.file('examples/javascript_client.js', javascriptExample);

    // Add documentation
    const documentation = `
# ${model.name} - Deployment Documentation

## Overview
${model.description}

## Model Information
- Type: ${model.modelType}
- Created: ${new Date(model.createdAt).toLocaleDateString()}
- Deployed: ${model.deployedAt ? new Date(model.deployedAt).toLocaleDateString() : 'Not deployed'}

## Performance Metrics
${Object.entries(model.metrics || {})
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

## API Endpoint
${model.deploymentEndpoint}

## Authentication
API requests require authentication using an API key in the Authorization header:
\`\`\`
Authorization: Bearer YOUR_API_KEY
\`\`\`

## Request Format
\`\`\`json
{
  "data": {
    "feature1": 0.5,
    "feature2": "category",
    "feature3": 42
  }
}
\`\`\`

## Response Format
\`\`\`json
{
  "prediction": 0.75,
  "confidence": 0.92
}
\`\`\`

## Error Handling
The API returns standard HTTP status codes:
- 200: Successful prediction
- 400: Invalid input
- 401: Unauthorized
- 500: Server error

## Rate Limiting
- 100 requests per minute
- 10 concurrent requests
- 100,000 requests per month
`;

    zip.file('documentation.md', documentation);

    // Generate and download the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${model.name.toLowerCase().replace(/\s+/g, '-')}-deployment-package.zip`);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopySuccess(type);
        setTimeout(() => setCopySuccess(null), 2000);
      },
      () => {
        setCopySuccess('failed');
      }
    );
  };

  const apiKey = 'sk_test_automl_' + Math.random().toString(36).substring(2, 15);

  const curlExample = `curl -X POST \\
  ${selectedModel?.deploymentEndpoint || 'https://api.automl-platform.com/v1/models/predict'} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "data": {
      "feature1": 0.5,
      "feature2": "category",
      "feature3": 42
    }
  }'`;

  const pythonExample = `import requests
import json

url = "${selectedModel?.deploymentEndpoint || 'https://api.automl-platform.com/v1/models/predict'}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
}
data = {
    "data": {
        "feature1": 0.5,
        "feature2": "category",
        "feature3": 42
    }
}

response = requests.post(url, headers=headers, json=data)
prediction = response.json()
print(prediction)`;

  const javascriptExample = `fetch("${
    selectedModel?.deploymentEndpoint || 'https://api.automl-platform.com/v1/models/predict'
  }", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${apiKey}"
  },
  body: JSON.stringify({
    data: {
      feature1: 0.5,
      feature2: "category",
      feature3: 42
    }
  })
})
.then(response => response.json())
.then(prediction => console.log(prediction))
.catch(error => console.error("Error:", error));`;

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
          <Rocket className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No models available for deployment</h3>
        <p className="mt-1 text-sm text-gray-500">
          Train a model first to deploy it and make it available as an API
        </p>
        <Button className="mt-4" onClick={() => navigate('/train')}>
          Train New Model
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Deployment</h1>
          <p className="mt-1 text-sm text-gray-500">
            Deploy your models and make them available as APIs
          </p>
        </div>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Models</h3>
            <div className="mt-4 space-y-2">
              {deployedModels.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-500 uppercase">Deployed Models</p>
                  {deployedModels.map((model) => (
                    <button
                      key={model.id}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-md ${
                        selectedModel?.id === model.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelSelect(model.id)}
                    >
                      <div className="flex items-center">
                        <Rocket
                          className={`w-4 h-4 mr-2 ${
                            selectedModel?.id === model.id
                              ? 'text-indigo-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="truncate">{model.name}</span>
                      </div>
                      {selectedModel?.id === model.id && (
                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                      )}
                    </button>
                  ))}
                  <div className="my-3 border-t border-gray-200"></div>
                </>
              )}

              {deployableModels.length > 0 && (
                <>
                  <p className="text-xs font-medium text-gray-500 uppercase">Ready to Deploy</p>
                  {deployableModels.map((model) => (
                    <button
                      key={model.id}
                      className={`flex items-center justify-between w-full px-3 py-2 text-sm text-left rounded-md ${
                        selectedModel?.id === model.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleModelSelect(model.id)}
                    >
                      <div className="flex items-center">
                        <BarChart2
                          className={`w-4 h-4 mr-2 ${
                            selectedModel?.id === model.id
                              ? 'text-indigo-500'
                              : 'text-gray-400'
                          }`}
                        />
                        <span className="truncate">{model.name}</span>
                      </div>
                      {selectedModel?.id === model.id && (
                        <ChevronRight className="w-4 h-4 text-indigo-500" />
                      )}
                    </button>
                  ))}
                </>
              )}

              {deployableModels.length === 0 && deployedModels.length === 0 && (
                <div className="p-4 text-sm text-center text-gray-500">
                  No models available for deployment
                </div>
              )}
            </div>
          </Card>
        </div>

        {selectedModel && (
          <div className="md:col-span-2">
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedModel.status === 'deployed' ? 'Deployment Details' : 'Deploy Model'}
                </h3>
                {selectedModel.status === 'deployed' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" />
                    Active
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Model Information</h4>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-xs font-medium text-gray-500">Name</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedModel.name}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Type</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedModel.name.includes('Classification')
                          ? 'Classification'
                          : 'Regression'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Status</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedModel.status.charAt(0).toUpperCase() +
                          selectedModel.status.slice(1)}
                      </p>
                    </div>
                    {selectedModel.deployedAt && (
                      <div>
                        <p className="text-xs font-medium text-gray-500">Deployed On</p>
                        <p className="mt-1 text-sm text-gray-900">
                          {new Date(selectedModel.deployedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {selectedModel.status !== 'deployed' && !isDeploying && (
                  <>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Deployment Configuration</h4>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label
                            htmlFor="endpoint"
                            className="block text-xs font-medium text-gray-500"
                          >
                            API Endpoint Path
                          </label>
                          <div className="flex mt-1">
                            <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                              https://api.automl-platform.com/v1/models/{selectedModel.id}/
                            </span>
                            <input
                              type="text"
                              id="endpoint"
                              className="flex-1 block w-full min-w-0 px-3 py-2 border-gray-300 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={deploymentConfig.endpoint}
                              onChange={(e) =>
                                setDeploymentConfig({
                                  ...deploymentConfig,
                                  endpoint: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="minInstances"
                              className="block text-xs font-medium text-gray-500"
                            >
                              Minimum Instances
                            </label>
                            <select
                              id="minInstances"
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={deploymentConfig.scalingOptions.minInstances}
                              onChange={(e) =>
                                setDeploymentConfig({
                                  ...deploymentConfig,
                                  scalingOptions: {
                                    ...deploymentConfig.scalingOptions,
                                    minInstances: parseInt(e.target.value),
                                  },
                                })
                              }
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={5}>5</option>
                            </select>
                          </div>
                          <div>
                            <label
                              htmlFor="maxInstances"
                              className="block text-xs font-medium text-gray-500"
                            >
                              Maximum Instances
                            </label>
                            <select
                              id="maxInstances"
                              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              value={deploymentConfig.scalingOptions.maxInstances}
                              onChange={(e) =>
                                setDeploymentConfig({
                                  ...deploymentConfig,
                                  scalingOptions: {
                                    ...deploymentConfig.scalingOptions,
                                    maxInstances: parseInt(e.target.value),
                                  },
                                })
                              }
                            >
                              <option value={1}>1</option>
                              <option value={3}>3</option>
                              <option value={5}>5</option>
                              <option value={10}>10</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-500">
                            Authentication
                          </label>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center">
                              <input
                                id="auth-api-key"
                                name="authentication"
                                type="radio"
                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                checked={deploymentConfig.authentication === 'api_key'}
                                onChange={() =>
                                  setDeploymentConfig({
                                    ...deploymentConfig,
                                    authentication: 'api_key',
                                  })
                                }
                              />
                              <label
                                htmlFor="auth-api-key"
                                className="block ml-3 text-sm text-gray-700"
                              >
                                API Key
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="auth-oauth"
                                name="authentication"
                                type="radio"
                                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                checked={deploymentConfig.authentication === 'oauth'}
                                onChange={() =>
                                  setDeploymentConfig({
                                    ...deploymentConfig,
                                    authentication: 'oauth',
                                  })
                                }
                              />
                              <label
                                htmlFor="auth-oauth"
                                className="block ml-3 text-sm text-gray-700"
                              >
                                OAuth 2.0
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={handleDeploy} icon={<Rocket className="w-4 h-4" />}>
                        Deploy Model
                      </Button>
                    </div>
                  </>
                )}

                {isDeploying && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Deployment progress
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                          {Math.round(deployProgress)}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div
                          className="h-2 transition-all duration-300 bg-indigo-600 rounded-full"
                          style={{ width: `${deployProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            deployProgress > 20
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            deployProgress > 20 ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          Preparing model artifacts
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            deployProgress > 40
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            deployProgress > 40 ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          Building container image
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            deployProgress > 60
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            deployProgress > 60 ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          Deploying API endpoints
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            deployProgress > 80
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            deployProgress > 80 ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          Setting up monitoring
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Check
                          className={`w-4 h-4 mr-2 ${
                            deployProgress >= 100
                              ? 'text-green-500'
                              : 'text-gray-300'
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            deployProgress >= 100 ? 'text-gray-700' : 'text-gray-400'
                          }`}
                        >
                          Deployment complete
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedModel.status === 'deployed' && (
                  <>
                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <Server className="w-4 h-4 mr-2" />
                        API Endpoint
                      </h4>
                      <div className="flex items-center p-2 mt-2 bg-gray-50 rounded-md">
                        <code className="flex-1 text-sm text-indigo-600 break-all">
                          {selectedModel.deploymentEndpoint}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              selectedModel.deploymentEndpoint || '',
                              'endpoint'
                            )
                          }
                          className="p-1 ml-2 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                        >
                          {copySuccess === 'endpoint' ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <Key className="w-4 h-4 mr-2" />
                        API Key
                      </h4>
                      <div className="flex items-center p-2 mt-2 bg-gray-50 rounded-md">
                        <code className="flex-1 text-sm text-indigo-600 font-mono">
                          {showApiKey ? apiKey : '•'.repeat(20)}
                        </code>
                        <div className="flex ml-2">
                          <button
                            onClick={() => setShowApiKey(!showApiKey)}
                            className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey, 'apikey')}
                            className="p-1 ml-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                          >
                            {copySuccess === 'apikey' ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <Globe className="w-4 h-4 mr-2" />
                        Deployment Configuration
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Authentication</p>
                          <p className="mt-1 text-sm text-gray-900">API Key</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Scaling</p>
                          <p className="mt-1 text-sm text-gray-900">
                            {deploymentConfig.scalingOptions.minInstances} to{' '}
                            {deploymentConfig.scalingOptions.maxInstances} instances
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Region</p>
                          <p className="mt-1 text-sm text-gray-900">US East (N. Virginia)</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Auto-scaling</p>
                          <p className="mt-1 text-sm text-gray-900">Enabled</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <Code className="w-4 h-4 mr-2" />
                        Code Examples
                      </h4>
                      <div className="mt-2 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">cURL</p>
                            <button
                              onClick={() => copyToClipboard(curlExample, 'curl')}
                              className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                            >
                              {copySuccess === 'curl' ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="p-3 mt-1 overflow-x-auto text-sm bg-gray-800 rounded-md">
                            <pre className="text-gray-200 whitespace-pre-wrap">
                              {curlExample}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">Python</p>
                            <button
                              onClick={() => copyToClipboard(pythonExample, 'python')}
                              className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                            >
                              {copySuccess === 'python' ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="p-3 mt-1 overflow-x-auto text-sm bg-gray-800 rounded-md">
                            <pre className="text-gray-200 whitespace-pre-wrap">
                              {pythonExample}
                            </pre>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-medium text-gray-500">JavaScript</p>
                            <button
                              onClick={() => copyToClipboard(javascriptExample, 'javascript')}
                              className="p-1 text-gray-400 rounded hover:text-gray-600 hover:bg-gray-100"
                            >
                              {copySuccess === 'javascript' ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          <div className="p-3 mt-1 overflow-x-auto text-sm bg-gray-800 rounded-md">
                            <pre className="text-gray-200 whitespace-pre-wrap">
                              {javascriptExample}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="flex items-center text-sm font-medium text-gray-700">
                        <Shield className="w-4 h-4 mr-2" />
                        Security Recommendations
                      </h4>
                      <div className="p-4 mt-2 space-y-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          For secure API usage, we recommend:
                        </p>
                        <ul className="pl-5 mt-1 text-sm text-blue-700 list-disc">
                          <li>Store API keys securely, never expose in client-side code</li>
                          <li>Implement rate limiting in your application</li>
                          <li>Set up IP restrictions in production</li>
                          <li>
                            Consider using OAuth 2.0 for applications with multiple users
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Download className="w-4 h-4" />}
                        onClick={() => handleExportModel(selectedModel)}
                      >
                        Export Deployment Package
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<ExternalLink className="w-4 h-4" />}
                      >
                        View Documentation
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => navigate(`/evaluate?model=${selectedModel.id}`)}
                      >
                        View Model Performance
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deployment;