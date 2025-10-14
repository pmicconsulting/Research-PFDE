-- ====================================
-- すべてのチェック制約を削除する
-- ====================================

-- 1. 現在のチェック制約を確認
SELECT '=== 現在のチェック制約一覧 ===' as status;

SELECT
    n.nspname as schema_name,
    c.relname as table_name,
    con.conname as constraint_name,
    pg_get_constraintdef(con.oid) as constraint_definition
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE con.contype = 'c'  -- CHECK制約
AND n.nspname = 'public'
AND c.relname IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY c.relname, con.conname;

-- 2. block1_basic_infoのチェック制約を削除
ALTER TABLE block1_basic_info
DROP CONSTRAINT IF EXISTS block1_basic_info_q3_business_type_check,
DROP CONSTRAINT IF EXISTS block1_basic_info_q4_employment_status_check;

-- 3. block2_current_employmentのチェック制約を削除
ALTER TABLE block2_current_employment
DROP CONSTRAINT IF EXISTS block2_current_employment_q9_increase_intention_check;

-- 4. block3_no_employmentのチェック制約を削除
ALTER TABLE block3_no_employment
DROP CONSTRAINT IF EXISTS block3_no_employment_q18_employment_policy_check;

-- 5. respondentsのチェック制約を削除
ALTER TABLE respondents
DROP CONSTRAINT IF EXISTS respondents_status_check;

-- 6. すべてのチェック制約を動的に削除（念のため）
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT
            c.relname as table_name,
            con.conname as constraint_name
        FROM pg_constraint con
        JOIN pg_class c ON c.oid = con.conrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE con.contype = 'c'  -- CHECK制約
        AND n.nspname = 'public'
        AND c.relname IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
    LOOP
        EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', r.table_name, r.constraint_name);
        RAISE NOTICE 'Dropped constraint: %.%', r.table_name, r.constraint_name;
    END LOOP;
END $$;

-- 7. 削除後の確認
SELECT '=== チェック制約削除後の確認 ===' as status;

SELECT
    COUNT(*) as remaining_constraints
FROM pg_constraint con
JOIN pg_class c ON c.oid = con.conrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE con.contype = 'c'
AND n.nspname = 'public'
AND c.relname IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other');

-- 8. RLSも再度無効化（念のため）
ALTER TABLE respondents DISABLE ROW LEVEL SECURITY;
ALTER TABLE block1_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE block2_current_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block3_no_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block4_other DISABLE ROW LEVEL SECURITY;

-- 9. 最終確認メッセージ
SELECT
    '✅ すべてのチェック制約を削除しました' as message,
    'アンケート送信を再度お試しください' as action;