import { useNavigate } from 'react-router-dom'
import { DocumentTextIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const TopPage = () => {
  const navigate = useNavigate()

  const handleStartSurvey = () => {
    navigate('/survey')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="mb-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
                <p className="text-sm font-semibold">令和７年度 実態調査</p>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                ご協力のお願い
              </h2>
              <p className="text-xl sm:text-2xl mb-8 leading-relaxed">
                トラック運送業界における<br className="sm:hidden" />
                女性の活躍推進のため、<br />
                皆様のご意見をお聞かせください
              </p>
            </div>

            <Button
              onClick={handleStartSurvey}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl hover:scale-105 transform transition-all"
            >
              <span className="flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6" />
                アンケートに回答する
              </span>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
              アンケートについて
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-blue-100">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <ClockIcon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  所要時間
                </h4>
                <p className="text-gray-600 text-center leading-relaxed">
                  約10〜15分程度で<br />
                  ご回答いただけます
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-green-100">
                <div className="bg-green-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  匿名回答
                </h4>
                <p className="text-gray-600 text-center leading-relaxed">
                  個人情報は厳重に管理され、<br />
                  統計的に処理されます
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-purple-100">
                <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <DocumentTextIcon className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  簡単入力
                </h4>
                <p className="text-gray-600 text-center leading-relaxed">
                  選択式の質問が中心で<br />
                  簡単にご回答いただけます
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Purpose Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                調査の目的
              </h3>
              <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                <p>
                  本調査は、トラック運送業界における女性の雇用状況や職場環境について実態を把握し、
                  女性がより活躍できる環境づくりに向けた施策の検討に活用させていただくことを目的としています。
                </p>
                <p>
                  皆様からいただいた貴重なご意見は、業界全体の発展と、
                  働きやすい職場環境の実現に向けて役立てさせていただきます。
                </p>
                <p className="text-center text-blue-700 font-semibold text-xl mt-8">
                  ご協力のほど、よろしくお願いいたします。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-bold text-white mb-6">
              準備ができましたら、下のボタンから回答を開始してください
            </h3>
            <Button
              onClick={handleStartSurvey}
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 shadow-2xl hover:scale-105 transform transition-all"
            >
              <span className="flex items-center gap-2">
                <DocumentTextIcon className="h-6 w-6" />
                アンケートに回答する
              </span>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default TopPage
