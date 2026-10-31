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
 *  - CSS:   dist/style.css (all component styles, stable path — matches
 *           the "./styles" entry in package.json exports)
 *  - Types: dist/types/index.d.ts
 *
 * The UMD build lives in `vite.config.umd.ts` and is run separately so it
 * can inline the workspace packages (@zc-ui/utils, ...) instead of
 * externalizing them to private globals.
 *
 * `qrcode` is a real runtime dependency (used by qr-code) and is kept
 * external so consumers don't get a second copy bundled inside this one.
 */
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    dts({
      tsconfigPath: './tsconfig.json',
      outDirs: ['dist/types'],
      entryRoot: 'src',
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
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ZcUI',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        if (format === 'es') return 'index.mjs'
        return 'index.cjs'
      },
      // Emit the combined stylesheet as dist/style.css (stable, matches exports).
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [/^vue($|\/)/, /^@vue\//, /^@zc-ui\//, 'qrcode'],
      output: {
        exports: 'named',
      },
    },
  },
})
