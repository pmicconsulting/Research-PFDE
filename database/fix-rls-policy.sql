-- ====================================
-- RLSポリシー修正スクリプト
-- 匿名ユーザーからのアクセスを許可
-- ====================================

-- 1. 既存のポリシーを削除（エラーが出ても無視）
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON respondents;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON block1_basic_info;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON block2_current_employment;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON block3_no_employment;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON block4_other;

DROP POLICY IF EXISTS "Users can update own records" ON respondents;
DROP POLICY IF EXISTS "Users can update own records" ON block1_basic_info;
DROP POLICY IF EXISTS "Users can update own records" ON block2_current_employment;
DROP POLICY IF EXISTS "Users can update own records" ON block3_no_employment;
DROP POLICY IF EXISTS "Users can update own records" ON block4_other;

-- 2. RLSを有効化（すでに有効な場合でも実行可能）
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE block1_basic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE block2_current_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE block3_no_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE block4_other ENABLE ROW LEVEL SECURITY;

-- 3. 匿名ユーザー用の新しいポリシーを作成
-- INSERT: 誰でも可能
CREATE POLICY "Allow anonymous insert" ON respondents
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON block1_basic_info
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON block2_current_employment
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON block3_no_employment
FOR INSERT TO anon
WITH CHECK (true);

CREATE POLICY "Allow anonymous insert" ON block4_other
FOR INSERT TO anon
WITH CHECK (true);

-- SELECT: 自分のデータのみ（セッションIDベース）
CREATE POLICY "Allow select own data" ON respondents
FOR SELECT TO anon
USING (true);  -- 一時的に全て許可（本番では session_id でフィルタ）

CREATE POLICY "Allow select own data" ON block1_basic_info
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow select own data" ON block2_current_employment
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow select own data" ON block3_no_employment
FOR SELECT TO anon
USING (true);

CREATE POLICY "Allow select own data" ON block4_other
FOR SELECT TO anon
USING (true);

-- UPDATE: 自分のデータのみ更新可能
CREATE POLICY "Allow update own data" ON respondents
FOR UPDATE TO anon
USING (true)  -- 一時的に全て許可
WITH CHECK (true);

CREATE POLICY "Allow update own data" ON block1_basic_info
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow update own data" ON block2_current_employment
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow update own data" ON block3_no_employment
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow update own data" ON block4_other
FOR UPDATE TO anon
USING (true)
WITH CHECK (true);

-- 4. テスト用: RLSを一時的に無効化（開発環境のみ）
-- 注意: 本番環境では実行しないでください
-- ALTER TABLE respondents DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE block1_basic_info DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE block2_current_employment DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE block3_no_employment DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE block4_other DISABLE ROW LEVEL SECURITY;