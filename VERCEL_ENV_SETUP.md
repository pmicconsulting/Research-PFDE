# Vercel 環境変数設定ガイド

## 🔴 現在の問題
メール送信時に以下のエラーが発生：
```
Failed to send confirmation email: メール送信の設定が正しくありません（APIキー未設定）
```

Vercelのログ：
```
- SENDGRID_API_KEY exists: false
- SENDGRID_FROM_EMAIL: undefined
```

## ✅ 設定手順

### 1. Vercelダッシュボードにアクセス
1. https://vercel.com/dashboard にログイン
2. プロジェクト一覧から `Research-PFDE` を選択
3. プロジェクトのURLは: https://vercel.com/pmis-projects/research-pfde

### 2. 環境変数設定ページへ移動
1. 上部メニューの **Settings** タブをクリック
2. 左側メニューの **Environment Variables** をクリック

### 3. 必須環境変数の追加

#### SENDGRID_API_KEY
- **Key**: `SENDGRID_API_KEY`
- **Value**: SendGridのAPIキー（`SG.`で始まる文字列）
- **Environment**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **注意**: VITEプレフィックスなし

#### SENDGRID_FROM_EMAIL
- **Key**: `SENDGRID_FROM_EMAIL`
- **Value**: `membership-mgr@jta-r.jp`
- **Environment**:
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- **注意**: SendGridで認証済みのメールアドレスを使用

### 4. その他の環境変数（既に設定済みの場合は確認のみ）

#### Supabase関連
- `VITE_SUPABASE_URL`: [SupabaseプロジェクトURL]
- `VITE_SUPABASE_ANON_KEY`: [Supabase公開キー]

### 5. 環境変数を保存
1. 各環境変数を入力後、**Save** ボタンをクリック
2. すべての環境変数を追加したら、自動的に反映される

### 6. デプロイメントを再実行
環境変数を追加した後：
1. **Deployments** タブに移動
2. 最新のデプロイメントの右側にある **...** メニューをクリック
3. **Redeploy** を選択
4. **Use existing Build Cache** のチェックを外す
5. **Redeploy** ボタンをクリック

## 🔍 SendGrid APIキーの取得方法

### 新規作成の場合
1. https://app.sendgrid.com にログイン
2. 左側メニューの **Settings** → **API Keys**
3. **Create API Key** ボタンをクリック
4. API Key Name: `Research-PFDE-Production`
5. API Key Permissions: **Full Access** または **Restricted Access** で以下を選択：
   - Mail Send: **Full Access**
6. **Create & View** をクリック
7. 表示されたAPIキーをコピー（この画面でしか表示されない）

### 既存のキーを使用する場合
- 既存のAPIキーは再表示できない
- 新しいキーを作成するか、保存してあるキーを使用

## 🔐 セキュリティ注意事項

### やってはいけないこと
- ❌ APIキーをコード内にハードコーディング
- ❌ APIキーをGitHubにコミット
- ❌ VITEプレフィックス付きでSendGrid APIキーを設定
- ❌ クライアント側でAPIキーを使用

### 推奨事項
- ✅ 環境変数はVercelダッシュボードでのみ設定
- ✅ APIキーは安全に保管
- ✅ 定期的にAPIキーをローテーション
- ✅ 最小限の権限でAPIキーを作成

## 📧 送信元メールアドレスの認証

### SendGridで送信元を認証する
1. https://app.sendgrid.com にログイン
2. **Settings** → **Sender Authentication**
3. **Single Sender Verification** または **Domain Authentication** を選択
4. `membership-mgr@jta-r.jp` を認証

### ドメイン認証（推奨）
1. **Authenticate a Domain** を選択
2. DNS プロバイダを選択
3. 表示されたDNSレコードをドメインに追加
4. 認証を確認

## 🧪 動作確認

### 1. Vercel Functionsのログ確認
1. Vercelダッシュボードの **Functions** タブ
2. `api/send-email` をクリック
3. ログで以下を確認：
```
Environment check:
- SENDGRID_API_KEY exists: true
- SENDGRID_API_KEY length: 69
- SENDGRID_FROM_EMAIL: membership-mgr@jta-r.jp
```

### 2. テストメール送信
1. https://research202510.jta.support/survey にアクセス
2. フォームを入力（メールアドレスは必須）
3. 送信ボタンをクリック
4. 確認メールが届くことを確認

## 🚨 トラブルシューティング

### エラー: APIキー未設定
```
SENDGRID_API_KEY is not set
```
→ 環境変数が正しく設定されているか確認

### エラー: 401 Unauthorized
```
The provided authorization grant is invalid, expired, or revoked
```
→ APIキーが無効または権限不足

### エラー: 403 Forbidden
```
The from address does not match a verified Sender Identity
```
→ 送信元メールアドレスが認証されていない

### エラー: メールが届かない
1. SendGridダッシュボードの **Activity** でメール送信ログを確認
2. スパムフォルダを確認
3. 受信者のメールサーバーでブロックされていないか確認

## 📞 サポート連絡先

### Vercelサポート
- ドキュメント: https://vercel.com/docs
- サポート: https://vercel.com/support

### SendGridサポート
- ドキュメント: https://docs.sendgrid.com
- サポート: https://support.sendgrid.com

---
最終更新: 2025年10月14日
作成者: Claude Code Assistant