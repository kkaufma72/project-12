import * as tf from '@tensorflow/tfjs';
import { Matrix } from 'ml-matrix';
import { v4 as uuidv4 } from 'uuid';

export interface AutoMLConfig {
  targetColumn: string;
  featureColumns: string[];
  modelType: 'classification' | 'regression';
  optimizationMetric: string;
  maxTrials: number;
  validationSplit: number;
}

export interface ModelArchitecture {
  layers: number[];
  activations: string[];
  learningRate: number;
  optimizer: string;
}

export class AutoMLEngine {
  private data: any[];
  private config: AutoMLConfig;
  private bestModel: tf.LayersModel | null = null;
  private bestScore: number = -Infinity;
  private trials: Array<{id: string; architecture: ModelArchitecture; score: number}> = [];

  constructor(data: any[], config: AutoMLConfig) {
    this.data = data;
    this.config = config;
  }

  async train(): Promise<{
    model: tf.LayersModel;
    score: number;
    trials: Array<{id: string; architecture: ModelArchitecture; score: number}>;
    featureImportance: {feature: string; importance: number}[];
  }> {
    const { X, y } = this.preprocessData();
    const architectures = this.generateArchitectures();
    
    for (const architecture of architectures) {
      const model = this.buildModel(architecture);
      const score = await this.evaluateModel(model, X, y);
      
      this.trials.push({
        id: uuidv4(),
        architecture,
        score
      });

      if (score > this.bestScore) {
        this.bestScore = score;
        this.bestModel = model;
      }
    }

    const featureImportance = await this.calculateFeatureImportance(X, y);

    return {
      model: this.bestModel!,
      score: this.bestScore,
      trials: this.trials,
      featureImportance
    };
  }

  private preprocessData() {
    // Extract features and target
    const X = this.data.map(row => 
      this.config.featureColumns.map(col => row[col])
    );
    const y = this.data.map(row => row[this.config.targetColumn]);

    // Convert to tensors
    const tensorX = tf.tensor2d(X);
    const tensorY = tf.tensor1d(y);

    return { X: tensorX, y: tensorY };
  }

  private generateArchitectures(): ModelArchitecture[] {
    const architectures: ModelArchitecture[] = [];
    const inputDim = this.config.featureColumns.length;

    // Generate different network architectures
    const layerConfigurations = [
      [inputDim * 2],
      [inputDim * 2, inputDim],
      [inputDim * 3, inputDim * 2, inputDim],
    ];

    const activations = ['relu', 'tanh', 'sigmoid'];
    const learningRates = [0.001, 0.01, 0.1];
    const optimizers = ['adam', 'rmsprop', 'sgd'];

    for (const layers of layerConfigurations) {
      for (const activation of activations) {
        for (const learningRate of learningRates) {
          for (const optimizer of optimizers) {
            architectures.push({
              layers,
              activations: Array(layers.length).fill(activation),
              learningRate,
              optimizer
            });
          }
        }
      }
    }

    return architectures.slice(0, this.config.maxTrials);
  }

  private buildModel(architecture: ModelArchitecture): tf.LayersModel {
    const model = tf.sequential();
    
    architecture.layers.forEach((units, i) => {
      model.add(tf.layers.dense({
        units,
        activation: architecture.activations[i],
        inputShape: i === 0 ? [this.config.featureColumns.length] : undefined
      }));
    });

    // Add output layer
    model.add(tf.layers.dense({
      units: this.config.modelType === 'classification' ? 1 : 1,
      activation: this.config.modelType === 'classification' ? 'sigmoid' : 'linear'
    }));

    model.compile({
      optimizer: tf.train.adam(architecture.learningRate),
      loss: this.config.modelType === 'classification' ? 'binaryCrossentropy' : 'meanSquaredError',
      metrics: ['accuracy']
    });

    return model;
  }

  private async evaluateModel(model: tf.LayersModel, X: tf.Tensor2D, y: tf.Tensor1D): Promise<number> {
    const validationSplit = this.config.validationSplit;
    const splitIndex = Math.floor(X.shape[0] * (1 - validationSplit));
    
    const trainX = X.slice([0, 0], [splitIndex, -1]);
    const trainY = y.slice([0], [splitIndex]);
    const valX = X.slice([splitIndex, 0], [-1, -1]);
    const valY = y.slice([splitIndex], [-1]);

    await model.fit(trainX, trainY, {
      epochs: 50,
      batchSize: 32,
      validationData: [valX, valY],
      verbose: 0
    });

    const evaluation = await model.evaluate(valX, valY) as tf.Scalar[];
    return evaluation[1].dataSync()[0]; // Return validation accuracy
  }

  private async calculateFeatureImportance(X: tf.Tensor2D, y: tf.Tensor1D) {
    if (!this.bestModel) throw new Error('No model trained yet');

    const baselinePredictions = this.bestModel.predict(X) as tf.Tensor;
    const baselineScore = await this.calculateScore(baselinePredictions, y);
    const importance: {feature: string; importance: number}[] = [];

    // Calculate feature importance using permutation importance
    for (let i = 0; i < this.config.featureColumns.length; i++) {
      const permutedX = X.clone();
      const column = permutedX.slice([0, i], [-1, 1]);
      const shuffled = tf.randomShuffle(column);
      permutedX.slice([0, i], [-1, 1]).assign(shuffled);

      const permutedPredictions = this.bestModel.predict(permutedX) as tf.Tensor;
      const permutedScore = await this.calculateScore(permutedPredictions, y);
      
      importance.push({
        feature: this.config.featureColumns[i],
        importance: Math.abs(baselineScore - permutedScore)
      });
    }

    return importance.sort((a, b) => b.importance - a.importance);
  }

  private async calculateScore(predictions: tf.Tensor, actual: tf.Tensor1D): Promise<number> {
    const predArray = await predictions.array();
    const actualArray = await actual.array();
    
    if (this.config.modelType === 'classification') {
      // Calculate accuracy
      const correct = predArray.filter((pred, i) => 
        Math.round(pred) === actualArray[i]
      ).length;
      return correct / predArray.length;
    } else {
      // Calculate R-squared
      const mean = actualArray.reduce((a, b) => a + b) / actualArray.length;
      const totalSS = actualArray.reduce((a, b) => a + Math.pow(b - mean, 2), 0);
      const residualSS = actualArray.reduce((a, b, i) => a + Math.pow(b - predArray[i], 2), 0);
      return 1 - (residualSS / totalSS);
    }
  }
}