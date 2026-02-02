// Claude API Service

const API_ENDPOINT = import.meta.env.PROD
  ? '/api/chat'
  : 'http://localhost:5173/api/chat';

export const sendMessage = async (messages, systemPrompt = null) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemPrompt
      })
    });

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
    console.error('Claude API Error:', error);
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
