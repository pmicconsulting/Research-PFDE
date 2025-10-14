import { useNavigate, useLocation } from 'react-router-dom'
import { CheckCircleIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'

const CompletionPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { respondentId, sessionId, emailSent } = location.state || {}

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

            <p className="text-gray-600 mb-4 text-lg leading-relaxed">
              アンケートへのご協力、誠にありがとうございました。<br />
              貴重なご意見は、今後の施策検討に活用させていただきます。
            </p>

            {emailSent && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8 inline-block rounded-lg">
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <p className="text-blue-700">
                    確認メールを送信いたしました
                  </p>
                </div>
              </div>
            )}

            {respondentId && (
              <div className="bg-gray-50 p-4 rounded-lg mb-8">
                <p className="text-sm text-gray-600">
                  回答ID: {respondentId}
                </p>
              </div>
            )}

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
