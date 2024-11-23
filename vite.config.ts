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
    preview: {
      port: env.VITE_SERVER_PORT,
      host: true,
      cors: true,
    },
    server: {
      port: env.VITE_SERVER_PORT,
      host: true,
      cors: true,
    },
    build: {
      minify: true,
      sourcemap: false,
      target: 'modules',
    },
    base: env.VITE_BASE_PATH,
  }
})
