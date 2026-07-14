import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'

/**
 * Components package Vite library-mode config.
 *
 * Outputs:
 *  - ESM:   dist/index.mjs (tree-shakeable)
 *  - CJS:   dist/index.cjs
 *  - UMD:   dist/index.umd.js (with inlined CSS)
 *  - CSS:   dist/style.css
 *  - Types: dist/types/index.d.ts
 */
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.json',
      outDirs: ['dist/types'],
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
      cleanVueFileName: true,
      staticImport: true,
    }),
    // Generate bundle analysis report (stats.html) during build.
    // Enable via ANALYZE=true or always on CI.
    process.env.ANALYZE || process.env.CI
      ? visualizer({
          filename: '../../reports/stats.html',
          template: 'treemap',
          gzipSize: true,
          brotliSize: true,
          open: false,
        })
      : null,
  ].filter(Boolean),
  build: {
    target: 'es2018',
    outDir: 'dist',
    cssCodeSplit: true,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ZcUI',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs'
        if (format === 'cjs') return 'index.cjs'
        return 'index.umd.js'
      },
    },
    rollupOptions: {
      external: ['vue', '@vue/*', /^@zc-ui\//],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css'
          return assetInfo.name || 'asset-[hash][extname]'
        },
      },
    },
  },
})
