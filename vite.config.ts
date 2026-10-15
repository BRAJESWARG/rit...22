import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Keep the bundle runnable on iOS 15 Safari and equivalent desktop browsers.
    target: ['es2020', 'safari15', 'chrome90', 'firefox90', 'edge90'],
  },
})
