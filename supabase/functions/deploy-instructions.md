# Supabase Edge Function デプロイ手順

## 1. Supabase CLIのインストール

```bash
npm install -g supabase
```

## 2. Supabaseプロジェクトにログイン

```bash
supabase login
```

## 3. プロジェクトリンク

```bash
supabase link --project-ref dfmgnedobufhvkoemxtu
```

## 4. 環境変数の設定

Supabaseダッシュボード → Edge Functions → send-survey-email → Settings

以下の環境変数を追加：

- `SENDGRID_API_KEY`: SendGridのAPIキー
- `SENDGRID_FROM_EMAIL`: 送信元メールアドレス
- `SENDGRID_FROM_NAME`: 送信者名（全日本トラック協会 女性部会）

## 5. Edge Functionのデプロイ

```bash
supabase functions deploy send-survey-email
```

## 6. テスト

```bash
supabase functions invoke send-survey-email --body '{
  "to": "test@example.com",
  "respondentId": "test-123",
  "formData": {
    "companyName": "テスト会社",
    "responderName": "テスト太郎",
    "email": "test@example.com"
  }
}'
```

## SendGridの設定

1. [SendGrid](https://sendgrid.com)にログイン
2. Settings → API Keys → Create API Key
3. Full Access を選択
4. APIキーをコピー
5. Settings → Sender Authentication → Single Sender Verification
6. 送信元メールアドレスを認証

## 注意事項

- SendGridの無料プランでは1日100通まで送信可能
- 本番環境では独自ドメインのメール認証を推奨
- Edge FunctionのURLは自動的にSupabaseクライアントから解決される