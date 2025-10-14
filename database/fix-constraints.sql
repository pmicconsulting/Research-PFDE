-- ====================================
-- チェック制約の修正
-- ====================================

-- 1. 既存の制約を削除
ALTER TABLE block1_basic_info
DROP CONSTRAINT IF EXISTS block1_basic_info_q3_business_type_check;

-- 2. より柔軟な制約を追加（NULLも許可）
ALTER TABLE block1_basic_info
ADD CONSTRAINT block1_basic_info_q3_business_type_check
CHECK (
  q3_business_type IS NULL OR
  q3_business_type IN (
    'general_freight',
    'specific_freight',
    'cargo_light',
    'freight_transport',
    'freight_forwarding',
    'other'
  )
);

-- 3. 確認
SELECT
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'block1_basic_info'::regclass
AND contype = 'c';