/**
 * ブラウザ拡張機能との競合を処理するユーティリティ
 *
 * "A listener indicated an asynchronous response..." エラーは
 * ブラウザ拡張機能（広告ブロッカー、パスワードマネージャーなど）が
 * ページのメッセージングシステムに干渉する際に発生します。
 *
 * このエラーはアプリケーションの動作には影響しませんが、
 * コンソールを汚染するため、適切に処理します。
 */

/**
 * ブラウザ拡張機能のエラーを検出してフィルタリング
 * @param {Error} error - 発生したエラー
 * @returns {boolean} - 拡張機能のエラーかどうか
 */
export const isBrowserExtensionError = (error) => {
  if (!error || !error.message) return false;

  const extensionErrorPatterns = [
    'A listener indicated an asynchronous response',
    'message channel closed before a response was received',
    'Extension context invalidated',
    'Could not establish connection',
  ];

  return extensionErrorPatterns.some(pattern =>
    error.message.includes(pattern)
  );
};

/**
 * グローバルエラーハンドラーの設定
 * ブラウザ拡張機能のエラーをフィルタリング
 */
export const setupExtensionErrorHandler = () => {
  // 既存のエラーハンドラーを保存
  const originalErrorHandler = window.onerror;
  const originalUnhandledRejection = window.onunhandledrejection;

  // カスタムエラーハンドラー
  window.onerror = function(message, source, lineno, colno, error) {
    // ブラウザ拡張機能のエラーの場合は無視
    if (isBrowserExtensionError(error)) {
      return true; // エラーを処理済みとしてマーク
    }

    // その他のエラーは元のハンドラーに渡す
    if (originalErrorHandler) {
      return originalErrorHandler.call(this, message, source, lineno, colno, error);
    }

    return false;
  };

  // Promise rejectionハンドラー
  window.onunhandledrejection = function(event) {
    // ブラウザ拡張機能のエラーの場合は無視
    if (isBrowserExtensionError(event.reason)) {
      event.preventDefault();
      return;
    }

    // その他のエラーは元のハンドラーに渡す
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.call(this, event);
    }
  };
};

/**
 * 安全なfetch wrapper
 * ブラウザ拡張機能の干渉を考慮
 */
export const safeFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      // タイムアウト設定
      signal: AbortSignal.timeout(30000),
    });

    return response;
  } catch (error) {
    // ブラウザ拡張機能のエラーは無視
    if (isBrowserExtensionError(error)) {
      // リトライ
      return fetch(url, options);
    }

    throw error;
  }
};

/**
 * 拡張機能の検出
 * 既知の拡張機能が存在するかチェック
 */
export const detectExtensions = () => {
  const detectedExtensions = [];

  // Chrome拡張機能の検出
  if (window.chrome?.runtime?.id) {
    detectedExtensions.push('Chrome Extension');
  }

  // 広告ブロッカーの検出
  const adBlockTest = document.createElement('div');
  adBlockTest.className = 'ad-block-test pub_300x250 pub_300x250m pub_728x90 text-ad textAd text_ad text_ads text-ads text-ad-links';
  adBlockTest.style.position = 'absolute';
  adBlockTest.style.left = '-9999px';
  document.body.appendChild(adBlockTest);

  if (adBlockTest.offsetHeight === 0) {
    detectedExtensions.push('Ad Blocker');
  }

  document.body.removeChild(adBlockTest);

  return detectedExtensions;
};

// デバッグモードでのみ拡張機能情報を表示
if (import.meta.env.DEV) {
  const extensions = detectExtensions();
  if (extensions.length > 0) {
    console.info('Detected browser extensions:', extensions);
  }
}