import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TopPage from './pages/TopPage'
import SurveyPage from './pages/SurveyPage'
import CompletionPage from './pages/CompletionPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/completion" element={<CompletionPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
