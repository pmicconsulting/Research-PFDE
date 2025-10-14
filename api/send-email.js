// Vercel Function for sending emails
// このファイルを /api/send-email.js に配置

import sgMail from '@sendgrid/mail';

// Vercelの環境変数から取得（VITE_プレフィックスなし）
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  // POSTメソッドのみ許可
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const { email, formData, respondentId } = req.body;

    // 入力検証
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です'
      });
    }

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
    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: '確認メールを送信しました'
    });

  } catch (error) {
    console.error('Email sending error:', error);

    // エラーレスポンス
    return res.status(500).json({
      success: false,
      error: 'メール送信に失敗しました',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

function generateEmailContent(formData, respondentId) {
  const businessTypes = formData.q2 ? formData.q2.join('、') : '未回答';

  const html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Meiryo', sans-serif; line-height: 1.8; }
    .container { max-width: 600px; margin: 0 auto; }
    .header { background: #667eea; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>アンケート回答確認</h1>
    </div>
    <div class="content">
      <p>${formData.companyName || ''}様</p>
      <p>アンケートにご回答いただき、ありがとうございました。</p>
      <p>回答番号: <strong>${respondentId}</strong></p>

      <h3>回答内容</h3>
      <ul>
        <li>会社名: ${formData.companyName || '未入力'}</li>
        <li>担当者: ${formData.responderName || '未入力'}</li>
        <li>事業内容: ${businessTypes}</li>
      </ul>
    </div>
    <div class="footer">
      <p>公益社団法人全日本トラック協会 女性部会</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
アンケート回答確認

${formData.companyName || ''}様

アンケートにご回答いただき、ありがとうございました。

回答番号: ${respondentId}

【回答内容】
会社名: ${formData.companyName || '未入力'}
担当者: ${formData.responderName || '未入力'}
事業内容: ${businessTypes}

---
公益社団法人全日本トラック協会 女性部会
  `;

  return { html, text };
}