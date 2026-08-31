import { copyFileSync, mkdirSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    sites(),
    {
      name: 'sites-worker-entrypoint',
      closeBundle() {
        mkdirSync('dist/server', { recursive: true })
        copyFileSync('src/worker.js', 'dist/server/index.js')
      },
    },
  ],
})
