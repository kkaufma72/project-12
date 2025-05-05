import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, RefreshCcw, Settings } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

interface ModelMetric {
  timestamp: string;
  accuracy: number;
  latency: number;
  requests: number;
  driftScore: number;
}

const ModelMonitoring: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState<ModelMetric[]>(generateSampleData());
  const [driftDetected, setDriftDetected] = useState(false);
  const [retrainingStatus, setRetrainingStatus] = useState<'idle' | 'running' | 'completed'>('idle');

  function generateSampleData(): ModelMetric[] {
    const data: ModelMetric[] = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (23 - i) * 3600000);
      const baseAccuracy = 0.85 + Math.random() * 0.1;
      const driftScore = 0.1 + Math.random() * 0.3;
      
      data.push({
        timestamp: timestamp.toISOString(),
        accuracy: baseAccuracy,
        latency: 100 + Math.random() * 50,
        requests: Math.floor(100 + Math.random() * 200),
        driftScore: driftScore
      });

      if (driftScore > 0.3) {
        setDriftDetected(true);
      }
    }
    return data;
  }

  const handleRetrain = () => {
    setRetrainingStatus('running');
    // Simulate retraining process
    setTimeout(() => {
      setRetrainingStatus('completed');
      setDriftDetected(false);
      // Generate new metrics with better performance
      setMetrics(generateSampleData());
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Model Performance Monitoring</h2>
          <p className="mt-1 text-sm text-gray-500">Real-time metrics and drift detection</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            icon={<Settings className="w-4 h-4" />}
          >
            Configure Alerts
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-gray-700">Model Accuracy</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis domain={[0.7, 1]} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [value.toFixed(3), 'Accuracy']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-700">Data Drift Detection</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis domain={[0, 1]} />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [value.toFixed(3), 'Drift Score']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="driftScore"
                  stroke="#EC4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {driftDetected && (
        <div className="p-4 bg-amber-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Data Drift Detected</h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  Significant drift detected in the input data distribution. Consider retraining the model
                  with recent data to maintain performance.
                </p>
              </div>
              <div className="mt-4">
                <Button
                  size="sm"
                  onClick={handleRetrain}
                  disabled={retrainingStatus === 'running'}
                  icon={retrainingStatus === 'running' ? <Activity className="w-4 h-4 animate-pulse" /> : <RefreshCcw className="w-4 h-4" />}
                >
                  {retrainingStatus === 'running' ? 'Retraining...' : 'Retrain Model'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-gray-700">Response Latency</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [`${value.toFixed(1)}ms`, 'Latency']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#2DD4BF"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-medium text-gray-700">Request Volume</h3>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleString()}
                  formatter={(value: number) => [value, 'Requests']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="requests"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ModelMonitoring;