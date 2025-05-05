/*
  # Fix Function Search Path Security Issues
  
  1. Changes
    - Add explicit search paths to all functions
    - Improve security by preventing search_path manipulation
  
  2. Security
    - Prevents potential SQL injection via search_path
    - Ensures functions use correct schema resolution
*/

-- Update function: update_updated_at_column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update function: get_metric_average
CREATE OR REPLACE FUNCTION get_metric_average(metric_type text, start_time timestamp, end_time timestamp)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_value numeric;
BEGIN
  SELECT AVG(value) INTO avg_value
  FROM data_center_metrics
  WHERE data_center_metrics.metric_type = $1
  AND timestamp BETWEEN $2 AND $3;
  RETURN avg_value;
END;
$$;

-- Update function: get_metric_peak
CREATE OR REPLACE FUNCTION get_metric_peak(metric_type text, start_time timestamp, end_time timestamp)
RETURNS numeric
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  peak_value numeric;
BEGIN
  SELECT MAX(value) INTO peak_value
  FROM data_center_metrics
  WHERE data_center_metrics.metric_type = $1
  AND timestamp BETWEEN $2 AND $3;
  RETURN peak_value;
END;
$$;

-- Update function: update_connections_updated_at
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update function: check_metric_thresholds
CREATE OR REPLACE FUNCTION check_metric_thresholds()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  threshold_record RECORD;
BEGIN
  SELECT * INTO threshold_record
  FROM data_center_metric_thresholds
  WHERE data_center_id = NEW.data_center_id
  AND metric_type::text = NEW.metric_type;

  IF FOUND THEN
    IF NEW.value >= threshold_record.critical_threshold THEN
      INSERT INTO data_center_alerts (
        data_center_id,
        alert_type,
        threshold,
        condition,
        status
      ) VALUES (
        NEW.data_center_id,
        NEW.metric_type,
        threshold_record.critical_threshold,
        'exceeded',
        'critical'
      );
    ELSIF NEW.value >= threshold_record.warning_threshold THEN
      INSERT INTO data_center_alerts (
        data_center_id,
        alert_type,
        threshold,
        condition,
        status
      ) VALUES (
        NEW.data_center_id,
        NEW.metric_type,
        threshold_record.warning_threshold,
        'exceeded',
        'warning'
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Update function: update_pred_models_updated_at
CREATE OR REPLACE FUNCTION update_pred_models_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Update function: update_dataset_version
CREATE OR REPLACE FUNCTION update_dataset_version()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO dataset_versions (
    dataset_id,
    version_number,
    changes_description,
    created_by
  ) VALUES (
    NEW.id,
    NEW.schema_version::text,
    'Schema version update',
    NEW.owner_id
  );
  RETURN NEW;
END;
$$;

-- Update function: track_metadata_changes
CREATE OR REPLACE FUNCTION track_metadata_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO dataset_metadata_history (
      dataset_id,
      field_name,
      old_value,
      new_value,
      change_type,
      changed_by
    )
    SELECT
      NEW.id,
      key,
      OLD.metadata->key,
      NEW.metadata->key,
      'update',
      NEW.owner_id
    FROM (
      SELECT DISTINCT key
      FROM jsonb_object_keys(NEW.metadata) AS key
      WHERE NEW.metadata->key IS DISTINCT FROM OLD.metadata->key
    ) AS changed_keys;
  END IF;
  RETURN NEW;
END;
$$;