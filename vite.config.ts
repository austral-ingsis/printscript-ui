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
      proxy: {
        '/api': {
          target: env.BACKEND_PROXY_TARGET || 'http://localhost:8080',
          changeOrigin: true,
          // El WebSocket de ejecución (/api/snippets/{id}/execution) también pasa por acá.
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
