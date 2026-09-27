import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// In GitHub Actions / GitHub Pages, use repository subpath '/TaskFlow/'
// On Google Cloud Run or local dev, use root '/'
const isGitHub = process.env.GITHUB_ACTIONS === 'true' || process.env.GITHUB_PAGES === 'true';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: isGitHub ? '/TaskFlow/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
