import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/weather-app/',  // important! GitHub repo name with slashes
  plugins: [react()]
})
