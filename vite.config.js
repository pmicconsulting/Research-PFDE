import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 本番ビルド時の最適化設定
    minify: 'terser',
    terserOptions: {
      compress: {
        // 本番環境でconsole文を削除
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  esbuild: {
    // 開発環境でもconsole文を制御可能
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
  },
})
