import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

/**
 * 自動保存ステータス表示コンポーネント
 */
export function AutoSaveStatus({ lastSaveTime, saveStatus, isSaving }) {
  // ステータスに応じたスタイルとメッセージ
  const getStatusDisplay = () => {
    if (isSaving) {
      return {
        text: '保存中...',
        className: 'text-blue-600 animate-pulse',
        icon: (
          <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )
      };
    }

    switch (saveStatus) {
      case 'saved':
        return {
          text: lastSaveTime
            ? `最終保存: ${format(new Date(lastSaveTime), 'HH:mm:ss', { locale: ja })}`
            : '保存済み',
          className: 'text-green-600',
          icon: (
            <svg className="h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };

      case 'error':
        return {
          text: '保存エラー',
          className: 'text-red-600',
          icon: (
            <svg className="h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };

      case 'completed':
        return {
          text: '送信完了',
          className: 'text-blue-600 font-bold',
          icon: (
            <svg className="h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          )
        };

      default:
        if (lastSaveTime) {
          return {
            text: `最終保存: ${format(new Date(lastSaveTime), 'HH:mm:ss', { locale: ja })}`,
            className: 'text-gray-500',
            icon: null
          };
        }
        return {
          text: '自動保存: 120秒ごと',
          className: 'text-gray-400',
          icon: null
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="fixed top-14 right-2 sm:bottom-4 sm:top-auto sm:right-4 z-30">
      <div className="bg-white/95 backdrop-blur rounded-lg shadow-lg border border-gray-200 px-2 py-1 sm:px-4 sm:py-2 flex items-center space-x-1 sm:space-x-2">
        {display.icon && <span className="scale-75 sm:scale-100">{display.icon}</span>}
        <span className={`text-xs sm:text-sm ${display.className}`}>
          {display.text}
        </span>
      </div>
    </div>
  );
}

/**
 * 自動保存インジケーター（コンパクト版）
 */
export function AutoSaveIndicator({ isSaving, lastSaveTime }) {
  if (isSaving) {
    return (
      <span className="inline-flex items-center text-xs text-blue-600">
        <svg className="animate-spin h-3 w-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        保存中...
      </span>
    );
  }

  if (lastSaveTime) {
    return (
      <span className="inline-flex items-center text-xs text-gray-500">
        <svg className="h-3 w-3 mr-1 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        {format(new Date(lastSaveTime), 'HH:mm')}に保存
      </span>
    );
  }

  return null;
}