import React, { useEffect, useState } from 'react';
import { getDomainInfo, logDomainInfo } from '../utils/domainIdentifier';

const TestDomain = () => {
  const [domainInfo, setDomainInfo] = useState(null);

  useEffect(() => {
    // ドメイン情報を取得してコンソールに出力
    const info = logDomainInfo();
    setDomainInfo(info);
  }, []);

  if (!domainInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>ドメイン識別テスト</h1>
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h2>現在のドメイン情報:</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', fontWeight: 'bold', width: '200px' }}>
                Source Domain:
              </td>
              <td style={{ padding: '10px', color: '#0066cc' }}>
                {domainInfo.source_domain}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
                Source URL:
              </td>
              <td style={{ padding: '10px', color: '#0066cc', wordBreak: 'break-all' }}>
                {domainInfo.source_url}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
                Source Identifier:
              </td>
              <td style={{ padding: '10px', color: '#0066cc' }}>
                {domainInfo.source_identifier}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '10px', fontWeight: 'bold' }}>
                User Agent:
              </td>
              <td style={{ padding: '10px', color: '#666', fontSize: '12px', wordBreak: 'break-all' }}>
                {domainInfo.user_agent}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{
        backgroundColor: '#e8f5e9',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h3>テスト結果:</h3>
        <p>✅ ドメイン情報が正常に取得できています。</p>
        <p>✅ この情報がSupabaseに保存されます。</p>
      </div>

      <div style={{
        backgroundColor: '#fff3e0',
        padding: '15px',
        borderRadius: '5px',
        marginTop: '20px'
      }}>
        <h3>識別子の説明:</h3>
        <ul>
          <li><strong>localhost</strong>: ローカル開発環境</li>
          <li><strong>research202510</strong>: 2025年10月版のURL</li>
          <li><strong>research202511</strong>: 2025年11月版のURL</li>
          <li><strong>vercel_preview</strong>: Vercelプレビュー環境</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDomain;