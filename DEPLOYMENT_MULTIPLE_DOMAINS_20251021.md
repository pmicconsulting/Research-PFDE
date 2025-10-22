# 複数ドメインへのデプロイ設定記録
**日付**: 2025年10月21日

## 目的
同一プロジェクトを以下の2つのURLにデプロイする
- `research202510.jta.support` (既存)
- `research202511.jta.support` (新規追加)

## 使用技術
- **ホスティング**: Vercel
- **フレームワーク**: Vite + React
- **リポジトリ**: GitHub (pmicconsulting/Research-PFDE)

## 実施内容

### 1. CSPヘッダーの更新
`vercel.json`のContent-Security-Policyヘッダーに新しいドメインを追加

**変更前**:
```json
"value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://dfmgnedobufhvkoemxtu.supabase.co https://research202510.jta.support"
```

**変更後**:
```json
"value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://dfmgnedobufhvkoemxtu.supabase.co https://research202510.jta.support https://research202511.jta.support"
```

### 2. 変更のコミット
```bash
git add vercel.json
git commit -m "feat: CSPヘッダーにresearch202511.jta.supportドメインを追加"
git push
```

コミットハッシュ: `cc45ceb`

## Vercelでの設定手順

### 方法1: 同じプロジェクトに複数ドメインを追加（推奨）

1. **Vercelダッシュボード**にログイン
2. 既存のプロジェクト（Research-PFDE）を選択
3. **Settings → Domains**へ移動
4. **「Add Domain」**をクリック
5. `research202511.jta.support`を入力
6. DNS設定の指示に従う

**メリット**:
- 1つのプロジェクトで管理が簡単
- 自動デプロイが両方のドメインに適用される
- 環境変数の管理が一元化される

### 方法2: 別プロジェクトとして作成

1. Vercelダッシュボードで「New Project」
2. 同じGitHubリポジトリをインポート
3. プロジェクト名を変更（例: research-pfde-202511）
4. ドメイン設定で`research202511.jta.support`を追加

**メリット**:
- 独立した環境変数設定が可能
- バージョンごとの管理が可能

## DNS設定

ドメインプロバイダー側で以下のいずれかを設定：

### CNAMEレコード
- ホスト: `research202511`
- 値: `cname.vercel-dns.com`

### Aレコード
- ホスト: `research202511`
- 値: `76.76.21.21`

## 環境変数
Vercelダッシュボードで以下の環境変数が設定されていることを確認：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`

## 確認事項

### デプロイ前
- [x] CSPヘッダーに新ドメインを追加
- [x] 変更をGitHubにプッシュ
- [ ] Vercelでドメイン設定
- [ ] DNS設定の反映待ち

### デプロイ後
- [ ] `research202510.jta.support`でアクセス確認
- [ ] `research202511.jta.support`でアクセス確認
- [ ] 両URLで同じコンテンツが表示されることを確認
- [ ] ブラウザのコンソールでCSPエラーがないことを確認
- [ ] API通信が正常に動作することを確認

## 注意事項

1. **DNSの反映時間**
   - DNS設定の変更は最大48時間かかる場合がある
   - 通常は数分から数時間で反映される

2. **SSL証明書**
   - Vercelが自動的にSSL証明書を発行する
   - ドメイン追加後、数分でHTTPSが有効になる

3. **キャッシュ**
   - ブラウザキャッシュをクリアして確認
   - CDNキャッシュの反映も考慮

## トラブルシューティング

### ドメインが表示されない場合
1. DNS設定が正しいか確認
2. Vercelダッシュボードでドメインの検証状態を確認
3. `nslookup research202511.jta.support`でDNS解決を確認

### CSPエラーが発生する場合
1. ブラウザのコンソールでエラー詳細を確認
2. `vercel.json`のCSP設定を再確認
3. 必要に応じて追加のドメインを許可リストに追加

## 関連ファイル
- `vercel.json` - Vercel設定ファイル
- `.env.production` - 本番環境変数
- `VERCEL_DEPLOYMENT.md` - Vercelデプロイメントガイド
- `VERCEL_ENV_SETUP.md` - Vercel環境変数設定ガイド

## 参考リンク
- [Vercel Domains Documentation](https://vercel.com/docs/concepts/projects/domains)
- [Vercel Multiple Domains Guide](https://vercel.com/guides/how-to-add-multiple-domains-to-a-vercel-project)