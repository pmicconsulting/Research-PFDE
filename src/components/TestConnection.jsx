import { useState } from 'react'
import { supabase } from '../lib/supabase'

const TestConnection = () => {
  const [status, setStatus] = useState('未接続')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setStatus('接続中...')

    try {
      // データベース接続テスト - 簡単なクエリを実行
      const { data, error } = await supabase
        .from('respondents')
        .select('count')
        .limit(1)

      if (error) {
        console.error('Connection error:', error)
        setStatus(`エラー: ${error.message}`)
      } else {
        console.log('Connection successful:', data)
        setStatus('✅ 接続成功！Supabaseと正常に通信できています。')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      setStatus(`予期しないエラー: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-3">Supabase接続テスト</h3>
      <div className="flex items-center gap-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'テスト中...' : '接続テスト'}
        </button>
        <span className="text-sm text-gray-700">{status}</span>
      </div>
    </div>
  )
}

export default TestConnection