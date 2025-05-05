import React, { useState } from 'react';
import { Check, AlertTriangle, X, RefreshCw } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { z } from 'zod';

interface ValidationRule {
  id: string;
  name: string;
  field: string;
  type: 'required' | 'format' | 'range' | 'custom';
  condition: string;
  enabled: boolean;
}

const DataValidation: React.FC = () => {
  const [rules, setRules] = useState<ValidationRule[]>([
    {
      id: '1',
      name: 'Age Range',
      field: 'age',
      type: 'range',
      condition: '0 <= value <= 120',
      enabled: true
    },
    {
      id: '2',
      name: 'Email Format',
      field: 'email',
      type: 'format',
      condition: 'email',
      enabled: true
    },
    {
      id: '3',
      name: 'Required Fields',
      field: 'name',
      type: 'required',
      condition: 'not_null',
      enabled: true
    }
  ]);

  const [validationResults, setValidationResults] = useState<{
    passed: number;
    failed: number;
    details: Array<{ rule: string; status: 'passed' | 'failed'; message: string }>;
  }>({
    passed: 0,
    failed: 0,
    details: []
  });

  const [isValidating, setIsValidating] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const validateData = () => {
    setIsValidating(true);

    // Simulate data validation
    setTimeout(() => {
      const results = {
        passed: Math.floor(Math.random() * 950) + 50,
        failed: Math.floor(Math.random() * 50),
        details: rules
          .filter(rule => rule.enabled)
          .map(rule => ({
            rule: rule.name,
            status: Math.random() > 0.1 ? 'passed' : 'failed',
            message: `Validated ${rule.field} against ${rule.condition}`
          })) as Array<{ rule: string; status: 'passed' | 'failed'; message: string }>
      };

      setValidationResults(results);
      setIsValidating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Data Validation Rules</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure and manage data validation rules
          </p>
        </div>
        <Button
          onClick={validateData}
          disabled={isValidating}
          icon={isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : undefined}
        >
          {isValidating ? 'Validating...' : 'Run Validation'}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-medium text-gray-700">Validation Rules</h3>
          <div className="mt-4 space-y-4">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{rule.name}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {rule.field}: {rule.condition}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggleRule(rule.id)}
                    className={`relative inline-flex flex-shrink-0 h-6 transition-colors duration-200 ease-in-out border-2 border-transparent rounded-full cursor-pointer w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      rule.enabled ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      } inline-block w-5 h-5 transform bg-white rounded-full transition-transform`}
                    ></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {validationResults.details.length > 0 && (
          <Card>
            <h3 className="text-sm font-medium text-gray-700">Validation Results</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="ml-2 text-sm font-medium text-green-700">
                    Passed: {validationResults.passed}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-500" />
                  <span className="ml-2 text-sm font-medium text-red-700">
                    Failed: {validationResults.failed}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              {validationResults.details.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.status === 'passed' ? 'bg-green-50' : 'bg-red-50'
                  }`}
                >
                  <div className="flex items-center">
                    {result.status === 'passed' ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          result.status === 'passed' ? 'text-green-800' : 'text-red-800'
                        }`}
                      >
                        {result.rule}
                      </p>
                      <p
                        className={`mt-1 text-sm ${
                          result.status === 'passed' ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {result.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DataValidation;