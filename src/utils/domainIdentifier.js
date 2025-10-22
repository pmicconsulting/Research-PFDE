/**
 * ドメイン識別用ユーティリティ関数
 * どのURLから回答が送信されたかを識別するための情報を取得
 */

/**
 * 現在のドメイン情報を取得
 * @returns {Object} ドメイン情報オブジェクト
 */
export const getDomainInfo = () => {
  // ブラウザ環境でない場合（テスト環境など）のフォールバック
  if (typeof window === 'undefined') {
    return {
      source_domain: 'unknown',
      source_url: 'unknown',
      source_identifier: 'unknown',
      user_agent: 'unknown'
    };
  }

  const hostname = window.location.hostname;
  const fullUrl = window.location.href;
  const userAgent = navigator.userAgent || '';

  return {
    source_domain: hostname,
    source_url: fullUrl,
    source_identifier: getSourceIdentifier(hostname),
    user_agent: userAgent
  };
};

/**
 * ホスト名から簡易識別子を生成
 * @param {string} hostname - ホスト名
 * @returns {string} 識別子
 */
export const getSourceIdentifier = (hostname) => {
  // research202510.jta.support → research202510
  if (hostname.includes('research202510')) {
    return 'research202510';
  }

  // research202511.jta.support → research202511
  if (hostname.includes('research202511')) {
    return 'research202511';
  }

  // localhost開発環境
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'localhost';
  }

  // Vercelプレビュー環境
  if (hostname.includes('vercel.app')) {
    // research-pfde-*.vercel.app → vercel_preview
    if (hostname.includes('research-pfde')) {
      return 'vercel_preview';
    }
    return 'vercel_other';
  }

  // その他のドメイン
  return hostname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
};

/**
 * ドメイン情報をログ出力（デバッグ用）
 */
export const logDomainInfo = () => {
  const domainInfo = getDomainInfo();
  console.log('=== Domain Information ===');
  console.log('Domain:', domainInfo.source_domain);
  console.log('URL:', domainInfo.source_url);
  console.log('Identifier:', domainInfo.source_identifier);
  console.log('User Agent:', domainInfo.user_agent);
  console.log('=========================');
  return domainInfo;
};

/**
 * 特定のドメインからのアクセスかを判定
 * @param {string} targetDomain - チェック対象のドメイン識別子
 * @returns {boolean} 一致する場合true
 */
export const isFromDomain = (targetDomain) => {
  const currentIdentifier = getSourceIdentifier(window.location.hostname);
  return currentIdentifier === targetDomain;
};

/**
 * 本番環境からのアクセスかを判定
 * @returns {boolean} 本番環境の場合true
 */
export const isProduction = () => {
  const identifier = getSourceIdentifier(window.location.hostname);
  return identifier === 'research202510' || identifier === 'research202511';
};

/**
 * 開発環境からのアクセスかを判定
 * @returns {boolean} 開発環境の場合true
 */
export const isDevelopment = () => {
  const identifier = getSourceIdentifier(window.location.hostname);
  return identifier === 'localhost';
};