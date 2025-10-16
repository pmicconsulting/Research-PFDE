-- アンケート回答テーブル作成用SQL
-- 作成日: 2024-10-15

-- 既存のテーブルを削除（必要に応じて）
-- DROP TABLE IF EXISTS survey_responses CASCADE;

-- メイン回答テーブル
CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,

    -- ブロック1: 基本情報
    -- 問1: 回答時点の貴社の概要
    company_name VARCHAR(255),
    position VARCHAR(100),
    responder_name VARCHAR(100),
    gender VARCHAR(10),
    email VARCHAR(255),
    prefecture VARCHAR(20),

    -- 問2: 事業内容（複数選択可）
    business_type_general_cargo BOOLEAN DEFAULT FALSE,
    business_type_special_cargo BOOLEAN DEFAULT FALSE,
    business_type_specific_cargo BOOLEAN DEFAULT FALSE,
    business_type_forwarding BOOLEAN DEFAULT FALSE,
    business_type_light_cargo BOOLEAN DEFAULT FALSE,
    business_type_other TEXT,

    -- 問3: トラック台数
    truck_count INTEGER,

    -- 問4: 女性ドライバー雇用状況（分岐質問）
    female_driver_employment VARCHAR(50),

    -- 問5: 雇用の必要性
    employment_necessity VARCHAR(50),

    -- 問6: 今後の予定
    future_employment_plan VARCHAR(100),

    -- ブロック2: 現在雇用している場合の質問
    -- 問1: 従業員数
    male_drivers_2025 INTEGER,
    female_drivers_2025 INTEGER,
    male_employees_2025 INTEGER,
    female_employees_2025 INTEGER,
    male_drivers_2020 INTEGER,
    female_drivers_2020 INTEGER,
    male_employees_2020 INTEGER,
    female_employees_2020 INTEGER,

    -- 問2: 平均在職年数
    avg_tenure_years VARCHAR(20),

    -- 問3: 運行距離別人数
    long_distance_count INTEGER,
    medium_distance_count INTEGER,
    short_distance_count INTEGER,
    city_delivery_count INTEGER,

    -- 問4: 車両別人数（その他テキスト追加）
    kei_cargo_count INTEGER,
    small_truck_count INTEGER,
    medium_truck_count INTEGER,
    large_truck_count INTEGER,
    trailer_count INTEGER,
    other_vehicle_count INTEGER,
    other_vehicle_text TEXT,  -- その他の詳細

    -- 問5: 車両形状別人数（その他テキスト追加）
    van_truck_count INTEGER,
    flat_body_count INTEGER,
    dump_truck_count INTEGER,
    unic_count INTEGER,
    tank_truck_count INTEGER,
    garbage_truck_count INTEGER,
    semi_trailer_count INTEGER,
    other_shape_count INTEGER,
    other_shape_text TEXT,  -- その他の詳細

    -- 問6: 取扱品目（複数選択可）
    item_agriculture BOOLEAN DEFAULT FALSE,
    item_container BOOLEAN DEFAULT FALSE,
    item_paper BOOLEAN DEFAULT FALSE,
    item_construction BOOLEAN DEFAULT FALSE,
    item_metal BOOLEAN DEFAULT FALSE,
    item_petroleum BOOLEAN DEFAULT FALSE,
    item_chemical BOOLEAN DEFAULT FALSE,
    item_textile BOOLEAN DEFAULT FALSE,
    item_daily BOOLEAN DEFAULT FALSE,
    item_machinery BOOLEAN DEFAULT FALSE,
    item_food BOOLEAN DEFAULT FALSE,
    item_other TEXT,

    -- 問7: 荷役作業（複数選択可）
    loading_manual BOOLEAN DEFAULT FALSE,
    loading_forklift BOOLEAN DEFAULT FALSE,
    loading_wheeled_rack BOOLEAN DEFAULT FALSE,
    loading_inspection BOOLEAN DEFAULT FALSE,
    loading_indoor BOOLEAN DEFAULT FALSE,
    loading_none BOOLEAN DEFAULT FALSE,
    loading_other TEXT,

    -- 問8: 免許取得対応（複数選択可）
    license_company_full BOOLEAN DEFAULT FALSE,
    license_company_partial BOOLEAN DEFAULT FALSE,
    license_self_pay BOOLEAN DEFAULT FALSE,
    license_other TEXT,

    -- 問9: その他の免許（複数選択可）
    other_license_forklift BOOLEAN DEFAULT FALSE,
    other_license_dangerous BOOLEAN DEFAULT FALSE,
    other_license_crane_rigging BOOLEAN DEFAULT FALSE,
    other_license_mobile_crane BOOLEAN DEFAULT FALSE,
    other_license_operation_manager BOOLEAN DEFAULT FALSE,
    other_license_other TEXT,

    -- ブロック3: 採用について
    -- 問1: 採用方法（複数選択可）
    recruitment_hellowork BOOLEAN DEFAULT FALSE,
    recruitment_internet BOOLEAN DEFAULT FALSE,
    recruitment_homepage BOOLEAN DEFAULT FALSE,
    recruitment_sns BOOLEAN DEFAULT FALSE,
    recruitment_video BOOLEAN DEFAULT FALSE,
    recruitment_school BOOLEAN DEFAULT FALSE,
    recruitment_referral BOOLEAN DEFAULT FALSE,
    recruitment_magazine BOOLEAN DEFAULT FALSE,
    recruitment_other TEXT,

    -- 問2: 採用工夫（複数選択可）
    effort_work_hours BOOLEAN DEFAULT FALSE,
    effort_active_appeal BOOLEAN DEFAULT FALSE,
    effort_success_appeal BOOLEAN DEFAULT FALSE,
    effort_workability_appeal BOOLEAN DEFAULT FALSE,
    effort_license_support BOOLEAN DEFAULT FALSE,
    effort_bonus_system BOOLEAN DEFAULT FALSE,
    effort_briefing_session BOOLEAN DEFAULT FALSE,
    effort_internship BOOLEAN DEFAULT FALSE,
    effort_facility_for_women BOOLEAN DEFAULT FALSE,
    effort_workplace_environment BOOLEAN DEFAULT FALSE,
    effort_daycare BOOLEAN DEFAULT FALSE,
    effort_male_awareness BOOLEAN DEFAULT FALSE,
    effort_maternity_leave BOOLEAN DEFAULT FALSE,
    effort_none BOOLEAN DEFAULT FALSE,
    effort_other TEXT,

    -- 問3: 特に有効な工夫
    effective_efforts TEXT,

    -- 問4: メリット（複数選択可）
    merit_communication BOOLEAN DEFAULT FALSE,
    merit_client_evaluation BOOLEAN DEFAULT FALSE,
    merit_labor_shortage BOOLEAN DEFAULT FALSE,
    merit_company_image BOOLEAN DEFAULT FALSE,
    merit_none BOOLEAN DEFAULT FALSE,
    merit_other TEXT,

    -- 問5: 問題点（複数選択可）
    problem_relationship BOOLEAN DEFAULT FALSE,
    problem_sudden_absence BOOLEAN DEFAULT FALSE,
    problem_skill_limitation BOOLEAN DEFAULT FALSE,
    problem_workplace_facility BOOLEAN DEFAULT FALSE,
    problem_work_system BOOLEAN DEFAULT FALSE,
    problem_harassment BOOLEAN DEFAULT FALSE,
    problem_none BOOLEAN DEFAULT FALSE,
    problem_other TEXT,

    -- 問6: 問題の具体例と対策
    problem_details TEXT,

    -- 問7: 定着傾向
    retention_tendency VARCHAR(100),

    -- 問8: 退職理由
    resignation_reasons TEXT,

    -- 問9: 定着のための取組（複数選択可）
    retention_female_manager BOOLEAN DEFAULT FALSE,
    retention_top_message BOOLEAN DEFAULT FALSE,
    retention_workplace_understanding BOOLEAN DEFAULT FALSE,
    retention_gender_equality BOOLEAN DEFAULT FALSE,
    retention_recreation BOOLEAN DEFAULT FALSE,
    retention_fair_evaluation BOOLEAN DEFAULT FALSE,
    retention_childcare_support BOOLEAN DEFAULT FALSE,
    retention_flexible_leave BOOLEAN DEFAULT FALSE,
    retention_work_improvement BOOLEAN DEFAULT FALSE,
    retention_childcare_facility BOOLEAN DEFAULT FALSE,
    retention_childcare_allowance BOOLEAN DEFAULT FALSE,
    retention_female_facilities BOOLEAN DEFAULT FALSE,
    retention_at_vehicles BOOLEAN DEFAULT FALSE,
    retention_harassment_management BOOLEAN DEFAULT FALSE,
    retention_no_two_man BOOLEAN DEFAULT FALSE,
    retention_no_long_distance BOOLEAN DEFAULT FALSE,
    retention_education BOOLEAN DEFAULT FALSE,
    retention_nothing BOOLEAN DEFAULT FALSE,
    retention_other TEXT,

    -- 問10: 取組の具体例
    retention_details TEXT,

    -- 問11: 相談・要望
    consultation_requests TEXT,

    -- ブロック4: その他
    -- 問1: 採用の悩み（複数選択可）
    concern_support_system BOOLEAN DEFAULT FALSE,
    concern_understanding BOOLEAN DEFAULT FALSE,
    concern_trouble_response BOOLEAN DEFAULT FALSE,
    concern_none BOOLEAN DEFAULT FALSE,
    concern_other TEXT,

    -- 問2: 業界への要望（複数選択可）
    request_media BOOLEAN DEFAULT FALSE,
    request_female_manager BOOLEAN DEFAULT FALSE,
    request_toilet_map BOOLEAN DEFAULT FALSE,
    request_daycare_subsidy BOOLEAN DEFAULT FALSE,
    request_facility_subsidy BOOLEAN DEFAULT FALSE,
    request_gender_equality BOOLEAN DEFAULT FALSE,
    request_seminar BOOLEAN DEFAULT FALSE,
    request_male_childcare BOOLEAN DEFAULT FALSE,
    request_other TEXT,

    -- 問3: 助成金制度
    subsidy_knowledge VARCHAR(100),

    -- 問4: 助成金活用方法
    subsidy_usage TEXT,

    -- 問5: 意見・要望
    opinions TEXT,

    -- システム情報
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_status VARCHAR(20) DEFAULT 'draft', -- draft, submitted
    last_saved_at TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_survey_email ON survey_responses(email);
CREATE INDEX idx_survey_company ON survey_responses(company_name);
CREATE INDEX idx_survey_status ON survey_responses(submission_status);
CREATE INDEX idx_survey_created ON survey_responses(created_at);

-- 更新時刻を自動更新するトリガー（PostgreSQL用）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_survey_responses_updated_at
    BEFORE UPDATE ON survey_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- コメント追加
COMMENT ON TABLE survey_responses IS 'トラック運送業界における女性ドライバー雇用に関するアンケート回答';
COMMENT ON COLUMN survey_responses.other_vehicle_text IS 'ブロック2問4：車両別「その他」の詳細';
COMMENT ON COLUMN survey_responses.other_shape_text IS 'ブロック2問5：車両形状別「その他」の詳細';