-- ====================================
-- Migration: Add General Cargo Business Type Option
-- Date: 2025-10-16
-- Description: Add business_type_general_cargo column to support 【一般】一般自動車貨物運送事業
-- ====================================

-- Add the new column for general cargo business type
ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS business_type_general_cargo BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN survey_responses.business_type_general_cargo IS '問2：【一般】一般自動車貨物運送事業';

-- Verify the column was added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'survey_responses'
  AND column_name = 'business_type_general_cargo';
