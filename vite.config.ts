import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.FRONTEND_URL': JSON.stringify(env.FRONTEND_URL),
      'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL)
    },
    plugins: [react()],
    server: {
      // same-origin /api in dev, like nginx in prod (snippet-service has no CORS)
      proxy: {
        '/api': {
          target: env.SNIPPET_SERVICE_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
