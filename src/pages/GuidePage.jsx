import React from 'react';
import { Link } from 'react-router-dom';

const GuidePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-purple-800">ワークショップガイド</h1>
          <div className="flex gap-3">
            <Link to="/" className="text-purple-600 hover:text-purple-800 text-sm">
              ワークショップへ戻る
            </Link>
            <Link to="/ai-services" className="text-purple-600 hover:text-purple-800 text-sm">
              生成AIサービス一覧
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* タイトル */}
          <div className="text-center mb-8 pb-6 border-b-4 border-purple-600">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">生成AI利用体験ワークショップ</h1>
            <p className="text-gray-600 text-lg">～ 運送業の実務に活かすAI活用ガイド ～</p>
          </div>

          {/* 1. 目的 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              1. ワークショップの目的
            </h2>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <p className="mb-2">
                本ワークショップでは、<strong>生成AI（Claude）</strong>を活用して、運送業における日常業務の効率化を体験していただきます。
              </p>
              <p>
                AIは<span className="bg-yellow-200 px-1 rounded">運送業界の専門知識</span>を学習しており、法令・契約・安全管理など実務に即した回答を提供します。
              </p>
            </div>
          </section>

          {/* 2. 機能 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              2. 利用できる機能
            </h2>
            <p className="mb-3 text-gray-600">6つのカテゴリ、全24項目のメニューから選択できます。</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-purple-300 px-4 py-2 text-left text-purple-800">カテゴリ</th>
                    <th className="border border-purple-300 px-4 py-2 text-left text-purple-800">利用できる内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">クレーム対応</td>
                    <td className="border border-gray-200 px-4 py-2">荷物破損・遅延・誤配送への謝罪メール作成</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">契約書の作成</td>
                    <td className="border border-gray-200 px-4 py-2">運送契約書・傭車契約書・業務委託契約書の作成支援</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">運賃交渉</td>
                    <td className="border border-gray-200 px-4 py-2">値上げ交渉資料・燃料サーチャージ計算・新規顧客見積</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">安全教育プログラム</td>
                    <td className="border border-gray-200 px-4 py-2">新人教育カリキュラム・KYT活動・事故防止対策</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">年間研修プログラム</td>
                    <td className="border border-gray-200 px-4 py-2">月別研修計画・管理職研修・法令研修プログラム</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">経営相談</td>
                    <td className="border border-gray-200 px-4 py-2">2024年問題対策・人材確保戦略・収益改善・DX推進</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 3. 使い方 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              3. 使い方（5ステップ）
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              {[
                '左側のメニューからカテゴリを選択（クリックで展開）',
                '具体的な項目をクリック',
                'テキストエリアにプロンプト例が自動入力される',
                '必要に応じて内容を編集（会社名・条件など）',
                '「送信」ボタン または Enterキーで送信'
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <p className="font-semibold text-blue-800 mb-1">便利な操作</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li><strong>Shift + Enter</strong>：改行（送信せずに次の行へ）</li>
                <li>会話は継続されるため、「もう少し詳しく」「別のパターンで」など追加指示が可能</li>
              </ul>
            </div>
          </section>

          {/* 4. プロンプト例 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              4. プロンプト例（そのまま使えます）
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-purple-700 border-l-4 border-purple-500 pl-2 mb-2">【クレーム対応】謝罪メールの作成</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{`配送中に荷物が破損してしまいました。
お客様への謝罪メールを作成してください。

- 商品：精密機器
- 破損状況：外箱に凹み、内部機器に傷
- 対応：代替品を翌日発送予定`}</pre>
              </div>

              <div>
                <h3 className="font-bold text-purple-700 border-l-4 border-purple-500 pl-2 mb-2">【契約書作成】運送基本契約書</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{`新規荷主との運送基本契約書を作成してください。

- 荷主：株式会社〇〇
- 主な貨物：食品（冷蔵）
- 運行区間：東京～大阪
- 契約期間：1年（自動更新）`}</pre>
              </div>

              <div>
                <h3 className="font-bold text-purple-700 border-l-4 border-purple-500 pl-2 mb-2">【運賃交渉】値上げ提案書</h3>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{`既存荷主への運賃値上げ交渉の提案書を作成してください。

- 現行運賃：東京→大阪 4トン車 45,000円
- 希望値上げ率：15%
- 根拠：燃料費高騰、2024年問題による人件費増`}</pre>
              </div>
            </div>
          </section>

          {/* 5. 専門知識 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              5. AIが持つ専門知識
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border border-purple-300 px-4 py-2 text-left text-purple-800">分野</th>
                    <th className="border border-purple-300 px-4 py-2 text-left text-purple-800">具体的な内容</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">法令関係</td>
                    <td className="border border-gray-200 px-4 py-2">改正貨物自動車運送事業法、標準的な運賃告示、取引適正化法、下請法</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">2024年問題</td>
                    <td className="border border-gray-200 px-4 py-2">時間外労働上限規制（年960時間）、改善基準告示、荷待ち時間対策</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">契約実務</td>
                    <td className="border border-gray-200 px-4 py-2">標準運送約款に基づく契約書テンプレート（12条構成）</td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">安全管理</td>
                    <td className="border border-gray-200 px-4 py-2">KYT 4ラウンド法、ヒヤリハット8分類、年間安全カレンダー</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-gray-200 px-4 py-2 font-semibold">人材採用</td>
                    <td className="border border-gray-200 px-4 py-2">求人原稿構成、面接見極めポイント、採用コスト計算式</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 6. 注意事項 */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg mb-4">
              6. 注意事項
            </h2>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>AIの回答は<strong>参考情報</strong>です。重要な契約・法的判断は専門家にご確認ください</li>
                <li><strong>個人情報</strong>や<strong>機密情報</strong>の入力はお控えください</li>
                <li>インターネット接続環境が必要です</li>
              </ul>
            </div>
          </section>

          {/* CTAボタン */}
          <div className="text-center pt-6 border-t border-gray-200">
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              ワークショップを始める
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
};

export default GuidePage;
