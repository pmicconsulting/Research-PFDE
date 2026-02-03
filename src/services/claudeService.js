// Claude API Service

const API_ENDPOINT = import.meta.env.PROD
  ? '/api/chat'
  : 'http://localhost:5173/api/chat';

// タイムアウト: 150秒（Vercelの120秒 + バッファ）
const TIMEOUT_MS = 150000;

export const sendMessage = async (messages, systemPrompt = null) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemPrompt
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // レスポンスがJSONかどうか確認
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('Non-JSON response:', text.substring(0, 200));
      throw new Error('サーバーからの応答が不正です。しばらく待ってから再試行してください。');
    }

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'AI応答の取得に失敗しました');
    }

    return {
      success: true,
      content: data.content,
      usage: data.usage
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Claude API Error:', error);

    // タイムアウトエラーの場合
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'AIの応答に時間がかかっています。もう一度お試しください。'
      };
    }

    return {
      success: false,
      error: error.message || 'エラーが発生しました'
    };
  }
};

export const formatMessagesForAPI = (chatHistory) => {
  return chatHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
};
