import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useId } from '../useId'

describe('useId', () => {
  it('generates a unique id string', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { id } = useId()
        return { id }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComponent)
    expect(typeof wrapper.vm.id).toBe('string')
    expect(wrapper.vm.id.length).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('uses the provided prefix', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { id } = useId('input')
        return { id }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.id.startsWith('input-')).toBe(true)

    wrapper.unmount()
  })

  it('uses default "zc" prefix', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { id } = useId()
        return { id }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.id.startsWith('zc-')).toBe(true)

    wrapper.unmount()
  })

  it('generates different ids for different invocations', async () => {
    const ids: string[] = []

    const TestComponent = defineComponent({
      setup() {
        const { id: id1 } = useId()
        const { id: id2 } = useId()
        ids.push(id1, id2)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    await wrapper.vm.$nextTick()

    expect(ids).toHaveLength(2)
    expect(ids[0]).not.toBe(ids[1])

    wrapper.unmount()
  })

  it('id is stable (same value across re-renders)', async () => {
    const TestComponent = defineComponent({
      setup() {
        const { id } = useId('stable')
        return { id }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComponent)
    const firstId = wrapper.vm.id

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.id).toBe(firstId)

    wrapper.unmount()
  })
})
