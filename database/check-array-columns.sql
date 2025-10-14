-- ====================================
-- 配列型カラムの確認と修正
-- ====================================

-- 1. block3_no_employmentテーブルの配列型カラムを確認
SELECT '=== block3_no_employment 配列型カラム ===' as check_name;

SELECT
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'block3_no_employment'
AND data_type = 'ARRAY'
ORDER BY ordinal_position;

-- 2. block2_current_employmentテーブルの配列型カラムを確認
SELECT '=== block2_current_employment 配列型カラム ===' as check_name;

SELECT
    column_name,
    data_type,
    udt_name,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'block2_current_employment'
AND data_type = 'ARRAY'
ORDER BY ordinal_position;

-- 3. 配列型カラムの詳細確認
SELECT '=== 配列型カラムの詳細 ===' as check_name;

SELECT
    table_name,
    column_name,
    data_type,
    udt_name,
    CASE
        WHEN udt_name = '_text' THEN 'TEXT[]'
        WHEN udt_name = '_varchar' THEN 'VARCHAR[]'
        WHEN udt_name = '_int4' THEN 'INTEGER[]'
        ELSE udt_name
    END as array_type
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('block2_current_employment', 'block3_no_employment')
AND data_type = 'ARRAY'
ORDER BY table_name, ordinal_position;

-- 4. テストINSERT（配列型の動作確認）
SELECT '=== 配列INSERT テスト ===' as check_name;

-- テスト用の一時テーブルを作成
CREATE TEMP TABLE test_array (
    id SERIAL PRIMARY KEY,
    text_array TEXT[],
    empty_array TEXT[]
);

-- 空配列、単一要素、複数要素をテスト
INSERT INTO test_array (text_array, empty_array)
VALUES
    (ARRAY['value1', 'value2'], ARRAY[]::TEXT[]),
    (ARRAY['single'], NULL),
    (NULL, ARRAY[]::TEXT[]);

-- 結果確認
SELECT * FROM test_array;

-- テスト用テーブルを削除
DROP TABLE test_array;

-- 5. 既存データの確認（配列カラムにどんなデータが入っているか）
SELECT '=== 既存データサンプル（最新5件） ===' as check_name;

SELECT
    id,
    q10_retirement_reasons,
    q12_not_hiring_reasons,
    q13_considerations
FROM block3_no_employment
ORDER BY id DESC
LIMIT 5;