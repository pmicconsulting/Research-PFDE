# Vercel デプロイメントガイド

## 📋 Vercelで設定する環境変数

### 必須の環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://dfmgnedobufhvkoemxtu.supabase.co` | Supabase プロジェクトURL |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...（長い文字列）` | Supabase 公開キー |
| `SENDGRID_API_KEY` | `SG.xxx...（実際のAPIキー）` | SendGrid APIキー（**VITEプレフィックスなし**） |
| `SENDGRID_FROM_EMAIL` | `membership-mgr@jta-r.jp` | 送信元メールアドレス |

### オプションの環境変数

| 変数名 | 値 | 説明 |
|--------|-----|------|
| `VITE_APP_NAME` | `トラック運送業界における女性雇用促進に関する実態調査` | アプリ名 |
| `VITE_APP_VERSION` | `1.0.0` | バージョン |
| `VITE_APP_ENV` | `production` | 環境 |
| `VITE_DEBUG_MODE` | `false` | デバッグモード |
| `VITE_SESSION_TIMEOUT` | `3600000` | セッションタイムアウト（ミリ秒） |

## ⚠️ 重要な注意点

### ❌ 設定してはいけない環境変数
- `VITE_SENDGRID_API_KEY` - セキュリティリスク！フロントエンドに露出します
- `VITE_SENDGRID_FROM_NAME` - APIキーなしでは使用不可

### ✅ 正しいSendGrid設定
- `SENDGRID_API_KEY`（VITEプレフィックスなし）をVercel Functionsで使用
- サーバーサイドでのみAPIキーを処理

## 🚀 Vercelへのデプロイ手順

### 1. Vercelアカウントでプロジェクトを作成

1. [Vercel](https://vercel.com)にログイン
2. "New Project"をクリック
3. GitHubリポジトリ（Research-PFDE）を選択
4. "Import"をクリック

### 2. 環境変数を設定

プロジェクト設定画面で：

1. "Environment Variables"タブを選択
2. 以下の変数を追加：

```bash
# 必須
VITE_SUPABASE_URL=https://dfmgnedobufhvkoemxtu.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmbWduZWRvYnVmaHZrb2VteHR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTYwNTksImV4cCI6MjA3NTkzMjA1OX0.GFxX6lee67WvpmU8m-TpCutH_bM1jl9IqriSxdV-HYY
SENDGRID_API_KEY=[実際のAPIキー]
SENDGRID_FROM_EMAIL=membership-mgr@jta-r.jp

# オプション
VITE_APP_ENV=production
VITE_DEBUG_MODE=false
```

### 3. デプロイ

1. "Deploy"ボタンをクリック
2. ビルドとデプロイが自動的に実行されます
3. 完了後、提供されたURLでアクセス可能

## 🔍 動作確認

### 1. アンケートフォーム
- フォームの入力と送信が可能か確認
- Supabaseへのデータ保存を確認

### 2. メール送信
- 確認メールが送信されるか確認
- SendGridダッシュボードで送信ログを確認

### 3. 自動保存
- 120秒ごとの自動保存が動作するか確認

## 📝 トラブルシューティング

### メールが送信されない場合
1. Vercelのファンクションログを確認
2. SendGrid APIキーが正しく設定されているか確認（VITEプレフィックスなし）
3. 送信元メールアドレスがSendGridで認証済みか確認

### データが保存されない場合
1. Supabase URLとキーが正しいか確認
2. ブラウザのコンソールでエラーを確認
3. Supabaseダッシュボードでテーブルを確認

### 404エラーが出る場合
1. `vercel.json`のrewritesルールを確認
2. SPAルーティングが正しく設定されているか確認

## 📞 サポート

問題が解決しない場合：
1. Vercelのサポートドキュメントを参照
2. SupabaseのドキュメントBを参照
3. SendGridのドキュメントを参照