// Test script for email sending functionality
import fetch from 'node-fetch';

const testData = {
  email: 'test@example.com',
  formData: {
    companyName: 'テスト運送株式会社',
    responderName: '山田太郎',
    position: '代表取締役',
    gender: '男性',
    email: 'test@example.com',
    prefecture: '東京都',
    q2: ['一般貨物自動車運送事業', '特定貨物自動車運送事業'],
    q3: '50',
    q4: 'currently_employed',
    q5: '人材不足の解消',
    q6: '今後も継続して採用していく予定'
  },
  respondentId: 'test-' + Date.now()
};

async function testEmailSending() {
  console.log('Testing email sending...');
  console.log('Target email:', testData.email);

  try {
    const response = await fetch('http://localhost:3002/api/send-survey-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Success:', result);
    } else {
      console.error('❌ Error:', result);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

testEmailSending();