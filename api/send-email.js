// Vercel Function for sending emails
const sgMail = require('@sendgrid/mail');

// CORSヘッダーを設定
const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return await fn(req, res);
};

const handler = async (req, res) => {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 環境変数チェック
    if (!process.env.SENDGRID_API_KEY) {
      console.error('SENDGRID_API_KEY is not set');
      return res.status(500).json({
        success: false,
        error: 'メール送信の設定が正しくありません'
      });
    }

    // SendGrid設定
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { email, formData, respondentId } = req.body;

    // 入力検証
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です'
      });
    }

    console.log('Sending email to:', email);
    console.log('From email:', process.env.SENDGRID_FROM_EMAIL);

    // メール内容生成
    const emailContent = generateEmailContent(formData, respondentId);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
        name: '全日本トラック協会 女性部会'
      },
      subject: '【全日本トラック協会】アンケート回答確認',
      text: emailContent.text,
      html: emailContent.html
    };

    // SendGridでメール送信
    const result = await sgMail.send(msg);
    console.log('Email sent successfully:', result);

    return res.status(200).json({
      success: true,
      message: '確認メールを送信しました'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    console.error('Error response:', error.response?.body);

    // SendGridのエラーの詳細を取得
    const errorMessage = error.response?.body?.errors?.[0]?.message || error.message;

    // エラーレスポンス
    return res.status(500).json({
      success: false,
      error: 'メール送信に失敗しました',
      details: errorMessage
    });
  }
};

function generateEmailContent(formData, respondentId) {
  const businessTypes = formData.q2 ? formData.q2.join('、') : '未回答';
  const employmentStatus = {
    'currently_employed': '現在、女性ドライバーを雇用している',
    'previously_employed': '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない',
    'never_employed': '過去から現在まで、一度も女性ドライバーを雇用したことがない'
  };

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
      line-height: 1.8;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }
    .content {
      padding: 40px 30px;
    }
    .section {
      background: #f8f9fa;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .field {
      margin: 15px 0;
    }
    .label {
      font-weight: bold;
      color: #555;
    }
    .value {
      color: #333;
      margin-left: 10px;
    }
    .footer {
      background: #f5f5f5;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 13px;
    }
    .notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
      padding: 15px;
      border-radius: 5px;
      margin: 25px 0;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>トラック運送業界における<br>女性雇用促進に関する実態調査</h1>
      <p>アンケート回答確認</p>
    </div>

    <div class="content">
      <p>${formData.companyName || ''}様</p>
      <p>この度は、アンケート調査にご協力いただき、誠にありがとうございました。<br>
      以下の内容で回答を受け付けましたので、ご確認ください。</p>

      <div class="section">
        <h3>📋 回答受付番号</h3>
        <p style="font-size: 18px; font-weight: bold; color: #667eea;">${respondentId}</p>
      </div>

      <div class="section">
        <h3>📝 基本情報</h3>
        <div class="field">
          <span class="label">会社名:</span>
          <span class="value">${formData.companyName || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">ご担当者名:</span>
          <span class="value">${formData.responderName || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">役職:</span>
          <span class="value">${formData.position || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">メールアドレス:</span>
          <span class="value">${formData.email || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">所在地:</span>
          <span class="value">${formData.prefecture || '未入力'}</span>
        </div>
      </div>

      <div class="section">
        <h3>🚚 事業情報</h3>
        <div class="field">
          <span class="label">事業内容:</span>
          <span class="value">${businessTypes}</span>
        </div>
        <div class="field">
          <span class="label">保有車両台数:</span>
          <span class="value">${formData.q3 || '0'} 台</span>
        </div>
        <div class="field">
          <span class="label">女性ドライバー雇用状況:</span>
          <span class="value">${employmentStatus[formData.q4] || '未回答'}</span>
        </div>
      </div>

      <div class="notice">
        <strong>📌 ご注意</strong><br>
        • このメールは自動送信されています。返信はできません。<br>
        • ご質問等がございましたら、下記連絡先までお問い合わせください。<br>
        • 回答内容の修正が必要な場合は、お手数ですが再度アンケートにご回答ください。
      </div>

      <p style="color: #666; font-size: 14px;">
        今回のアンケート調査結果は、トラック運送業界における女性活躍推進のための
        施策検討に活用させていただきます。貴重なご意見をありがとうございました。
      </p>
    </div>

    <div class="footer">
      <p><strong>公益社団法人全日本トラック協会 女性部会</strong></p>
      <p>〒160-0004 東京都新宿区四谷三丁目2番5号</p>
      <p>TEL: 03-3354-1009（代表）| FAX: 03-3354-1019</p>
      <p>URL: https://www.jta.or.jp</p>
      <p style="margin-top: 20px; font-size: 12px; color: #999;">
        © 2025 Japan Trucking Association. All Rights Reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
トラック運送業界における女性雇用促進に関する実態調査
アンケート回答確認

${formData.companyName || ''}様

この度は、アンケート調査にご協力いただき、誠にありがとうございました。
以下の内容で回答を受け付けましたので、ご確認ください。

━━━━━━━━━━━━━━━━━━━━━━
回答受付番号: ${respondentId}
━━━━━━━━━━━━━━━━━━━━━━

■ 基本情報
会社名: ${formData.companyName || '未入力'}
ご担当者名: ${formData.responderName || '未入力'}
役職: ${formData.position || '未入力'}
メールアドレス: ${formData.email || '未入力'}
所在地: ${formData.prefecture || '未入力'}

■ 事業情報
事業内容: ${businessTypes}
保有車両台数: ${formData.q3 || '0'} 台
女性ドライバー雇用状況: ${employmentStatus[formData.q4] || '未回答'}

━━━━━━━━━━━━━━━━━━━━━━
【ご注意】
• このメールは自動送信されています。返信はできません。
• ご質問等がございましたら、下記連絡先までお問い合わせください。
• 回答内容の修正が必要な場合は、お手数ですが再度アンケートにご回答ください。

今回のアンケート調査結果は、トラック運送業界における女性活躍推進のための
施策検討に活用させていただきます。貴重なご意見をありがとうございました。

━━━━━━━━━━━━━━━━━━━━━━
公益社団法人全日本トラック協会 女性部会
〒160-0004 東京都新宿区四谷三丁目2番5号
TEL: 03-3354-1009（代表）| FAX: 03-3354-1019
URL: https://www.jta.or.jp
━━━━━━━━━━━━━━━━━━━━━━
  `;

  return { html, text };
}

module.exports = allowCors(handler);