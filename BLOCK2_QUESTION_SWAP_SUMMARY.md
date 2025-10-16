# Block 2 Question Swap Summary - 問2 ↔ 問3

**Date**: 2025年10月16日
**Task**: Swap the order of questions 2 and 3 in Block 2

## ✅ Completed Changes

### 1. Frontend - Survey Data Configuration
**File**: `src/data/surveyData.js`

**Before**:
- **b2q2**: 問2：1日当たりの運行距離別に、従事している女性ドライバーの人数をご入力ください。
- **b2q3**: 問3：女性ドライバーの平均在職年数について、おおよその数字をご入力ください。

**After**:
- **b2q2**: 問2：女性ドライバーの平均在職年数について、おおよその数字をご入力ください。
- **b2q3**: 問3：1日当たりの運行距離別に、従事している女性ドライバーの人数をご入力ください。

**Important**: The IDs (`b2q2` and `b2q3`) remain the same. Only the question numbers in the titles and the content were swapped.

### 2. Database Schema - Comment Update
**File**: `sql/create_tables.sql:54`

Updated comment from:
```sql
-- 問3: 運行形態別人数
```

To:
```sql
-- 問3: 運行距離別人数
```

**Note**: The column names (`avg_tenure_years`, `long_distance_count`, etc.) do NOT need to change because they use descriptive names that are independent of question numbers.

## 📊 Database Impact Analysis

### ✅ No Database Migration Required

The swap of questions 2 and 3 **does NOT require a database migration** because:

1. **Column names are descriptive**: The database uses field names like `avg_tenure_years` and `long_distance_count` that describe the data, not the question number.

2. **Data mapping remains the same**: The frontend code maps:
   - `b2q2` data → `avg_tenure_years` column (平均在職年数)
   - `b2q3` data → `long_distance_count`, `medium_distance_count`, etc. (運行距離別人数)

3. **Only comments changed**: The SQL schema comments were updated for clarity, but this doesn't affect the database structure or data.

### Database Column Mapping

| Question ID | Question Title | Database Columns |
|------------|----------------|------------------|
| b2q2 (問2) | 平均在職年数 | `avg_tenure_years` |
| b2q3 (問3) | 運行距離別人数 | `long_distance_count`, `medium_distance_count`, `short_distance_count`, `city_delivery_count` |

## 🔍 Verification Checklist

### Frontend Verification
- [x] Question order swapped in `surveyData.js`
- [x] Question IDs remain unchanged (b2q2, b2q3)
- [x] Question titles updated with correct numbers (問2, 問3)
- [x] All question properties (type, options, etc.) preserved

### Database Verification
- [x] SQL comments updated to reflect new question order
- [x] Column names remain descriptive and unchanged
- [x] No data migration needed
- [x] Data mapping logic unchanged

### Testing Checklist
1. Test Block 2 question display order (問2 should show 平均在職年数 first)
2. Test form submission to verify data saves to correct columns
3. Test data retrieval to verify correct mapping

## 📝 Related Changes

### Additional Database Cleanup
While reviewing the schema, we also removed the deleted "トラガール" question:

**File**: `database/remove-tragirl-question.sql` (NEW)
```sql
ALTER TABLE survey_responses
DROP COLUMN IF EXISTS tragirl_increase;
```

This removes Block 4 Question 5 (which was deleted earlier) from the database.

## 🔗 Related Files

- Frontend: `src/data/surveyData.js`
- Schema: `sql/create_tables.sql`
- Migration: `database/remove-tragirl-question.sql`

---
Created: 2025年10月16日
