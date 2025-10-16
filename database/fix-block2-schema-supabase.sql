-- ====================================
-- Migration: Fix Block 2 Schema Mismatch (CRITICAL)
-- Date: 2025-10-16
-- Description: Fix block2_current_employment table to match actual survey structure
-- Impact: HIGH - Current schema has incorrect field names that don't match implementation
-- ====================================

-- WARNING: This migration will DROP columns that don't match the actual survey
-- If you have production data in these fields, back up the data first!

BEGIN;

-- ====================================
-- Step 1: Remove incorrect fields that don't match actual survey
-- ====================================

ALTER TABLE block2_current_employment
DROP COLUMN IF EXISTS q2_cargo_characteristics,
DROP COLUMN IF EXISTS q2_cargo_other,
DROP COLUMN IF EXISTS q3_improvements,
DROP COLUMN IF EXISTS q3_improvements_other,
DROP COLUMN IF EXISTS q4_education_methods,
DROP COLUMN IF EXISTS q4_education_other,
DROP COLUMN IF EXISTS q5_challenges,
DROP COLUMN IF EXISTS q5_challenges_other,
DROP COLUMN IF EXISTS q6_promotion_initiatives,
DROP COLUMN IF EXISTS q6_promotion_other,
DROP COLUMN IF EXISTS q7_facility_improvements,
DROP COLUMN IF EXISTS q7_facility_other,
DROP COLUMN IF EXISTS q8_feedback,
DROP COLUMN IF EXISTS q9_increase_intention;

-- ====================================
-- Step 2: Add correct fields matching actual survey structure
-- ====================================

-- b2q2: 平均在職年数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS avg_tenure_years VARCHAR(20);

-- b2q3: 運行距離別人数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS long_distance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS medium_distance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS short_distance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS city_delivery_count INTEGER DEFAULT 0;

-- b2q4: 車両別人数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS kei_cargo_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS small_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS medium_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS large_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trailer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_vehicle_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_vehicle_text TEXT;

-- b2q5: 車両形状別人数
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS van_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS flat_body_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dump_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unic_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tank_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS garbage_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS semi_trailer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_shape_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_shape_text TEXT;

-- b2q6: 取扱品目（複数選択）
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS cargo_items TEXT[],
ADD COLUMN IF NOT EXISTS cargo_items_other TEXT;

-- b2q7: 荷役作業（複数選択）
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS loading_methods TEXT[],
ADD COLUMN IF NOT EXISTS loading_methods_other TEXT;

-- b2q8: 免許取得対応（旧b2q10）
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS license_support TEXT[],
ADD COLUMN IF NOT EXISTS license_support_other TEXT;

-- b2q9: その他の免許（旧b2q11）
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS other_licenses TEXT[],
ADD COLUMN IF NOT EXISTS other_licenses_other TEXT;

-- ====================================
-- Step 3: Add comments for documentation
-- ====================================

COMMENT ON COLUMN block2_current_employment.avg_tenure_years IS 'b2q2（問2）: 女性ドライバーの平均在職年数';

COMMENT ON COLUMN block2_current_employment.long_distance_count IS 'b2q3（問3）: 長距離（500km超）の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.medium_distance_count IS 'b2q3（問3）: 中距離（200～500km）の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.short_distance_count IS 'b2q3（問3）: 近距離（50～200km）の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.city_delivery_count IS 'b2q3（問3）: 市内配送（100km以内）の女性ドライバー人数';

COMMENT ON COLUMN block2_current_employment.kei_cargo_count IS 'b2q4（問4）: 軽貨物の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.small_truck_count IS 'b2q4（問4）: 小型トラックの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.medium_truck_count IS 'b2q4（問4）: 中型トラックの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.large_truck_count IS 'b2q4（問4）: 大型トラックの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.trailer_count IS 'b2q4（問4）: トレーラーの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.other_vehicle_count IS 'b2q4（問4）: その他車両の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.other_vehicle_text IS 'b2q4（問4）: その他車両の詳細';

COMMENT ON COLUMN block2_current_employment.van_truck_count IS 'b2q5（問5）: バントラックの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.flat_body_count IS 'b2q5（問5）: 平ボディの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.dump_truck_count IS 'b2q5（問5）: ダンプの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.unic_count IS 'b2q5（問5）: ユニックの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.tank_truck_count IS 'b2q5（問5）: タンクローリーの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.garbage_truck_count IS 'b2q5（問5）: パッカーの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.semi_trailer_count IS 'b2q5（問5）: セミトレーラーの女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.other_shape_count IS 'b2q5（問5）: その他形状の女性ドライバー人数';
COMMENT ON COLUMN block2_current_employment.other_shape_text IS 'b2q5（問5）: その他形状の詳細';

COMMENT ON COLUMN block2_current_employment.cargo_items IS 'b2q6（問6）: 取扱品目（複数選択可）';
COMMENT ON COLUMN block2_current_employment.cargo_items_other IS 'b2q6（問6）: 取扱品目のその他詳細';

COMMENT ON COLUMN block2_current_employment.loading_methods IS 'b2q7（問7）: 荷役作業（複数選択可）';
COMMENT ON COLUMN block2_current_employment.loading_methods_other IS 'b2q7（問7）: 荷役作業のその他詳細';

COMMENT ON COLUMN block2_current_employment.license_support IS 'b2q8（問8）: 免許取得対応（複数選択可）';
COMMENT ON COLUMN block2_current_employment.license_support_other IS 'b2q8（問8）: 免許取得対応のその他詳細';

COMMENT ON COLUMN block2_current_employment.other_licenses IS 'b2q9（問9）: その他の免許（複数選択可）';
COMMENT ON COLUMN block2_current_employment.other_licenses_other IS 'b2q9（問9）: その他の免許の詳細';

-- ====================================
-- Step 4: Verify the changes
-- ====================================

-- Check that old columns are removed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'block2_current_employment'
  AND column_name IN ('q2_cargo_characteristics', 'q3_improvements', 'q4_education_methods');
-- This should return 0 rows after successful deletion

-- Check that new columns are added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'block2_current_employment'
  AND column_name IN ('avg_tenure_years', 'long_distance_count', 'cargo_items', 'license_support');
-- This should return 4 rows showing the new columns

COMMIT;

-- ====================================
-- Post-Migration Notes
-- ====================================

-- IMPORTANT: After running this migration, you MUST update surveyService.js
-- to map the correct field names when saving Block 2 data:
--
-- Example mapping changes needed in surveyService.js:
--
-- OLD (incorrect):
--   q2_cargo_characteristics: ensureArray(formData.b2q6),
--   q10_license_methods: ensureArray(formData.b2q10),
--
-- NEW (correct):
--   avg_tenure_years: formData.b2q2 || null,
--   long_distance_count: formData.b2q3?.longDistance || 0,
--   cargo_items: ensureArray(formData.b2q6),
--   license_support: ensureArray(formData.b2q8),
--   other_licenses: ensureArray(formData.b2q9),
