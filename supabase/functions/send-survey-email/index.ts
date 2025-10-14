import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  respondentId: string
  formData: any
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, respondentId, formData } = await req.json() as EmailRequest

    // SendGrid API設定
    const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')
    const SENDGRID_FROM_EMAIL = Deno.env.get('SENDGRID_FROM_EMAIL') || 'noreply@your-domain.com'
    const SENDGRID_FROM_NAME = Deno.env.get('SENDGRID_FROM_NAME') || '全日本トラック協会 女性部会'

    if (!SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured')
    }

    // メール本文を作成
    const emailHtml = createEmailHtml(formData)
    const emailText = createEmailText(formData)

    // SendGrid APIを呼び出し
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: to }],
          subject: '【全日本トラック協会】アンケート回答確認'
        }],
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: SENDGRID_FROM_NAME
        },
        content: [
          {
            type: 'text/plain',
            value: emailText
          },
          {
            type: 'text/html',
            value: emailHtml
          }
        ]
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`SendGrid API error: ${error}`)
    }

    return new Response(
      JSON.stringify({ success: true, message: '確認メールを送信しました' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

function createEmailHtml(formData: any): string {
  const businessTypes = formData.q2 ? formData.q2.join('、') : '未回答'
  const employmentStatus = {
    'currently_employed': '現在、女性ドライバーを雇用している',
    'previously_employed': '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない',
    'never_employed': '過去から現在まで、一度も女性ドライバーを雇用したことがない'
  }

  return `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Hiragino Sans', 'Meiryo', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .content {
      background: #f8f9fa;
      padding: 30px;
      border: 1px solid #dee2e6;
      border-radius: 0 0 10px 10px;
    }
    .section {
      background: white;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .section-title {
      color: #4a5568;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }
    .field {
      margin: 10px 0;
      display: flex;
      align-items: flex-start;
    }
    .label {
      font-weight: bold;
      color: #2d3748;
      min-width: 150px;
      margin-right: 15px;
    }
    .value {
      color: #4a5568;
      flex: 1;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      color: #6c757d;
      font-size: 14px;
    }
    .notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      color: #856404;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>トラック運送業界における<br>女性雇用促進に関する実態調査</h1>
    <p>アンケート回答確認</p>
  </div>

  <div class="content">
    <p>この度はアンケートにご回答いただき、誠にありがとうございました。<br>
    以下の内容で回答を受け付けました。</p>

    <div class="section">
      <div class="section-title">📋 基本情報</div>
      <div class="field">
        <span class="label">会社名:</span>
        <span class="value">${formData.companyName || '未入力'}</span>
      </div>
      <div class="field">
        <span class="label">担当者名:</span>
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
      <div class="section-title">🚚 事業情報</div>
      <div class="field">
        <span class="label">事業内容:</span>
        <span class="value">${businessTypes}</span>
      </div>
      <div class="field">
        <span class="label">保有車両台数:</span>
        <span class="value">${formData.q3 || '0'} 台</span>
      </div>
    </div>

    <div class="section">
      <div class="section-title">👩‍💼 女性ドライバー雇用状況</div>
      <div class="field">
        <span class="label">雇用状況:</span>
        <span class="value">${employmentStatus[formData.q4] || '未回答'}</span>
      </div>
      <div class="field">
        <span class="label">雇用の必要性:</span>
        <span class="value">${formData.q5 || '未回答'}</span>
      </div>
      <div class="field">
        <span class="label">今後の予定:</span>
        <span class="value">${formData.q6 || '未回答'}</span>
      </div>
    </div>

    ${formData.q4 === 'currently_employed' ? `
    <div class="section">
      <div class="section-title">📊 女性ドライバーの実態</div>
      <p>詳細な回答内容は、集計結果とともに後日ご報告させていただきます。</p>
    </div>
    ` : ''}

    <div class="notice">
      <strong>📌 ご注意</strong><br>
      このメールは自動送信されています。<br>
      ご質問等がございましたら、別途お問い合わせください。
    </div>

    <div class="footer">
      <p>公益社団法人全日本トラック協会 女性部会<br>
      〒160-0004 東京都新宿区四谷三丁目2番5号<br>
      TEL: 03-3354-1009（代表）</p>
    </div>
  </div>
</body>
</html>
  `
}

function createEmailText(formData: any): string {
  const businessTypes = formData.q2 ? formData.q2.join('、') : '未回答'
  const employmentStatus = {
    'currently_employed': '現在、女性ドライバーを雇用している',
    'previously_employed': '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない',
    'never_employed': '過去から現在まで、一度も女性ドライバーを雇用したことがない'
  }

  return `
トラック運送業界における女性雇用促進に関する実態調査
アンケート回答確認

この度はアンケートにご回答いただき、誠にありがとうございました。
以下の内容で回答を受け付けました。

━━━━━━━━━━━━━━━━━━━━━━
■ 基本情報
━━━━━━━━━━━━━━━━━━━━━━
会社名: ${formData.companyName || '未入力'}
担当者名: ${formData.responderName || '未入力'}
役職: ${formData.position || '未入力'}
メールアドレス: ${formData.email || '未入力'}
所在地: ${formData.prefecture || '未入力'}

━━━━━━━━━━━━━━━━━━━━━━
■ 事業情報
━━━━━━━━━━━━━━━━━━━━━━
事業内容: ${businessTypes}
保有車両台数: ${formData.q3 || '0'} 台

━━━━━━━━━━━━━━━━━━━━━━
■ 女性ドライバー雇用状況
━━━━━━━━━━━━━━━━━━━━━━
雇用状況: ${employmentStatus[formData.q4] || '未回答'}
雇用の必要性: ${formData.q5 || '未回答'}
今後の予定: ${formData.q6 || '未回答'}

${formData.q4 === 'currently_employed' ?
'━━━━━━━━━━━━━━━━━━━━━━\n■ 女性ドライバーの実態\n━━━━━━━━━━━━━━━━━━━━━━\n詳細な回答内容は、集計結果とともに後日ご報告させていただきます。\n' : ''}

━━━━━━━━━━━━━━━━━━━━━━
※このメールは自動送信されています。
ご質問等がございましたら、別途お問い合わせください。

公益社団法人全日本トラック協会 女性部会
〒160-0004 東京都新宿区四谷三丁目2番5号
TEL: 03-3354-1009（代表）
━━━━━━━━━━━━━━━━━━━━━━
  `
}