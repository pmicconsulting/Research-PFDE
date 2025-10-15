import React from 'react'

/**
 * プログレスバーコンポーネント
 * @param {Object} props - プロパティ
 * @param {number} props.currentBlock - 現在のブロック番号
 * @param {number} props.totalBlocks - 総ブロック数
 * @param {Object} props.blockCompletion - 各ブロックの完了状況
 * @param {boolean} props.isSaving - 保存中かどうか
 * @param {string} props.lastSaveTime - 最後の保存時刻
 * @param {Function} props.onManualSave - 手動保存関数
 */
const ProgressBar = ({ currentBlock, totalBlocks, blockCompletion = {}, isSaving = false, lastSaveTime = null, onManualSave }) => {
  // 全体の進捗率を計算
  const calculateTotalProgress = () => {
    const completedBlocks = Object.values(blockCompletion).filter(Boolean).length
    return Math.round((completedBlocks / totalBlocks) * 100)
  }

  const totalProgress = calculateTotalProgress()

  const blocks = [
    { id: 1, name: '基本情報', required: true },
    { id: 2, name: '女性ドライバーの実態', required: false },
    { id: 3, name: '採用について', required: false },
    { id: 4, name: 'その他', required: true }
  ]

  return (
    <div className="bg-white p-4">
      {/* 全体の進捗 */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">全体の進捗</span>
          <span className="text-sm font-bold text-blue-600">{totalProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* ブロック別進捗 */}
      <div className="flex justify-between items-center">
        {blocks.map((block, index) => (
          <div key={block.id} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              {/* ブロックアイコン */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                  transition-all duration-300
                  ${blockCompletion[`block${block.id}`]
                    ? 'bg-green-500 text-white'
                    : currentBlock === block.id
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-300 text-gray-600'
                  }
                `}
              >
                {blockCompletion[`block${block.id}`] ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  block.id
                )}
              </div>

              {/* ブロック名 */}
              <span className={`
                text-xs mt-2 text-center
                ${currentBlock === block.id ? 'font-bold text-blue-600' : 'text-gray-600'}
              `}>
                {block.name}
                {block.required && <span className="text-red-500 ml-0.5">*</span>}
              </span>
            </div>

            {/* 接続線 */}
            {index < blocks.length - 1 && (
              <div className="flex-shrink-0 w-12 h-0.5 mx-2">
                <div className={`
                  h-full transition-all duration-300
                  ${blockCompletion[`block${block.id}`]
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                  }
                `} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 自動保存インジケーター */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">
            {isSaving && (
              <span className="flex items-center">
                <svg className="animate-spin h-3 w-3 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                保存中...
              </span>
            )}
            {!isSaving && lastSaveTime && (
              <span className="flex items-center text-green-600">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                自動保存済み ({new Date(lastSaveTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })})
              </span>
            )}
          </span>
          <button
            onClick={onManualSave}
            className="text-blue-600 hover:text-blue-800 font-medium"
            disabled={isSaving}
          >
            手動保存
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProgressBar