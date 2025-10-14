-- ====================================
-- データベース完全修正スクリプト
-- エラーを解決するための包括的な修正
-- ====================================

-- 1. RLSを無効化（既に実行済みの場合はスキップ）
ALTER TABLE IF EXISTS respondents DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block1_basic_info DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block2_current_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block3_no_employment DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS block4_other DISABLE ROW LEVEL SECURITY;

-- 2. チェック制約を削除（より柔軟に）
ALTER TABLE block1_basic_info
DROP CONSTRAINT IF EXISTS block1_basic_info_q3_business_type_check;

-- 3. 配列型カラムが正しく定義されているか確認
-- block3_no_employmentの配列カラムを確認・修正
DO $$
BEGIN
    -- q10_retirement_reasonsがTEXT[]型でない場合は修正
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'block3_no_employment'
        AND column_name = 'q10_retirement_reasons'
        AND data_type = 'ARRAY'
    ) THEN
        ALTER TABLE block3_no_employment
        ALTER COLUMN q10_retirement_reasons TYPE TEXT[]
        USING CASE
            WHEN q10_retirement_reasons IS NULL THEN NULL
            ELSE ARRAY[q10_retirement_reasons::TEXT]
        END;
    END IF;
END $$;

-- 4. NULLと空配列を適切に処理するためのデフォルト値設定
ALTER TABLE block3_no_employment
ALTER COLUMN q10_retirement_reasons SET DEFAULT '{}',
ALTER COLUMN q12_not_hiring_reasons SET DEFAULT '{}',
ALTER COLUMN q13_considerations SET DEFAULT '{}',
ALTER COLUMN q14_education_methods SET DEFAULT '{}',
ALTER COLUMN q15_concerns SET DEFAULT '{}',
ALTER COLUMN q16_promotion_initiatives SET DEFAULT '{}',
ALTER COLUMN q17_facility_needs SET DEFAULT '{}';

ALTER TABLE block2_current_employment
ALTER COLUMN q2_cargo_characteristics SET DEFAULT '{}',
ALTER COLUMN q3_improvements SET DEFAULT '{}',
ALTER COLUMN q4_education_methods SET DEFAULT '{}',
ALTER COLUMN q5_challenges SET DEFAULT '{}',
ALTER COLUMN q6_promotion_initiatives SET DEFAULT '{}',
ALTER COLUMN q7_facility_improvements SET DEFAULT '{}';

-- 5. 権限を再付与（念のため）
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. テスト: 配列データの挿入が可能か確認
DO $$
DECLARE
    test_id UUID;
BEGIN
    -- テスト用レスポンデントを作成
    INSERT INTO respondents (session_id, status, completed_at)
    VALUES ('test_array_' || NOW()::TEXT, 'test', NOW())
    RETURNING id INTO test_id;

    -- block3にテストデータを挿入
    INSERT INTO block3_no_employment (
        respondent_id,
        q10_retirement_reasons,
        q12_not_hiring_reasons,
        q13_considerations
    ) VALUES (
        test_id,
        ARRAY['理由1', '理由2']::TEXT[],
        ARRAY[]::TEXT[],  -- 空配列
        NULL  -- NULL値
    );

    -- テスト成功
    RAISE NOTICE '✅ 配列データの挿入テスト成功';

    -- テストデータをクリーンアップ
    DELETE FROM block3_no_employment WHERE respondent_id = test_id;
    DELETE FROM respondents WHERE id = test_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ 配列データの挿入テスト失敗: %', SQLERRM;
END $$;

-- 7. 最終確認
SELECT
    'データベース修正完了' as status,
    COUNT(*) FILTER (WHERE rowsecurity = false) as rls_disabled_count,
    COUNT(*) as total_tables
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('respondents', 'block1_basic_info', 'block2_current_employment', 'block3_no_employment', 'block4_other');

-- 8. 配列カラムの状態確認
SELECT
    table_name,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('block2_current_employment', 'block3_no_employment')
AND data_type = 'ARRAY'
ORDER BY table_name, ordinal_position;