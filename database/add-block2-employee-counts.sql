-- ====================================
-- Migration: Add Block 2 Question 1 Employee Count Columns
-- Date: 2025-10-16
-- Description: Add columns for b2q1 (employee counts for 2020 and 2025)
-- Impact: CRITICAL - Required for Block 2 data submission
-- ====================================

BEGIN;

-- ====================================
-- Add b2q1: Employee counts (2020 and 2025)
-- ====================================

-- 2025年度の従業員数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS male_drivers_2025 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS female_drivers_2025 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS male_employees_2025 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS female_employees_2025 INTEGER DEFAULT 0;

-- 2020年度の従業員数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS male_drivers_2020 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS female_drivers_2020 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS male_employees_2020 INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS female_employees_2020 INTEGER DEFAULT 0;

-- ====================================
-- Add comments for documentation
-- ====================================

COMMENT ON COLUMN block2_current_employment.male_drivers_2025 IS 'b2q1（問1）: 2025年度の男性ドライバー数';
COMMENT ON COLUMN block2_current_employment.female_drivers_2025 IS 'b2q1（問1）: 2025年度の女性ドライバー数';
COMMENT ON COLUMN block2_current_employment.male_employees_2025 IS 'b2q1（問1）: 2025年度の男性従業員数（全体）';
COMMENT ON COLUMN block2_current_employment.female_employees_2025 IS 'b2q1（問1）: 2025年度の女性従業員数（全体）';

COMMENT ON COLUMN block2_current_employment.male_drivers_2020 IS 'b2q1（問1）: 2020年度の男性ドライバー数';
COMMENT ON COLUMN block2_current_employment.female_drivers_2020 IS 'b2q1（問1）: 2020年度の女性ドライバー数';
COMMENT ON COLUMN block2_current_employment.male_employees_2020 IS 'b2q1（問1）: 2020年度の男性従業員数（全体）';
COMMENT ON COLUMN block2_current_employment.female_employees_2020 IS 'b2q1（問1）: 2020年度の女性従業員数（全体）';

-- ====================================
-- Verify the changes
-- ====================================

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'block2_current_employment'
  AND column_name IN (
    'male_drivers_2025', 'female_drivers_2025', 'male_employees_2025', 'female_employees_2025',
    'male_drivers_2020', 'female_drivers_2020', 'male_employees_2020', 'female_employees_2020'
  )
ORDER BY column_name;
-- This should return 8 rows showing the new columns

COMMIT;

-- ====================================
-- Post-Migration Notes
-- ====================================

-- After running this migration:
-- 1. Block 2 data submission will work correctly
-- 2. surveyService.js already has the correct mapping for these fields
-- 3. Test the form submission to ensure data is saved properly
