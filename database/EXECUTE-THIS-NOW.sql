-- ====================================
-- 今すぐこれを実行してください！
-- ====================================

-- RLSを完全に無効化（これが最も重要）
ALTER TABLE respondents DISABLE ROW LEVEL SECURITY;
ALTER TABLE block1_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE block2_current_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block3_no_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE block4_other DISABLE ROW LEVEL SECURITY;

-- 確認
SELECT
    tablename,
    CASE
        WHEN rowsecurity = false THEN '✅ RLS無効 - データ挿入可能！'
        ELSE '❌ まだRLSが有効です'
    END as status
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other')
ORDER BY tablename;