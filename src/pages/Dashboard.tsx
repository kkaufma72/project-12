import React, { useState } from 'react';
import { Layers, BarChart2, Database, Clock, ArrowRight, Sparkles, Check, MessageSquare, ChevronDown } from 'lucide-react';
import { useMLContext } from '../context/MLContext';
// Add this import if you have an auth context/hook
// import { useAuth } from '../context/AuthContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ChatInterface from '../components/chat/ChatInterface';
import PitchDeck from '../components/marketing/PitchDeck';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { datasets, models, currentProject } = useMLContext();
  const navigate = useNavigate();
  const [showPitchDeck, setShowPitchDeck] = useState(false);

  // Example: If you have an auth context/hook
  // const { user, isAuthenticated } = useAuth();

  // For debugging: zs authenticated
  // const isAuthenticated = true;

  // If you want to check authentication, add this:
  // if (!isAuthenticated) {
  //   return <div>You are not authenticated. Please sign in.</div>;
  // }

  const statsCards = [
    {
      title: 'Datasets',
      value: datasets.length,
      icon: <Database className="w-8 h-8 text-blue-500" />,
      description: 'Available datasets',
      color: 'blue',
      action: () => navigate('/app/data', { replace: true }),
    },
    {
      title: 'Models',
      value: models.length,
      icon: <Layers className="w-8 h-8 text-indigo-500" />,
      description: 'Trained models',
      color: 'indigo',
      action: () => navigate('/app/train', { replace: true }),
    },
    {
      title: 'Deployed',
      value: models.filter((model) => model.status === 'deployed').length,
      icon: <BarChart2 className="w-8 h-8 text-emerald-500" />,
      description: 'Models in production',
      color: 'emerald',
      action: () => navigate('/app/deploy', { replace: true }),
    },
    {
      title: 'In Progress',
      value: models.filter((model) => model.status === 'training').length,
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      description: 'Training jobs',
      color: 'amber',
      action: () => navigate('/app/train', { replace: true }),
    },
  ];

  // Find best performing model
  const deployedModels = models.filter((model) => model.status === 'trained' || model.status === 'deployed');
  const bestModel = deployedModels.length > 0
    ? deployedModels.reduce((prev, current) => {
        const prevMetric = prev.metrics?.accuracy || 0;
        const currentMetric = current.metrics?.accuracy || 0;
        return currentMetric > prevMetric ? current : prev;
      })
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to AutoML Platform</h1>
          <p className="mt-1 text-sm text-gray-500">
            Build, train, and deploy machine learning models with ease
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowPitchDeck(!showPitchDeck)}
          icon={showPitchDeck ? <ChevronDown className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
        >
          {showPitchDeck ? 'Hide Presentation' : 'View Presentation'}
        </Button>
      </div>

      {showPitchDeck && (
        <div className="mb-8">
          <PitchDeck />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 mt-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => (
          <Card key={card.title} className="overflow-hidden transition-all hover:shadow-lg">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
              </div>
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-lg bg-${card.color}-100`}
              >
                {card.icon}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-500">{card.description}</p>
              <button
                onClick={card.action}
                className={`flex items-center text-sm font-medium text-${card.color}-600 hover:text-${card.color}-700`}
              >
                View <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 mt-8 lg:grid-cols-3">
        <Card
          title="Quick Actions"
          className="lg:col-span-1 transition-all hover:shadow-lg"
        >
          <div className="flex flex-col space-y-3">
            <Button
              variant="outline"
              className="justify-start transition-colors hover:bg-gray-50"
              icon={<Database className="w-4 h-4" />}
              onClick={() => navigate('/app/data')}
            >
              Upload new dataset
            </Button>
            <Button
              variant="outline"
              className="justify-start transition-colors hover:bg-gray-50"
              icon={<Layers className="w-4 h-4" />}
              onClick={() => navigate('/app/train')}
              disabled={datasets.length === 0}
            >
              Train new model
            </Button>
            <Button
              variant="outline"
              className="justify-start transition-colors hover:bg-gray-50"
              icon={<BarChart2 className="w-4 h-4" />}
              onClick={() => navigate('/app/evaluate')}
              disabled={models.filter(m => m.status === 'trained').length === 0}
            >
              Evaluate models
            </Button>
            <Button
              variant="outline"
              className="justify-start transition-colors hover:bg-gray-50"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate('/app/deploy')}
              disabled={models.filter(m => m.status === 'trained').length === 0}
            >
              Deploy model
            </Button>
          </div>
        </Card>

        <Card
          title="Recent Activity"
          className="lg:col-span-1 transition-all hover:shadow-lg"
        >
          {models.length > 0 ? (
            <div className="space-y-4">
              {models.slice(0, 3).map((model) => (
                <div key={model.id} className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    model.status === 'trained' ? 'bg-green-100' : 
                    model.status === 'training' ? 'bg-yellow-100' : 
                    model.status === 'deployed' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    {model.status === 'trained' && <Check className="w-4 h-4 text-green-600" />}
                    {model.status === 'training' && <Clock className="w-4 h-4 text-yellow-600" />}
                    {model.status === 'deployed' && <BarChart2 className="w-4 h-4 text-blue-600" />}
                    {model.status === 'failed' && <Clock className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {model.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {model.status === 'trained' && 'Model training completed'}
                      {model.status === 'training' && 'Model is currently training'}
                      {model.status === 'deployed' && 'Model deployed to production'}
                      {model.status === 'failed' && 'Model training failed'}
                    </p>
                  </div>
                  <div className="flex-shrink-0 ml-2">
                    <p className="text-xs text-gray-500">
                      {new Date(model.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500">No recent activity</p>
              <Button 
                variant="outline" 
                size="sm"
                className="mt-2"
                onClick={() => navigate('/app/data')}
              >
                Upload dataset to get started
              </Button>
            </div>
          )}
        </Card>

        <Card
          title="AI Assistant"
          className="lg:col-span-1 transition-all hover:shadow-lg"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 text-indigo-600 mr-2" />
            <span className="text-sm text-gray-500">Ask questions about your data and models</span>
          </div>
          <ChatInterface />
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;