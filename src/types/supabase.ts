export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      datasets: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          file_type: string;
          file_size: string;
          row_count: number;
          column_count: number;
          preview_data: any;
          project_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          file_type: string;
          file_size: string;
          row_count: number;
          column_count: number;
          preview_data?: any;
          project_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          file_type?: string;
          file_size?: string;
          row_count?: number;
          column_count?: number;
          preview_data?: any;
          project_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      models: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          model_type: string;
          status: string;
          dataset_id: string | null;
          project_id: string;
          hyperparameters: any;
          training_config: any;
          metadata: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          model_type: string;
          status?: string;
          dataset_id?: string | null;
          project_id: string;
          hyperparameters?: any;
          training_config?: any;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          model_type?: string;
          status?: string;
          dataset_id?: string | null;
          project_id?: string;
          hyperparameters?: any;
          training_config?: any;
          metadata?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}