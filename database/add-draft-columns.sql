-- ====================================
-- Migration: Add Draft and Auto-Save Columns to Respondents Table
-- Date: 2025-10-16
-- Description: Add draft_data and last_auto_save columns to support auto-save functionality
-- ====================================

BEGIN;

-- Add draft_data column to store draft form data as JSONB
ALTER TABLE respondents
ADD COLUMN IF NOT EXISTS draft_data JSONB;

-- Add last_auto_save column to track when the draft was last saved
ALTER TABLE respondents
ADD COLUMN IF NOT EXISTS last_auto_save TIMESTAMP;

-- Add comments for documentation
COMMENT ON COLUMN respondents.draft_data IS '自動保存された下書きデータ（JSONB形式）';
COMMENT ON COLUMN respondents.last_auto_save IS '下書きが最後に保存された日時';

-- Create index on session_id and status for faster draft lookups
CREATE INDEX IF NOT EXISTS idx_respondents_session_status
ON respondents(session_id, status);

-- Verify the columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'respondents'
  AND column_name IN ('draft_data', 'last_auto_save');
-- This should return 2 rows showing the new columns

COMMIT;

-- ====================================
-- Post-Migration Notes
-- ====================================

-- After running this migration, the auto-save feature will work properly.
--
-- The draft_data column stores the entire form state as JSONB.
-- The last_auto_save column tracks when the draft was last updated.
--
-- Auto-save functionality:
-- 1. Saves draft every 120 seconds (2 minutes)
-- 2. Loads draft on page load
-- 3. Allows manual save via "下書き保存" button
