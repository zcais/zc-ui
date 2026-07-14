import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

/**
 * Vite config for E2E test fixtures server.
 * Serves a minimal Vue app with ZC UI components mounted for Playwright testing.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@zc-ui/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@zc-ui/hooks': resolve(__dirname, '../../packages/hooks/src/index.ts'),
      '@zc-ui/locale': resolve(__dirname, '../../packages/locale/src/index.ts'),
      '@zc-ui/theme': resolve(__dirname, '../../packages/theme/src/index.ts'),
    },
  },
  server: {
    port: 5174,
  },
})
