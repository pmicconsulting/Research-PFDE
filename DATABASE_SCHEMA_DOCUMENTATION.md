# データベーススキーマドキュメント

## 📊 概要

トラック運送業界における女性雇用促進実態調査システムのデータベース構造ドキュメント。
Supabase (PostgreSQL) を使用しています。

## 🗂️ テーブル構造

### 1. respondents（回答者情報）

アンケート回答者の基本情報を管理するメインテーブル。

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | 回答者の一意識別子 |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | レコード作成日時 |
| updated_at | TIMESTAMP WITH TIME ZONE | NOT NULL | レコード更新日時 |
| email | VARCHAR(255) | - | 回答者のメールアドレス |
| ip_address | INET | - | 回答者のIPアドレス |
| user_agent | TEXT | - | ブラウザ情報 |
| status | VARCHAR(50) | CHECK | 回答ステータス（in_progress/completed/abandoned） |
| started_at | TIMESTAMP WITH TIME ZONE | NOT NULL | 回答開始日時 |
| completed_at | TIMESTAMP WITH TIME ZONE | - | 回答完了日時 |
| session_id | VARCHAR(255) | - | セッションID |
| submission_count | INTEGER | DEFAULT 0 | 送信回数 |

### 2. block1_basic_info（基本情報）

全回答者が回答する基本情報セクション。

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | レコードID |
| respondent_id | UUID | FOREIGN KEY | 回答者ID（respondentsテーブルを参照） |
| created_at | TIMESTAMP WITH TIME ZONE | NOT NULL | レコード作成日時 |
| q1_company_name | VARCHAR(255) | - | 会社名・事業所名 |
| q2_prefecture | VARCHAR(100) | - | 本社所在地（都道府県） |
| q2_city | VARCHAR(100) | - | 本社所在地（市区町村） |
| q3_business_type | VARCHAR(100) | CHECK | 事業形態 |
| q3_other_text | VARCHAR(255) | - | 事業形態（その他の内容） |
| q4_employment_status | VARCHAR(50) | CHECK | 女性ドライバー雇用状況 |

**q3_business_type の値:**
- `general_freight`: 一般貨物自動車運送事業
- `specific_freight`: 特定貨物自動車運送事業
- `cargo_light`: 貨物軽自動車運送事業
- `freight_forwarding`: 貨物利用運送事業
- `other`: その他

**q4_employment_status の値:**
- `currently_employed`: 現在雇用している
- `previously_employed`: 過去に雇用していたが現在はいない
- `never_employed`: 一度も雇用したことがない

### 3. block2_current_employment（現在雇用している企業）

現在女性ドライバーを雇用している企業のみが回答するセクション。

#### 車種別・年代別女性ドライバー数（q1_*）

| 車種 | 20代 | 30代 | 40代 | 50代 | 60代以上 |
|------|------|------|------|------|----------|
| 大型トラック | q1_large_truck_20s | q1_large_truck_30s | q1_large_truck_40s | q1_large_truck_50s | q1_large_truck_60s_plus |
| 中型トラック | q1_medium_truck_20s | q1_medium_truck_30s | q1_medium_truck_40s | q1_medium_truck_50s | q1_medium_truck_60s_plus |
| 準中型トラック | q1_semi_medium_truck_20s | q1_semi_medium_truck_30s | q1_semi_medium_truck_40s | q1_semi_medium_truck_50s | q1_semi_medium_truck_60s_plus |
| 小型トラック | q1_small_truck_20s | q1_small_truck_30s | q1_small_truck_40s | q1_small_truck_50s | q1_small_truck_60s_plus |
| 軽貨物車 | q1_light_vehicle_20s | q1_light_vehicle_30s | q1_light_vehicle_40s | q1_light_vehicle_50s | q1_light_vehicle_60s_plus |
| トレーラー | q1_trailer_20s | q1_trailer_30s | q1_trailer_40s | q1_trailer_50s | q1_trailer_60s_plus |

#### その他のフィールド

| カラム名 | データ型 | 説明 |
|---------|---------|------|
| q2_cargo_characteristics | TEXT[] | 貨物特性（複数選択） |
| q2_cargo_other | VARCHAR(255) | 貨物特性（その他） |
| q3_improvements | TEXT[] | 労働条件改善項目（複数選択） |
| q3_improvements_other | VARCHAR(255) | 労働条件改善（その他） |
| q4_education_methods | TEXT[] | 教育方法（複数選択） |
| q4_education_other | VARCHAR(255) | 教育方法（その他） |
| q5_challenges | TEXT[] | 雇用後の課題（複数選択） |
| q5_challenges_other | VARCHAR(255) | 課題（その他） |
| q6_promotion_initiatives | TEXT[] | 女性活躍推進取組（複数選択） |
| q6_promotion_other | VARCHAR(255) | 推進取組（その他） |
| q7_facility_improvements | TEXT[] | 施設整備（複数選択） |
| q7_facility_other | VARCHAR(255) | 施設整備（その他） |
| q8_feedback | TEXT | 女性ドライバーの声（自由記述） |
| q9_increase_intention | VARCHAR(50) | 女性ドライバー比率向上意向 |
| **otherVehicle_text** | **VARCHAR(255)** | **問4：車両別「その他」の詳細（2025年10月15日追加）** |
| **otherShape_text** | **VARCHAR(255)** | **問5：車両形状別「その他」の詳細（2025年10月15日追加）** |

### 4. block3_no_employment（雇用していない企業）

女性ドライバーを雇用していない企業が回答するセクション。

| カラム名 | データ型 | 説明 |
|---------|---------|------|
| q10_retirement_reasons | TEXT[] | 退職理由（複数選択、過去雇用企業のみ） |
| q10_retirement_other | VARCHAR(255) | 退職理由（その他） |
| q11_large_truck | VARCHAR(50) | 大型トラック採用検討 |
| q11_medium_truck | VARCHAR(50) | 中型トラック採用検討 |
| q11_semi_medium_truck | VARCHAR(50) | 準中型トラック採用検討 |
| q11_small_truck | VARCHAR(50) | 小型トラック採用検討 |
| q11_light_vehicle | VARCHAR(50) | 軽貨物車採用検討 |
| q11_trailer | VARCHAR(50) | トレーラー採用検討 |
| q12_not_hiring_reasons | TEXT[] | 採用しない理由（複数選択） |
| q13_considerations | TEXT[] | 労働条件配慮事項（複数選択） |
| q14_education_methods | TEXT[] | 教育方法（複数選択） |
| q15_concerns | TEXT[] | 採用時の懸念（複数選択） |
| q16_promotion_initiatives | TEXT[] | 女性活躍推進取組（複数選択） |
| q17_facility_needs | TEXT[] | 必要な施設整備（複数選択） |
| q18_employment_policy | VARCHAR(100) | 今後の雇用方針 |
| q19_government_requests | TEXT | 行政への要望（自由記述） |
| q20_association_requests | TEXT | 協会への要望（自由記述） |

### 5. block4_other（その他の情報）

全回答者が回答するその他の情報セクション。

| カラム名 | データ型 | 説明 |
|---------|---------|------|
| id | UUID | PRIMARY KEY |
| respondent_id | UUID | FOREIGN KEY |
| created_at | TIMESTAMP WITH TIME ZONE | レコード作成日時 |
| q1_vehicle_count | INTEGER | 保有車両台数 |
| q2_total_drivers | INTEGER | ドライバー総数 |
| q3_male_drivers | INTEGER | 男性ドライバー数 |
| q4_female_office_workers | INTEGER | 女性事務職員数 |
| q5_female_warehouse_workers | INTEGER | 女性倉庫作業員数 |
| q6_respondent_name | VARCHAR(100) | 回答者氏名 |
| q6_department | VARCHAR(100) | 部署名 |
| q6_position | VARCHAR(100) | 役職 |
| q6_phone | VARCHAR(50) | 電話番号 |
| q6_email | VARCHAR(255) | メールアドレス |

## 📐 インデックス

パフォーマンス最適化のために以下のインデックスが設定されています：

| インデックス名 | テーブル | カラム | 用途 |
|---------------|---------|--------|------|
| idx_respondents_status | respondents | status | ステータス別検索 |
| idx_respondents_created_at | respondents | created_at | 日時順ソート |
| idx_respondents_completed_at | respondents | completed_at | 完了日時検索 |
| idx_respondents_email | respondents | email | メール検索 |
| idx_block1_respondent | block1_basic_info | respondent_id | 結合最適化 |
| idx_block1_employment_status | block1_basic_info | q4_employment_status | 雇用状況別集計 |
| idx_block1_prefecture | block1_basic_info | q2_prefecture | 地域別集計 |

## 🔒 セキュリティ設定

### Row Level Security (RLS)

すべてのテーブルでRLSが有効化されています：

1. **INSERT ポリシー**: 匿名ユーザーでも新規レコードの追加が可能
2. **UPDATE ポリシー**: session_id が一致する場合のみ更新可能
3. **SELECT ポリシー**: 管理者のみ全データ閲覧可能（通常ユーザーは自分のデータのみ）
4. **DELETE ポリシー**: 削除は管理者のみ可能

## 📊 ビューとストアドプロシージャ

### survey_summary ビュー

回答データの集計用ビュー。以下の情報を提供：
- 基本的な回答者情報
- 会社情報（会社名、所在地、事業形態）
- 雇用状況
- 女性ドライバーの総数（現在雇用企業のみ）

### save_survey_response 関数

アンケート回答を保存するストアドプロシージャ。
- パラメータ: session_id, block1〜4のJSONBデータ
- 戻り値: respondent_id (UUID)
- トランザクション処理により、データの整合性を保証

## 🔄 トリガー

### update_updated_at_column

`respondents` テーブルの更新時に `updated_at` カラムを自動的に現在時刻に更新。

## 📈 データ分析用クエリ例

### 1. 雇用状況別の企業数

```sql
SELECT
  q4_employment_status,
  COUNT(*) as count
FROM block1_basic_info
GROUP BY q4_employment_status;
```

### 2. 都道府県別の回答数

```sql
SELECT
  q2_prefecture,
  COUNT(*) as count
FROM block1_basic_info
WHERE q2_prefecture IS NOT NULL
GROUP BY q2_prefecture
ORDER BY count DESC;
```

### 3. 女性ドライバー総数（車種別）

```sql
SELECT
  SUM(q1_large_truck_20s + q1_large_truck_30s + q1_large_truck_40s +
      q1_large_truck_50s + q1_large_truck_60s_plus) as large_truck_total,
  SUM(q1_medium_truck_20s + q1_medium_truck_30s + q1_medium_truck_40s +
      q1_medium_truck_50s + q1_medium_truck_60s_plus) as medium_truck_total,
  -- 他の車種も同様
FROM block2_current_employment;
```

### 4. 完了率の計算

```sql
SELECT
  COUNT(*) FILTER (WHERE status = 'completed') * 100.0 / COUNT(*) as completion_rate
FROM respondents;
```

## 🛠️ メンテナンス

### バックアップ推奨頻度
- 日次: 増分バックアップ
- 週次: フルバックアップ
- 月次: アーカイブ作成

### パフォーマンス監視項目
- クエリ実行時間
- インデックス使用率
- テーブルサイズ
- デッドロック発生頻度

## 📝 注意事項

1. **配列型カラム**: PostgreSQLの配列型（TEXT[]）を使用している箇所は、アプリケーション側で適切に処理が必要
2. **UUID生成**: uuid-ossp拡張を使用してUUIDを自動生成
3. **タイムゾーン**: すべての日時はUTCで保存、表示時にローカルタイムに変換
4. **文字コード**: UTF-8で統一
5. **NULL値の扱い**: 必須項目以外はNULL許可、集計時は0として扱う

## 📝 変更履歴

### 2025年10月15日
- **block2_current_employment テーブル更新**
  - `otherVehicle_text` カラムを追加（問4：車両別「その他」の詳細入力用）
  - `otherShape_text` カラムを追加（問5：車両形状別「その他」の詳細入力用）
- **注**: 既存のSupabaseデータベースにこれらのカラムを追加するには、以下のSQLを実行してください：
  ```sql
  ALTER TABLE block2_current_employment
  ADD COLUMN IF NOT EXISTS otherVehicle_text VARCHAR(255),
  ADD COLUMN IF NOT EXISTS otherShape_text VARCHAR(255);

  COMMENT ON COLUMN block2_current_employment.otherVehicle_text IS '問4：車両別「その他」の詳細';
  COMMENT ON COLUMN block2_current_employment.otherShape_text IS '問5：車両形状別「その他」の詳細';
  ```

### 2025年10月14日
- 初版作成
- 全テーブル構造の文書化
- インデックスとセキュリティ設定の記載

---
最終更新: 2025年10月15日