import { supabase } from '../lib/supabase';

/**
 * 自動保存サービス
 * フォームデータを120秒ごとに下書きとして保存
 */
class AutoSaveService {
  constructor() {
    this.saveInterval = 120000; // 120秒
    this.intervalId = null;
    this.lastSaveTime = null;
    this.isSaving = false;
  }

  /**
   * セッションIDを取得または生成
   */
  getSessionId() {
    let sessionId = sessionStorage.getItem('survey_session_id');
    if (!sessionId) {
      sessionId = `session_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      sessionStorage.setItem('survey_session_id', sessionId);
    }
    return sessionId;
  }

  /**
   * 下書きデータを保存
   */
  async saveDraft(formData) {
    if (this.isSaving) {
      console.log('既に保存処理中です');
      return null;
    }

    this.isSaving = true;
    const sessionId = this.getSessionId();

    try {
      // 現在のタイムスタンプ
      const now = new Date().toISOString();

      // 既存のレコードを確認
      const { data: existing, error: fetchError } = await supabase
        .from('respondents')
        .select('id')
        .eq('session_id', sessionId)
        .eq('status', 'draft')
        .maybeSingle();

      let respondentId;

      if (existing) {
        // 既存レコードを更新
        const { data, error } = await supabase
          .from('respondents')
          .update({
            draft_data: formData,
            updated_at: now,
            last_auto_save: now,
            status: 'draft'
          })
          .eq('session_id', sessionId)
          .select('id')
          .single();

        if (error) throw error;
        respondentId = data.id;

        console.log(`下書き更新完了: ${now}`);
      } else {
        // 新規レコード作成
        const { data, error } = await supabase
          .from('respondents')
          .insert({
            session_id: sessionId,
            draft_data: formData,
            status: 'draft',
            last_auto_save: now,
            email: formData.email || null
          })
          .select('id')
          .single();

        if (error) throw error;
        respondentId = data.id;

        console.log(`下書き作成完了: ${now}`);
      }

      this.lastSaveTime = now;
      return { respondentId, savedAt: now };

    } catch (error) {
      console.error('自動保存エラー:', error);
      return null;
    } finally {
      this.isSaving = false;
    }
  }

  /**
   * 下書きデータを取得
   */
  async loadDraft() {
    const sessionId = this.getSessionId();

    try {
      const { data, error } = await supabase
        .from('respondents')
        .select('draft_data, last_auto_save')
        .eq('session_id', sessionId)
        .eq('status', 'draft')
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data?.draft_data) {
        console.log(`下書きデータ復元: 最終保存 ${data.last_auto_save}`);
        return {
          formData: data.draft_data,
          lastSaveTime: data.last_auto_save
        };
      }

      return null;
    } catch (error) {
      console.error('下書き読み込みエラー:', error);
      return null;
    }
  }

  /**
   * 最終送信（下書きを完了状態に変更）
   */
  async submitFinal(formData) {
    const sessionId = this.getSessionId();

    try {
      // 自動保存を停止
      this.stop();

      const now = new Date().toISOString();

      // 下書きデータを完了状態に更新
      const { data, error } = await supabase
        .from('respondents')
        .update({
          draft_data: null, // 下書きデータをクリア
          status: 'completed',
          completed_at: now,
          updated_at: now,
          submission_data: formData // 最終データを別カラムに保存
        })
        .eq('session_id', sessionId)
        .select('id')
        .single();

      if (error) {
        // レコードがない場合は新規作成
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('respondents')
            .insert({
              session_id: sessionId,
              status: 'completed',
              completed_at: now,
              submission_data: formData,
              email: formData.email || null
            })
            .select('id')
            .single();

          if (insertError) throw insertError;
          return newData.id;
        }
        throw error;
      }

      console.log('最終送信完了:', data.id);

      // セッションIDをクリア（重複送信防止）
      sessionStorage.removeItem('survey_session_id');

      return data.id;

    } catch (error) {
      console.error('最終送信エラー:', error);
      throw error;
    }
  }

  /**
   * 自動保存を開始
   */
  start(saveCallback) {
    if (this.intervalId) {
      console.log('自動保存は既に開始されています');
      return;
    }

    console.log('自動保存を開始します（120秒間隔）');

    // 最初の保存は30秒後
    setTimeout(() => {
      saveCallback();
    }, 30000);

    // その後は120秒間隔
    this.intervalId = setInterval(() => {
      saveCallback();
    }, this.saveInterval);
  }

  /**
   * 自動保存を停止
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('自動保存を停止しました');
    }
  }

  /**
   * 最後の保存時間を取得
   */
  getLastSaveTime() {
    return this.lastSaveTime;
  }

  /**
   * 保存状態をリセット
   */
  reset() {
    this.stop();
    this.lastSaveTime = null;
    this.isSaving = false;
  }
}

// シングルトンインスタンスをエクスポート
export const autoSaveService = new AutoSaveService();