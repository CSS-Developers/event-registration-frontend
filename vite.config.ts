import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  if (command === 'build' && mode === 'production') {
    const apiBase = loadEnv(mode, process.cwd(), 'VITE_').VITE_API_BASE_URL
    if (!apiBase || !/^https:\/\//i.test(apiBase)) {
      throw new Error('VITE_API_BASE_URL must be set to the https:// API origin for a production build.')
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
