import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const CompletionPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircleIcon className="h-24 w-24 text-green-500" />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              ご回答ありがとうございました
            </h2>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              アンケートへのご協力、誠にありがとうございました。<br />
              確認メールを送信いたしました。
            </p>

            <Button onClick={() => navigate('/')}>
              トップページに戻る
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CompletionPage
