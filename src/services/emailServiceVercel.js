/**
 * Vercel Functions対応版メールサービス
 * このファイルをemailService.jsと置き換えて使用
 */

/**
 * アンケート回答確認メールを送信する（Vercel Functions版）
 * @param {Object} formData - フォームデータ
 * @param {string} respondentId - 回答者ID
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export const sendConfirmationEmail = async (formData, respondentId) => {
  try {
    // メールアドレスがない場合はスキップ
    if (!formData.email) {
      // No email address provided, skipping email confirmation
      return {
        success: true,
        message: 'メールアドレスが入力されていないため、確認メールは送信されませんでした。'
      }
    }

    // Sending confirmation email

    // Vercel Functionsのエンドポイントを使用
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        formData: formData,
        respondentId: respondentId
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'メール送信に失敗しました')
    }

    // Email sent successfully
    return {
      success: true,
      message: '確認メールを送信しました。'
    }

  } catch (error) {
    // Failed to send confirmation email
    return {
      success: false,
      error: error.message || 'メール送信に失敗しました。'
    }
  }
}

/**
 * メールアドレスのバリデーション
 * @param {string} email - メールアドレス
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * 回答内容をフォーマット（メール用）
 * @param {Object} formData - フォームデータ
 * @returns {Object} フォーマット済みデータ
 */
export const formatSurveyResponse = (formData) => {
  const formatted = {
    基本情報: {
      会社名: formData.companyName || '未入力',
      担当者名: formData.responderName || '未入力',
      役職: formData.position || '未入力',
      性別: formData.gender || '未入力',
      メールアドレス: formData.email || '未入力',
      所在地: formData.prefecture || '未入力'
    },
    事業情報: {
      事業内容: formData.q2 ? formData.q2.join('、') : '未入力',
      保有車両台数: formData.q3 ? `${formData.q3}台` : '未入力'
    },
    雇用状況: {
      女性ドライバー雇用: getEmploymentStatusLabel(formData.q4),
      雇用の必要性: formData.q5 || '未入力',
      今後の予定: formData.q6 || '未入力'
    }
  }

  // 現在雇用している場合の追加情報
  if (formData.q4 === 'currently_employed') {
    formatted.女性ドライバーの実態 = {
      平均在職年数: formData.b2q2 || '未入力',
      主な品目: formData.b2q6 ? formData.b2q6.join('、') : '未入力',
      荷役作業: formData.b2q7 ? formData.b2q7.join('、') : '未入力'
    }
  }

  return formatted
}

/**
 * 雇用状況のラベルを取得
 * @param {string} status - 雇用状況コード
 * @returns {string} ラベル
 */
const getEmploymentStatusLabel = (status) => {
  const labels = {
    'currently_employed': '現在、女性ドライバーを雇用している',
    'previously_employed': '過去に女性ドライバーを雇用したことがあるが、現在は雇用していない',
    'never_employed': '過去から現在まで、一度も女性ドライバーを雇用したことがない'
  }
  return labels[status] || '未回答'
}