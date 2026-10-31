import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      outDirs: ['dist/types'],
      include: ['src/index.ts'],
      exclude: ['node_modules', 'dist', 'src/runtime'],
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ZcUINuxtModule',
      fileName: (format) => (format === 'es' ? 'module.mjs' : 'module.cjs'),
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
