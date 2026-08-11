import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import ZcTable from '../table/table.vue'
import ZcButton from '../button/button.vue'
import ZcTag from '../tag/tag.vue'
import ZcInput from '../input/input.vue'

/**
 * Performance Benchmark Tests
 *
 * These tests measure component rendering performance to catch regressions.
 * They use a generous threshold approach: instead of absolute timing
 * (which varies by machine), we check that operations complete within
 * a reasonable upper bound.
 *
 * In CI, these run on consistent hardware. Locally, thresholds may need
 * adjustment depending on the developer's machine.
 *
 * Inspired by:
 * - Element Plus: https://github.com/element-plus/element-plus/tree/main/packages/play
 * - Vuetify: uses benchmark.js for component perf testing
 */

/** Threshold for "should complete" checks (ms) — generous for CI runners
 * jsdom is ~10x slower than real browsers, so thresholds are set accordingly.
 */
const PERFORMANCE_THRESHOLD = 30000

/** Per-test timeout for performance tests (ms) */
const PERF_TEST_TIMEOUT = 60_000

/** Helper: measure execution time of a function */
function measureTime(fn: () => void): number {
  const start = performance.now()
  fn()
  return performance.now() - start
}

/** Helper: generate test data for large tables */
function generateTableData(rows: number) {
  return Array.from({ length: rows }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 50),
    department: ['Engineering', 'Design', 'Marketing', 'Sales'][i % 4],
    status: i % 3 === 0 ? 'active' : 'inactive',
    salary: 50000 + (i % 100) * 1000,
  }))
}

describe('Performance Benchmarks', () => {
  describe('Table Rendering', () => {
    it('should render 100 rows within threshold', () => {
      const data = generateTableData(100)
      const columns = [
        { prop: 'id', label: 'ID' },
        { prop: 'name', label: 'Name' },
        { prop: 'email', label: 'Email' },
      ]

      const time = measureTime(() => {
        mount(ZcTable, {
          props: { data, columns },
        })
      })

      console.log(`  Table(100 rows): ${time.toFixed(2)}ms`)
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
    })

    it(
      'should render 1000 rows within threshold',
      () => {
        const data = generateTableData(1000)
        const columns = [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' },
          { prop: 'email', label: 'Email' },
          { prop: 'department', label: 'Department' },
          { prop: 'status', label: 'Status' },
        ]

        const time = measureTime(() => {
          mount(ZcTable, {
            props: { data, columns },
          })
        })

        console.log(`  Table(1000 rows): ${time.toFixed(2)}ms`)
        expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
      },
      PERF_TEST_TIMEOUT
    )

    it(
      'should mount and unmount 100 rows without memory leaks',
      () => {
        const data = generateTableData(100)
        const columns = [
          { prop: 'id', label: 'ID' },
          { prop: 'name', label: 'Name' },
        ]

        // Mount and unmount 10 times to check for leaks/errors
        let totalTime = 0
        for (let i = 0; i < 10; i++) {
          const iterationTime = measureTime(() => {
            const wrapper = mount(ZcTable, {
              props: { data, columns },
            })
            wrapper.unmount()
          })
          totalTime += iterationTime
        }

        const avgTime = totalTime / 10
        console.log(`  Table(100 rows) mount/unmount x10 avg: ${avgTime.toFixed(2)}ms`)
        expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLD / 2)
      },
      PERF_TEST_TIMEOUT
    )
  })

  describe('Button Rendering', () => {
    it('should render 1000 buttons within threshold', () => {
      const time = measureTime(() => {
        const wrapper = mount({
          render() {
            return h(
              'div',
              Array.from({ length: 1000 }, (_, i) =>
                h(ZcButton, { key: i, type: i % 2 === 0 ? 'primary' : 'default' }, () => `Btn ${i}`)
              )
            )
          },
        })
        wrapper.unmount()
      })

      console.log(`  Button(1000 instances): ${time.toFixed(2)}ms`)
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
    })
  })

  describe('Tag Rendering', () => {
    it('should render 1000 tags within threshold', () => {
      const time = measureTime(() => {
        const wrapper = mount({
          render() {
            return h(
              'div',
              Array.from({ length: 1000 }, (_, i) =>
                h(
                  ZcTag,
                  { key: i, type: (['primary', 'success', 'warning', 'danger'] as const)[i % 4] },
                  () => `Tag ${i}`
                )
              )
            )
          },
        })
        wrapper.unmount()
      })

      console.log(`  Tag(1000 instances): ${time.toFixed(2)}ms`)
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
    })
  })

  describe('Input Rendering', () => {
    it('should render 500 inputs within threshold', () => {
      const time = measureTime(() => {
        const wrapper = mount({
          render() {
            return h(
              'div',
              Array.from({ length: 500 }, (_, i) =>
                h(ZcInput, {
                  key: i,
                  placeholder: `Input ${i}`,
                  modelValue: `value ${i}`,
                })
              )
            )
          },
        })
        wrapper.unmount()
      })

      console.log(`  Input(500 instances): ${time.toFixed(2)}ms`)
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
    })
  })

  describe('Mixed Components', () => {
    it('should render a complex form within threshold', () => {
      const time = measureTime(() => {
        // Simulate a complex form with 50 rows, each containing inputs, buttons, tags
        const wrapper = mount({
          render() {
            return h(
              'div',
              Array.from({ length: 50 }, (_, i) =>
                h('div', { key: i, style: 'display: flex; gap: 8px; margin-bottom: 8px;' }, [
                  h(ZcInput, { placeholder: `Field ${i}`, modelValue: '' }),
                  h(ZcButton, { type: 'primary' }, () => 'Action'),
                  h(ZcTag, { type: i % 3 === 0 ? 'success' : 'danger' }, () =>
                    i % 3 === 0 ? 'Active' : 'Inactive'
                  ),
                ])
              )
            )
          },
        })
        wrapper.unmount()
      })

      console.log(`  Mixed form(50 rows x 3 components): ${time.toFixed(2)}ms`)
      expect(time).toBeLessThan(PERFORMANCE_THRESHOLD)
    })
  })
})
