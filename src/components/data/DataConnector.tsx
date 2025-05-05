import React, { useState } from 'react';
import { Database, Cloud, Server, Box, Link2, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

interface DataConnectorProps {
  onConnect: (connection: {
    type: string;
    name: string;
    config: Record<string, string>;
  }) => void;
}

const DataConnector: React.FC<DataConnectorProps> = ({ onConnect }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [connectionConfig, setConnectionConfig] = useState<Record<string, string>>({});
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    {
      id: 'gcp',
      name: 'Google Cloud Platform',
      icon: Cloud,
      fields: ['Project ID', 'Service Account Key', 'Dataset Location']
    },
    {
      id: 'aws',
      name: 'Amazon S3',
      icon: Cloud,
      fields: ['Access Key ID', 'Secret Access Key', 'Bucket Name', 'Region']
    },
    {
      id: 'ibm',
      name: 'IBM Cloud',
      icon: Server,
      fields: ['API Key', 'Instance ID', 'Region']
    },
    {
      id: 'oracle',
      name: 'Oracle Cloud',
      icon: Database,
      fields: ['Tenant ID', 'User ID', 'Private Key', 'Region']
    },
    {
      id: 'tableau',
      name: 'Tableau',
      icon: Box,
      fields: ['Site URL', 'Access Token', 'Site ID']
    },
    {
      id: 'qlik',
      name: 'Qlik Sense',
      icon: Box,
      fields: ['Host URL', 'Client ID', 'Client Secret']
    },
    {
      id: 'informatica',
      name: 'Informatica',
      icon: Link2,
      fields: ['Pod URL', 'Username', 'Password', 'Security Domain']
    }
  ];

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatform(platformId);
    setConnectionConfig({});
    setTestStatus('idle');
    setError(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setConnectionConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setTestStatus('testing');
    setError(null);

    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, succeed for GCP and fail for others
      if (selectedPlatform === 'gcp') {
        setTestStatus('success');
      } else {
        throw new Error('Connection failed. Please check your credentials.');
      }
    } catch (err) {
      setTestStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to test connection');
    }
  };

  const handleConnect = () => {
    const platform = platforms.find(p => p.id === selectedPlatform);
    if (!platform) return;

    onConnect({
      type: platform.id,
      name: platform.name,
      config: connectionConfig
    });
  };

  const selectedPlatformData = platforms.find(p => p.id === selectedPlatform);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Connect Data Source</h3>
          <p className="mt-1 text-sm text-gray-500">
            Connect to your enterprise data platforms and analytics tools
          </p>
        </div>

        {!selectedPlatform ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <button
                  key={platform.id}
                  className="flex items-center p-4 text-left transition-colors border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => handlePlatformSelect(platform.id)}
                >
                  <Icon className="w-6 h-6 text-gray-400" />
                  <span className="ml-3 text-sm font-medium text-gray-900">{platform.name}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {selectedPlatformData && (
                  <>
                    <selectedPlatformData.icon className="w-6 h-6 text-gray-400" />
                    <span className="ml-3 text-sm font-medium text-gray-900">
                      {selectedPlatformData.name}
                    </span>
                  </>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePlatformSelect('')}
              >
                Change Platform
              </Button>
            </div>

            <div className="grid gap-4">
              {selectedPlatformData?.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field}
                  </label>
                  <input
                    type={field.toLowerCase().includes('password') || field.toLowerCase().includes('key') ? 'password' : 'text'}
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={connectionConfig[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                </div>
              ))}
            </div>

            {testStatus === 'success' && (
              <div className="flex items-center p-4 bg-green-50 rounded-md">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span className="ml-2 text-sm text-green-700">Connection test successful</span>
              </div>
            )}

            {testStatus === 'error' && (
              <div className="flex items-center p-4 bg-red-50 rounded-md">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="ml-2 text-sm text-red-700">{error}</span>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={testStatus === 'testing'}
              >
                Test Connection
              </Button>
              <Button
                onClick={handleConnect}
                disabled={testStatus !== 'success'}
              >
                Connect
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DataConnector;