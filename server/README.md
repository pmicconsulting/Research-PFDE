# Email Server for Survey System

## 概要
このサーバーは、アンケート回答者への確認メール送信を処理します。

## セットアップ

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env` ファイルに以下の変数を設定:
```
PORT=3002
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=sender@example.com
SENDGRID_FROM_NAME=送信者名
```

### 3. サーバーの起動
```bash
npm start
```

## エンドポイント

### ヘルスチェック
- **GET** `/health`
- レスポンス: `{ "status": "ok", "message": "Email server is running" }`

### メール送信
- **POST** `/api/send-survey-confirmation`
- リクエストボディ:
```json
{
  "email": "recipient@example.com",
  "formData": {
    "companyName": "会社名",
    "responderName": "回答者名",
    // その他のフォームデータ
  },
  "respondentId": "回答ID"
}
```

## 本番環境へのデプロイ

### PM2を使用する場合
```bash
npm install -g pm2
pm2 start index.js --name survey-email-server
pm2 save
pm2 startup
```

### systemdサービスとして実行する場合
1. サービスファイルを作成: `/etc/systemd/system/survey-email.service`
2. サービスを有効化: `systemctl enable survey-email`
3. サービスを開始: `systemctl start survey-email`

## トラブルシューティング

### ポートが使用中の場合
`.env` ファイルの `PORT` を別の番号に変更してください。

### SendGridエラーの場合
- APIキーが正しく設定されているか確認
- 送信元メールアドレスがSendGridで認証済みか確認

## セキュリティ

本番環境では以下の対策を推奨:
- HTTPSの使用（リバースプロキシ経由）
- レート制限の実装
- APIキーの環境変数による管理
- CORSの適切な設定