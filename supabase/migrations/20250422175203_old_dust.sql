/*
  # Optimize AI Marketplace RLS Policy
  
  1. Changes
    - Replace auth.uid() with subquery for better performance
    - Optimize RLS policy evaluation
  
  2. Security
    - Maintains same security rules
    - Improves query performance
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Providers can manage their marketplace items" ON ai_marketplace;
DROP POLICY IF EXISTS "Users can read marketplace" ON ai_marketplace;

-- Create optimized policies
CREATE POLICY "Providers can manage their marketplace items"
ON ai_marketplace
FOR ALL 
TO authenticated
USING (provider_id = (SELECT auth.uid()))
WITH CHECK (provider_id = (SELECT auth.uid()));

CREATE POLICY "Users can read marketplace"
ON ai_marketplace
FOR SELECT
TO authenticated
USING (true);