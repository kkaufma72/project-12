import { Matrix } from 'ml-matrix';

export interface OptimizationConfig {
  metric: 'accuracy' | 'f1' | 'precision' | 'recall' | 'rmse' | 'mae';
  maxIterations: number;
  tolerance: number;
}

export class ModelOptimizer {
  private data: Matrix;
  private labels: number[];
  private config: OptimizationConfig;

  constructor(data: number[][], labels: number[], config: OptimizationConfig) {
    this.data = new Matrix(data);
    this.labels = labels;
    this.config = config;
  }

  optimizeHyperparameters(parameterRanges: Record<string, [number, number]>) {
    const results: Array<{
      parameters: Record<string, number>;
      score: number;
    }> = [];

    // Bayesian optimization implementation
    for (let i = 0; i < this.config.maxIterations; i++) {
      const parameters = this.sampleParameters(parameterRanges);
      const score = this.evaluateParameters(parameters);
      
      results.push({ parameters, score });

      if (i > 0 && Math.abs(results[i].score - results[i-1].score) < this.config.tolerance) {
        break;
      }
    }

    return results.sort((a, b) => b.score - a.score)[0];
  }

  private sampleParameters(ranges: Record<string, [number, number]>) {
    const parameters: Record<string, number> = {};
    
    for (const [param, [min, max]] of Object.entries(ranges)) {
      parameters[param] = min + Math.random() * (max - min);
    }
    
    return parameters;
  }

  private evaluateParameters(parameters: Record<string, number>): number {
    // Simplified cross-validation
    const folds = this.createFolds(5);
    const scores = [];

    for (const fold of folds) {
      const trainData = this.data.subset(fold.trainIndices);
      const trainLabels = fold.trainIndices.map(i => this.labels[i]);
      const testData = this.data.subset(fold.testIndices);
      const testLabels = fold.testIndices.map(i => this.labels[i]);

      const model = this.trainModel(trainData, trainLabels, parameters);
      const predictions = this.predict(model, testData);
      const score = this.calculateMetric(predictions, testLabels);
      
      scores.push(score);
    }

    return scores.reduce((a, b) => a + b) / scores.length;
  }

  private createFolds(k: number) {
    const indices = Array.from({length: this.data.rows}, (_, i) => i);
    const foldSize = Math.floor(indices.length / k);
    const folds = [];

    for (let i = 0; i < k; i++) {
      const start = i * foldSize;
      const end = i === k - 1 ? indices.length : start + foldSize;
      
      const testIndices = indices.slice(start, end);
      const trainIndices = indices.filter(idx => !testIndices.includes(idx));
      
      folds.push({ trainIndices, testIndices });
    }

    return folds;
  }

  private trainModel(data: Matrix, labels: number[], parameters: Record<string, number>) {
    // Simplified model training
    return {
      weights: data.transpose().mmul(new Matrix([labels]).transpose()),
      parameters
    };
  }

  private predict(model: any, data: Matrix) {
    return data.mmul(model.weights).to1DArray();
  }

  private calculateMetric(predictions: number[], actuals: number[]): number {
    switch (this.config.metric) {
      case 'accuracy':
        return predictions.filter((p, i) => Math.round(p) === actuals[i]).length / predictions.length;
      
      case 'f1':
        const precision = this.calculatePrecision(predictions, actuals);
        const recall = this.calculateRecall(predictions, actuals);
        return 2 * (precision * recall) / (precision + recall);
      
      case 'precision':
        return this.calculatePrecision(predictions, actuals);
      
      case 'recall':
        return this.calculateRecall(predictions, actuals);
      
      case 'rmse':
        return Math.sqrt(
          predictions.reduce((acc, p, i) => 
            acc + Math.pow(p - actuals[i], 2), 0
          ) / predictions.length
        );
      
      case 'mae':
        return predictions.reduce((acc, p, i) => 
          acc + Math.abs(p - actuals[i]), 0
        ) / predictions.length;
      
      default:
        throw new Error(`Unsupported metric: ${this.config.metric}`);
    }
  }

  private calculatePrecision(predictions: number[], actuals: number[]): number {
    const truePositives = predictions.filter((p, i) => Math.round(p) === 1 && actuals[i] === 1).length;
    const falsePositives = predictions.filter((p, i) => Math.round(p) === 1 && actuals[i] === 0).length;
    return truePositives / (truePositives + falsePositives);
  }

  private calculateRecall(predictions: number[], actuals: number[]): number {
    const truePositives = predictions.filter((p, i) => Math.round(p) === 1 && actuals[i] === 1).length;
    const falseNegatives = predictions.filter((p, i) => Math.round(p) === 0 && actuals[i] === 1).length;
    return truePositives / (truePositives + falseNegatives);
  }
}