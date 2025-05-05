import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Dataset } from '../types';

interface AutoMLDB extends DBSchema {
  datasets: {
    key: string;
    value: Dataset;
    indexes: { 'by-date': Date };
  };
}

class StorageManager {
  private db: Promise<IDBPDatabase<AutoMLDB>>;
  private static instance: StorageManager;

  private constructor() {
    this.db = openDB<AutoMLDB>('automl-storage', 1, {
      upgrade(db) {
        const datasetsStore = db.createObjectStore('datasets', {
          keyPath: 'id'
        });
        datasetsStore.createIndex('by-date', 'dateUploaded');
      },
    });
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager();
    }
    return StorageManager.instance;
  }

  async saveDataset(dataset: Dataset): Promise<void> {
    try {
      const db = await this.db;
      await db.put('datasets', dataset);
    } catch (error) {
      console.error('Error saving dataset:', error);
      throw new Error('Failed to save dataset to local storage');
    }
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    try {
      const db = await this.db;
      return await db.get('datasets', id);
    } catch (error) {
      console.error('Error retrieving dataset:', error);
      throw new Error('Failed to retrieve dataset from local storage');
    }
  }

  async getAllDatasets(): Promise<Dataset[]> {
    try {
      const db = await this.db;
      return await db.getAllFromIndex('datasets', 'by-date');
    } catch (error) {
      console.error('Error retrieving datasets:', error);
      throw new Error('Failed to retrieve datasets from local storage');
    }
  }

  async deleteDataset(id: string): Promise<void> {
    try {
      const db = await this.db;
      await db.delete('datasets', id);
    } catch (error) {
      console.error('Error deleting dataset:', error);
      throw new Error('Failed to delete dataset from local storage');
    }
  }

  async clearAllDatasets(): Promise<void> {
    try {
      const db = await this.db;
      await db.clear('datasets');
    } catch (error) {
      console.error('Error clearing datasets:', error);
      throw new Error('Failed to clear datasets from local storage');
    }
  }
}

export const storage = StorageManager.getInstance();