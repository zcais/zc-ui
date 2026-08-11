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
 *  - CSS:   dist/style.css (all component styles)
 *  - Types: dist/types/index.d.ts
 *
 * CSS code splitting is enabled (cssCodeSplit: true) for better
 * per-chunk CSS extraction when used with manual chunks.
 *
 * sideEffects: Only "*.css" files are marked as side-effects,
 * allowing bundlers to tree-shake unused component JS.
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
        // Use default asset naming so CSS chunks get proper hashed names.
        // The full combined CSS is available as dist/style.css.
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})
