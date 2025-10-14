/**
 * データベーステストユーティリティ
 * Supabaseデータベースの動作確認と診断を行うためのツール
 */

import supabaseAdmin from '../lib/supabaseAdmin'

/**
 * データベース接続テスト
 */
export const testConnection = async () => {
  console.log('=== データベース接続テスト開始 ===')

  try {
    // 基本的な接続テスト
    const { data, error } = await supabaseAdmin.client
      .from('respondents')
      .select('id')
      .limit(1)

    if (error) {
      console.error('❌ 接続エラー:', error.message)
      return { success: false, error: error.message }
    }

    console.log('✅ データベース接続成功')
    return { success: true }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * テーブル存在確認
 */
export const checkTablesExist = async () => {
  console.log('=== テーブル存在確認 ===')

  const tables = Object.keys(supabaseAdmin.tables)
  const results = {}

  for (const table of tables) {
    try {
      const { error } = await supabaseAdmin.client
        .from(table)
        .select('id')
        .limit(1)

      results[table] = !error
      console.log(`${!error ? '✅' : '❌'} ${table}: ${!error ? '存在' : 'エラー'}`)
    } catch (error) {
      results[table] = false
      console.log(`❌ ${table}: エラー`)
    }
  }

  return results
}

/**
 * データ挿入テスト
 */
export const testDataInsertion = async () => {
  console.log('=== データ挿入テスト ===')

  try {
    // テストデータの生成
    const testData = supabaseAdmin.import.generateTestData()
    console.log('📝 テストデータ:', testData)

    // surveyServiceを使用してデータ保存
    const { saveSurveyResponse } = await import('../services/surveyService')
    const result = await saveSurveyResponse(testData)

    if (result.success) {
      console.log('✅ データ挿入成功')
      console.log('   回答ID:', result.data.respondent_id)
      console.log('   セッションID:', result.data.session_id)

      // 挿入したデータを確認
      const { data: savedData } = await supabaseAdmin.client
        .from('respondents')
        .select('*')
        .eq('id', result.data.respondent_id)
        .single()

      console.log('📊 保存されたデータ:', savedData)

      return {
        success: true,
        respondentId: result.data.respondent_id,
        data: savedData
      }
    } else {
      console.error('❌ データ挿入失敗:', result.error)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * データ取得テスト
 */
export const testDataRetrieval = async () => {
  console.log('=== データ取得テスト ===')

  try {
    // 最新10件の回答を取得
    const { data, error } = await supabaseAdmin.analysis.getRecentResponses(10)

    if (error) {
      console.error('❌ データ取得エラー:', error)
      return { success: false, error }
    }

    console.log(`✅ ${data?.length || 0}件のデータを取得`)

    // 各レコードの概要を表示
    data?.forEach((record, index) => {
      console.log(`  ${index + 1}. ID: ${record.id}`)
      console.log(`     ステータス: ${record.status}`)
      console.log(`     会社名: ${record.block1_basic_info?.[0]?.q1_company_name || '未入力'}`)
      console.log(`     作成日: ${new Date(record.created_at).toLocaleString('ja-JP')}`)
    })

    return { success: true, data }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 統計情報の取得テスト
 */
export const testStatistics = async () => {
  console.log('=== 統計情報取得テスト ===')

  try {
    // 総回答数
    const totalResponses = await supabaseAdmin.analysis.getTotalResponses()
    console.log(`📊 総回答数: ${totalResponses.count}`)

    // 完了回答数
    const completedResponses = await supabaseAdmin.analysis.getCompletedResponses()
    console.log(`📊 完了回答数: ${completedResponses.count}`)

    // 雇用状況分布
    const employmentDist = await supabaseAdmin.analysis.getEmploymentStatusDistribution()
    if (employmentDist.data) {
      console.log('📊 雇用状況分布:')
      console.log(`   現在雇用: ${employmentDist.data.currently_employed}`)
      console.log(`   過去雇用: ${employmentDist.data.previously_employed}`)
      console.log(`   未雇用: ${employmentDist.data.never_employed}`)
    }

    // 都道府県分布
    const prefectureDist = await supabaseAdmin.analysis.getPrefectureDistribution()
    if (prefectureDist.data) {
      console.log('📊 都道府県分布:')
      const topPrefectures = Object.entries(prefectureDist.data)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)

      topPrefectures.forEach(([prefecture, count]) => {
        console.log(`   ${prefecture}: ${count}件`)
      })
    }

    // 女性ドライバー総数
    const femaleDrivers = await supabaseAdmin.analysis.getTotalFemaleDrivers()
    if (femaleDrivers.data) {
      console.log(`📊 女性ドライバー総数: ${femaleDrivers.data.total}人`)
    }

    return {
      success: true,
      statistics: {
        total: totalResponses.count,
        completed: completedResponses.count,
        employmentDistribution: employmentDist.data,
        prefectureDistribution: prefectureDist.data,
        femaleDriversTotal: femaleDrivers.data?.total
      }
    }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * データ整合性チェック
 */
export const testDataIntegrity = async () => {
  console.log('=== データ整合性チェック ===')

  try {
    const { issues } = await supabaseAdmin.diagnostics.checkDataIntegrity()

    if (issues.length === 0) {
      console.log('✅ データ整合性に問題なし')
    } else {
      console.log('⚠️ データ整合性の問題を検出:')
      issues.forEach(issue => {
        console.log(`   - ${issue.type}: ${issue.count}件`)
        if (issue.table) {
          console.log(`     テーブル: ${issue.table}`)
        }
      })
    }

    return { success: issues.length === 0, issues }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * テーブルサイズ確認
 */
export const checkTableSizes = async () => {
  console.log('=== テーブルサイズ確認 ===')

  try {
    const { data: sizes } = await supabaseAdmin.diagnostics.getTableSizes()

    console.log('📊 テーブル別レコード数:')
    Object.entries(sizes).forEach(([table, count]) => {
      console.log(`   ${table}: ${count}件`)
    })

    const totalRecords = Object.values(sizes).reduce((sum, count) => sum + count, 0)
    console.log(`📊 総レコード数: ${totalRecords}件`)

    return { success: true, sizes, total: totalRecords }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 全テストの実行
 */
export const runAllTests = async () => {
  console.log('=====================================')
  console.log('  データベーステスト実行')
  console.log('=====================================\n')

  const results = {
    connection: null,
    tables: null,
    insertion: null,
    retrieval: null,
    statistics: null,
    integrity: null,
    sizes: null,
    timestamp: new Date().toISOString()
  }

  // 接続テスト
  results.connection = await testConnection()
  console.log('')

  // テーブル存在確認
  results.tables = await checkTablesExist()
  console.log('')

  // データ取得テスト
  results.retrieval = await testDataRetrieval()
  console.log('')

  // 統計情報テスト
  results.statistics = await testStatistics()
  console.log('')

  // データ整合性チェック
  results.integrity = await testDataIntegrity()
  console.log('')

  // テーブルサイズ確認
  results.sizes = await checkTableSizes()
  console.log('')

  // 結果サマリー
  console.log('=====================================')
  console.log('  テスト結果サマリー')
  console.log('=====================================')

  const allPassed = Object.values(results)
    .filter(r => r && typeof r === 'object' && 'success' in r)
    .every(r => r.success)

  if (allPassed) {
    console.log('✅ すべてのテストが成功しました！')
  } else {
    console.log('⚠️ 一部のテストで問題が検出されました')
  }

  return results
}

/**
 * データエクスポートテスト
 */
export const testDataExport = async (format = 'json') => {
  console.log(`=== データエクスポートテスト (${format.toUpperCase()}) ===`)

  try {
    let exportResult

    if (format === 'csv') {
      exportResult = await supabaseAdmin.export.exportToCSV('respondents')
    } else {
      exportResult = await supabaseAdmin.export.exportToJSON('respondents')
    }

    if (exportResult.error) {
      console.error('❌ エクスポートエラー:', exportResult.error)
      return { success: false, error: exportResult.error }
    }

    console.log('✅ エクスポート成功')
    console.log(`   データサイズ: ${exportResult.data.length} バイト`)

    // サンプル表示（最初の500文字）
    console.log('📄 データサンプル:')
    console.log(exportResult.data.substring(0, 500) + '...')

    return {
      success: true,
      size: exportResult.data.length,
      data: exportResult.data
    }
  } catch (error) {
    console.error('❌ 予期しないエラー:', error)
    return { success: false, error: error.message }
  }
}

// コンソールから直接実行できるようにグローバルに登録
if (typeof window !== 'undefined') {
  window.dbTest = {
    connection: testConnection,
    tables: checkTablesExist,
    insert: testDataInsertion,
    retrieve: testDataRetrieval,
    statistics: testStatistics,
    integrity: testDataIntegrity,
    sizes: checkTableSizes,
    export: testDataExport,
    runAll: runAllTests
  }

  console.log('💡 データベーステストツールが利用可能です')
  console.log('   使用方法: window.dbTest.runAll() で全テストを実行')
  console.log('   個別テスト: window.dbTest.connection() など')
}

export default {
  testConnection,
  checkTablesExist,
  testDataInsertion,
  testDataRetrieval,
  testStatistics,
  testDataIntegrity,
  checkTableSizes,
  testDataExport,
  runAllTests
}