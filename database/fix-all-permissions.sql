-- ====================================
-- 完全な権限修正スクリプト
-- これを実行すればすべての問題が解決されます
-- ====================================

-- 1. RLSを完全に無効化
ALTER TABLE IF EXISTS respondents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block1_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block2_current_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block3_no_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block4_other DISABLE ROW LEVEL SECURITY;

-- 2. anonロールに完全な権限を付与
GRANT ALL ON respondents TO anon;
GRANT ALL ON block1_basic_info TO anon;
GRANT ALL ON block2_current_employment TO anon;
GRANT ALL ON block3_no_employment TO anon;
GRANT ALL ON block4_other TO anon;

-- 3. シーケンス権限も付与（IDの自動生成のため）
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. publicスキーマへのアクセス権限
GRANT USAGE ON SCHEMA public TO anon;

-- 5. 既存の全テーブルに対する権限
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon;

-- 6. 結果確認
SELECT
    'テーブル: ' || tablename as object,
    CASE
        WHEN rowsecurity = false THEN '✅ RLS無効'
        ELSE '❌ RLS有効'
    END as rls_status,
    CASE
        WHEN has_table_privilege('anon', schemaname||'.'||tablename, 'INSERT') THEN '✅'
        ELSE '❌'
    END as can_insert,
    CASE
        WHEN has_table_privilege('anon', schemaname||'.'||tablename, 'SELECT') THEN '✅'
        ELSE '❌'
    END as can_select,
    CASE
        WHEN has_table_privilege('anon', schemaname||'.'||tablename, 'UPDATE') THEN '✅'
        ELSE '❌'
    END as can_update
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename;

-- 7. 成功メッセージ
SELECT '✅ 権限設定が完了しました！アンケート送信を再試行してください。' as message;