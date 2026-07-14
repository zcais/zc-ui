import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.json',
      outDirs: ['dist/types'],
      include: ['src/**/*.ts'],
      exclude: ['node_modules', 'dist'],
      cleanVueFileName: true,
    }),
  ],
  build: {
    target: 'es2018',
    outDir: 'dist',
    cssCodeSplit: false,
    lib: {
      entry: resolve(import.meta.dirname, 'src/index.ts'),
      name: 'ZcIcons',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['vue', /^@zc-ui\//],
      output: {
        globals: { vue: 'Vue' },
        exports: 'named',
      },
    },
  },
})
