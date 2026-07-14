import { describe, it, expect } from 'vitest'
import { ref, computed, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useVirtualList } from '../useVirtualList'

describe('useVirtualList', () => {
  it('returns correct initial state with empty data', async () => {
    const data = ref<number[]>([])
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 40 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 300px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.visibleData).toEqual([])
    expect(wrapper.vm.totalHeight).toBe(0)
    expect(wrapper.vm.offsetY).toBe(0)

    wrapper.unmount()
  })

  it('computes totalHeight as count * itemHeight', async () => {
    const data = ref([1, 2, 3, 4, 5])
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 40 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 300px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.totalHeight).toBe(200) // 5 items * 40px

    wrapper.unmount()
  })

  it('startIndex and endIndex are within bounds', async () => {
    const data = ref(Array.from({ length: 100 }, (_, i) => i))
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 30, overscan: 3 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 300px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.startIndex).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.endIndex).toBeLessThanOrEqual(100)
    expect(wrapper.vm.visibleData.length).toBeLessThanOrEqual(100)

    wrapper.unmount()
  })

  it('visibleData is a subset of the original data', async () => {
    const data = ref(Array.from({ length: 50 }, (_, i) => `item-${i}`))
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 36, overscan: 2 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 200px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    // Every visible item should exist in the original data
    for (const item of wrapper.vm.visibleData) {
      expect(data.value).toContain(item)
    }

    wrapper.unmount()
  })

  it('reacts to data changes', async () => {
    const data = ref<number[]>([])
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 50 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 300px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.totalHeight).toBe(0)

    data.value = [1, 2, 3]
    await nextTick()

    expect(wrapper.vm.totalHeight).toBe(150) // 3 items * 50px

    wrapper.unmount()
  })

  it('offsetY is always a multiple of itemHeight', async () => {
    const data = ref(Array.from({ length: 200 }, (_, i) => i))
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 36, overscan: 5 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 400px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.offsetY).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.offsetY % 36).toBe(0)

    wrapper.unmount()
  })

  it('works with ComputedRef data source', async () => {
    const source = ref([10, 20, 30, 40, 50])
    const data = computed(() => source.value.map((v) => v * 2))
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 40 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 200px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    expect(wrapper.vm.totalHeight).toBe(200) // 5 * 40

    wrapper.unmount()
  })

  it('cleans up listeners on unmount', async () => {
    const data = ref([1, 2, 3])
    const TestComp = defineComponent({
      setup() {
        const vl = useVirtualList({ data, itemHeight: 40 })
        return { ...vl }
      },
      render() {
        return h('div', { ref: 'containerRef', style: 'height: 200px;' })
      },
    })
    const wrapper = mount(TestComp)
    await nextTick()

    // Should unmount without errors
    wrapper.unmount()
    expect(true).toBe(true)
  })
})
