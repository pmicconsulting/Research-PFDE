import React, { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import ChatInterface from '../components/workshop/ChatInterface';
import WorkshopMenu from '../components/workshop/WorkshopMenu';

const WorkshopPage = () => {
  const [promptToSet, setPromptToSet] = useState('');
  const chatRef = useRef(null);

  const handlePromptSelect = (prompt) => {
    setPromptToSet(prompt);
    // プロンプトがセットされたらリセット用にタイマーをセット
    setTimeout(() => setPromptToSet(''), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <Toaster position="top-center" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">生成AI利用体験ワークショップ</h1>
                <p className="text-sm text-gray-500">Generative AI Experience Workshop</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                オンライン
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            {/* ワークショップメニュー */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
              <WorkshopMenu onPromptSelect={handlePromptSelect} />
            </div>

            {/* 使い方のヒント */}
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                使い方のヒント
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>左のメニューから体験したい項目を選択</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>「使用する」でプロンプトを入力欄にセット</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500 mt-1">•</span>
                  <span>必要に応じて内容を編集して送信</span>
                </li>
              </ul>
            </div>

            {/* 注意事項 */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                ご注意
              </h3>
              <p className="text-sm text-amber-700">
                個人情報や機密情報は入力しないでください。AIの回答は必ずしも正確とは限りません。
              </p>
            </div>
          </aside>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-200px)] min-h-[500px] border border-gray-100">
              <ChatInterface ref={chatRef} promptToSet={promptToSet} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 mt-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              Powered by Claude AI (Anthropic)
            </p>
            <p className="text-sm text-gray-500">
              &copy; 2025 AI Workshop. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WorkshopPage;
