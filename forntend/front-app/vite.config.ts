import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// Viteの設定をエクスポート
export default defineConfig({
  // プラグインの設定
  plugins: [react()],
  // パスの解決設定
  resolve: {
    alias: [
      // @からのパスをsrcディレクトリに紐付け
      { find: '@', replacement: path.resolve(__dirname, 'src') }
    ]
  }
})

