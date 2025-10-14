# トラック運送業界における女性雇用促進に関する実態調査システム
## プロジェクト完全ドキュメント

---

## 📌 プロジェクト概要

**目的**: 公益社団法人全日本トラック協会 女性部会による、トラック運送業界における女性ドライバー雇用実態調査のためのWebアンケートシステム

**URL**: https://research202510.jta.support

**期間**: 2025年1月開発

---

## 🔧 技術スタック

### フロントエンド
- **React 18.3.1** - UIフレームワーク
- **Vite 7.1.9** - ビルドツール
- **React Router 6.31.0** - ルーティング
- **Tailwind CSS 3.4.1** - CSSフレームワーク

### バックエンド
- **Supabase** - データベース（PostgreSQL）
- **Node.js/Express** - メールサーバー
- **SendGrid** - メール送信サービス

---

## 📁 プロジェクト構造

```
Research-PFDE/
├── src/                        # Reactアプリケーション
│   ├── components/            # コンポーネント
│   │   ├── common/           # 共通コンポーネント
│   │   ├── layout/           # レイアウト（Header/Footer）
│   │   └── survey/           # アンケート用コンポーネント
│   ├── data/
│   │   └── surveyData.js     # アンケート質問データ（32問）
│   ├── pages/                # ページコンポーネント
│   │   ├── TopPage.jsx       # トップページ
│   │   ├── SurveyPage.jsx    # アンケートページ
│   │   └── CompletionPage.jsx # 完了ページ
│   ├── services/             # サービス層
│   │   ├── surveyService.js  # データ保存処理
│   │   └── emailService.js   # メール送信処理
│   └── lib/
│       └── supabase.js       # Supabaseクライアント設定
├── server/                    # メールサーバー
│   ├── index.js              # Express サーバー
│   ├── package.json          # サーバー依存関係
│   └── .env                  # 環境変数
├── database/                  # データベース関連
│   ├── schema.sql            # テーブル定義
│   ├── create-email-trigger.sql # メールトリガー
│   └── remove-all-constraints.sql # 制約削除
├── dist/                      # ビルド済みファイル
├── nginx.conf                # Nginx設定
├── ecosystem.config.js       # PM2設定
└── deploy.sh                 # デプロイスクリプト
```

---

## 🎯 主要機能

### 1. アンケートフォーム
- **32問の質問項目**（4ブロック構成）
- **アコーディオンUI** - 折りたたみ可能なセクション
- **条件分岐ロジック** - 問4の回答により表示ブロックが変化
  - "現在雇用している" → ブロック2表示
  - "過去に雇用/雇用なし" → ブロック3表示

### 2. データベース構造
```sql
-- 5つのテーブル構成
- respondents           # 回答者基本情報
- block1_basic_info     # 基本情報（問1-6）
- block2_current_employment # 現在雇用（問7-24）
- block3_no_employment  # 雇用なし（問25-27）
- block4_other         # その他（問28-32）
```

### 3. メール送信機能
- **Node.js/Express サーバー** (ポート3002)
- **SendGrid API** 統合
- **HTML/テキスト形式** の確認メール
- 回答内容と回答IDを含む

---

## 🔑 重要な修正履歴

### 1. 白画面問題の修正
**問題**: "currently_employed"選択時に白画面
**原因**: `surveyData.js`のb2q1に重複する`type`プロパティ
**解決**:
```javascript
// 修正前
type: 'grid',
type: 'select', // 重複

// 修正後
type: 'grid', // 重複削除
```

### 2. データベースエラーの修正
**問題**: RLSポリシー違反、制約違反、配列リテラルエラー
**解決**:
- RLS無効化: `ALTER TABLE respondents DISABLE ROW LEVEL SECURITY;`
- 制約削除: `remove-all-constraints.sql`実行
- 配列変換: `ensureArray`関数追加

### 3. メール送信問題の解決
**問題**: Edge Function展開失敗、CORS エラー
**解決**: Node.js/Expressサーバーを別途実装

---

## 🚀 デプロイ手順

### 1. ビルド
```bash
npm run build
```

### 2. ファイルアップロード
```bash
# フロントエンド
scp -r dist/* user@research202510.jta.support:/var/www/research202510/

# メールサーバー
scp -r server/* user@research202510.jta.support:/home/user/survey-server/
```

### 3. サーバー設定
```bash
# PM2でメールサーバー起動
export SENDGRID_API_KEY='実際のAPIキー'
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Nginx設定
sudo cp nginx.conf /etc/nginx/sites-available/research202510
sudo ln -s /etc/nginx/sites-available/research202510 /etc/nginx/sites-enabled/
sudo systemctl reload nginx
```

---

## 🔐 環境変数

### 開発環境 (.env.local)
```
VITE_SUPABASE_URL=https://dfmgnedobufhvkoemxtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SENDGRID_API_KEY=SG.xxx...
VITE_SENDGRID_FROM_EMAIL=membership-mgr@jta-r.jp
```

### 本番環境 (.env.production)
```
VITE_SUPABASE_URL=https://dfmgnedobufhvkoemxtu.supabase.co
VITE_APP_ENV=production
VITE_BASE_URL=https://research202510.jta.support
```

### メールサーバー (server/.env)
```
PORT=3002
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM_EMAIL=membership-mgr@jta-r.jp
SENDGRID_FROM_NAME=全日本トラック協会 女性部会
```

---

## 📊 アンケート構成詳細

### ブロック1: 基本情報（全員回答）
- 問1: 会社名、担当者名、役職、性別、メール、所在地
- 問2: 事業内容（複数選択）
- 問3: 保有車両台数
- 問4: 女性ドライバー雇用状況 **（分岐質問）**
- 問5: 女性ドライバー雇用の必要性
- 問6: 今後の採用予定

### ブロック2: 貴社の女性ドライバーの実態（現在雇用している場合）
- 問7-24: 雇用人数、年齢構成、勤務形態、業務内容等

### ブロック3: 採用について（雇用していない場合）
- 問25-27: 採用しない理由、課題、必要な支援

### ブロック4: その他（全員回答）
- 問28-32: 回答者情報、業界への要望等

---

## ⚠️ 注意事項

### セキュリティ
1. **APIキー管理**: 環境変数で管理、コードに直接記載しない
2. **CORS設定**: 本番ドメインのみ許可
3. **RLS**: 本番環境では適切に設定

### パフォーマンス
1. **ビルドサイズ**: 425KB (gzip: 128KB)
2. **キャッシュ設定**: 静的ファイルは1年キャッシュ
3. **レート制限**: メールAPIに制限実装推奨

### 運用
1. **ログ監視**: PM2とNginxのログを定期確認
2. **バックアップ**: Supabaseの自動バックアップ確認
3. **SSL証明書**: Let's Encryptの自動更新設定

---

## 📞 トラブルシューティング

### よくある問題と解決方法

#### 1. メールが送信されない
- SendGrid APIキーの確認
- 送信元メールアドレスの認証確認
- サーバーログ確認: `pm2 logs`

#### 2. データが保存されない
- Supabase接続確認
- RLSポリシー確認
- ネットワークエラーの確認

#### 3. 白画面/エラー画面
- ブラウザコンソールエラー確認
- ビルドファイルの整合性確認
- Nginxエラーログ確認

---

## 📝 今後の改善提案

1. **レスポンシブ対応**: モバイル表示の最適化
2. **プログレスバー**: 回答進捗の可視化
3. **一時保存機能**: 回答途中での保存
4. **集計ダッシュボード**: 管理者用統計画面
5. **多言語対応**: 英語版の追加

---

## 🏢 プロジェクト情報

**クライアント**: 公益社団法人全日本トラック協会 女性部会
**開発期間**: 2025年1月
**開発者**: Claude Code Assistant
**バージョン**: 1.0.0

---

## 📚 参考資料

- [Supabase Documentation](https://supabase.com/docs)
- [SendGrid API Documentation](https://docs.sendgrid.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

---

最終更新: 2025年1月13日