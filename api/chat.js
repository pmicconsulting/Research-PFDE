// Vercel Function for Claude API (ES modules)

// CORSヘッダーを設定 + エラーハンドリング
const allowCors = fn => async (req, res) => {
  const allowedOrigins = [
    'https://research202510.jta.support',
    'https://research-pfde.vercel.app',
    'https://research-pfde-git-main-pmis-projects.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    return await fn(req, res);
  } catch (unexpectedError) {
    console.error('Unexpected error in handler:', unexpectedError);

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'サーバーエラーが発生しました',
        details: unexpectedError.message || 'Unexpected server error',
        timestamp: new Date().toISOString()
      });
    }
  }
};

const handler = async (req, res) => {
  console.log('Chat API called:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 環境変数チェック
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return res.status(500).json({
        success: false,
        error: 'APIキーが設定されていません'
      });
    }

    const { messages, systemPrompt } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        success: false,
        error: 'メッセージが必要です'
      });
    }

    console.log('Calling Claude API with', messages.length, 'messages');

    // Claude API呼び出し
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250514',
        max_tokens: 4096,
        system: systemPrompt || '生成AI利用体験ワークショップのアシスタントです。親切で分かりやすく回答してください。日本語で応答してください。',
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Claude API error:', response.status, errorData);
      return res.status(response.status).json({
        success: false,
        error: 'AI応答の取得に失敗しました',
        details: errorData.error?.message || response.statusText
      });
    }

    const data = await response.json();
    console.log('Claude API response received');

    return res.status(200).json({
      success: true,
      content: data.content[0]?.text || '',
      usage: data.usage
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({
      success: false,
      error: 'チャット処理に失敗しました',
      details: error.message
    });
  }
};

export default allowCors(handler);
