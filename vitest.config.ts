import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@zc-ui/utils': resolve(__dirname, 'packages/utils/src/index.ts'),
      '@zc-ui/hooks': resolve(__dirname, 'packages/hooks/src/index.ts'),
      '@zc-ui/locale': resolve(__dirname, 'packages/locale/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/src/**/__tests__/**/*.spec.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov', 'html'],
      reportsDirectory: 'coverage',

      // Source files to measure coverage against
      include: [
        'packages/components/src/**/*.vue',
        'packages/components/src/**/*.ts',
        'packages/hooks/src/**/*.ts',
        'packages/utils/src/**/*.ts',
        'packages/locale/src/**/*.ts',
        'packages/theme/src/**/*.ts',
      ],

      // Exclude test files, type definitions, and barrel exports from coverage
      exclude: [
        'packages/**/src/**/__tests__/**',
        'packages/**/*.d.ts',
        'packages/**/src/**/types.ts',
        'packages/**/src/**/index.ts',
        'packages/**/*.config.*',
        'packages/**/dist/**',
      ],

      // Coverage thresholds — CI builds will fail below these levels
      // Current baseline: ~73% lines. Thresholds set slightly below current
      // coverage to prevent regressions while we work toward the 80% goal.
      // Raise thresholds incrementally as coverage improves.
      thresholds: {
        // Lines: percentage of executable lines covered
        lines: 70,
        // Functions: percentage of functions called at least once
        functions: 70,
        // Branches: percentage of code branches taken
        branches: 60,
        // Statements: percentage of statements executed
        statements: 68,
      },
    },
  },
})
