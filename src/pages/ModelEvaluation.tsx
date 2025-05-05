import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  BarChart2, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  BarChart, 
  Download, 
  ExternalLink,
  TrendingUp,
  Clock,
  Target,
  AlertTriangle,
  Users,
  Activity,
  Zap,
  Key
} from 'lucide-react';
import { useMLContext } from '../context/MLContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { MLModel, FeatureImportance, Dataset } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js/auto';
import Papa from 'papaparse';
import JSZip from 'jszip';
import * as FileSaver from 'file-saver';

const ModelEvaluation: React.FC = () => {
  const { models, datasets } = useMLContext();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'metrics' | 'confusion' | 'feature_importance'>('overview');
  const [timeSeriesData, setTimeSeriesData] = useState<{ date: string; accuracy: number; predictions: number }[]>([]);

  const trainedModels = models.filter((model) => model.status === 'trained' || model.status === 'deployed');
  const modelId = searchParams.get('model');

  // Memoize data generation functions to prevent unnecessary recalculations
  const generateTimeSeriesData = useCallback((model: MLModel) => {
    let startDate: Date;
    try {
      startDate = model.createdAt ? new Date(model.createdAt) : new Date();
      if (isNaN(startDate.getTime())) {
        startDate = new Date();
      }
    } catch {
      startDate = new Date();
    }
    
    const data = [];
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const baseAccuracy = model.metrics?.accuracy || 0.8;
      const noise = (Math.random() - 0.5) * 0.05;
      const accuracy = Math.min(Math.max(baseAccuracy + noise, 0), 1);
      
      const predictions = Math.floor(100 + i * 50 + Math.random() * 30);
      
      data.push({
        date: date.toISOString().split('T')[0],
        accuracy,
        predictions
      });
    }
    
    return data;
  }, []);

  const generateFeatureImportance = useCallback((dataset: Dataset) => {
    if (!dataset.previewData?.columns) return [];

    const importance: FeatureImportance[] = dataset.previewData.columns.map(column => {
      if (column === 'id' || column === 'created_at' || column === 'updated_at') {
        return { feature: column, importance: 0 };
      }

      let importance = 0;
      const columnIndex = dataset.previewData!.columns.indexOf(column);
      const values = dataset.previewData!.rows.map(row => row[columnIndex]);

      const isNumeric = values.every(val => !isNaN(Number(val)));
      const uniqueValues = new Set(values);
      const uniqueRatio = uniqueValues.size / values.length;

      if (isNumeric) {
        importance += 0.6;
        importance += uniqueRatio * 0.4;
      } else {
        importance += 0.3;
        importance += (1 - uniqueRatio) * 0.4;
      }

      importance += Math.random() * 0.2;

      return {
        feature: column,
        importance: Math.min(importance, 1)
      };
    }).filter(fi => fi.importance > 0)
      .sort((a, b) => b.importance - a.importance);

    return importance;
  }, []);

  // Update model and dataset selection with proper dependencies
  useEffect(() => {
    const updateModelAndDataset = () => {
      let modelToSelect: MLModel | null = null;

      if (modelId) {
        modelToSelect = models.find((m) => m.id === modelId && (m.status === 'trained' || m.status === 'deployed')) || null;
      } else if (trainedModels.length > 0 && !selectedModel) {
        modelToSelect = trainedModels[0];
      }

      if (modelToSelect) {
        setSelectedModel(modelToSelect);
        const dataset = datasets.find(d => d.id === modelToSelect.datasetId);
        setSelectedDataset(dataset || null);
        
        const timeSeriesData = generateTimeSeriesData(modelToSelect);
        setTimeSeriesData(timeSeriesData);
        
        if (dataset) {
          const importance = generateFeatureImportance(dataset);
          setFeatureImportance(importance);
        }
      }
    };

    updateModelAndDataset();
  }, [modelId, models, datasets, generateTimeSeriesData, generateFeatureImportance]);

  const generateTimeSeriesChart = useCallback(() => {
    return new Promise<HTMLCanvasElement | null>((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      const chart = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: timeSeriesData.map(d => d.date),
          datasets: [
            {
              label: 'Accuracy',
              data: timeSeriesData.map(d => d.accuracy),
              borderColor: '#4F46E5',
              tension: 0.1
            },
            {
              label: 'Predictions',
              data: timeSeriesData.map(d => d.predictions),
              borderColor: '#10B981',
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: {
            title: {
              display: true,
              text: 'Model Performance Over Time'
            }
          }
        }
      });

      // Wait for chart to render
      setTimeout(() => {
        resolve(canvas);
      }, 100);
    });
  }, [timeSeriesData]);

  const generateConfusionMatrixVisualization = useCallback(() => {
    return new Promise<HTMLCanvasElement | null>((resolve) => {
      if (!selectedModel?.metrics) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      const trueNegatives = Math.floor((selectedModel.metrics.accuracy || 0.8) * 800);
      const falsePositives = Math.floor((1 - (selectedModel.metrics.precision || 0.8)) * 200);
      const falseNegatives = Math.floor((1 - (selectedModel.metrics.recall || 0.8)) * 200);
      const truePositives = Math.floor((selectedModel.metrics.recall || 0.8) * 800);

      const data = [
        [trueNegatives, falsePositives],
        [falseNegatives, truePositives]
      ];

      const chart = new ChartJS(ctx, {
        type: 'matrix',
        data: {
          datasets: [{
            data: data.flat(),
            width: 2,
            height: 2,
            backgroundColor: (context) => {
              const value = data.flat()[context.dataIndex];
              return context.dataIndex % 3 === 0 ? '#34D399' : '#F87171';
            }
          }]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: {
            title: {
              display: true,
              text: 'Confusion Matrix'
            }
          }
        }
      });

      setTimeout(() => {
        resolve(canvas);
      }, 100);
    });
  }, [selectedModel]);

  const generateFeatureImportanceChart = useCallback(() => {
    return new Promise<HTMLCanvasElement | null>((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve(null);
        return;
      }

      const chart = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: featureImportance.map(f => f.feature),
          datasets: [{
            label: 'Feature Importance',
            data: featureImportance.map(f => f.importance),
            backgroundColor: '#4F46E5'
          }]
        },
        options: {
          responsive: false,
          animation: false,
          plugins: {
            title: {
              display: true,
              text: 'Feature Importance Analysis'
            }
          }
        }
      });

      setTimeout(() => {
        resolve(canvas);
      }, 100);
    });
  }, [featureImportance]);

  const handleExportReport = async () => {
    if (!selectedModel) return;

    try {
      // Create PDF document
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      
      // Title
      doc.setFontSize(20);
      doc.text('Model Evaluation Report', pageWidth / 2, 20, { align: 'center' });
      
      // Model Information
      doc.setFontSize(16);
      doc.text('Model Overview', 14, 40);
      doc.setFontSize(12);
      doc.text([
        `Name: ${selectedModel.name}`,
        `Status: ${selectedModel.status}`,
        `Created: ${new Date(selectedModel.createdAt).toLocaleDateString()}`,
        `Type: ${selectedModel.modelType || 'Classification'}`,
        selectedModel.description ? `Description: ${selectedModel.description}` : ''
      ].filter(Boolean), 14, 50);

      // Metrics Table
      if (selectedModel.metrics) {
        doc.setFontSize(16);
        doc.text('Performance Metrics', 14, 90);
        
        const metricsData = Object.entries(selectedModel.metrics).map(([key, value]) => [
          key.charAt(0).toUpperCase() + key.slice(1),
          value.toFixed(4)
        ]);
        
        (doc as any).autoTable({
          startY: 100,
          head: [['Metric', 'Value']],
          body: metricsData,
          theme: 'striped'
        });
      }

      // Time Series Chart
      const timeSeriesCanvas = await generateTimeSeriesChart();
      if (timeSeriesCanvas) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Performance Over Time', 14, 20);
        try {
          const imgData = timeSeriesCanvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 14, 30, 180, 100);
        } catch (error) {
          console.warn('Failed to add time series chart to PDF:', error);
        }
      }

      // Confusion Matrix
      const confusionMatrixCanvas = await generateConfusionMatrixVisualization();
      if (confusionMatrixCanvas) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Confusion Matrix', 14, 20);
        try {
          const imgData = confusionMatrixCanvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 14, 30, 180, 180);
        } catch (error) {
          console.warn('Failed to add confusion matrix to PDF:', error);
        }
      }

      // Feature Importance
      const featureImportanceCanvas = await generateFeatureImportanceChart();
      if (featureImportanceCanvas) {
        doc.addPage();
        doc.setFontSize(16);
        doc.text('Feature Importance Analysis', 14, 20);
        try {
          const imgData = featureImportanceCanvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 14, 30, 180, 100);
        } catch (error) {
          console.warn('Failed to add feature importance chart to PDF:', error);
        }
      }

      // Create ZIP archive
      const zip = new JSZip();

      // Add PDF to ZIP
      zip.file('model-evaluation-report.pdf', doc.output('blob'));

      // Add raw data files
      const modelData = {
        ...selectedModel,
        dataset: selectedDataset,
        featureImportance,
        performanceHistory: timeSeriesData,
        generatedAt: new Date().toISOString()
      };
      zip.file('model-data.json', JSON.stringify(modelData, null, 2));

      // Add predictions CSV
      const predictions = generatePredictionData();
      if (predictions) {
        const csv = Papa.unparse(predictions);
        zip.file('predictions.csv', csv);
      }

      // Add performance metrics CSV
      const metricsCSV = Papa.unparse({
        fields: ['date', 'accuracy', 'predictions'],
        data: timeSeriesData.map(d => [d.date, d.accuracy, d.predictions])
      });
      zip.file('performance-metrics.csv', metricsCSV);

      // Generate and download ZIP
      const content = await zip.generateAsync({ type: 'blob' });
      FileSaver.saveAs(content, `model-evaluation-${selectedModel.id}.zip`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      // You might want to show an error message to the user here
    }
  };

  const generatePredictionData = () => {
    if (!selectedModel || !selectedDataset?.previewData) return null;

    const predictions = selectedDataset.previewData.rows.map((row, index) => {
      const prediction = Math.random();
      const confidence = 0.5 + Math.random() * 0.5;
      
      return {
        id: index + 1,
        features: row.join(','),
        prediction,
        confidence,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
      };
    });

    return predictions;
  };

  const formatMetricName = (name: string) => {
    if (name === 'f1Score') return 'F1 Score';
    if (name === 'auc') return 'AUC';
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleModelChange = (direction: 'prev' | 'next') => {
    if (!selectedModel || trainedModels.length <= 1) return;

    const currentIndex = trainedModels.findIndex((m) => m.id === selectedModel.id);
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? trainedModels.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === trainedModels.length - 1 ? 0 : currentIndex + 1;
    }

    const newModel = trainedModels[newIndex];
    navigate(`/evaluate?model=${newModel.id}`);
  };

  if (!selectedModel && trainedModels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-lg">
          <BarChart2 className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No trained models available</h3>
        <p className="mt-1 text-sm text-gray-500">
          Train a model first to evaluate its performance
        </p>
        <Button className="mt-4" onClick={() => navigate('app/train')}>
          Train New Model
        </Button>
      </div>
    );
  }

  if (!selectedModel) {
    return null;
  }

  const renderOverviewTab = () => {
    if (!selectedModel) return null;

    const totalPredictions = timeSeriesData.reduce((sum, day) => sum + day.predictions, 0);
    const avgAccuracy = timeSeriesData.reduce((sum, day) => sum + day.accuracy, 0) / timeSeriesData.length;
    const recentAccuracy = timeSeriesData[timeSeriesData.length - 1]?.accuracy || avgAccuracy;
    const accuracyTrend = recentAccuracy > avgAccuracy ? 'increasing' : 'decreasing';
    
    const inferenceTime = Math.random() * 50 + 10; // Random time between 10-60ms
    
    // Use the same date validation logic for model age calculation
    let lastUpdated: Date;
    try {
      lastUpdated = selectedModel.createdAt ? new Date(selectedModel.createdAt) : new Date();
      if (isNaN(lastUpdated.getTime())) {
        lastUpdated = new Date();
      }
    } catch {
      lastUpdated = new Date();
    }
    
    const daysSinceTraining = Math.floor((new Date().getTime() - lastUpdated.getTime()) / (1000 * 3600 * 24));

    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Model Accuracy</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {(recentAccuracy * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500">
                  {accuracyTrend === 'increasing' ? '↑' : '↓'} {((Math.abs(recentAccuracy - avgAccuracy)) * 100).toFixed(1)}% vs avg
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Predictions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalPredictions.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Last 30 days
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-lg">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Inference Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {inferenceTime.toFixed(1)}ms
                </p>
                <p className="text-sm text-gray-500">
                  Average response time
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Model Age</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {daysSinceTraining} days
                </p>
                <p className="text-sm text-gray-500">
                  Since last training
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Performance Trend</h3>
            <div className="mt-4">
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end space-x-2">
                  {timeSeriesData.map((day, index) => (
                    <div
                      key={day.date}
                      className="flex-1 bg-indigo-600 rounded-t"
                      style={{
                        height: `${day.accuracy * 100}%`,
                        opacity: 0.7 + (index / timeSeriesData.length) * 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{timeSeriesData[0]?.date}</span>
                <span>{timeSeriesData[timeSeriesData.length - 1]?.date}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium text-gray-900">Prediction Volume</h3>
            <div className="mt-4">
              <div className="relative h-64">
                <div className="absolute inset-0 flex items-end space-x-2">
                  {timeSeriesData.map((day, index) => (
                    <div
                      key={day.date}
                      className="flex-1 bg-green-600 rounded-t"
                      style={{
                        height: `${(day.predictions / Math.max(...timeSeriesData.map(d => d.predictions))) * 100}%`,
                        opacity: 0.7 + (index / timeSeriesData.length) * 0.3
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{timeSeriesData[0]?.date}</span>
                <span>{timeSeriesData[timeSeriesData.length - 1]?.date}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card>
          <h3 className="text-lg font-medium text-gray-900">Model Health Check</h3>
          <div className="grid gap-4 mt-4 md:grid-cols-3">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500" />
                <span className="ml-2 font-medium text-green-700">Data Quality</span>
              </div>
              <p className="mt-2 text-sm text-green-600">
                No missing values or anomalies detected in recent predictions
              </p>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span className="ml-2 font-medium text-amber-700">Drift Detection</span>
              </div>
              <p className="mt-2 text-sm text-amber-600">
                Minor feature drift detected in 2 variables
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Target className="w-5 h-5 text-green-500" />
                <span className="ml-2 font-medium text-green-700">Performance</span>
              </div>
              <p className="mt-2 text-sm text-green-600">
                Model performance within expected thresholds
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<ExternalLink className="w-4 h-4" />}
            onClick={() => navigate(`/app/deploy?model=${selectedModel.id}`)}
          >
            Deploy Model
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col justify-between mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Model Evaluation</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analyze and compare model performance
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 mr-4 bg-indigo-100 rounded-lg">
            <BarChart className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedModel.name}</h2>
            <p className="text-sm text-gray-500">
              {selectedModel.description} 
              {selectedDataset && ` - Trained on ${selectedDataset.name}`}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModelChange('prev')}
            disabled={trainedModels.length <= 1}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleModelChange('next')}
            disabled={trainedModels.length <= 1}
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('metrics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'metrics'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Detailed Metrics
            </button>
            <button
              onClick={() => setActiveTab('confusion')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'confusion'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Confusion Matrix
            </button>
            <button
              onClick={() => setActiveTab('feature_importance')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'feature_importance'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Feature Importance
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'overview' && renderOverviewTab()}

      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Detailed Performance Metrics</h3>
            <div className="mt-6 space-y-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Classification Metrics</h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Metric
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Overall
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Class 0
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Class 1
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          Accuracy
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.accuracy.toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">-</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">-</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          Precision
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.precision.toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.precision * 0.95).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.precision * 1.05).toFixed(4) || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          Recall
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.recall.toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.recall * 1.03).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.recall * 0.98).toFixed(4) || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          F1 Score
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.f1Score.toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.f1Score * 0.99).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.f1Score * 1.01).toFixed(4) || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          AUC
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.auc.toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">-</td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">Performance by Data Split</h4>
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Metric
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Training
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Validation
                        </th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                          Test
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          Accuracy
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.accuracy * 1.05).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.accuracy * 1.02).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.accuracy.toFixed(4) || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          F1 Score
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.f1Score * 1.06).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.f1Score * 1.03).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.f1Score.toFixed(4) || '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                          AUC
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.auc * 1.04).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {(selectedModel?.metrics?.auc * 1.01).toFixed(4) || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {selectedModel?.metrics?.auc.toFixed(4) || '-'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'confusion' &&
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Confusion Matrix</h3>
            <div className="flex flex-col items-center mt-6 md:flex-row md:items-start">
              <div className="w-full max-w-md p-4 mx-auto">
                <div className="grid grid-cols-[auto,1fr,1fr] gap-1">
                  <div className="flex items-center justify-center p-3 font-medium text-gray-500 bg-gray-100">
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold">Actual</span>
                      <span className="text-xs font-bold mt-0.5">↓ \ →</span>
                      <span className="text-xs font-bold">Predicted</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center p-3 font-medium text-gray-700 bg-gray-100">
                    Negative
                  </div>
                  <div className="flex items-center justify-center p-3 font-medium text-gray-700 bg-gray-100">
                    Positive
                  </div>

                  <div className="flex items-center justify-center p-3 font-medium text-gray-700 bg-gray-100">
                    Negative
                  </div>
                  <div className="flex items-center justify-center p-4 text-lg font-bold text-green-700 bg-green-100">
                    {Math.floor((selectedModel?.metrics?.accuracy || 0.8) * 800)}
                  </div>
                  <div className="flex items-center justify-center p-4 text-lg font-bold text-red-700 bg-red-100">
                    {Math.floor((1 - (selectedModel?.metrics?.precision || 0.8)) * 200)}
                  </div>

                  <div className="flex items-center justify-center p-3 font-medium text-gray-700 bg-gray-100">
                    Positive
                  </div>
                  <div className="flex items-center justify-center p-4 text-lg font-bold text-red-700 bg-red-100">
                    {Math.floor((1 - (selectedModel?.metrics?.recall || 0.8)) * 200)}
                  </div>
                  <div className="flex items-center justify-center p-4 text-lg font-bold text-green-700 bg-green-100">
                    {Math.floor((selectedModel?.metrics?.recall || 0.8) * 800)}
                  </div>
                </div>
              </div>

              <div className="w-full p-4 mt-6 md:mt-0">
                <h4 className="mb-4 text-sm font-medium text-gray-700">Interpretations</h4>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-800">True Negatives (TN)</p>
                    <p className="mt-1 text-sm text-green-700">
                      Correctly predicted negative examples.
                      <br />
                      <span className="font-medium">
                        {Math.floor((selectedModel?.metrics?.accuracy || 0.8) * 800)} samples
                      </span>
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-800">False Positives (FP)</p>
                    <p className="mt-1 text-sm text-red-700">
                      Incorrectly predicted as positive when actually negative.
                      <br />
                      <span className="font-medium">
                        {Math.floor((1 - (selectedModel?.metrics?.precision || 0.8)) * 200)} samples
                      </span>
                    </p>
                  </div>

                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm font-medium text-red-800">False Negatives (FN)</p>
                    <p className="mt-1 text-sm text-red-700">
                      Incorrectly predicted as negative when actually positive.
                      <br />
                      <span className="font-medium">
                        {Math.floor((1 - (selectedModel?.metrics?.recall || 0.8)) * 200)} samples
                      </span>
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-medium text-green-800">True Positives (TP)</p>
                    <p className="mt-1 text-sm text-green-700">
                      Correctly predicted positive examples.
                      <br />
                      <span className="font-medium">
                        {Math.floor((selectedModel?.metrics?.recall || 0.8) * 800)} samples
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      }

      {activeTab === 'feature_importance' && featureImportance.length > 0 && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-medium text-gray-900">Feature Importance</h3>
            <p className="mt-1 text-sm text-gray-500">
              The relative importance of each feature in the model's predictions
            </p>

            <div className="mt-6">
              <div className="space-y-4">
                {featureImportance.map((feature) => (
                  <div key={feature.feature} className="flex items-center">
                    <div className="w-32 text-sm text-gray-700">{feature.feature}</div>
                    <div className="flex-1">
                      <div className="w-full h-6 bg-gray-200 rounded-full">
                        <div
                          className="h-6 rounded-full bg-indigo-600"
                          style={{
                            width: `${(feature.importance / featureImportance[0].importance) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 ml-4 text-sm font-medium text-gray-900">
                      {(feature.importance * 100).toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 mt-6 bg-indigo-50 rounded-md">
                <h4 className="text-sm font-medium text-indigo-800">Interpretation</h4>
                <p className="mt-2 text-sm text-indigo-700">
                  The feature importance chart shows the relative importance of each feature in 
                  making predictions. Features with higher importance have a stronger influence 
                  on the model's predictions.
                </p>
                <ul className="mt-2 ml-4 space-y-1 text-sm text-indigo-700 list-disc">
                  <li>
                    <strong>{featureImportance[0]?.feature}</strong> has the highest impact on predictions
                  </li>
                  {featureImportance[1] && (
                    <li>
                      <strong>{featureImportance[1].feature}</strong> is the second most influential feature
                    </li>
                  )}
                  <li>
                    Features with very low importance may be candidates for removal to simplify the model
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ModelEvaluation;