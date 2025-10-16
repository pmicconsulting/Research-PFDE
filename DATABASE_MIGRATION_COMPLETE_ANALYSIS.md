# データベース移行完全分析レポート

**作成日**: 2025年10月16日
**目的**: 全ての変更事項とデータベーススキーマの整合性を徹底評価

---

## 📋 変更事項一覧

### 変更1: Block 1 - Question 2に新オプション追加
**ファイル**: `src/data/surveyData.js:52`
**変更内容**: 「【一般】一般自動車貨物運送事業」を最初のオプションとして追加

**データベース影響**:
- ❌ **`database/schema.sql`**: 対応なし（旧スキーマ、単一選択のみ）
- ✅ **`sql/create_tables.sql:21`**: `business_type_general_cargo BOOLEAN` 追加済み
- ✅ **移行スクリプト**: `database/add-general-cargo-option.sql` 作成済み

**結論**: **移行が必要**

---

### 変更2: Block 1 - Question 2のタイトル修正
**ファイル**: `src/data/surveyData.js:49`
**変更内容**: 「ですか、」→「ですか。」

**データベース影響**: なし（表示のみの変更）

**結論**: **移行不要**

---

### 変更3: Block 2 - 問1, 2, 4, 5に注記追加
**ファイル**: `src/data/surveyData.js`
**変更内容**: 「※複数従事している場合、最も多く従事しているものでカウントします。」を追加
- b2q1 (line 118)
- b2q2 (line 133) - 既存の類似注記あり
- b2q4 (line 156)
- b2q5 (line 173)

**データベース影響**: なし（表示のみの変更）

**結論**: **移行不要**

---

### 変更4: Block 2 - 問10, 11を問8, 9に変更
**ファイル**: `src/data/surveyData.js`
**変更内容**:
- b2q10 → b2q8 (ID とタイトル)
- b2q11 → b2q9 (ID とタイトル)

**データベース影響分析**:

#### ❗ **重大な問題発見**

**`database/schema.sql` (Supabase用)**:
- Block2のフィールド名が**実際の質問内容と完全に不一致**
- 問2〜問9のフィールドが実際のアンケートと異なる

```sql
-- 現在のschema.sql (誤り)
q2_cargo_characteristics TEXT[],      -- 問2となっているが、実際は「取扱品目」= b2q6
q3_improvements TEXT[],                -- 問3となっているが存在しない質問
q4_education_methods TEXT[],           -- 問4となっているが存在しない質問
q5_challenges TEXT[],                  -- 問5となっているが存在しない質問
q6_promotion_initiatives TEXT[],       -- 問6となっているが存在しない質問
q7_facility_improvements TEXT[],       -- 問7となっているが存在しない質問
q8_feedback TEXT,                      -- 問8となっているが存在しない質問
q9_increase_intention VARCHAR(50),     -- 問9となっているが存在しない質問
```

**実際のアンケート構造 (surveyData.js)**:
- b2q1: 従業員数グリッド
- b2q2: 平均在職年数（変更後）
- b2q3: 運行距離別人数（変更後）
- b2q4: 車両別人数
- b2q5: 車両形状別人数
- b2q6: 取扱品目
- b2q7: 荷役作業
- b2q8: 免許取得対応（旧b2q10）
- b2q9: その他の免許（旧b2q11）

**`sql/create_tables.sql` (survey_responses用)**:
- ✅ 説明的なフィールド名を使用（問番号に依存しない）
- ✅ 正しくマッピングされている

**結論**: **Supabaseスキーマ（database/schema.sql）は実装と完全に不一致！**

---

### 変更5: Block 2 - 問2と問3の順番入れ替え
**ファイル**: `src/data/surveyData.js`
**変更内容**:
- 旧問2「運行距離別人数」→ 新問3
- 旧問3「平均在職年数」→ 新問2

**データベース影響**:
- ✅ **`sql/create_tables.sql`**: フィールド名が説明的なため影響なし
  - `avg_tenure_years` (平均在職年数)
  - `long_distance_count` (運行距離別)
- ❌ **`database/schema.sql`**: フィールド名が不適切で使用不可

**結論**: **survey_responsesテーブルは移行不要、Supabaseスキーマは全面見直し必要**

---

### 変更6: Block 2 - 問3の距離ラベル変更
**ファイル**: `src/data/surveyData.js:141-145`
**変更内容**:

| 変更前 | 変更後 |
|--------|--------|
| 片道200km以上 | 長距離（500km超） |
| 片道100km以上200km未満 | 中距離（200～500km） |
| 片道50km以上100km未満 | 近距離（50～200km） |
| 片道50km未満 | 市内配送（100km以内） |

**データベース影響**:
- フィールド名は変更なし: `longDistance`, `mediumDistance`, `shortDistance`, `cityDelivery`
- 距離の定義が変更（500km超、200-500km等）されたが、フィールド名は抽象的なので問題なし

**結論**: **移行不要**（ただし、既存データの解釈には注意が必要）

---

### 変更7: Block 4 - 問5（トラガール）削除
**ファイル**: `src/data/surveyData.js`
**変更内容**: 問5を削除、旧問6を問5に変更

**データベース影響**:
- ❌ **`database/schema.sql`**: 該当なし（Block4フィールドなし）
- ✅ **`sql/create_tables.sql:229`**: `tragirl_increase` カラムあり
- ✅ **移行スクリプト**: `database/remove-tragirl-question.sql` 作成済み

**結論**: **移行が必要**

---

## 🔍 重大な問題: 2つのスキーマファイルの存在

### Schema File 1: `database/schema.sql` (Supabase用)
**構造**: 正規化されたテーブル設計
- `respondents`
- `block1_basic_info`
- `block2_current_employment` ← **実装と不一致**
- `block3_no_employment`
- `block4_other`

**問題点**:
1. ❌ Block2のフィールド名が質問番号ベース（q2_, q3_等）で、実装と一致しない
2. ❌ 実際のアンケートに存在しない質問のフィールドが多数存在
3. ❌ `save_survey_response`関数が実装と合わない

### Schema File 2: `sql/create_tables.sql` (survey_responses)
**構造**: 単一テーブル設計
- `survey_responses` (全データを1テーブルに格納)

**利点**:
1. ✅ 説明的なフィールド名使用（問番号に依存しない）
2. ✅ 実際のアンケート構造と一致
3. ✅ 新しいオプション追加済み

---

## ⚠️ データベーススキーマ不整合の詳細分析

### Block 2 フィールドマッピングの問題

#### `database/schema.sql` の現状（Supabase）

```sql
-- 問1: 車種別女性ドライバー数（グリッド）
q1_large_truck_20s INTEGER DEFAULT 0,
...
-- 問2: 業務内容 ← ❌ 実際は「取扱品目」で問6
q2_cargo_characteristics TEXT[],
q2_cargo_other VARCHAR(255),
-- 問3: 労働条件改善 ← ❌ 存在しない質問
q3_improvements TEXT[],
...
```

#### 実際のアンケート（surveyData.js）

```javascript
b2q1: 従業員数グリッド（2020年と2025年）
b2q2: 平均在職年数
b2q3: 運行距離別人数
b2q4: 車両別人数
b2q5: 車両形状別人数
b2q6: 取扱品目（複数選択）
b2q7: 荷役作業（複数選択）
b2q8: 免許取得対応（旧b2q10）
b2q9: その他の免許（旧b2q11）
```

#### ` surveyService.js`のデータマッピング

```javascript
// Block2データは schema.sql のテーブルには保存されていない！
// 代わりに survey_responses テーブルを使用している可能性
```

**調査結果**: `surveyService.js`は`block2_current_employment`テーブルにデータを保存しようとするが、フィールド名が一致しない！

---

## 🚨 必須の移行作業

### 移行1: Block 1 - 一般自動車貨物運送事業オプション追加

**対象データベース**: survey_responses テーブル

**スクリプト**: `database/add-general-cargo-option.sql`

```sql
ALTER TABLE survey_responses
ADD COLUMN IF NOT EXISTS business_type_general_cargo BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN survey_responses.business_type_general_cargo IS '問2：【一般】一般自動車貨物運送事業';
```

**実行必須度**: ★★★★★ (高)

---

### 移行2: Block 4 - トラガール質問削除

**対象データベース**: survey_responses テーブル

**スクリプト**: `database/remove-tragirl-question.sql`

```sql
ALTER TABLE survey_responses
DROP COLUMN IF EXISTS tragirl_increase;
```

**実行必須度**: ★★★☆☆ (中) - 既存データに影響なし

---

### 移行3: Supabase Block2スキーマ全面修正 ← **最重要**

**対象データベース**: block2_current_employment テーブル (Supabase)

**問題**: 現在のスキーマは実装と完全に不一致

**解決策の選択肢**:

#### オプションA: Supabaseスキーマを実装に合わせて修正（推奨）

フィールド名を実際のアンケートに合わせて再設計:

```sql
-- 既存の不要なフィールドを削除
ALTER TABLE block2_current_employment
DROP COLUMN IF EXISTS q2_cargo_characteristics,
DROP COLUMN IF EXISTS q2_cargo_other,
DROP COLUMN IF EXISTS q3_improvements,
DROP COLUMN IF EXISTS q3_improvements_other,
DROP COLUMN IF EXISTS q4_education_methods,
DROP COLUMN IF EXISTS q4_education_other,
DROP COLUMN IF EXISTS q5_challenges,
DROP COLUMN IF EXISTS q5_challenges_other,
DROP COLUMN IF EXISTS q6_promotion_initiatives,
DROP COLUMN IF EXISTS q6_promotion_other,
DROP COLUMN IF EXISTS q7_facility_improvements,
DROP COLUMN IF EXISTS q7_facility_other,
DROP COLUMN IF EXISTS q8_feedback,
DROP COLUMN IF EXISTS q9_increase_intention;

-- 実際の質問に対応するフィールドを追加
ALTER TABLE block2_current_employment
ADD COLUMN IF NOT EXISTS avg_tenure_years VARCHAR(20),  -- b2q2: 平均在職年数
ADD COLUMN IF NOT EXISTS long_distance_count INTEGER DEFAULT 0,  -- b2q3
ADD COLUMN IF NOT EXISTS medium_distance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS short_distance_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS city_delivery_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS kei_cargo_count INTEGER DEFAULT 0,  -- b2q4
ADD COLUMN IF NOT EXISTS small_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS medium_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS large_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS trailer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_vehicle_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_vehicle_text TEXT,
ADD COLUMN IF NOT EXISTS van_truck_count INTEGER DEFAULT 0,  -- b2q5
ADD COLUMN IF NOT EXISTS flat_body_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS dump_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS unic_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS tank_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS garbage_truck_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS semi_trailer_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_shape_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS other_shape_text TEXT,
ADD COLUMN IF NOT EXISTS cargo_items TEXT[],  -- b2q6: 取扱品目
ADD COLUMN IF NOT EXISTS cargo_items_other TEXT,
ADD COLUMN IF NOT EXISTS loading_methods TEXT[],  -- b2q7: 荷役作業
ADD COLUMN IF NOT EXISTS loading_methods_other TEXT,
ADD COLUMN IF NOT EXISTS license_support TEXT[],  -- b2q8: 免許取得対応
ADD COLUMN IF NOT EXISTS license_support_other TEXT,
ADD COLUMN IF NOT EXISTS other_licenses TEXT[],  -- b2q9: その他の免許
ADD COLUMN IF NOT EXISTS other_licenses_other TEXT;
```

#### オプションB: survey_responsesテーブルに一本化

Supabaseの正規化スキーマを廃止し、`sql/create_tables.sql`のsurvey_responsesテーブルのみを使用

**実行必須度**: ★★★★★ (最高) - **これがないとアプリが動作しない**

---

## 📊 データベーススキーマ使用状況の確認

### surveyService.jsの実際の動作

`surveyService.js`は**Supabaseの正規化テーブル**を使用:
- `respondents`
- `block1_basic_info`
- `block2_current_employment`
- `block3_no_employment`
- `block4_other`

しかし、フィールド名が一致しないため、**データ保存が失敗する可能性が高い**！

---

## ✅ 推奨される移行手順

### ステップ1: 緊急度の高い移行（即実行）

1. **Block 2 スキーマ修正**: オプションAを実行
2. **Block 1 新オプション追加**: `add-general-cargo-option.sql` 実行

### ステップ2: 通常の移行

3. **トラガール質問削除**: `remove-tragirl-question.sql` 実行

### ステップ3: surveyService.jsの修正

Block2のデータマッピングを正しいフィールド名に更新する必要あり

---

## 🎯 結論

### 移行が必要な項目

| # | 変更内容 | 対象DB | 緊急度 | スクリプト |
|---|---------|--------|--------|-----------|
| 1 | Block2スキーマ全面修正 | Supabase | ★★★★★ | 新規作成必要 |
| 2 | 一般自動車貨物運送事業追加 | survey_responses | ★★★★☆ | 作成済み |
| 3 | トラガール質問削除 | survey_responses | ★★★☆☆ | 作成済み |

### 移行不要な項目

- Block 1 Question 2 タイトル修正（表示のみ）
- Block 2 注記追加（表示のみ）
- Block 2 問2/3順番入れ替え（survey_responsesは説明的フィールド名使用のため）
- Block 2 距離ラベル変更（表示のみ、フィールド名不変）

### 最重要アクション

**`database/schema.sql`のBlock2スキーマが実装と完全に不一致です。アプリケーションが正しく動作していない可能性があります。至急、実際の使用状況を確認し、適切なスキーマ修正を行う必要があります。**

## 🚀 推奨される移行実行手順

### フェーズ1: 緊急対応（即座に実行）

#### 1.1 Block 2 スキーマ修正（最優先）

**スクリプト**: `database/fix-block2-schema-supabase.sql` ✅ **作成完了**

**実行方法**:
```bash
# Supabaseダッシュボード > SQL Editor で実行
# または psql コマンドで実行
psql -h [HOST] -U [USER] -d [DATABASE] -f database/fix-block2-schema-supabase.sql
```

**重要な注意事項**:
- ⚠️ **本番環境で実行する前に必ずバックアップを取ること**
- ⚠️ 既存の `q2_cargo_characteristics` 等のフィールドにデータがある場合、移行前にデータを保存
- ⚠️ トランザクション内で実行されるため、エラーが発生した場合は全てロールバックされる

**影響範囲**:
- `block2_current_employment` テーブルの全フィールド構造
- Block 2 の全ての質問データ（b2q2～b2q9）

**緊急度**: ★★★★★ （最高）
**理由**: 現在のスキーマではBlock 2のデータが正しく保存できない

---

#### 1.2 surveyService.js の修正（Block 2 データマッピング）

**ファイル**: `src/services/surveyService.js`

**必要な修正**:

現在の `surveyService.js` は存在しないフィールド名（`q6_cargo_characteristics`, `q10_license_methods` 等）にマッピングしようとしています。

修正が必要な箇所:

```javascript
// 修正前（誤り）
const block2Data = {
  respondent_id: respondentId,
  // 問1のグリッドデータ
  q1_large_truck_20s: parseInt(formData.b2q1?.largeTruck?.['20代']) || 0,
  // ... 他のグリッドデータ

  // 問6-11（誤ったフィールド名）
  q6_cargo_characteristics: ensureArray(formData.b2q6),
  q6_cargo_other: formData.b2q6_other || null,
  q7_loading_methods: ensureArray(formData.b2q7),
  q7_loading_other: formData.b2q7_other || null,
  q10_license_methods: ensureArray(formData.b2q10),
  q10_license_other: formData.b2q10_other || null,
  q11_other_licenses: ensureArray(formData.b2q11),
  q11_other_licenses_other: formData.b2q11_other || null,
};

// 修正後（正しい）
const block2Data = {
  respondent_id: respondentId,

  // 問1: 従業員数グリッド
  q1_large_truck_20s: parseInt(formData.b2q1?.largeTruck?.['20代']) || 0,
  // ... 他のグリッドデータ

  // 問2: 平均在職年数
  avg_tenure_years: formData.b2q2 || null,

  // 問3: 運行距離別人数
  long_distance_count: parseInt(formData.b2q3?.longDistance) || 0,
  medium_distance_count: parseInt(formData.b2q3?.mediumDistance) || 0,
  short_distance_count: parseInt(formData.b2q3?.shortDistance) || 0,
  city_delivery_count: parseInt(formData.b2q3?.cityDelivery) || 0,

  // 問4: 車両別人数
  kei_cargo_count: parseInt(formData.b2q4?.keiCargo) || 0,
  small_truck_count: parseInt(formData.b2q4?.smallTruck) || 0,
  medium_truck_count: parseInt(formData.b2q4?.mediumTruck) || 0,
  large_truck_count: parseInt(formData.b2q4?.largeTruck) || 0,
  trailer_count: parseInt(formData.b2q4?.trailer) || 0,
  other_vehicle_count: parseInt(formData.b2q4?.otherVehicle) || 0,
  other_vehicle_text: formData.b2q4?.otherVehicle_text || null,

  // 問5: 車両形状別人数
  van_truck_count: parseInt(formData.b2q5?.vanTruck) || 0,
  flat_body_count: parseInt(formData.b2q5?.flatBody) || 0,
  dump_truck_count: parseInt(formData.b2q5?.dumpTruck) || 0,
  unic_count: parseInt(formData.b2q5?.unic) || 0,
  tank_truck_count: parseInt(formData.b2q5?.tankTruck) || 0,
  garbage_truck_count: parseInt(formData.b2q5?.garbageTruck) || 0,
  semi_trailer_count: parseInt(formData.b2q5?.semiTrailer) || 0,
  other_shape_count: parseInt(formData.b2q5?.otherShape) || 0,
  other_shape_text: formData.b2q5?.otherShape_text || null,

  // 問6: 取扱品目
  cargo_items: ensureArray(formData.b2q6),
  cargo_items_other: formData.b2q6_other || null,

  // 問7: 荷役作業
  loading_methods: ensureArray(formData.b2q7),
  loading_methods_other: formData.b2q7_other || null,

  // 問8: 免許取得対応（旧b2q10）
  license_support: ensureArray(formData.b2q8),
  license_support_other: formData.b2q8_other || null,

  // 問9: その他の免許（旧b2q11）
  other_licenses: ensureArray(formData.b2q9),
  other_licenses_other: formData.b2q9_other || null,
};
```

**緊急度**: ★★★★★ （最高）
**理由**: データベーススキーマ修正後、このコード修正がないとデータ保存が失敗する

---

### フェーズ2: 通常の移行（Block 2 修正後に実行）

#### 2.1 Block 1 - 一般自動車貨物運送事業オプション追加

**スクリプト**: `database/add-general-cargo-option.sql` ✅ **作成済み**

**実行方法**:
```bash
psql -h [HOST] -U [USER] -d [DATABASE] -f database/add-general-cargo-option.sql
```

**影響範囲**: `survey_responses` テーブル（または該当テーブル）
**緊急度**: ★★★★☆ （高）
**理由**: 新しい事業内容オプションが選択できない

---

#### 2.2 Block 4 - トラガール質問削除

**スクリプト**: `database/remove-tragirl-question.sql` ✅ **作成済み**

**実行方法**:
```bash
psql -h [HOST] -U [USER] -d [DATABASE] -f database/remove-tragirl-question.sql
```

**影響範囲**: `survey_responses` テーブル（または該当テーブル）
**緊急度**: ★★★☆☆ （中）
**理由**: 使用されていないカラムが残るだけで、機能には影響しない

---

## 📋 移行実行チェックリスト

### 実行前の準備

- [ ] 本番データベースの完全バックアップを取得
- [ ] ステージング環境で全ての移行スクリプトをテスト実行
- [ ] Block 2 の既存データ（`q2_cargo_characteristics` 等）を確認し、必要ならデータを退避
- [ ] メンテナンスウィンドウを設定（ユーザーへの通知）

### 実行順序

1. [ ] **Phase 1.1**: `fix-block2-schema-supabase.sql` を実行
2. [ ] **Phase 1.1 検証**: Block 2 のフィールドが正しく変更されたか確認
3. [ ] **Phase 1.2**: `surveyService.js` のデータマッピングを修正
4. [ ] **Phase 1.2 検証**: Block 2 のデータが正しく保存・取得できるかテスト
5. [ ] **Phase 2.1**: `add-general-cargo-option.sql` を実行
6. [ ] **Phase 2.1 検証**: Block 1 Question 2 で新オプションが選択・保存できるか確認
7. [ ] **Phase 2.2**: `remove-tragirl-question.sql` を実行
8. [ ] **Phase 2.2 検証**: `tragirl_increase` カラムが削除されたか確認

### 実行後の検証

- [ ] Block 1 Question 2: 「【一般】一般自動車貨物運送事業」が選択可能か
- [ ] Block 2 Question 2: 平均在職年数が正しく保存されるか
- [ ] Block 2 Question 3: 運行距離別データが正しく保存されるか（新ラベル）
- [ ] Block 2 Question 4: 車両別データとその他テキストが正しく保存されるか
- [ ] Block 2 Question 5: 車両形状別データとその他テキストが正しく保存されるか
- [ ] Block 2 Question 6-9: 複数選択データが配列として正しく保存されるか
- [ ] Block 4: 質問が5つのみ表示されるか（トラガール質問がないこと）
- [ ] 既存のアンケート回答データが正しく表示されるか

---

## 🔄 データベース使用状況の最終判断

### 現状の問題

プロジェクトには**2つの異なるスキーマ**が存在します:

1. **`database/schema.sql`** (Supabase用、正規化設計)
   - 5つのテーブルに分割: `respondents`, `block1_basic_info`, `block2_current_employment`, `block3_no_employment`, `block4_other`
   - **Block 2 のフィールド名が実装と不一致**（致命的な問題）

2. **`sql/create_tables.sql`** (単一テーブル設計)
   - 1つの `survey_responses` テーブルにすべてのデータを格納
   - **フィールド名が実装と一致**（正しい設計）

### 推奨される解決策

#### オプションA: Supabaseスキーマを修正して使用（推奨）

**メリット**:
- 正規化されたデータ構造（データの重複が少ない）
- テーブル間の関係性が明確
- 将来の拡張性が高い

**作業内容**:
1. ✅ `fix-block2-schema-supabase.sql` を実行してBlock 2スキーマを修正（作成済み）
2. ✅ `surveyService.js` のデータマッピングを修正
3. Block 1, 3, 4 のテーブルも実装との整合性を確認（別途分析が必要）

---

#### オプションB: survey_responsesテーブルに一本化

**メリット**:
- シンプルな構造
- 既に実装と一致しているため修正が少ない
- クエリがシンプル

**デメリット**:
- データの重複が発生しやすい
- テーブルが非常に大きくなる（200+カラム）

**作業内容**:
1. `database/schema.sql` の正規化テーブルを削除
2. `sql/create_tables.sql` を本番環境に適用
3. `surveyService.js` を `survey_responses` テーブルのみを使用するように修正

---

### 推奨: **オプションA を採用**

理由:
- 正規化設計の方が長期的にメンテナンスしやすい
- Block 2 の修正スクリプトは既に作成済み
- 他のブロックも同様に修正すれば整合性が取れる

---

## 📊 全変更事項の最終まとめ

| # | 変更内容 | データベース移行 | 緊急度 | スクリプト | コード修正 |
|---|---------|----------------|--------|-----------|----------|
| 1 | Block 2スキーマ全面修正 | ✅ 必要 | ★★★★★ | `fix-block2-schema-supabase.sql` ✅作成済み | `surveyService.js` 要修正 |
| 2 | Block 1 一般貨物運送事業追加 | ✅ 必要 | ★★★★☆ | `add-general-cargo-option.sql` ✅作成済み | 不要 |
| 3 | Block 4 トラガール質問削除 | ✅ 必要 | ★★★☆☆ | `remove-tragirl-question.sql` ✅作成済み | 不要（既に削除済み） |
| 4 | Block 1 Q2 タイトル句読点修正 | ❌ 不要 | - | - | 不要（既に修正済み） |
| 5 | Block 2 Q1,2,4,5 注記追加 | ❌ 不要 | - | - | 不要（既に修正済み） |
| 6 | Block 2 Q10,11 → Q8,9 変更 | ❌ 不要 | - | - | 不要（既に修正済み） |
| 7 | Block 2 Q2 ↔ Q3 順番入れ替え | ❌ 不要 | - | - | 不要（既に修正済み） |
| 8 | Block 2 Q3 距離ラベル変更 | ❌ 不要 | - | - | 不要（既に修正済み） |

**注意**: データベース移行が「不要」の項目は、フロントエンドの表示のみの変更、またはデータベースのカラム名が説明的なため影響を受けないものです。

---

## ⚠️ 最重要アクション

### 🚨 **Block 2 スキーマの不一致は致命的な問題です**

現在のSupabaseスキーマ（`database/schema.sql`）では、Block 2のデータが正しく保存できません。

**現象**:
- ユーザーがBlock 2のフォームに入力しても、データが正しく保存されない
- または、エラーが発生してフォーム送信が失敗する
- 既存のBlock 2データが取得できない、または誤ったフィールドから取得される

**対処**:
1. ✅ **即座に** `database/fix-block2-schema-supabase.sql` を実行
2. ✅ **即座に** `src/services/surveyService.js` のBlock 2マッピングを修正
3. ✅ ステージング環境でBlock 2のデータ保存・取得をテスト
4. ✅ 本番環境に適用

**追加の推奨事項**:
- Block 1, Block 3, Block 4 のテーブルも同様に実装との整合性を確認
- `database/schema.sql` 全体を見直し、実装と一致するように更新
- または、`survey_responses` 単一テーブル設計への移行を検討

---

## 📝 今後の課題

### 短期的な課題
1. Block 1, 3, 4 のSupabaseスキーマも実装と一致するか確認
2. `save_survey_response` 関数（PostgreSQL関数）の更新
3. RLS（Row Level Security）ポリシーの確認

### 長期的な課題
1. スキーマファイルの一本化（`database/schema.sql` と `sql/create_tables.sql` の統一）
2. データベーススキーマのバージョン管理とマイグレーション戦略
3. 自動テストによるスキーマとコードの整合性チェック
4. CI/CDパイプラインへの移行スクリプト統合

---

## 📚 関連ドキュメント

- `QUESTION_2_UPDATE_SUMMARY.md`: Block 1 Question 2の変更詳細
- `BLOCK2_QUESTION_SWAP_SUMMARY.md`: Block 2の質問順変更詳細
- `DATABASE_SCHEMA_DOCUMENTATION.md`: データベーススキーマの全体ドキュメント
- `database/add-general-cargo-option.sql`: 一般貨物運送事業オプション追加スクリプト
- `database/remove-tragirl-question.sql`: トラガール質問削除スクリプト
- `database/fix-block2-schema-supabase.sql`: Block 2スキーマ修正スクリプト（新規作成）

---

**作成日**: 2025年10月16日
**最終更新**: 2025年10月16日
**作成者**: Claude Code
**ステータス**: ✅ 完了 - レビュー待ち
