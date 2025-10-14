/**
 * Supabase Admin Client
 * データベース管理・分析用のヘルパーファイル
 *
 * このファイルはAIがSupabaseデータベースを自動的に確認・管理するために使用します
 * 注意: 管理者権限が必要な操作のため、本番環境では適切なセキュリティ対策が必要です
 */

import { createClient } from '@supabase/supabase-js'

// 環境変数から設定を取得
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// 管理者用のサービスキー（環境変数に設定が必要）
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// 通常のクライアント（公開用）
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// 管理者用クライアント（サービスキーが設定されている場合のみ）
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

/**
 * データベーステーブル情報
 */
export const DATABASE_TABLES = {
  respondents: {
    name: 'respondents',
    description: 'アンケート回答者の基本情報',
    columns: {
      id: 'UUID PRIMARY KEY',
      created_at: 'TIMESTAMP - 作成日時',
      updated_at: 'TIMESTAMP - 更新日時',
      email: 'VARCHAR(255) - メールアドレス',
      status: 'VARCHAR(50) - ステータス (in_progress/completed/abandoned)',
      session_id: 'VARCHAR(255) - セッションID',
      completed_at: 'TIMESTAMP - 完了日時'
    }
  },
  block1_basic_info: {
    name: 'block1_basic_info',
    description: 'ブロック1: 基本情報（全員回答）',
    columns: {
      respondent_id: 'UUID - 回答者ID（外部キー）',
      q1_company_name: 'VARCHAR(255) - 会社名',
      q2_prefecture: 'VARCHAR(100) - 都道府県',
      q3_business_type: 'VARCHAR(100) - 事業形態',
      q4_employment_status: 'VARCHAR(50) - 女性ドライバー雇用状況'
    }
  },
  block2_current_employment: {
    name: 'block2_current_employment',
    description: 'ブロック2: 現在雇用している企業の詳細',
    columns: {
      respondent_id: 'UUID - 回答者ID（外部キー）',
      // 車種別・年代別女性ドライバー数
      q1_large_truck_20s: 'INTEGER - 大型トラック20代',
      q1_large_truck_30s: 'INTEGER - 大型トラック30代',
      // ... 他の年代・車種
      q2_cargo_characteristics: 'TEXT[] - 貨物特性',
      q3_improvements: 'TEXT[] - 労働条件改善',
      q8_feedback: 'TEXT - 女性ドライバーの声',
      q9_increase_intention: 'VARCHAR(50) - 増員意向'
    }
  },
  block3_no_employment: {
    name: 'block3_no_employment',
    description: 'ブロック3: 雇用していない企業の詳細',
    columns: {
      respondent_id: 'UUID - 回答者ID（外部キー）',
      q10_retirement_reasons: 'TEXT[] - 退職理由',
      q12_not_hiring_reasons: 'TEXT[] - 採用しない理由',
      q18_employment_policy: 'VARCHAR(100) - 今後の雇用方針',
      q19_government_requests: 'TEXT - 行政への要望',
      q20_association_requests: 'TEXT - 協会への要望'
    }
  },
  block4_other: {
    name: 'block4_other',
    description: 'ブロック4: その他の情報（全員回答）',
    columns: {
      respondent_id: 'UUID - 回答者ID（外部キー）',
      q1_vehicle_count: 'INTEGER - 保有車両台数',
      q2_total_drivers: 'INTEGER - ドライバー総数',
      q3_male_drivers: 'INTEGER - 男性ドライバー数',
      q6_respondent_name: 'VARCHAR(100) - 回答者名',
      q6_position: 'VARCHAR(100) - 役職',
      q6_email: 'VARCHAR(255) - メールアドレス'
    }
  }
}

/**
 * データベース分析用クエリ
 */
export const ANALYSIS_QUERIES = {
  // 基本統計
  getTotalResponses: async () => {
    const { data, error } = await supabaseClient
      .from('respondents')
      .select('*', { count: 'exact', head: true })

    return { count: data?.length || 0, error }
  },

  getCompletedResponses: async () => {
    const { data, error } = await supabaseClient
      .from('respondents')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    return { count: data?.length || 0, error }
  },

  // 雇用状況別統計
  getEmploymentStatusDistribution: async () => {
    const { data, error } = await supabaseClient
      .from('block1_basic_info')
      .select('q4_employment_status')

    if (error) return { data: null, error }

    const distribution = {
      currently_employed: 0,
      previously_employed: 0,
      never_employed: 0
    }

    data?.forEach(row => {
      if (row.q4_employment_status in distribution) {
        distribution[row.q4_employment_status]++
      }
    })

    return { data: distribution, error: null }
  },

  // 都道府県別分布
  getPrefectureDistribution: async () => {
    const { data, error } = await supabaseClient
      .from('block1_basic_info')
      .select('q2_prefecture')

    if (error) return { data: null, error }

    const distribution = {}
    data?.forEach(row => {
      if (row.q2_prefecture) {
        distribution[row.q2_prefecture] = (distribution[row.q2_prefecture] || 0) + 1
      }
    })

    return { data: distribution, error: null }
  },

  // 最新の回答を取得
  getRecentResponses: async (limit = 10) => {
    const { data, error } = await supabaseClient
      .from('respondents')
      .select(`
        *,
        block1_basic_info(*)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    return { data, error }
  },

  // 女性ドライバー総数の集計
  getTotalFemaleDrivers: async () => {
    const { data, error } = await supabaseClient
      .from('block2_current_employment')
      .select('*')

    if (error) return { data: null, error }

    let total = 0
    const vehicleTypes = ['large_truck', 'medium_truck', 'semi_medium_truck', 'small_truck', 'light_vehicle', 'trailer']
    const ageGroups = ['20s', '30s', '40s', '50s', '60s_plus']

    data?.forEach(row => {
      vehicleTypes.forEach(vehicle => {
        ageGroups.forEach(age => {
          const column = `q1_${vehicle}_${age}`
          total += row[column] || 0
        })
      })
    })

    return { data: { total }, error: null }
  }
}

/**
 * データベース診断機能
 */
export const DATABASE_DIAGNOSTICS = {
  // RLS（Row Level Security）の状態確認
  checkRLSStatus: async () => {
    if (!supabaseAdmin) {
      return { error: 'Admin client not available. Set VITE_SUPABASE_SERVICE_KEY environment variable.' }
    }

    try {
      const tables = Object.keys(DATABASE_TABLES)
      const results = {}

      for (const table of tables) {
        const { data, error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)

        results[table] = {
          accessible: !error,
          error: error?.message
        }
      }

      return { data: results, error: null }
    } catch (error) {
      return { data: null, error: error.message }
    }
  },

  // データの整合性チェック
  checkDataIntegrity: async () => {
    const issues = []

    // 孤立したレコードのチェック
    const { data: orphanedBlock1 } = await supabaseClient
      .from('block1_basic_info')
      .select('respondent_id')
      .not('respondent_id', 'in',
        `(SELECT id FROM respondents)`
      )

    if (orphanedBlock1?.length > 0) {
      issues.push({
        type: 'orphaned_records',
        table: 'block1_basic_info',
        count: orphanedBlock1.length
      })
    }

    // 不完全な回答のチェック
    const { data: incompleteResponses } = await supabaseClient
      .from('respondents')
      .select('id, status')
      .eq('status', 'completed')
      .not('id', 'in',
        `(SELECT respondent_id FROM block1_basic_info)`
      )

    if (incompleteResponses?.length > 0) {
      issues.push({
        type: 'incomplete_responses',
        count: incompleteResponses.length
      })
    }

    return { issues }
  },

  // テーブルサイズの確認
  getTableSizes: async () => {
    const sizes = {}

    for (const table of Object.keys(DATABASE_TABLES)) {
      const { count } = await supabaseClient
        .from(table)
        .select('*', { count: 'exact', head: true })

      sizes[table] = count || 0
    }

    return { data: sizes, error: null }
  }
}

/**
 * データエクスポート機能
 */
export const DATA_EXPORT = {
  // CSV形式でのエクスポート
  exportToCSV: async (tableName) => {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select('*')

    if (error) return { data: null, error }

    // CSVヘッダーの生成
    const headers = Object.keys(data[0] || {})
    const csvHeaders = headers.join(',')

    // CSVデータの生成
    const csvRows = data.map(row => {
      return headers.map(header => {
        const value = row[header]
        // 配列の場合は文字列化
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`
        }
        // 文字列の場合はエスケープ
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value ?? ''
      }).join(',')
    })

    const csv = [csvHeaders, ...csvRows].join('\n')
    return { data: csv, error: null }
  },

  // JSON形式でのエクスポート
  exportToJSON: async (tableName) => {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select('*')

    return { data: JSON.stringify(data, null, 2), error }
  },

  // 全データの統合エクスポート
  exportAllData: async () => {
    const allData = {}

    for (const table of Object.keys(DATABASE_TABLES)) {
      const { data, error } = await supabaseClient
        .from(table)
        .select('*')

      if (!error) {
        allData[table] = data
      }
    }

    return {
      data: JSON.stringify(allData, null, 2),
      error: null
    }
  }
}

/**
 * データインポート機能（開発・テスト用）
 */
export const DATA_IMPORT = {
  // テストデータの生成
  generateTestData: () => {
    const prefectures = ['東京都', '神奈川県', '千葉県', '埼玉県', '大阪府', '愛知県']
    const businessTypes = ['general_freight', 'specific_freight', 'cargo_light', 'freight_forwarding']
    const employmentStatuses = ['currently_employed', 'previously_employed', 'never_employed']

    return {
      companyName: `テスト運送会社${Math.floor(Math.random() * 1000)}`,
      prefecture: prefectures[Math.floor(Math.random() * prefectures.length)],
      q2: [businessTypes[Math.floor(Math.random() * businessTypes.length)]],
      q3: Math.floor(Math.random() * 100) + 10,
      q4: employmentStatuses[Math.floor(Math.random() * employmentStatuses.length)],
      responderName: `テスト太郎${Math.floor(Math.random() * 100)}`,
      position: '部長',
      email: `test${Date.now()}@example.com`
    }
  },

  // バッチインポート
  batchImport: async (data) => {
    if (!Array.isArray(data)) {
      return { error: 'Data must be an array' }
    }

    const results = []
    for (const record of data) {
      try {
        // saveSurveyResponse関数を使用してインポート
        const { saveSurveyResponse } = await import('../services/surveyService')
        const result = await saveSurveyResponse(record)
        results.push(result)
      } catch (error) {
        results.push({ error: error.message })
      }
    }

    return { data: results, error: null }
  }
}

// デフォルトエクスポート
export default {
  client: supabaseClient,
  admin: supabaseAdmin,
  tables: DATABASE_TABLES,
  analysis: ANALYSIS_QUERIES,
  diagnostics: DATABASE_DIAGNOSTICS,
  export: DATA_EXPORT,
  import: DATA_IMPORT
}