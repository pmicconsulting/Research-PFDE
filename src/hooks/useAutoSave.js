import { useEffect, useState, useCallback, useRef } from 'react';
import { autoSaveService } from '../services/autoSaveService';
import toast from 'react-hot-toast';

/**
 * 自動保存用カスタムフック
 * @param {Object} formData - 保存するフォームデータ
 * @param {boolean} isEnabled - 自動保存を有効にするかどうか
 * @returns {Object} 自動保存の状態と制御関数
 */
export function useAutoSave(formData, isEnabled = true) {
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('idle'); // idle, saving, saved, error
  const [draftLoaded, setDraftLoaded] = useState(false);
  const formDataRef = useRef(formData);

  // formDataの参照を更新
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // 下書きを保存する関数
  const saveDraft = useCallback(async () => {
    if (!isEnabled || !formDataRef.current) return;

    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const result = await autoSaveService.saveDraft(formDataRef.current);

      if (result) {
        setLastSaveTime(result.savedAt);
        setSaveStatus('saved');

        // 成功メッセージを表示（控えめに）
        toast.success('下書き保存しました', {
          duration: 2000,
          position: 'bottom-right',
          style: {
            background: '#10b981',
            color: 'white',
            fontSize: '14px'
          }
        });
      } else {
        setSaveStatus('error');
      }
    } catch (error) {
      console.error('自動保存エラー:', error);
      setSaveStatus('error');

      // エラーメッセージを表示
      toast.error('下書き保存に失敗しました', {
        duration: 3000,
        position: 'bottom-right'
      });
    } finally {
      setIsSaving(false);

      // 3秒後にステータスをリセット
      setTimeout(() => {
        setSaveStatus('idle');
      }, 3000);
    }
  }, [isEnabled]);

  // 下書きを読み込む関数
  const loadDraft = useCallback(async () => {
    try {
      const draft = await autoSaveService.loadDraft();

      if (draft) {
        setLastSaveTime(draft.lastSaveTime);
        setDraftLoaded(true);

        // 下書きが見つかったことを通知
        toast('前回の下書きを復元しました', {
          duration: 4000,
          position: 'top-center',
          icon: 'ℹ️',
          style: {
            background: '#3b82f6',
            color: 'white'
          }
        });

        return draft.formData;
      }

      return null;
    } catch (error) {
      console.error('下書き読み込みエラー:', error);
      return null;
    }
  }, []);

  // 手動保存関数
  const manualSave = useCallback(async () => {
    await saveDraft();
  }, [saveDraft]);

  // 自動保存の開始と停止
  useEffect(() => {
    if (!isEnabled) return;

    // 自動保存を開始
    autoSaveService.start(saveDraft);

    // クリーンアップ: コンポーネントのアンマウント時に自動保存を停止
    return () => {
      autoSaveService.stop();
    };
  }, [isEnabled, saveDraft]);

  // ページ離脱時の警告
  useEffect(() => {
    if (!isEnabled) return;

    const handleBeforeUnload = (e) => {
      if (formDataRef.current && Object.keys(formDataRef.current).length > 0) {
        const message = '入力内容が保存されていない可能性があります。ページを離れてもよろしいですか？';
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEnabled]);

  // 最終送信関数
  const submitFinal = useCallback(async (finalData) => {
    try {
      // 自動保存を停止
      autoSaveService.stop();

      // 最終データを送信
      const respondentId = await autoSaveService.submitFinal(finalData);

      // 成功時の処理
      setSaveStatus('completed');
      setLastSaveTime(new Date().toISOString());

      return respondentId;
    } catch (error) {
      console.error('最終送信エラー:', error);
      throw error;
    }
  }, []);

  // 状態をリセット
  const reset = useCallback(() => {
    autoSaveService.reset();
    setLastSaveTime(null);
    setIsSaving(false);
    setSaveStatus('idle');
    setDraftLoaded(false);
  }, []);

  return {
    lastSaveTime,
    isSaving,
    saveStatus,
    draftLoaded,
    manualSave,
    loadDraft,
    submitFinal,
    reset
  };
}