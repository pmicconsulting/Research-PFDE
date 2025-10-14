-- ====================================
-- 自動保存機能のためのスキーマ更新
-- ====================================

-- 1. respondentsテーブルに自動保存用のカラムを追加
ALTER TABLE respondents
ADD COLUMN IF NOT EXISTS draft_data JSONB,
ADD COLUMN IF NOT EXISTS last_auto_save TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS submission_data JSONB,
ADD COLUMN IF NOT EXISTS session_id VARCHAR(255);

-- 2. statusカラムの値を拡張（draftを追加）
-- 既存の制約を削除
ALTER TABLE respondents
DROP CONSTRAINT IF EXISTS respondents_status_check;

-- 新しい制約を追加（RLSが無効になっている前提なので制約も不要かもしれないが念のため）
-- ALTER TABLE respondents
-- ADD CONSTRAINT respondents_status_check
-- CHECK (status IN ('in_progress', 'draft', 'completed', 'abandoned'));

-- 3. session_idにインデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_respondents_session_id
ON respondents(session_id);

-- 4. last_auto_saveにインデックスを追加
CREATE INDEX IF NOT EXISTS idx_respondents_last_auto_save
ON respondents(last_auto_save);

-- 5. draft_dataを持つレコードを検索するための部分インデックス
CREATE INDEX IF NOT EXISTS idx_respondents_draft
ON respondents(session_id)
WHERE status = 'draft';

-- 6. 自動保存ビューの作成（管理画面用）
CREATE OR REPLACE VIEW auto_save_status AS
SELECT
    id,
    session_id,
    email,
    status,
    created_at,
    last_auto_save,
    completed_at,
    CASE
        WHEN draft_data IS NOT NULL THEN '下書きあり'
        ELSE '下書きなし'
    END as draft_status,
    CASE
        WHEN last_auto_save IS NOT NULL THEN
            EXTRACT(EPOCH FROM (NOW() - last_auto_save)) / 60
        ELSE NULL
    END as minutes_since_last_save
FROM respondents
ORDER BY last_auto_save DESC;

-- 7. 古い下書きを削除する関数（オプション）
CREATE OR REPLACE FUNCTION cleanup_old_drafts()
RETURNS void AS $$
BEGIN
    -- 7日以上経過した下書きを削除
    UPDATE respondents
    SET draft_data = NULL,
        status = 'abandoned'
    WHERE status = 'draft'
    AND last_auto_save < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- 8. 下書きクリーンアップのコメント
COMMENT ON FUNCTION cleanup_old_drafts() IS '7日以上経過した下書きデータを削除する関数';

-- 9. テーブルカラムのコメント
COMMENT ON COLUMN respondents.draft_data IS '自動保存された下書きデータ（JSON形式）';
COMMENT ON COLUMN respondents.last_auto_save IS '最後に自動保存された時刻';
COMMENT ON COLUMN respondents.submission_data IS '最終送信されたデータ（JSON形式）';
COMMENT ON COLUMN respondents.session_id IS 'ブラウザセッションID（自動保存の識別用）';

-- 10. 実行確認
SELECT
    '✅ 自動保存機能のスキーマ更新が完了しました' as message,
    COUNT(*) as total_respondents,
    COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count
FROM respondents;