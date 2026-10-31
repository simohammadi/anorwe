import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from the root of the custom domain https://anorwe.com/
export default defineConfig({
  base: '/',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
})
