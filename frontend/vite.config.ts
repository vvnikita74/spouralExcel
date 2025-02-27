import legacy from '@vitejs/plugin-legacy'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'

  return {
    plugins: [
      react(),
      tsconfigPaths(),
      eslintPlugin({
        include: ['./src/**/*.{ts,tsx,js,jsx}']
      }),
      svgr(),
      legacy({
        targets: [
          'last 8 versions',
          '> 0.1%',
          'Safari 9',
          'Chrome >= 49',
          'Firefox >= 45',
          'Edge >= 12',
          'IE 11'
        ]
      })
    ],
    server: {
      port: 8080
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction
    },
    define: {
      'process.env.PRODUCTION': JSON.stringify(isProduction)
    }
  }
})
