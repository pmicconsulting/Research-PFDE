import { supabase, getSessionId } from '../lib/supabase'
import { getDomainInfo } from '../utils/domainIdentifier'

/**
 * アンケート回答を保存する
 * @param {Object} formData - フォームデータ
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const saveSurveyResponse = async (formData) => {
  try {
    const sessionId = getSessionId()

    // ブロック1のデータ整形
    const block1Data = {
      q1_company_name: formData.companyName || null,  // 問の会社名
      q2_prefecture: formData.prefecture || null,     // 問の都道府県
      q2_city: formData.city || null,                // 問の市区町村（現在はないので null）
      q3_business_type: null,  // 問の事業形態は checkbox なので、別途処理が必要
      q3_other_text: formData.q2_other || null,      // 問のその他
      q4_employment_status: formData.q4 || null      // 問の雇用状況
    }

    // 問（事業形態）の処理 - チェックボックスから最初の選択を取得
    if (formData.q2 && Array.isArray(formData.q2) && formData.q2.length > 0) {
      // データベースの制約に合わせて値を変換
      const businessTypeMap = {
        '【特積】貨物自動車運送事業': 'general_freight',
        '【特定】貨物自動車運送事業': 'specific_freight',
        '貨物軽自動車運送事業': 'cargo_light',
        '利用運送事業': 'freight_forwarding'
      }
      block1Data.q3_business_type = businessTypeMap[formData.q2[0]] || 'other'
    }

    // 配列型フィールドの安全な処理関数
    const ensureArray = (value) => {
      if (!value) return []
      if (Array.isArray(value)) return value
      return [value]  // 文字列の場合は配列に変換
    }

    // ブロック2のデータ整形（現在雇用している場合）
    let block2Data = null
    if (formData.q4 === 'currently_employed') {
      block2Data = {
        // 問1: 従業員数（2020年と2025年）
        male_drivers_2025: parseInt(formData.b2q1?.maleDrivers?.[0]) || 0,
        female_drivers_2025: parseInt(formData.b2q1?.femaleDrivers?.[0]) || 0,
        male_employees_2025: parseInt(formData.b2q1?.maleEmployees?.[0]) || 0,
        female_employees_2025: parseInt(formData.b2q1?.femaleEmployees?.[0]) || 0,
        male_drivers_2020: parseInt(formData.b2q1?.maleDrivers?.[1]) || 0,
        female_drivers_2020: parseInt(formData.b2q1?.femaleDrivers?.[1]) || 0,
        male_employees_2020: parseInt(formData.b2q1?.maleEmployees?.[1]) || 0,
        female_employees_2020: parseInt(formData.b2q1?.femaleEmployees?.[1]) || 0,

        // 問2: 平均在職年数
        avg_tenure_years: formData.b2q2 || null,

        // 問3: 運行距離別人数
        long_distance_count: parseInt(formData.b2q3?.longDistance) || 0,
        medium_distance_count: parseInt(formData.b2q3?.mediumDistance) || 0,
        short_distance_count: parseInt(formData.b2q3?.shortDistance) || 0,
        city_delivery_count: parseInt(formData.b2q3?.cityDelivery) || 0,

        // 問4: 車両別人数
        kei_cargo_count: parseInt(formData.b2q4?.keiCargo) || 0,
        small_truck_count: parseInt(formData.b2q4?.smallTruck) || 0,
        medium_truck_count: parseInt(formData.b2q4?.mediumTruck) || 0,
        large_truck_count: parseInt(formData.b2q4?.largeTruck) || 0,
        trailer_count: parseInt(formData.b2q4?.trailer) || 0,
        other_vehicle_count: parseInt(formData.b2q4?.otherVehicle) || 0,
        other_vehicle_text: formData.b2q4?.otherVehicle_text || null,

        // 問5: 車両形状別人数
        van_truck_count: parseInt(formData.b2q5?.vanTruck) || 0,
        flat_body_count: parseInt(formData.b2q5?.flatBody) || 0,
        dump_truck_count: parseInt(formData.b2q5?.dumpTruck) || 0,
        unic_count: parseInt(formData.b2q5?.unic) || 0,
        tank_truck_count: parseInt(formData.b2q5?.tankTruck) || 0,
        garbage_truck_count: parseInt(formData.b2q5?.garbageTruck) || 0,
        semi_trailer_count: parseInt(formData.b2q5?.semiTrailer) || 0,
        other_shape_count: parseInt(formData.b2q5?.otherShape) || 0,
        other_shape_text: formData.b2q5?.otherShape_text || null,

        // 問6: 取扱品目
        cargo_items: ensureArray(formData.b2q6),
        cargo_items_other: formData.b2q6_other || null,

        // 問7: 荷役作業
        loading_methods: ensureArray(formData.b2q7),
        loading_methods_other: formData.b2q7_other || null,

        // 問8: 免許取得対応（旧b2q10）
        license_support: ensureArray(formData.b2q8),
        license_support_other: formData.b2q8_other || null,

        // 問9: その他の免許（旧b2q11）
        other_licenses: ensureArray(formData.b2q9),
        other_licenses_other: formData.b2q9_other || null
      }
    }

    // ブロック3のデータ整形（雇用していない場合）
    let block3Data = null
    if (formData.q4 === 'previously_employed' || formData.q4 === 'never_employed') {
      block3Data = {
        q10_retirement_reasons: ensureArray(formData.b3q10),
        q10_retirement_other: formData.b3q10_other || null,
        q11_large_truck: formData.b3q11?.large_truck || null,
        q11_medium_truck: formData.b3q11?.medium_truck || null,
        q11_semi_medium_truck: formData.b3q11?.semi_medium_truck || null,
        q11_small_truck: formData.b3q11?.small_truck || null,
        q11_light_vehicle: formData.b3q11?.light_vehicle || null,
        q11_trailer: formData.b3q11?.trailer || null,
        q12_not_hiring_reasons: ensureArray(formData.b3q12),
        q12_not_hiring_other: formData.b3q12_other || null,
        q13_considerations: ensureArray(formData.b3q13),
        q13_considerations_other: formData.b3q13_other || null,
        q14_education_methods: ensureArray(formData.b3q14),
        q14_education_other: formData.b3q14_other || null,
        q15_concerns: ensureArray(formData.b3q15),
        q15_concerns_other: formData.b3q15_other || null,
        q16_promotion_initiatives: ensureArray(formData.b3q16),
        q16_promotion_other: formData.b3q16_other || null,
        q17_facility_needs: ensureArray(formData.b3q17),
        q17_facility_other: formData.b3q17_other || null,
        q18_employment_policy: formData.b3q18 || null,
        q19_government_requests: formData.b3q19 || null,
        q20_association_requests: formData.b3q20 || null
      }
    }

    // ブロック4のデータ整形（全員回答）
    // surveyData.jsのblock4の質問はb4q1〜b4q6として保存されている
    // データベースのblock4_otherテーブルには別のフィールドがあるため、適切にマッピング
    const block4Data = {
      q1_vehicle_count: parseInt(formData.q3) || null,  // block1の問: 車両台数
      q2_total_drivers: null,  // 現在のフォームには全ドライバー数の質問がない
      q3_male_drivers: null,   // 現在のフォームには男性ドライバー数の質問がない
      q4_female_office_workers: null,  // 現在のフォームには女性事務職数の質問がない
      q5_female_warehouse_workers: null,  // 現在のフォームには女性倉庫作業員数の質問がない
      q6_respondent_name: formData.responderName || null,  // block1問: 担当者名
      q6_department: null,  // 現在のフォームには部署の入力欄がない
      q6_position: formData.position || null,  // block1問: 役職
      q6_phone: null,  // 現在のフォームには電話番号の入力欄がない
      q6_email: formData.email || null  // block1問: メールアドレス
    }

    // ドメイン情報を取得
    const domainInfo = getDomainInfo();

    // トランザクション開始
    // 1. 回答者レコードを作成（ドメイン情報を含む）
    const insertData = {
      session_id: sessionId,
      status: 'completed',
      completed_at: new Date().toISOString(),
      source_domain: domainInfo.source_domain,
      source_url: domainInfo.source_url,
      source_identifier: domainInfo.source_identifier,
      user_agent: domainInfo.user_agent
    }

    const { data: respondent, error: respondentError } = await supabase
      .from('respondents')
      .insert([insertData])
      .select()
      .single()

    if (respondentError) {
      console.error('Respondent insert error details:', {
        message: respondentError.message,
        details: respondentError.details,
        hint: respondentError.hint,
        code: respondentError.code
      })
      throw respondentError
    }

    // 2. ブロック1を保存
    const { error: block1Error } = await supabase
      .from('block1_basic_info')
      .insert([{ ...block1Data, respondent_id: respondent.id }])

    if (block1Error) throw block1Error

    // 3. ブロック2を保存（該当する場合）
    if (block2Data) {
      const { error: block2Error } = await supabase
        .from('block2_current_employment')
        .insert([{ ...block2Data, respondent_id: respondent.id }])

      if (block2Error) throw block2Error
    }

    // 4. ブロック3を保存（該当する場合）
    if (block3Data) {
      const { error: block3Error } = await supabase
        .from('block3_no_employment')
        .insert([{ ...block3Data, respondent_id: respondent.id }])

      if (block3Error) throw block3Error
    }

    // 5. ブロック4を保存
    const { error: block4Error } = await supabase
      .from('block4_other')
      .insert([{ ...block4Data, respondent_id: respondent.id }])

    if (block4Error) throw block4Error

    return {
      success: true,
      data: { respondent_id: respondent.id, session_id: sessionId }
    }

  } catch (error) {
    console.error('Survey submission error:', error)
    return {
      success: false,
      error: error.message || 'アンケートの送信に失敗しました'
    }
  }
}

/**
 * セッションの回答データを取得する
 * @returns {Promise<{success: boolean, data?: any, error?: any}>}
 */
export const getSessionResponse = async () => {
  try {
    const sessionId = getSessionId()

    const { data, error } = await supabase
      .from('respondents')
      .select(`
        *,
        block1_basic_info(*),
        block2_current_employment(*),
        block3_no_employment(*),
        block4_other(*)
      `)
      .eq('session_id', sessionId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw error
    }

    return {
      success: true,
      data: data || null
    }

  } catch (error) {
    console.error('Error fetching session response:', error)
    return {
      success: false,
      error: error.message || 'データの取得に失敗しました'
    }
  }
}