-- ====================================
-- メール送信用のデータベーストリガー
-- respondentsテーブルに新規レコードが追加されたときに
-- メール送信キューに追加
-- ====================================

-- 1. メール送信キューテーブルを作成
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    to_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    html_content TEXT NOT NULL,
    text_content TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    respondent_id UUID REFERENCES respondents(id) ON DELETE CASCADE
);

-- 2. インデックスを作成
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);

-- 3. メール内容を生成する関数
CREATE OR REPLACE FUNCTION generate_survey_confirmation_email()
RETURNS TRIGGER AS $$
DECLARE
    v_email VARCHAR(255);
    v_company_name VARCHAR(255);
    v_respondent_name VARCHAR(255);
    v_employment_status VARCHAR(255);
    v_html_content TEXT;
    v_text_content TEXT;
BEGIN
    -- 関連データを取得
    SELECT
        b1.q1_company_name,
        b4.q6_respondent_name,
        b4.q6_email,
        CASE b1.q4_employment_status
            WHEN 'currently_employed' THEN '現在、女性ドライバーを雇用している'
            WHEN 'previously_employed' THEN '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない'
            WHEN 'never_employed' THEN '過去から現在まで、一度も女性ドライバーを雇用したことがない'
            ELSE '未回答'
        END
    INTO v_company_name, v_respondent_name, v_email, v_employment_status
    FROM respondents r
    LEFT JOIN block1_basic_info b1 ON r.id = b1.respondent_id
    LEFT JOIN block4_other b4 ON r.id = b4.respondent_id
    WHERE r.id = NEW.id;

    -- メールアドレスがない場合はスキップ
    IF v_email IS NULL OR v_email = '' THEN
        RETURN NEW;
    END IF;

    -- HTML形式のメール本文
    v_html_content := format('
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: "Hiragino Sans", "Meiryo", sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4a5568; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border: 1px solid #dee2e6; }
        .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .field { margin: 10px 0; }
        .label { font-weight: bold; color: #2d3748; }
        .value { color: #4a5568; margin-left: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>アンケート回答確認</h1>
            <p>トラック運送業界における女性雇用促進に関する実態調査</p>
        </div>
        <div class="content">
            <p>この度はアンケートにご回答いただき、誠にありがとうございました。</p>

            <div class="section">
                <h3>回答内容</h3>
                <div class="field">
                    <span class="label">会社名:</span>
                    <span class="value">%s</span>
                </div>
                <div class="field">
                    <span class="label">回答者名:</span>
                    <span class="value">%s</span>
                </div>
                <div class="field">
                    <span class="label">女性ドライバー雇用状況:</span>
                    <span class="value">%s</span>
                </div>
                <div class="field">
                    <span class="label">回答ID:</span>
                    <span class="value">%s</span>
                </div>
            </div>

            <p>ご協力ありがとうございました。</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d;">
                <p>公益社団法人全日本トラック協会 女性部会<br>
                〒160-0004 東京都新宿区四谷三丁目2番5号<br>
                TEL: 03-3354-1009（代表）</p>
            </div>
        </div>
    </div>
</body>
</html>',
    COALESCE(v_company_name, '未入力'),
    COALESCE(v_respondent_name, '未入力'),
    v_employment_status,
    NEW.id::TEXT
    );

    -- テキスト形式のメール本文
    v_text_content := format('
アンケート回答確認

トラック運送業界における女性雇用促進に関する実態調査

この度はアンケートにご回答いただき、誠にありがとうございました。

■ 回答内容
会社名: %s
回答者名: %s
女性ドライバー雇用状況: %s
回答ID: %s

ご協力ありがとうございました。

━━━━━━━━━━━━━━━━━━━━━━
公益社団法人全日本トラック協会 女性部会
〒160-0004 東京都新宿区四谷三丁目2番5号
TEL: 03-3354-1009（代表）
━━━━━━━━━━━━━━━━━━━━━━',
    COALESCE(v_company_name, '未入力'),
    COALESCE(v_respondent_name, '未入力'),
    v_employment_status,
    NEW.id::TEXT
    );

    -- メールキューに追加
    INSERT INTO email_queue (
        to_email,
        subject,
        html_content,
        text_content,
        respondent_id
    ) VALUES (
        v_email,
        '【全日本トラック協会】アンケート回答確認',
        v_html_content,
        v_text_content,
        NEW.id
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. トリガーを作成
DROP TRIGGER IF EXISTS send_confirmation_email_on_survey_complete ON respondents;

CREATE TRIGGER send_confirmation_email_on_survey_complete
AFTER INSERT OR UPDATE OF status ON respondents
FOR EACH ROW
WHEN (NEW.status = 'completed')
EXECUTE FUNCTION generate_survey_confirmation_email();

-- 5. 権限を付与
GRANT ALL ON email_queue TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 6. 確認
SELECT '✅ メール送信トリガーを作成しました' as message,
       'email_queueテーブルにメールが追加されます' as note;