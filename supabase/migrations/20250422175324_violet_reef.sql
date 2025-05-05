/*
  # Database Index Optimization
  
  1. New Indexes
    - Add covering indexes for foreign keys to improve join performance
    - Index naming follows convention: idx_{table}_{column}
  
  2. Cleanup
    - Remove unused indexes to reduce maintenance overhead
    - Keep only necessary indexes for performance
*/

-- Add indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_ai_marketplace_provider_id ON ai_marketplace(provider_id);
CREATE INDEX IF NOT EXISTS idx_ai_workflows_user_id ON ai_workflows(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_dashboards_last_modified_by ON analytics_dashboards(last_modified_by);
CREATE INDEX IF NOT EXISTS idx_automl_jobs_created_by ON automl_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_automl_results_best_model_id ON automl_results(best_model_id);
CREATE INDEX IF NOT EXISTS idx_business_metrics_user_id ON business_metrics(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_connection_recommendations_recommended_user_id ON connection_recommendations(recommended_user_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected_user_id ON connections(connected_user_id);
CREATE INDEX IF NOT EXISTS idx_dashboard_widgets_data_source_id ON dashboard_widgets(data_source_id);
CREATE INDEX IF NOT EXISTS idx_data_center_access_data_center_id ON data_center_access(data_center_id);
CREATE INDEX IF NOT EXISTS idx_data_center_alerts_data_center_id ON data_center_alerts(data_center_id);
CREATE INDEX IF NOT EXISTS idx_data_center_assets_assigned_to ON data_center_assets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_data_center_communications_sent_by ON data_center_communications(sent_by);
CREATE INDEX IF NOT EXISTS idx_data_center_maintenance_data_center_id ON data_center_maintenance(data_center_id);
CREATE INDEX IF NOT EXISTS idx_data_center_metrics_data_center_id ON data_center_metrics(data_center_id);
CREATE INDEX IF NOT EXISTS idx_data_center_tickets_assigned_to ON data_center_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_data_center_tickets_created_by ON data_center_tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_data_center_tickets_data_center_id ON data_center_tickets(data_center_id);
CREATE INDEX IF NOT EXISTS idx_data_pipelines_created_by ON data_pipelines(created_by);
CREATE INDEX IF NOT EXISTS idx_dataset_access_granted_by ON dataset_access(granted_by);
CREATE INDEX IF NOT EXISTS idx_dataset_annotations_created_by ON dataset_annotations(created_by);
CREATE INDEX IF NOT EXISTS idx_dataset_annotations_resolved_by ON dataset_annotations(resolved_by);
CREATE INDEX IF NOT EXISTS idx_dataset_catalog_last_transformation_id ON dataset_catalog(last_transformation_id);
CREATE INDEX IF NOT EXISTS idx_dataset_lineage_created_by ON dataset_lineage(created_by);
CREATE INDEX IF NOT EXISTS idx_dataset_metadata_history_changed_by ON dataset_metadata_history(changed_by);
CREATE INDEX IF NOT EXISTS idx_dataset_tags_created_by ON dataset_tags(created_by);
CREATE INDEX IF NOT EXISTS idx_dataset_transformations_created_by ON dataset_transformations(created_by);
CREATE INDEX IF NOT EXISTS idx_dataset_versions_created_by ON dataset_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_feature_store_created_by ON feature_store(created_by);
CREATE INDEX IF NOT EXISTS idx_interactions_customer_id ON interactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_model_categories_parent_id ON model_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_model_deployments_deployed_by ON model_deployments(deployed_by);
CREATE INDEX IF NOT EXISTS idx_model_ensembles_stacking_model ON model_ensembles(stacking_model);
CREATE INDEX IF NOT EXISTS idx_model_evaluations_created_by ON model_evaluations(created_by);
CREATE INDEX IF NOT EXISTS idx_model_experiments_created_by ON model_experiments(created_by);
CREATE INDEX IF NOT EXISTS idx_model_ratings_model_id ON model_ratings(model_id);
CREATE INDEX IF NOT EXISTS idx_model_versions_created_by ON model_versions(created_by);
CREATE INDEX IF NOT EXISTS idx_prediction_models_category_id ON prediction_models(category_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_by ON predictions(created_by);
CREATE INDEX IF NOT EXISTS idx_recommendations_session_id ON recommendations(session_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_data_customer_id ON revenue_data(customer_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_reports_created_by ON scheduled_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_training_jobs_created_by ON training_jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_user_favorite_models_model_id ON user_favorite_models(model_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);

-- Drop unused indexes
DROP INDEX IF EXISTS idx_assets_datacenter;
DROP INDEX IF EXISTS idx_communications_customer;
DROP INDEX IF EXISTS idx_communications_ticket;
DROP INDEX IF EXISTS idx_connections_source;
DROP INDEX IF EXISTS idx_connections_target;
DROP INDEX IF EXISTS idx_data_center_access_user;
DROP INDEX IF EXISTS idx_data_center_alerts_type;
DROP INDEX IF EXISTS idx_data_center_maintenance_status;
DROP INDEX IF EXISTS idx_data_center_metrics_type;
DROP INDEX IF EXISTS idx_data_centers_provider;
DROP INDEX IF EXISTS idx_data_centers_status;
DROP INDEX IF EXISTS idx_metric_thresholds_datacenter;
DROP INDEX IF EXISTS idx_metrics_type_timestamp;
DROP INDEX IF EXISTS idx_monitoring_prefs_user;
DROP INDEX IF EXISTS idx_tickets_customer;
DROP INDEX IF EXISTS idx_tickets_status;
DROP INDEX IF EXISTS idx_user_recommendations_user_type;
DROP INDEX IF EXISTS idx_user_metrics_user_type;
DROP INDEX IF EXISTS idx_data_sources_created_by;
DROP INDEX IF EXISTS idx_data_pipelines_source_id;
DROP INDEX IF EXISTS idx_data_pipelines_destination_id;
DROP INDEX IF EXISTS idx_analytics_dashboards_created_by;
DROP INDEX IF EXISTS idx_dashboard_widgets_dashboard_id;
DROP INDEX IF EXISTS idx_scheduled_reports_dashboard_id;
DROP INDEX IF EXISTS idx_audit_logs_user_id;
DROP INDEX IF EXISTS idx_audit_logs_timestamp;
DROP INDEX IF EXISTS idx_pred_models_type;
DROP INDEX IF EXISTS idx_pred_models_model_type;
DROP INDEX IF EXISTS idx_pred_models_tech_level;
DROP INDEX IF EXISTS idx_model_versions_model_id;
DROP INDEX IF EXISTS idx_experiments_model_version;
DROP INDEX IF EXISTS idx_evaluations_model_version;
DROP INDEX IF EXISTS idx_deployments_model_version;
DROP INDEX IF EXISTS idx_feature_store_name;
DROP INDEX IF EXISTS idx_automl_jobs_dataset;
DROP INDEX IF EXISTS idx_automl_jobs_status;
DROP INDEX IF EXISTS idx_automl_results_job;
DROP INDEX IF EXISTS idx_model_candidates_job;
DROP INDEX IF EXISTS idx_hyperparameter_tuning_model;
DROP INDEX IF EXISTS idx_model_ensembles_created_by;
DROP INDEX IF EXISTS idx_training_jobs_model_id;
DROP INDEX IF EXISTS idx_predictions_model_id;
DROP INDEX IF EXISTS idx_model_metrics_model_id_timestamp;
DROP INDEX IF EXISTS idx_dataset_tables_dataset;
DROP INDEX IF EXISTS idx_dataset_columns_table;
DROP INDEX IF EXISTS idx_dataset_access_dataset;
DROP INDEX IF EXISTS idx_dataset_access_user;
DROP INDEX IF EXISTS idx_dataset_versions_dataset;
DROP INDEX IF EXISTS idx_dataset_quality_metrics_dataset;
DROP INDEX IF EXISTS idx_dataset_quality_metrics_type;
DROP INDEX IF EXISTS idx_dataset_catalog_version;
DROP INDEX IF EXISTS idx_dataset_catalog_parent;
DROP INDEX IF EXISTS idx_dataset_lineage_source;
DROP INDEX IF EXISTS idx_dataset_lineage_target;
DROP INDEX IF EXISTS idx_dataset_transformations_dataset;
DROP INDEX IF EXISTS idx_dataset_metadata_history_dataset;
DROP INDEX IF EXISTS idx_dataset_tags_dataset;
DROP INDEX IF EXISTS idx_dataset_annotations_dataset;
DROP INDEX IF EXISTS idx_dataset_access_lookup;
DROP INDEX IF EXISTS idx_dataset_access_dataset_id;
DROP INDEX IF EXISTS idx_dataset_access_user_id;
DROP INDEX IF EXISTS idx_projects_created_at;
DROP INDEX IF EXISTS idx_datasets_project_id;
DROP INDEX IF EXISTS idx_datasets_created_at;
DROP INDEX IF EXISTS idx_models_project_id;
DROP INDEX IF EXISTS idx_models_dataset_id;
DROP INDEX IF EXISTS idx_models_status;
DROP INDEX IF EXISTS idx_models_created_at;