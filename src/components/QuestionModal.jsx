import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon } from '@heroicons/react/24/outline';

const QuestionModal = ({ isOpen, onClose, questionId, questionText, onSubmit }) => {
  const [userQuestion, setUserQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // トラガールキャラクター画像URL
  const characterImageUrl = 'https://t.pimg.jp/112/106/345/1/112106345.jpg';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userQuestion.trim()) return;

    // ユーザーの質問を追加
    const newUserMessage = { type: 'user', message: userQuestion };
    setConversation(prev => [...prev, newUserMessage]);
    setUserQuestion('');
    setIsLoading(true);

    try {
      // モック回答を生成（後でAI APIに置き換え）
      const response = await onSubmit(questionId, questionText, userQuestion);

      // トラガールの回答を追加
      const newBotMessage = { type: 'bot', message: response };
      setConversation(prev => [...prev, newBotMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', message: '申し訳ございません。回答の取得中にエラーが発生しました。' };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // モーダルを閉じる際に会話をクリア
    setTimeout(() => {
      setConversation([]);
      setUserQuestion('');
    }, 300);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                {/* ヘッダー */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 relative">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={characterImageUrl}
                        alt="トラガール"
                        className="w-16 h-16 rounded-full border-3 border-white shadow-lg object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="hidden w-16 h-16 rounded-full border-3 border-white shadow-lg bg-white items-center justify-center">
                        <SparklesIcon className="h-8 w-8 text-purple-600" />
                      </div>
                      <div>
                        <Dialog.Title as="h3" className="text-xl font-bold text-white">
                          トラガールに質問
                        </Dialog.Title>
                        <p className="text-pink-100 text-sm mt-1">
                          アンケートの疑問点をお答えします！
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-colors"
                      onClick={handleClose}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* 質問内容の表示 */}
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-gray-500 mt-0.5">設問:</span>
                    <p className="text-sm text-gray-700 flex-1">{questionText}</p>
                  </div>
                </div>

                {/* 会話エリア */}
                <div className="px-6 py-4 h-80 overflow-y-auto bg-gray-50">
                  {conversation.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <SparklesIcon className="h-12 w-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-sm">
                        この設問について分からないことがあれば、<br />
                        お気軽に質問してくださいね！
                      </p>
                      <div className="mt-6 space-y-2">
                        <p className="text-xs text-gray-400">質問例：</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <button
                            type="button"
                            onClick={() => setUserQuestion('この質問の意味を教えてください')}
                            className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            この質問の意味を教えてください
                          </button>
                          <button
                            type="button"
                            onClick={() => setUserQuestion('どの選択肢を選べばいいですか？')}
                            className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            どの選択肢を選べばいいですか？
                          </button>
                          <button
                            type="button"
                            onClick={() => setUserQuestion('具体例を教えてください')}
                            className="px-3 py-1 text-xs bg-white rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                          >
                            具体例を教えてください
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {msg.type === 'bot' && (
                            <img
                              src={characterImageUrl}
                              alt="トラガール"
                              className="w-8 h-8 rounded-full mr-2 object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          )}
                          <div className={`hidden w-8 h-8 rounded-full mr-2 bg-gradient-to-br from-pink-400 to-purple-600 items-center justify-center`}>
                            <SparklesIcon className="h-4 w-4 text-white" />
                          </div>
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              msg.type === 'user'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-700'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <img
                            src={characterImageUrl}
                            alt="トラガール"
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 入力フォーム */}
                <form onSubmit={handleSubmit} className="px-6 py-4 bg-white border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder="質問を入力してください..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !userQuestion.trim()}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                      <span>送信</span>
                      <PaperAirplaneIcon className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default QuestionModal;