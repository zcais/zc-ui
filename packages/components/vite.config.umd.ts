import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

/**
 * UMD build for the components package (dist/index.umd.js).
 *
 * Runs as a second `vite build` pass (see the "build" script) because UMD
 * needs different externals than ESM/CJS: everything except Vue is inlined
 * so the bundle works from a plain <script> tag without any import map.
 * `emptyOutDir: false` keeps the ESM/CJS/CSS output of the first pass.
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    target: 'es2018',
    outDir: 'dist',
    emptyOutDir: false,
    sourcemap: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ZcUI',
      formats: ['umd'],
      fileName: () => 'index.umd.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: [/^vue($|\/)/, /^@vue\//],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
})
