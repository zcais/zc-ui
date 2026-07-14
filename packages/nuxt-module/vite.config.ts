import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ZcUINuxtModule',
      fileName: (format) => format === 'es' ? 'module.mjs' : 'module.cjs',
    },
    rollupOptions: {
      // Do not bundle Nuxt kit — it's provided by the host Nuxt app
      external: [
        '@nuxt/kit',
        '@nuxt/schema',
        'vue',
        '@zc-ui/components',
        '@zc-ui/utils',
        '@zc-ui/theme',
      ],
    },
    minify: false,
    sourcemap: true,
  },
})
