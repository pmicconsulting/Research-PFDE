import express from 'express';
import cors from 'cors';
import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

// 環境変数を読み込み
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// SendGrid設定
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ミドルウェア
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://research202510.jta.support'
  ]
}));
app.use(express.json());

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// メール送信エンドポイント
app.post('/api/send-survey-confirmation', async (req, res) => {
  try {
    const { email, formData, respondentId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスが必要です'
      });
    }

    // メール内容を生成
    const emailContent = generateEmailContent(formData, respondentId);

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
        name: process.env.SENDGRID_FROM_NAME || '全日本トラック協会 女性部会'
      },
      subject: '【全日本トラック協会】アンケート回答確認',
      text: emailContent.text,
      html: emailContent.html
    };

    // SendGridでメール送信
    await sgMail.send(msg);

    console.log(`Email sent successfully to: ${email}`);

    res.json({
      success: true,
      message: '確認メールを送信しました'
    });

  } catch (error) {
    console.error('Email sending error:', error);

    res.status(500).json({
      success: false,
      error: error.message || 'メール送信に失敗しました'
    });
  }
});

// メール内容生成関数
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
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 30px;
    }
    .section {
      background: #f8f9fa;
      padding: 25px;
      margin: 25px 0;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    .section-title {
      color: #333;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .field {
      margin: 15px 0;
      display: flex;
      align-items: flex-start;
    }
    .label {
      font-weight: bold;
      color: #555;
      min-width: 140px;
      margin-right: 15px;
    }
    .value {
      color: #333;
      flex: 1;
    }
    .divider {
      border-top: 1px solid #e0e0e0;
      margin: 30px 0;
    }
    .footer {
      background: #f5f5f5;
      padding: 30px;
      text-align: center;
      color: #666;
      font-size: 13px;
    }
    .footer p {
      margin: 5px 0;
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
    .completion-id {
      background: #e8f5e9;
      border: 1px solid #4caf50;
      color: #2e7d32;
      padding: 15px;
      border-radius: 5px;
      margin: 25px 0;
      text-align: center;
    }
    .completion-id .id-number {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
      font-family: monospace;
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
      <div class="greeting">
        ${formData.companyName || ''}様<br><br>
        この度は、アンケート調査にご協力いただき、誠にありがとうございました。<br>
        以下の内容で回答を受け付けましたので、ご確認ください。
      </div>

      <div class="completion-id">
        <div>回答受付番号</div>
        <div class="id-number">${respondentId}</div>
      </div>

      <div class="section">
        <div class="section-title">📋 基本情報</div>
        <div class="field">
          <span class="label">会社名：</span>
          <span class="value">${formData.companyName || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">ご担当者名：</span>
          <span class="value">${formData.responderName || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">役職：</span>
          <span class="value">${formData.position || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">性別：</span>
          <span class="value">${formData.gender || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">メールアドレス：</span>
          <span class="value">${formData.email || '未入力'}</span>
        </div>
        <div class="field">
          <span class="label">所在地：</span>
          <span class="value">${formData.prefecture || '未入力'}</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">🚚 事業情報</div>
        <div class="field">
          <span class="label">事業内容：</span>
          <span class="value">${businessTypes}</span>
        </div>
        <div class="field">
          <span class="label">保有車両台数：</span>
          <span class="value">${formData.q3 || '0'} 台</span>
        </div>
      </div>

      <div class="section">
        <div class="section-title">👩‍💼 女性ドライバー雇用状況</div>
        <div class="field">
          <span class="label">雇用状況：</span>
          <span class="value">${employmentStatus[formData.q4] || '未回答'}</span>
        </div>
        <div class="field">
          <span class="label">雇用の必要性：</span>
          <span class="value">${formData.q5 || '未回答'}</span>
        </div>
        <div class="field">
          <span class="label">今後の予定：</span>
          <span class="value">${formData.q6 || '未回答'}</span>
        </div>
      </div>

      ${formData.q4 === 'currently_employed' ? `
      <div class="section">
        <div class="section-title">📊 女性ドライバーの実態</div>
        <p style="color: #666; font-size: 14px;">
          詳細な回答内容につきましては、調査終了後、集計結果とともにご報告させていただきます。
        </p>
      </div>
      ` : formData.q4 === 'previously_employed' || formData.q4 === 'never_employed' ? `
      <div class="section">
        <div class="section-title">📝 採用に関するご回答</div>
        <p style="color: #666; font-size: 14px;">
          詳細な回答内容につきましては、調査終了後、集計結果とともにご報告させていただきます。
        </p>
      </div>
      ` : ''}

      <div class="notice">
        <strong>📌 ご注意</strong><br>
        • このメールは自動送信されています。返信はできません。<br>
        • ご質問等がございましたら、下記連絡先までお問い合わせください。<br>
        • 回答内容の修正が必要な場合は、お手数ですが再度アンケートにご回答ください。
      </div>

      <div class="divider"></div>

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
性別: ${formData.gender || '未入力'}
メールアドレス: ${formData.email || '未入力'}
所在地: ${formData.prefecture || '未入力'}

■ 事業情報
事業内容: ${businessTypes}
保有車両台数: ${formData.q3 || '0'} 台

■ 女性ドライバー雇用状況
雇用状況: ${employmentStatus[formData.q4] || '未回答'}
雇用の必要性: ${formData.q5 || '未回答'}
今後の予定: ${formData.q6 || '未回答'}

${formData.q4 === 'currently_employed' ?
'■ 女性ドライバーの実態\n詳細な回答内容につきましては、調査終了後、集計結果とともにご報告させていただきます。\n' :
formData.q4 === 'previously_employed' || formData.q4 === 'never_employed' ?
'■ 採用に関するご回答\n詳細な回答内容につきましては、調査終了後、集計結果とともにご報告させていただきます。\n' : ''}

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

// サーバー起動
app.listen(PORT, () => {
  console.log(`Email server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});