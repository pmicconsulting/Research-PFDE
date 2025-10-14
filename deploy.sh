#!/bin/bash

# ====================================
# 本番環境デプロイスクリプト
# ====================================

echo "🚀 Starting deployment to production..."

# 1. ビルド
echo "📦 Building for production..."
npm run build

# 2. ビルドファイルの確認
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

echo "✅ Build successful"

# 3. サーバー側の依存関係インストール
echo "📦 Installing server dependencies..."
cd server
npm install --production
cd ..

# 4. デプロイ用ファイルのリスト
echo "📋 Files to deploy:"
echo "  - dist/ (フロントエンドビルド)"
echo "  - server/ (メールサーバー)"
echo "  - ecosystem.config.js (PM2設定)"
echo "  - nginx.conf (Nginx設定)"

# 5. 本番サーバーへのアップロード手順
echo ""
echo "📝 Manual deployment steps:"
echo ""
echo "1. Upload files to production server:"
echo "   scp -r dist/* user@research202510.jta.support:/var/www/research202510/"
echo "   scp -r server/* user@research202510.jta.support:/home/user/survey-server/"
echo "   scp ecosystem.config.js user@research202510.jta.support:/home/user/"
echo ""
echo "2. On production server:"
echo "   # Install PM2 globally"
echo "   npm install -g pm2"
echo ""
echo "   # Set environment variable"
echo "   export SENDGRID_API_KEY='your-actual-api-key'"
echo ""
echo "   # Start email server with PM2"
echo "   cd /home/user"
echo "   pm2 start ecosystem.config.js --env production"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "3. Configure Nginx:"
echo "   sudo cp nginx.conf /etc/nginx/sites-available/research202510"
echo "   sudo ln -s /etc/nginx/sites-available/research202510 /etc/nginx/sites-enabled/"
echo "   sudo nginx -t"
echo "   sudo systemctl reload nginx"
echo ""
echo "✅ Deployment preparation complete!"