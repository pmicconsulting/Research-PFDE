-- ====================================
-- RLSを無効化（開発・テスト用）
-- 本番環境では使用しないでください
-- ====================================

-- RLSを完全に無効化
ALTER TABLE respondents DISABLE ROW LEVEL SECURITY;
ALTER TABLE block1_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE block2_current_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block3_no_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block4_other DISABLE ROW LEVEL SECURITY;

-- 確認用クエリ
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other');