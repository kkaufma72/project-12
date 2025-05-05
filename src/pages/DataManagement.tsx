import React, { useState } from 'react';
import { useMLContext } from '../context/MLContext';
import Card from '../components/common/Card';
import DataUploader from '../components/data/DataUploader';
import DataConnector from '../components/data/DataConnector';
import DatasetCard from '../components/data/DatasetCard';
import { Dataset } from '../types';
import { Database, Upload, X, Table, Plus } from 'lucide-react';
import Button from '../components/common/Button';
import { useNavigate } from 'react-router-dom';

// Helper functions moved to module scope
const isNumeric = (value: string) => !isNaN(Number(value)) && value.trim() !== '';
const isDate = (value: string) => !isNaN(Date.parse(value));
const isCategorical = (values: string[]) => {
  const uniqueValues = new Set(values);
  return uniqueValues.size <= Math.min(10, values.length * 0.2); // 20% threshold
};

const DataManagement: React.FC = () => {
  const { datasets } = useMLContext();
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [showConnector, setShowConnector] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const navigate = useNavigate();

  const handlePreview = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setShowPreview(true);
    setShowAnalysis(false);
    setShowUploader(false);
    setShowConnector(false);
  };

  const handleAnalyze = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setShowPreview(false);
    setShowAnalysis(true);
    setShowUploader(false);
    setShowConnector(false);
  };

  const handleConnect = (connection: { type: string; name: string; config: Record<string, string> }) => {
    console.log('New connection:', connection);
    // Here you would typically handle the connection in your backend
    setShowConnector(false);
  };

  const renderPreviewModal = () => {
    if (!showPreview || !selectedDataset?.previewData) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPreview(false)} />
          <div className="inline-block w-full max-w-4xl overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle">
            <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {selectedDataset.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {selectedDataset.previewData.columns.map((column, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                        >
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedDataset.previewData.rows.slice(0, 10).map((row, i) => (
                      <tr key={i}>
                        {row.map((cell, j) => (
                          <td
                            key={j}
                            className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!showAnalysis || !selectedDataset?.previewData) return null;

    return (
      <Card className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Dataset Analysis: {selectedDataset.name}
          </h3>
          <button
            onClick={() => setShowAnalysis(false)}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">Total Rows</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedDataset.rows.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">Total Columns</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedDataset.columns}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">File Size</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedDataset.fileSize}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-sm font-medium text-gray-500">File Type</p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">{selectedDataset.fileType.toUpperCase()}</p>
          </div>
        </div>

        <h4 className="text-sm font-medium text-gray-700">Column Types</h4>
        <div className="mt-3">
          {(() => {
            // Analyze column types
            const columnTypes = selectedDataset.previewData.columns.reduce((acc, col, idx) => {
              const sampleValues = selectedDataset.previewData!.rows.slice(0, 100).map(row => row[idx]);
              
              // Determine column type
              const numericCount = sampleValues.filter(isNumeric).length;
              const dateCount = sampleValues.filter(isDate).length;
              const nonEmpty = sampleValues.filter(v => v && v.trim() !== '').length;

              if (numericCount / nonEmpty > 0.8) {
                acc.numeric++;
              } else if (dateCount / nonEmpty > 0.8) {
                acc.datetime++;
              } else if (isCategorical(sampleValues)) {
                acc.categorical++;
              } else {
                acc.text++;
              }
              
              return acc;
            }, { numeric: 0, categorical: 0, datetime: 0, text: 0 });

            const total = Object.values(columnTypes).reduce((a, b) => a + b, 0);
            const percentages = {
              numeric: (columnTypes.numeric / total) * 100,
              categorical: (columnTypes.categorical / total) * 100,
              datetime: (columnTypes.datetime / total) * 100,
              text: (columnTypes.text / total) * 100
            };

            return (
              <>
                <div className="flex items-center h-4 overflow-hidden rounded-full">
                  {percentages.numeric > 0 && (
                    <div 
                      className="h-full bg-indigo-500" 
                      style={{ width: `${percentages.numeric}%` }}
                    />
                  )}
                  {percentages.categorical > 0 && (
                    <div 
                      className="h-full bg-emerald-500" 
                      style={{ width: `${percentages.categorical}%` }}
                    />
                  )}
                  {percentages.datetime > 0 && (
                    <div 
                      className="h-full bg-amber-500" 
                      style={{ width: `${percentages.datetime}%` }}
                    />
                  )}
                  {percentages.text > 0 && (
                    <div 
                      className="h-full bg-rose-500" 
                      style={{ width: `${percentages.text}%` }}
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                  {percentages.numeric > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-indigo-500 rounded"></div>
                      <span>Numeric ({percentages.numeric.toFixed(1)}%)</span>
                    </div>
                  )}
                  {percentages.categorical > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-emerald-500 rounded"></div>
                      <span>Categorical ({percentages.categorical.toFixed(1)}%)</span>
                    </div>
                  )}
                  {percentages.datetime > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-amber-500 rounded"></div>
                      <span>Date/Time ({percentages.datetime.toFixed(1)}%)</span>
                    </div>
                  )}
                  {percentages.text > 0 && (
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-1 bg-rose-500 rounded"></div>
                      <span>Text ({percentages.text.toFixed(1)}%)</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h4 className="mb-4 text-sm font-medium text-gray-700">Column Details</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Column Name</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                          <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sample Values</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedDataset.previewData.columns.map((column, idx) => {
                          const sampleValues = selectedDataset.previewData!.rows
                            .slice(0, 100)
                            .map(row => row[idx]);
                          
                          const numericCount = sampleValues.filter(isNumeric).length;
                          const dateCount = sampleValues.filter(isDate).length;
                          const nonEmpty = sampleValues.filter(v => v && v.trim() !== '').length;
                          
                          let type = 'Text';
                          if (numericCount / nonEmpty > 0.8) type = 'Numeric';
                          else if (dateCount / nonEmpty > 0.8) type = 'Date/Time';
                          else if (isCategorical(sampleValues)) type = 'Categorical';

                          return (
                            <tr key={column}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">{column}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">{type}</td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {Array.from(new Set(sampleValues.slice(0, 3))).join(', ')}...
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      </Card>
    );
  };

  return (
    <div>
      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Upload and manage your datasets
          </p>
        </div>
        <div className="flex mt-4 space-x-3 md:mt-0">
          <Button
            onClick={() => {
              setShowUploader(!showUploader);
              setShowConnector(false);
              setShowPreview(false);
              setShowAnalysis(false);
            }}
            icon={<Upload className="w-4 h-4" />}
          >
            Upload Dataset
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowConnector(!showConnector);
              setShowUploader(false);
              setShowPreview(false);
              setShowAnalysis(false);
            }}
            icon={<Plus className="w-4 h-4" />}
          >
            Add Connection
          </Button>
        </div>
      </div>

      {showUploader && (
        <div className="mb-8">
          <DataUploader />
        </div>
      )}

      {showConnector && (
        <div className="mb-8">
          <DataConnector onConnect={handleConnect} />
        </div>
      )}

      {renderPreviewModal()}
      {renderAnalysis()}

      {datasets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {datasets.map((dataset) => (
            <DatasetCard
              key={dataset.id}
              dataset={dataset}
              onPreview={handlePreview}
              onAnalyze={handleAnalyze}
            />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
            <Database className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No datasets available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your first dataset or connect to an enterprise data source
          </p>
          <div className="flex mt-4 space-x-3">
            <Button
              onClick={() => {
                setShowUploader(true);
                setShowConnector(false);
                setShowPreview(false);
                setShowAnalysis(false);
              }}
              icon={<Upload className="w-4 h-4" />}
            >
              Upload Dataset
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowConnector(true);
                setShowUploader(false);
                setShowPreview(false);
                setShowAnalysis(false);
              }}
              icon={<Plus className="w-4 h-4" />}
            >
              Add Connection
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataManagement;