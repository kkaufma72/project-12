import React from 'react';
import { FileSpreadsheet, ExternalLink, BarChart2 } from 'lucide-react';
import { Dataset } from '../../types';
import Button from '../common/Button';
import Card from '../common/Card';

interface DatasetCardProps {
  dataset: Dataset;
  onPreview: (dataset: Dataset) => void;
  onAnalyze: (dataset: Dataset) => void;
}

const DatasetCard: React.FC<DatasetCardProps> = ({ 
  dataset, 
  onPreview, 
  onAnalyze 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      className="h-full transition-shadow hover:shadow-md"
    >
      <div className="flex items-start">
        <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg">
          <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
        </div>
        <div className="flex-1 ml-4">
          <h3 className="text-lg font-medium text-gray-900">{dataset.name}</h3>
          <p className="mt-1 text-sm text-gray-500">{dataset.description}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Rows</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{dataset.rows?.toLocaleString() ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Columns</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{dataset.columns ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Format</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{dataset.fileType?.toUpperCase() ?? 'N/A'}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase">Size</p>
          <p className="mt-1 text-sm font-medium text-gray-900">{dataset.fileSize ?? 'N/A'}</p>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        Uploaded on {dataset.dateUploaded ? formatDate(dataset.dateUploaded) : 'N/A'}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        <Button
          size="sm"
          variant="outline" 
          icon={<ExternalLink className="w-4 h-4" />}
          onClick={() => onPreview(dataset)}
        >
          Preview
        </Button>
        <Button 
          size="sm"
          variant="outline"
          icon={<BarChart2 className="w-4 h-4" />}
          onClick={() => onAnalyze(dataset)}
        >
          Analyze
        </Button>
      </div>
    </Card>
  );
};

export default DatasetCard;