-- ====================================
-- email_queueから手動でメールを確認・送信する方法
-- ====================================

-- 1. 未送信のメールを確認
SELECT
    id,
    to_email,
    subject,
    status,
    created_at,
    respondent_id
FROM email_queue
WHERE status = 'pending'
ORDER BY created_at DESC;

-- 2. メール内容を確認（特定のメール）
SELECT
    to_email,
    subject,
    html_content,
    text_content
FROM email_queue
WHERE id = 'メールのID';

-- 3. テスト用：最新の回答者にメールを再生成
DO $$
DECLARE
    v_respondent_id UUID;
BEGIN
    -- 最新の回答者IDを取得
    SELECT id INTO v_respondent_id
    FROM respondents
    WHERE status = 'completed'
    ORDER BY created_at DESC
    LIMIT 1;

    IF v_respondent_id IS NOT NULL THEN
        -- ステータスを一時的に変更して再度完了にすることでトリガーを発火
        UPDATE respondents
        SET status = 'in_progress'
        WHERE id = v_respondent_id;

        UPDATE respondents
        SET status = 'completed'
        WHERE id = v_respondent_id;

        RAISE NOTICE 'メールキューに追加しました。respondent_id: %', v_respondent_id;
    ELSE
        RAISE NOTICE '完了した回答が見つかりません。';
    END IF;
END $$;

-- 4. email_queueの内容をCSVエクスポート用に整形
SELECT
    to_email as "送信先",
    subject as "件名",
    CASE status
        WHEN 'pending' THEN '未送信'
        WHEN 'sent' THEN '送信済'
        WHEN 'failed' THEN '送信失敗'
    END as "ステータス",
    created_at as "作成日時",
    sent_at as "送信日時"
FROM email_queue
ORDER BY created_at DESC;