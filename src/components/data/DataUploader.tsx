import React, { useState, useRef } from 'react';
import { FileUp, AlertCircle, Check, Loader2 } from 'lucide-react';
import { useMLContext } from '../../context/MLContext';
import Button from '../common/Button';
import Card from '../common/Card';

const DataUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addDataset, currentProject } = useMLContext();

  const MAX_NAME_LENGTH = 100;

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/json', 'text/css'];
    const fileType = file.type || `text/${file.name.split('.').pop()?.toLowerCase()}`;
    
    if (!validTypes.includes(fileType)) {
      setError('Please upload a CSV, Excel, JSON, or CSS file');
      setFile(null);
      return;
    }
    setFile(file);
  };

  const truncateFileName = (name: string): string => {
    if (name.length <= MAX_NAME_LENGTH) return name;
    
    const extension = name.split('.').pop() || '';
    const nameWithoutExt = name.slice(0, -(extension.length + 1));
    const maxBaseLength = MAX_NAME_LENGTH - (extension.length + 4); // 4 accounts for '...' and '.'
    
    return `${nameWithoutExt.slice(0, maxBaseLength)}...${extension}`;
  };

  const parseFileContent = async (content: string, fileType: string) => {
    if (fileType === 'text/csv') {
      const lines = content.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
      return { columns: headers, rows };
    } else if (fileType === 'application/json') {
      const data = JSON.parse(content);
      if (Array.isArray(data)) {
        const headers = Object.keys(data[0] || {});
        const rows = data.map(item => headers.map(header => String(item[header] || '')));
        return { columns: headers, rows };
      }
    } else if (fileType === 'text/css') {
      const rules = content.split('}')
        .filter(block => block.trim())
        .map(block => {
          const [selector = '', properties = ''] = block.split('{');
          return [
            selector.trim(),
            properties.trim(),
            block.split('\n')[0].trim()
          ];
        });
      return {
        columns: ['Selector', 'Properties', 'Line'],
        rows: rules
      };
    }
    return { columns: [], rows: [] };
  };

  const handleUpload = async () => {
    if (!file || !currentProject) return;

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Read file content
      const fileContent = await file.text();
      const fileType = file.type || `text/${file.name.split('.').pop()?.toLowerCase()}`;
      
      // Parse content based on file type
      const previewData = await parseFileContent(fileContent, fileType);
      
      if (!previewData.columns.length) {
        throw new Error('Unable to parse file content');
      }

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 95 ? 95 : newProgress;
        });
      }, 300);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearInterval(interval);
      setUploadProgress(100);

      const fileSize = (file.size / 1024).toFixed(1) + ' KB';
      
      const newDataset = {
        id: `dataset-${Date.now()}`,
        name: truncateFileName(file.name),
        description: `Uploaded ${fileType.split('/')[1]} file`,
        rows: previewData.rows.length,
        columns: previewData.columns.length,
        dateUploaded: new Date().toISOString(),
        fileType: file.name.split('.').pop() || '',
        fileSize,
        projectId: currentProject.id,
        previewData
      };

      await addDataset(newDataset);
      setUploading(false);
      setFile(null);
      setUploadProgress(0);
    } catch (error) {
      clearInterval(interval);
      setError(error instanceof Error ? error.message : 'Failed to upload file. Please try again.');
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="h-full">
      <div
        className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg ${
          isDragging ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
        } transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!file && !uploading && (
          <>
            <FileUp className="w-12 h-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Drag and drop your file here
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: CSV, Excel, JSON, CSS (max 100MB)
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={triggerFileInput}
            >
              Select file
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".csv,.xlsx,.xls,.json,.css"
              onChange={handleFileChange}
            />
          </>
        )}

        {file && !uploading && (
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-green-500" />
                <span className="ml-2 text-sm font-medium text-gray-900">
                  {file.name.length > MAX_NAME_LENGTH ? truncateFileName(file.name) : file.name}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFile(null)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleUpload}>
                Upload
              </Button>
            </div>
          </div>
        )}

        {uploading && (
          <div className="w-full">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 mr-2 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium text-gray-900">
                {uploadProgress < 100
                  ? `Uploading ${file?.name}...`
                  : 'Processing...'}
              </span>
            </div>
            <div className="w-full h-2 mt-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">
                {uploadProgress.toFixed(0)}%
              </span>
              {uploadProgress < 100 && file && (
                <span className="text-xs text-gray-500">
                  {((file.size * (uploadProgress / 100)) / (1024 * 1024)).toFixed(2)} MB / {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center mt-4 text-sm text-red-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
};

export default DataUploader;