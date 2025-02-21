/* eslint-disable @typescript-eslint/no-require-imports */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import eslintPlugin from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
	const isProduction = mode === 'production'

	return {
		plugins: [
			react(),
			tsconfigPaths(),
			eslintPlugin({
				include: ['./src/**/*.{ts,tsx,js,jsx}']
			}),
			svgr()
		],
		server: {
			port: 8080
		},
		build: {
			outDir: 'dist',
			sourcemap: !isProduction,
			rollupOptions: {
				output: {
					entryFileNames: 'build.js'
				}
			}
		},
		define: {
			'process.env.PRODUCTION': JSON.stringify(isProduction)
		}
	}
})
