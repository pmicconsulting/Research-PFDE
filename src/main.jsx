import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupExtensionErrorHandler } from './utils/browserExtensionHandler.js'

// ブラウザ拡張機能のエラーハンドリングを設定
setupExtensionErrorHandler()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
