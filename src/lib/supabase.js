import { createClient } from '@supabase/supabase-js'

// 環境変数から Supabase の設定を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// エラーチェック
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabaseの環境変数が設定されていません。.env.localファイルを確認してください。'
  )
}

// Debug logs removed for production

// Supabaseクライアントの作成
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// セッションIDの生成（匿名ユーザー用）
export const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// セッションIDの取得または生成
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('survey_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('survey_session_id', sessionId)
  }
  return sessionId
}