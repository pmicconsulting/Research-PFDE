import { useNavigate } from 'react-router-dom'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const SurveyPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              アンケート回答画面
            </h2>
            <p className="text-gray-600 mb-8">
              ここにアンケートの質問フォームが表示されます。
            </p>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => navigate('/')}>
                戻る
              </Button>
              <Button onClick={() => navigate('/completion')}>
                送信（仮）
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SurveyPage
