# SurveyPage.jsx への自動保存機能統合ガイド

## 実装手順

### 1. 必要なインポートを追加

```javascript
import { useAutoSave } from '../hooks/useAutoSave';
import { AutoSaveStatus } from '../components/common/AutoSaveStatus';
import { Toaster } from 'react-hot-toast';
```

### 2. コンポーネント内で自動保存フックを使用

```javascript
export function SurveyPage() {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 自動保存フックを使用
  const {
    lastSaveTime,
    isSaving,
    saveStatus,
    draftLoaded,
    manualSave,
    loadDraft,
    submitFinal,
    reset
  } = useAutoSave(formData, true); // true = 自動保存有効

  // コンポーネントマウント時に下書きを読み込む
  useEffect(() => {
    const loadSavedDraft = async () => {
      const draft = await loadDraft();
      if (draft) {
        setFormData(draft);
        // 必要に応じて他の状態も復元
      }
    };

    loadSavedDraft();
  }, [loadDraft]);

  // フォームデータ更新時の処理
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 最終送信処理
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // 自動保存サービス経由で最終送信
      const respondentId = await submitFinal(formData);

      // 既存の送信処理（ブロックデータ保存、メール送信など）
      await saveSurveyData(formData, respondentId);

      // 成功後の画面遷移
      navigate('/completion', {
        state: {
          respondentId,
          formData
        }
      });

    } catch (error) {
      console.error('送信エラー:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Toast通知用 */}
      <Toaster position="top-right" />

      {/* 自動保存ステータス表示 */}
      <AutoSaveStatus
        lastSaveTime={lastSaveTime}
        saveStatus={saveStatus}
        isSaving={isSaving}
      />

      {/* 下書きが復元された場合の通知バナー */}
      {draftLoaded && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                前回の下書きを復元しました。続きから入力できます。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* アンケートフォーム（既存のコード） */}
      <form>
        {/* フォーム要素 */}
      </form>

      {/* 手動保存ボタン（オプション） */}
      <button
        type="button"
        onClick={manualSave}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        今すぐ保存
      </button>

      {/* 送信ボタン */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="..."
      >
        {isSubmitting ? '送信中...' : 'アンケートを送信'}
      </button>
    </div>
  );
}
```

## 実装のポイント

### 1. セッション管理
- ブラウザのsessionStorageを使用してセッションIDを管理
- ページリロードしても同じセッションを維持

### 2. 下書き保存タイミング
- 初回: コンポーネントマウントから30秒後
- 以降: 120秒（2分）間隔で自動保存
- 最終送信時: 下書きを削除して完了状態に更新

### 3. データの流れ
```
入力 → formData更新 → 120秒後 → 自動保存（draft） → 最終送信 → 完了状態
```

### 4. エラーハンドリング
- 保存失敗時はトースト通知
- ネットワークエラー時も継続して入力可能
- 次回の自動保存で再試行

### 5. パフォーマンス最適化
- formDataの参照をuseRefで管理
- 不要な再レンダリングを防止
- デバウンス処理は不要（120秒間隔のため）

## データベース側の対応

Supabaseで以下のSQLを実行:

```sql
-- database/add-autosave-columns.sql を実行
```

## テスト方法

1. **自動保存の確認**
   - フォーム入力後、120秒待つ
   - 右下に「保存済み」メッセージが表示される

2. **下書き復元の確認**
   - フォーム入力後、自動保存を待つ
   - ページをリロード
   - 下書きが自動復元される

3. **最終送信の確認**
   - 送信ボタンをクリック
   - 下書きが削除され、完了状態になる

## 注意事項

1. **ブラウザ互換性**
   - sessionStorageをサポートするブラウザが必要
   - IE11以上、モダンブラウザは全て対応

2. **プライバシー**
   - 下書きデータはサーバーに保存される
   - 7日後に自動削除（オプション）

3. **同時編集**
   - 同じセッションIDで複数タブを開くと競合する可能性
   - タブごとに異なるセッションIDを使用することを推奨