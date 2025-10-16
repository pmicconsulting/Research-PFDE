-- ====================================
-- Migration: Remove Tragirl Question (Block 4 Question 5)
-- Date: 2025-10-16
-- Description: Remove the tragirl_increase column as Question 5 about "トラガール" was deleted
-- ====================================

-- Remove the tragirl_increase column
ALTER TABLE survey_responses
DROP COLUMN IF EXISTS tragirl_increase;

-- Verify the column was removed
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'survey_responses'
  AND column_name = 'tragirl_increase';
-- This should return 0 rows after successful deletion
