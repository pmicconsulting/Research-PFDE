-- ====================================
-- トラック運送業界における女性雇用促進実態調査
-- データベーススキーマ
-- ====================================

-- 拡張機能の有効化
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. 回答者情報テーブル
-- ====================================
CREATE TABLE respondents (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- 基本情報
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,

    -- 回答ステータス
    status VARCHAR(50) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,

    -- メタデータ
    session_id VARCHAR(255),
    submission_count INTEGER DEFAULT 0
);

-- ====================================
-- 2. ブロック1: 基本情報
-- ====================================
CREATE TABLE block1_basic_info (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- 問1: 会社名・事業所名
    q1_company_name VARCHAR(255),

    -- 問2: 本社所在地
    q2_prefecture VARCHAR(100),
    q2_city VARCHAR(100),

    -- 問3: 事業形態
    q3_business_type VARCHAR(100) CHECK (q3_business_type IN (
        'general_freight', 'specific_freight', 'cargo_light',
        'freight_transport', 'freight_forwarding', 'other'
    )),
    q3_other_text VARCHAR(255),

    -- 問4: 女性ドライバーの雇用状況
    q4_employment_status VARCHAR(50) CHECK (q4_employment_status IN (
        'currently_employed', 'previously_employed', 'never_employed'
    )),

    UNIQUE(respondent_id)
);

-- ====================================
-- 3. ブロック2: 女性ドライバーの実態（現在雇用している場合）
-- ====================================
CREATE TABLE block2_current_employment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- 問1: 車種別女性ドライバー数（グリッド）
    q1_large_truck_20s INTEGER DEFAULT 0,
    q1_large_truck_30s INTEGER DEFAULT 0,
    q1_large_truck_40s INTEGER DEFAULT 0,
    q1_large_truck_50s INTEGER DEFAULT 0,
    q1_large_truck_60s_plus INTEGER DEFAULT 0,

    q1_medium_truck_20s INTEGER DEFAULT 0,
    q1_medium_truck_30s INTEGER DEFAULT 0,
    q1_medium_truck_40s INTEGER DEFAULT 0,
    q1_medium_truck_50s INTEGER DEFAULT 0,
    q1_medium_truck_60s_plus INTEGER DEFAULT 0,

    q1_semi_medium_truck_20s INTEGER DEFAULT 0,
    q1_semi_medium_truck_30s INTEGER DEFAULT 0,
    q1_semi_medium_truck_40s INTEGER DEFAULT 0,
    q1_semi_medium_truck_50s INTEGER DEFAULT 0,
    q1_semi_medium_truck_60s_plus INTEGER DEFAULT 0,

    q1_small_truck_20s INTEGER DEFAULT 0,
    q1_small_truck_30s INTEGER DEFAULT 0,
    q1_small_truck_40s INTEGER DEFAULT 0,
    q1_small_truck_50s INTEGER DEFAULT 0,
    q1_small_truck_60s_plus INTEGER DEFAULT 0,

    q1_light_vehicle_20s INTEGER DEFAULT 0,
    q1_light_vehicle_30s INTEGER DEFAULT 0,
    q1_light_vehicle_40s INTEGER DEFAULT 0,
    q1_light_vehicle_50s INTEGER DEFAULT 0,
    q1_light_vehicle_60s_plus INTEGER DEFAULT 0,

    q1_trailer_20s INTEGER DEFAULT 0,
    q1_trailer_30s INTEGER DEFAULT 0,
    q1_trailer_40s INTEGER DEFAULT 0,
    q1_trailer_50s INTEGER DEFAULT 0,
    q1_trailer_60s_plus INTEGER DEFAULT 0,

    -- 問2: 業務内容
    q2_cargo_characteristics TEXT[],
    q2_cargo_other VARCHAR(255),

    -- 問3: 労働条件改善
    q3_improvements TEXT[],
    q3_improvements_other VARCHAR(255),

    -- 問4: 教育方法
    q4_education_methods TEXT[],
    q4_education_other VARCHAR(255),

    -- 問5: 雇用後の課題
    q5_challenges TEXT[],
    q5_challenges_other VARCHAR(255),

    -- 問6: 女性活躍推進取組
    q6_promotion_initiatives TEXT[],
    q6_promotion_other VARCHAR(255),

    -- 問7: 施設整備
    q7_facility_improvements TEXT[],
    q7_facility_other VARCHAR(255),

    -- 問8: 女性ドライバーの声
    q8_feedback TEXT,

    -- 問9: 女性ドライバー比率向上意向
    q9_increase_intention VARCHAR(50) CHECK (q9_increase_intention IN (
        'want_to_increase', 'dont_want_to_increase', 'dont_know'
    )),

    UNIQUE(respondent_id)
);

-- ====================================
-- 4. ブロック3: 雇用していない場合
-- ====================================
CREATE TABLE block3_no_employment (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- 問10: 退職理由（以前雇用していた場合のみ）
    q10_retirement_reasons TEXT[],
    q10_retirement_other VARCHAR(255),

    -- 問11: 採用検討車種
    q11_large_truck VARCHAR(50),
    q11_medium_truck VARCHAR(50),
    q11_semi_medium_truck VARCHAR(50),
    q11_small_truck VARCHAR(50),
    q11_light_vehicle VARCHAR(50),
    q11_trailer VARCHAR(50),

    -- 問12: 採用しない理由
    q12_not_hiring_reasons TEXT[],
    q12_not_hiring_other VARCHAR(255),

    -- 問13: 採用する場合配慮する労働条件
    q13_considerations TEXT[],
    q13_considerations_other VARCHAR(255),

    -- 問14: 教育方法
    q14_education_methods TEXT[],
    q14_education_other VARCHAR(255),

    -- 問15: 採用する場合の懸念
    q15_concerns TEXT[],
    q15_concerns_other VARCHAR(255),

    -- 問16: 女性活躍推進取組
    q16_promotion_initiatives TEXT[],
    q16_promotion_other VARCHAR(255),

    -- 問17: 施設整備
    q17_facility_needs TEXT[],
    q17_facility_other VARCHAR(255),

    -- 問18: 雇用方針
    q18_employment_policy VARCHAR(100) CHECK (q18_employment_policy IN (
        'actively_hire', 'hire_if_good', 'prefer_men', 'consider_in_future', 'never_hire'
    )),

    -- 問19: 行政への要望
    q19_government_requests TEXT,

    -- 問20: 協会への要望
    q20_association_requests TEXT,

    UNIQUE(respondent_id)
);

-- ====================================
-- 5. ブロック4: その他
-- ====================================
CREATE TABLE block4_other (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    respondent_id UUID NOT NULL REFERENCES respondents(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

    -- 問1: 車両台数
    q1_vehicle_count INTEGER,

    -- 問2: ドライバー総数
    q2_total_drivers INTEGER,

    -- 問3: 男性ドライバー数
    q3_male_drivers INTEGER,

    -- 問4: 事務職の女性数
    q4_female_office_workers INTEGER,

    -- 問5: 倉庫作業の女性数
    q5_female_warehouse_workers INTEGER,

    -- 問6: 記入者情報
    q6_respondent_name VARCHAR(100),
    q6_department VARCHAR(100),
    q6_position VARCHAR(100),
    q6_phone VARCHAR(50),
    q6_email VARCHAR(255),

    UNIQUE(respondent_id)
);

-- ====================================
-- 6. インデックスの作成
-- ====================================
CREATE INDEX idx_respondents_status ON respondents(status);
CREATE INDEX idx_respondents_created_at ON respondents(created_at);
CREATE INDEX idx_respondents_completed_at ON respondents(completed_at);
CREATE INDEX idx_respondents_email ON respondents(email);

CREATE INDEX idx_block1_respondent ON block1_basic_info(respondent_id);
CREATE INDEX idx_block2_respondent ON block2_current_employment(respondent_id);
CREATE INDEX idx_block3_respondent ON block3_no_employment(respondent_id);
CREATE INDEX idx_block4_respondent ON block4_other(respondent_id);

CREATE INDEX idx_block1_employment_status ON block1_basic_info(q4_employment_status);
CREATE INDEX idx_block1_prefecture ON block1_basic_info(q2_prefecture);

-- ====================================
-- 7. トリガー関数: updated_at の自動更新
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at トリガーの作成
CREATE TRIGGER update_respondents_updated_at BEFORE UPDATE ON respondents
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 8. Row Level Security (RLS) の設定
-- ====================================

-- RLSを有効化
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;
ALTER TABLE block1_basic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE block2_current_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE block3_no_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE block4_other ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成（認証不要の匿名アンケートの場合）
-- INSERT のみ許可
CREATE POLICY "Enable insert for anonymous users" ON respondents
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON block1_basic_info
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON block2_current_employment
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON block3_no_employment
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable insert for anonymous users" ON block4_other
FOR INSERT WITH CHECK (true);

-- 自分のデータのみ更新可能（session_idベース）
CREATE POLICY "Users can update own records" ON respondents
FOR UPDATE USING (session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can update own records" ON block1_basic_info
FOR UPDATE USING (respondent_id IN (
    SELECT id FROM respondents WHERE session_id = current_setting('app.session_id', true)
));

CREATE POLICY "Users can update own records" ON block2_current_employment
FOR UPDATE USING (respondent_id IN (
    SELECT id FROM respondents WHERE session_id = current_setting('app.session_id', true)
));

CREATE POLICY "Users can update own records" ON block3_no_employment
FOR UPDATE USING (respondent_id IN (
    SELECT id FROM respondents WHERE session_id = current_setting('app.session_id', true)
));

CREATE POLICY "Users can update own records" ON block4_other
FOR UPDATE USING (respondent_id IN (
    SELECT id FROM respondents WHERE session_id = current_setting('app.session_id', true)
));

-- ====================================
-- 9. ビューの作成（集計用）
-- ====================================
CREATE VIEW survey_summary AS
SELECT
    r.id,
    r.status,
    r.created_at,
    r.completed_at,
    b1.q1_company_name,
    b1.q2_prefecture,
    b1.q3_business_type,
    b1.q4_employment_status,
    b4.q1_vehicle_count,
    b4.q2_total_drivers,
    b4.q3_male_drivers,
    CASE
        WHEN b1.q4_employment_status = 'currently_employed' THEN
            COALESCE(b2.q1_large_truck_20s, 0) + COALESCE(b2.q1_large_truck_30s, 0) +
            COALESCE(b2.q1_large_truck_40s, 0) + COALESCE(b2.q1_large_truck_50s, 0) +
            COALESCE(b2.q1_large_truck_60s_plus, 0) +
            COALESCE(b2.q1_medium_truck_20s, 0) + COALESCE(b2.q1_medium_truck_30s, 0) +
            COALESCE(b2.q1_medium_truck_40s, 0) + COALESCE(b2.q1_medium_truck_50s, 0) +
            COALESCE(b2.q1_medium_truck_60s_plus, 0) +
            COALESCE(b2.q1_semi_medium_truck_20s, 0) + COALESCE(b2.q1_semi_medium_truck_30s, 0) +
            COALESCE(b2.q1_semi_medium_truck_40s, 0) + COALESCE(b2.q1_semi_medium_truck_50s, 0) +
            COALESCE(b2.q1_semi_medium_truck_60s_plus, 0) +
            COALESCE(b2.q1_small_truck_20s, 0) + COALESCE(b2.q1_small_truck_30s, 0) +
            COALESCE(b2.q1_small_truck_40s, 0) + COALESCE(b2.q1_small_truck_50s, 0) +
            COALESCE(b2.q1_small_truck_60s_plus, 0) +
            COALESCE(b2.q1_light_vehicle_20s, 0) + COALESCE(b2.q1_light_vehicle_30s, 0) +
            COALESCE(b2.q1_light_vehicle_40s, 0) + COALESCE(b2.q1_light_vehicle_50s, 0) +
            COALESCE(b2.q1_light_vehicle_60s_plus, 0) +
            COALESCE(b2.q1_trailer_20s, 0) + COALESCE(b2.q1_trailer_30s, 0) +
            COALESCE(b2.q1_trailer_40s, 0) + COALESCE(b2.q1_trailer_50s, 0) +
            COALESCE(b2.q1_trailer_60s_plus, 0)
        ELSE 0
    END AS total_female_drivers
FROM respondents r
LEFT JOIN block1_basic_info b1 ON r.id = b1.respondent_id
LEFT JOIN block2_current_employment b2 ON r.id = b2.respondent_id
LEFT JOIN block4_other b4 ON r.id = b4.respondent_id;

-- ====================================
-- 10. 関数: 回答データの保存
-- ====================================
CREATE OR REPLACE FUNCTION save_survey_response(
    p_session_id VARCHAR,
    p_block1 JSONB,
    p_block2 JSONB,
    p_block3 JSONB,
    p_block4 JSONB
) RETURNS UUID AS $$
DECLARE
    v_respondent_id UUID;
    v_employment_status VARCHAR;
BEGIN
    -- セッションIDの設定（RLSポリシー用）
    PERFORM set_config('app.session_id', p_session_id, true);

    -- 回答者レコードの作成または更新
    INSERT INTO respondents (session_id, status, completed_at)
    VALUES (p_session_id, 'completed', NOW())
    ON CONFLICT (session_id) DO UPDATE
    SET status = 'completed',
        completed_at = NOW(),
        submission_count = respondents.submission_count + 1,
        updated_at = NOW()
    RETURNING id INTO v_respondent_id;

    -- ブロック1の保存
    INSERT INTO block1_basic_info (
        respondent_id,
        q1_company_name,
        q2_prefecture,
        q2_city,
        q3_business_type,
        q3_other_text,
        q4_employment_status
    ) VALUES (
        v_respondent_id,
        p_block1->>'q1_company_name',
        p_block1->>'q2_prefecture',
        p_block1->>'q2_city',
        p_block1->>'q3_business_type',
        p_block1->>'q3_other_text',
        p_block1->>'q4_employment_status'
    )
    ON CONFLICT (respondent_id) DO UPDATE SET
        q1_company_name = EXCLUDED.q1_company_name,
        q2_prefecture = EXCLUDED.q2_prefecture,
        q2_city = EXCLUDED.q2_city,
        q3_business_type = EXCLUDED.q3_business_type,
        q3_other_text = EXCLUDED.q3_other_text,
        q4_employment_status = EXCLUDED.q4_employment_status
    RETURNING q4_employment_status INTO v_employment_status;

    -- 雇用状況に応じてブロック2またはブロック3を保存
    IF v_employment_status = 'currently_employed' AND p_block2 IS NOT NULL THEN
        -- ブロック2の保存（現在雇用している場合）
        INSERT INTO block2_current_employment (respondent_id)
        VALUES (v_respondent_id)
        ON CONFLICT (respondent_id) DO NOTHING;

        -- 動的にJSONBから値を更新
        UPDATE block2_current_employment
        SET
            q1_large_truck_20s = COALESCE((p_block2->'q1'->'large_truck'->>'20s')::INTEGER, 0),
            q1_large_truck_30s = COALESCE((p_block2->'q1'->'large_truck'->>'30s')::INTEGER, 0),
            q1_large_truck_40s = COALESCE((p_block2->'q1'->'large_truck'->>'40s')::INTEGER, 0),
            q1_large_truck_50s = COALESCE((p_block2->'q1'->'large_truck'->>'50s')::INTEGER, 0),
            q1_large_truck_60s_plus = COALESCE((p_block2->'q1'->'large_truck'->>'60s_plus')::INTEGER, 0),
            -- 他の車種も同様に...
            q2_cargo_characteristics = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q2')),
            q3_improvements = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q3')),
            q4_education_methods = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q4')),
            q5_challenges = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q5')),
            q6_promotion_initiatives = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q6')),
            q7_facility_improvements = ARRAY(SELECT jsonb_array_elements_text(p_block2->'q7')),
            q8_feedback = p_block2->>'q8',
            q9_increase_intention = p_block2->>'q9'
        WHERE respondent_id = v_respondent_id;

    ELSIF v_employment_status IN ('previously_employed', 'never_employed') AND p_block3 IS NOT NULL THEN
        -- ブロック3の保存（雇用していない場合）
        INSERT INTO block3_no_employment (respondent_id)
        VALUES (v_respondent_id)
        ON CONFLICT (respondent_id) DO NOTHING;

        UPDATE block3_no_employment
        SET
            q10_retirement_reasons = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q10')),
            q11_large_truck = p_block3->>'q11_large_truck',
            q11_medium_truck = p_block3->>'q11_medium_truck',
            q11_semi_medium_truck = p_block3->>'q11_semi_medium_truck',
            q11_small_truck = p_block3->>'q11_small_truck',
            q11_light_vehicle = p_block3->>'q11_light_vehicle',
            q11_trailer = p_block3->>'q11_trailer',
            q12_not_hiring_reasons = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q12')),
            q13_considerations = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q13')),
            q14_education_methods = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q14')),
            q15_concerns = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q15')),
            q16_promotion_initiatives = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q16')),
            q17_facility_needs = ARRAY(SELECT jsonb_array_elements_text(p_block3->'q17')),
            q18_employment_policy = p_block3->>'q18',
            q19_government_requests = p_block3->>'q19',
            q20_association_requests = p_block3->>'q20'
        WHERE respondent_id = v_respondent_id;
    END IF;

    -- ブロック4の保存（全員回答）
    IF p_block4 IS NOT NULL THEN
        INSERT INTO block4_other (
            respondent_id,
            q1_vehicle_count,
            q2_total_drivers,
            q3_male_drivers,
            q4_female_office_workers,
            q5_female_warehouse_workers,
            q6_respondent_name,
            q6_department,
            q6_position,
            q6_phone,
            q6_email
        ) VALUES (
            v_respondent_id,
            (p_block4->>'q1')::INTEGER,
            (p_block4->>'q2')::INTEGER,
            (p_block4->>'q3')::INTEGER,
            (p_block4->>'q4')::INTEGER,
            (p_block4->>'q5')::INTEGER,
            p_block4->>'q6_name',
            p_block4->>'q6_department',
            p_block4->>'q6_position',
            p_block4->>'q6_phone',
            p_block4->>'q6_email'
        )
        ON CONFLICT (respondent_id) DO UPDATE SET
            q1_vehicle_count = EXCLUDED.q1_vehicle_count,
            q2_total_drivers = EXCLUDED.q2_total_drivers,
            q3_male_drivers = EXCLUDED.q3_male_drivers,
            q4_female_office_workers = EXCLUDED.q4_female_office_workers,
            q5_female_warehouse_workers = EXCLUDED.q5_female_warehouse_workers,
            q6_respondent_name = EXCLUDED.q6_respondent_name,
            q6_department = EXCLUDED.q6_department,
            q6_position = EXCLUDED.q6_position,
            q6_phone = EXCLUDED.q6_phone,
            q6_email = EXCLUDED.q6_email;
    END IF;

    RETURN v_respondent_id;
END;
$$ LANGUAGE plpgsql;

-- ====================================
-- 使用例とコメント
-- ====================================
COMMENT ON TABLE respondents IS 'アンケート回答者の基本情報';
COMMENT ON TABLE block1_basic_info IS 'ブロック1: 基本情報（全員回答）';
COMMENT ON TABLE block2_current_employment IS 'ブロック2: 女性ドライバーの実態（現在雇用している企業のみ）';
COMMENT ON TABLE block3_no_employment IS 'ブロック3: 雇用していない場合の質問';
COMMENT ON TABLE block4_other IS 'ブロック4: その他の情報（全員回答）';
COMMENT ON FUNCTION save_survey_response IS 'アンケート回答を保存する関数。JSONBで各ブロックのデータを受け取る';