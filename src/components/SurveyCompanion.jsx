import React, { useState, useEffect } from 'react';
import { SparklesIcon, XMarkIcon } from '@heroicons/react/24/outline';

const SurveyCompanion = ({ progress, currentBlock, totalQuestions, answeredQuestions }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // 女性トラックドライバーキャラクター画像URL
  const characterImageUrl = 'https://t.pimg.jp/112/106/345/1/112106345.jpg';

  // 進捗に応じたメッセージ
  const getProgressMessage = () => {
    if (progress === 0) {
      return 'アンケートへのご協力ありがとうございます！';
    } else if (progress < 25) {
      return '良いスタートです！ゆっくりお答えください。';
    } else if (progress < 50) {
      return `順調に進んでいますね！現在${Math.round(progress)}%完了しています。`;
    } else if (progress < 75) {
      return '半分を超えました！あと少しです、頑張ってください！';
    } else if (progress < 90) {
      return 'もうすぐ終わります！最後まで頑張りましょう！';
    } else if (progress < 100) {
      return '最後の質問です！ありがとうございます！';
    } else {
      return 'お疲れ様でした！全ての質問にお答えいただき、ありがとうございました！';
    }
  };

  // ブロック別の励ましメッセージ
  const getBlockMessage = () => {
    switch(currentBlock) {
      case 1:
        return '基本情報をお聞きしています。';
      case 2:
        return '女性ドライバーの雇用状況について詳しくお聞きしています。';
      case 3:
        return '採用や定着の取り組みについてお聞きしています。';
      case 4:
        return '今後の展望についてお聞きしています。';
      default:
        return '';
    }
  };

  useEffect(() => {
    const newMessage = getProgressMessage();
    if (newMessage !== currentMessage) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage(newMessage);
        setIsAnimating(false);
      }, 300);
    }
  }, [progress, currentBlock]);

  return (
    <div className={`fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}>
      <div className="flex items-end space-x-1 sm:space-x-4 scale-85 sm:scale-100 origin-bottom-right">
        {/* メッセージバブル */}
        {isVisible && (
          <div className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-5 max-w-[260px] sm:max-w-sm transition-all duration-300 ${isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
            <div className="flex items-start space-x-3">
              <div className="bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full p-1.5">
                <SparklesIcon className="h-5 w-5 text-white flex-shrink-0" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{currentMessage}</p>
                {currentBlock && (
                  <p className="text-xs text-gray-500 mt-2 italic">{getBlockMessage()}</p>
                )}
                {answeredQuestions !== undefined && totalQuestions > 0 && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                      <span className="font-semibold">回答進捗</span>
                      <span className="text-blue-600 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {answeredQuestions}/{totalQuestions} 問回答済み
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* キャラクターアバター */}
        <div className="relative">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full shadow-lg overflow-hidden border-3 border-white">
            <img
              src={characterImageUrl}
              alt="女性トラックドライバーアシスタント"
              className="w-full h-full object-cover"
              onError={(e) => {
                // 画像読み込みエラー時のフォールバック
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* フォールバック用アイコン（画像読み込み失敗時） */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full p-4 shadow-lg items-center justify-center hidden">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          {/* アニメーション用の波紋エフェクト */}
          <div className="absolute inset-0 rounded-full bg-pink-400 opacity-20 animate-ping" />

          {/* 表示/非表示トグルボタン */}
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="absolute -top-2 -right-2 bg-white rounded-full p-3 sm:p-2 shadow-md hover:shadow-lg active:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 transition-all hover:scale-110 active:scale-100 touch-manipulation"
            aria-label={isVisible ? 'アシスタントを非表示' : 'アシスタントを表示'}
          >
            <XMarkIcon className={`h-5 w-5 sm:h-4 sm:w-4 text-gray-600 transform transition-transform ${isVisible ? 'rotate-0' : 'rotate-45'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCompanion;