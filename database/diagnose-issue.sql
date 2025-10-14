-- ====================================
-- Supabase問題診断スクリプト
-- このSQLをSupabaseのSQL Editorで実行してください
-- ====================================

-- 1. テーブルの存在確認
-- ====================================
SELECT '=== 1. テーブル存在確認 ===' as check_name;

SELECT
    tablename,
    CASE
        WHEN tablename IS NOT NULL THEN '✅ 存在する'
        ELSE '❌ 存在しない'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename;

-- 2. RLS状態の確認
-- ====================================
SELECT '=== 2. RLS (Row Level Security) 状態 ===' as check_name;

SELECT
    tablename,
    rowsecurity,
    CASE
        WHEN rowsecurity = true THEN '⚠️ 有効 (RLSが有効です)'
        ELSE '✅ 無効 (データ挿入可能)'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename;

-- 3. RLSポリシーの確認
-- ====================================
SELECT '=== 3. RLSポリシー一覧 ===' as check_name;

SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename, policyname;

-- 4. カラムの存在確認 (respondentsテーブル)
-- ====================================
SELECT '=== 4. respondentsテーブルのカラム ===' as check_name;

SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'respondents'
ORDER BY ordinal_position;

-- 5. 権限の確認
-- ====================================
SELECT '=== 5. テーブル権限 ===' as check_name;

SELECT
    tablename,
    has_table_privilege('anon', schemaname||'.'||tablename, 'INSERT') as can_insert,
    has_table_privilege('anon', schemaname||'.'||tablename, 'SELECT') as can_select,
    has_table_privilege('anon', schemaname||'.'||tablename, 'UPDATE') as can_update,
    has_table_privilege('anon', schemaname||'.'||tablename, 'DELETE') as can_delete
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename;

-- 6. 現在のユーザーとロール確認
-- ====================================
SELECT '=== 6. 現在のユーザーとロール ===' as check_name;

SELECT
    current_user,
    session_user,
    current_role;

-- 7. anonロールの存在確認
-- ====================================
SELECT '=== 7. anonロールの確認 ===' as check_name;

SELECT
    rolname,
    rolsuper,
    rolinherit,
    rolcreaterole,
    rolcreatedb,
    rolcanlogin
FROM pg_roles
WHERE rolname = 'anon';

-- 8. 簡単なINSERTテスト（RLSが無効の場合のみ成功）
-- ====================================
SELECT '=== 8. INSERT テスト ===' as check_name;

-- テストデータを挿入してみる
DO $$
BEGIN
    INSERT INTO respondents (session_id, status, completed_at)
    VALUES ('test_' || now()::text, 'test', now());
    RAISE NOTICE '✅ INSERT成功: respondentsテーブルへの挿入が可能です';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ INSERTエラー: %', SQLERRM;
END;
$$;

-- 9. テストデータのクリーンアップ
DELETE FROM respondents WHERE status = 'test';

-- 10. 最終診断結果
-- ====================================
SELECT '=== 10. 診断サマリー ===' as check_name;

WITH rls_check AS (
    SELECT COUNT(*) as rls_enabled_count
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
    AND rowsecurity = true
),
table_check AS (
    SELECT COUNT(*) as table_count
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
)
SELECT
    CASE
        WHEN table_count < 5 THEN '❌ テーブルが不足しています。schema.sqlを実行してください。'
        WHEN rls_enabled_count > 0 THEN '⚠️ RLSが有効です。disable-rls-quick.sqlを実行してください。'
        ELSE '✅ 設定は正常です。'
    END as diagnosis,
    table_count as existing_tables,
    rls_enabled_count as rls_enabled_tables
FROM rls_check, table_check;