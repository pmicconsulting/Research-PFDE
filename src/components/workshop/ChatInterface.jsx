import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputArea from './InputArea';
import { sendMessage, formatMessagesForAPI } from '../../services/claudeService';

const SYSTEM_PROMPT = `あなたは「生成AI利用体験ワークショップ」のアシスタントです。

【役割】
- 参加者が生成AIを実際に体験し、その可能性と限界を理解できるようサポートします
- 質問に対して分かりやすく、具体例を交えて回答します
- 必要に応じてプロンプトの書き方のコツも教えます

【対応方針】
- 親切で丁寧な日本語で応答してください
- 難しい専門用語は避け、分かりやすい言葉で説明してください
- 実際の業務での活用例も積極的に紹介してください
- 質問がないときは、何か試してみたいことがあるか聞いてみてください

【注意事項】
- 個人情報や機密情報の入力は控えるようお伝えください
- AIの回答は常に正確とは限らないことを適宜お伝えください`;

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `こんにちは！「生成AI利用体験ワークショップ」へようこそ！

私はClaude（クロード）というAIアシスタントです。
今日は生成AIを実際に体験していただきながら、その可能性と活用方法を一緒に探っていきましょう。

【このワークショップでできること】
- 文章作成・要約・翻訳の体験
- アイデア出し・ブレインストーミング
- 質問への回答や調べ物のサポート
- プロンプト（指示文）の書き方の練習

まずは何でもお気軽に話しかけてみてください。
「自己紹介して」「今日の天気について話して」など、簡単なことからはじめましょう！`,
  timestamp: new Date().toISOString()
};

const ChatInterface = ({ promptToSet }) => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 外部からのプロンプトセット
  useEffect(() => {
    if (promptToSet) {
      setInputValue(promptToSet);
    }
  }, [promptToSet]);

  const handleSend = async (content) => {
    const userMessage = {
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // メッセージ履歴をAPI形式に変換（ウェルカムメッセージを除く）
      const apiMessages = formatMessagesForAPI(
        [...messages.filter(m => m !== WELCOME_MESSAGE), userMessage]
      );

      const response = await sendMessage(apiMessages, SYSTEM_PROMPT);

      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toISOString()
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `エラーが発生しました: ${response.error}\n\nもう一度お試しください。`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Send message error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '通信エラーが発生しました。ネットワーク接続を確認してください。',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-lg">AI チャット</h2>
              <p className="text-sm text-purple-200">Claude Sonnet 4.5</p>
            </div>
          </div>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            履歴クリア
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            message={message}
            isUser={message.role === 'user'}
          />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-md border border-gray-100">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">考え中...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <InputArea
        onSend={handleSend}
        isLoading={isLoading}
        value={inputValue}
        onChange={setInputValue}
      />
    </div>
  );
};

export default ChatInterface;
