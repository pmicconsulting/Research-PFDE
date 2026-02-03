import React from 'react';
import { Link } from 'react-router-dom';

const aiServices = [
  {
    name: 'ChatGPT',
    company: 'OpenAI',
    url: 'https://chat.openai.com',
    description: '世界で最も利用されている対話型AI。GPT-4oモデルを搭載し、テキスト生成、コード作成、画像生成に対応。',
    color: 'from-green-500 to-emerald-600',
    features: ['テキスト生成', '画像生成', 'コード作成', 'ファイル分析'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    )
  },
  {
    name: 'Claude',
    company: 'Anthropic',
    url: 'https://claude.ai',
    description: 'Anthropic社が開発した高度な推論能力を持つAI。長文処理に優れ、安全性を重視した設計。本ワークショップで使用。',
    color: 'from-orange-500 to-amber-600',
    features: ['長文処理', '高度な推論', 'コード作成', 'ファイル分析'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M4.603 15.397l5.397-10.794 5.397 10.794H4.603zM12 2L2 22h20L12 2z"/>
      </svg>
    )
  },
  {
    name: 'Gemini',
    company: 'Google',
    url: 'https://gemini.google.com',
    description: 'Googleが開発したマルチモーダルAI。検索エンジンとの連携が強み。画像・動画の理解にも対応。',
    color: 'from-blue-500 to-cyan-600',
    features: ['Google連携', '画像理解', 'マルチモーダル', 'リアルタイム情報'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    )
  },
  {
    name: 'Microsoft Copilot',
    company: 'Microsoft',
    url: 'https://copilot.microsoft.com',
    description: 'MicrosoftのAIアシスタント。Bingの検索機能と連携し、最新情報の取得が可能。Office製品との統合も。',
    color: 'from-sky-500 to-blue-600',
    features: ['Bing連携', 'Office統合', '画像生成', '最新情報'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M11.5 2.5v9h-9v-9h9zm1 0h9v9h-9v-9zm-1 10v9h-9v-9h9zm1 0h9v9h-9v-9z"/>
      </svg>
    )
  },
  {
    name: 'Perplexity',
    company: 'Perplexity AI',
    url: 'https://perplexity.ai',
    description: 'AI検索エンジン。リアルタイムでWeb検索を行い、情報源を明示した回答を提供。調査・リサーチに最適。',
    color: 'from-teal-500 to-emerald-600',
    features: ['Web検索', '情報源明示', 'リアルタイム', '学術検索'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    )
  },
  {
    name: 'Grok',
    company: 'xAI',
    url: 'https://grok.x.ai',
    description: 'イーロン・マスク率いるxAI社のAI。X（旧Twitter）のリアルタイム情報にアクセス可能。ユーモアのある回答が特徴。',
    color: 'from-gray-700 to-gray-900',
    features: ['X連携', 'リアルタイム', 'ユーモア', '最新ニュース'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    )
  },
  {
    name: 'Notion AI',
    company: 'Notion',
    url: 'https://notion.so',
    description: 'ドキュメント作成ツールNotionに組み込まれたAI。文章作成、要約、翻訳などをワークスペース内で実行。',
    color: 'from-gray-600 to-gray-800',
    features: ['文章作成', '要約', '翻訳', 'ドキュメント管理'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952l1.449.327s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.14c-.093-.514.28-.887.747-.933zM2.637 1.431l13.49-.933c1.636-.14 2.057.093 2.756.607l3.803 2.66c.513.374.7.467.7 .86v15.121c0 .84-.28 1.354-1.261 1.447l-15.083.887c-.747.047-1.12-.093-1.496-.607l-2.429-3.153c-.42-.56-.606-.98-.606-1.493V2.62c0-.56.28-1.026 1.121-1.12l.005-.068z"/>
      </svg>
    )
  },
  {
    name: 'DeepL',
    company: 'DeepL',
    url: 'https://deepl.com',
    description: '高精度な翻訳に特化したAI。自然で流暢な翻訳が特徴。ビジネス文書の翻訳に最適。',
    color: 'from-indigo-500 to-blue-600',
    features: ['高精度翻訳', '31言語対応', 'ドキュメント翻訳', 'API提供'],
    logo: (
      <svg viewBox="0 0 24 24" className="w-10 h-10" fill="currentColor">
        <path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
      </svg>
    )
  }
];

const AIServicesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ヘッダー */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">生成AIサービス一覧</h1>
          <div className="flex gap-4">
            <Link to="/" className="text-purple-300 hover:text-white text-sm transition-colors">
              ワークショップへ戻る
            </Link>
            <Link to="/guide" className="text-purple-300 hover:text-white text-sm transition-colors">
              ガイドを見る
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* タイトル */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            代表的な生成AIサービス
          </h1>
          <p className="text-purple-200 text-lg">
            様々な生成AIサービスを体験してみましょう
          </p>
        </div>

        {/* サービスカード */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiServices.map((service) => (
            <a
              key={service.name}
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105 hover:shadow-2xl"
            >
              {/* ロゴとタイトル */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white`}>
                  {service.logo}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-purple-300 text-sm">{service.company}</p>
                </div>
              </div>

              {/* 説明 */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                {service.description}
              </p>

              {/* 特徴タグ */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature) => (
                  <span
                    key={feature}
                    className="text-xs bg-white/10 text-purple-200 px-2 py-1 rounded-full"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* リンクインジケーター */}
              <div className="mt-4 flex items-center text-purple-300 text-sm group-hover:text-white transition-colors">
                <span>サービスを開く</span>
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </a>
          ))}
        </div>

        {/* 本ワークショップへの導線 */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-600/30 to-indigo-600/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-400/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              運送業特化のAIワークショップ
            </h2>
            <p className="text-purple-200 mb-6">
              本ワークショップでは、Claude（Anthropic社）を使用し、<br className="hidden md:inline" />
              運送業界の専門知識を学習したAIを体験できます。
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-purple-500/25"
            >
              ワークショップを始める
            </Link>
          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-purple-300 text-sm">
          <p>各サービスの利用にはそれぞれのアカウント登録が必要な場合があります</p>
        </div>
      </footer>
    </div>
  );
};

export default AIServicesPage;
