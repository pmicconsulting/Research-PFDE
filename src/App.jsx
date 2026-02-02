import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WorkshopPage from './pages/WorkshopPage'

// 調査ページ（現在は使用しない）
// import TopPage from './pages/TopPage'
// import SurveyPage from './pages/SurveyPage'
// import CompletionPage from './pages/CompletionPage'
// import TestDomain from './pages/TestDomain'

function App() {
  return (
    <Router>
      <Routes>
        {/* AIワークショップページ */}
        <Route path="/" element={<WorkshopPage />} />

        {/* 調査ページ（現在は使用しない）
        <Route path="/survey" element={<SurveyPage />} />
        <Route path="/completion" element={<CompletionPage />} />
        <Route path="/test-domain" element={<TestDomain />} />
        */}
      </Routes>
    </Router>
  )
}

export default App
