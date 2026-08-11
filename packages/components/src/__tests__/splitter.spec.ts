import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, defineComponent } from 'vue'
import Splitter from '../splitter/splitter.vue'

// Create a dummy panel content component
const DummyPanel = defineComponent({
  name: 'DummyPanel',
  setup(_, { slots }) {
    return () => h('div', { class: 'dummy-panel' }, slots.default?.())
  },
})

describe('ZcSplitter', () => {
  it('renders with default props', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'Left'), h(DummyPanel, () => 'Right')],
      },
    })
    expect(wrapper.classes()).toContain('zc-splitter')
    expect(wrapper.classes()).toContain('zc-splitter--horizontal')
  })

  it('renders vertical direction', () => {
    const wrapper = mount(Splitter, {
      props: { direction: 'vertical' },
      slots: {
        default: [h(DummyPanel, () => 'Top'), h(DummyPanel, () => 'Bottom')],
      },
    })
    expect(wrapper.classes()).toContain('zc-splitter--vertical')
  })

  it('renders gutter between panels', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'Left'), h(DummyPanel, () => 'Right')],
      },
    })
    const gutters = wrapper.findAll('.zc-splitter__gutter')
    expect(gutters.length).toBe(1)
  })

  it('renders multiple gutters for 3 panels', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B'), h(DummyPanel, () => 'C')],
      },
    })
    const gutters = wrapper.findAll('.zc-splitter__gutter')
    expect(gutters.length).toBe(2)
  })

  it('shows gutter handle dots by default', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })
    expect(wrapper.find('.zc-splitter__gutter-dots').exists()).toBe(true)
  })

  it('hides gutter handle when showGutterHandle is false', () => {
    const wrapper = mount(Splitter, {
      props: { showGutterHandle: false },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })
    expect(wrapper.find('.zc-splitter__gutter-dots').exists()).toBe(false)
  })

  it('applies disabled class when disabled', () => {
    const wrapper = mount(Splitter, {
      props: { disabled: true },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('does not render gutter when disabled', () => {
    const wrapper = mount(Splitter, {
      props: { disabled: true },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })
    expect(wrapper.findAll('.zc-splitter__gutter').length).toBe(0)
  })

  it('applies custom gutter size', () => {
    const wrapper = mount(Splitter, {
      props: { gutterSize: 10 },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })
    const gutter = wrapper.find('.zc-splitter__gutter')
    expect(gutter.attributes('style')).toContain('10px')
  })

  it('renders panel content correctly', () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'Hello'), h(DummyPanel, () => 'World')],
      },
    })
    expect(wrapper.text()).toContain('Hello')
    expect(wrapper.text()).toContain('World')
  })

  it('emits resize event on drag', async () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    const rectSpy = vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
      height: 500,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect)

    // Simulate mousedown
    gutter.trigger('mousedown', { clientX: 500, clientY: 0 })

    // Simulate mousemove
    const moveEvent = new MouseEvent('mousemove', { clientX: 600, clientY: 0 })
    document.dispatchEvent(moveEvent)

    // Simulate mouseup
    const upEvent = new MouseEvent('mouseup')
    document.dispatchEvent(upEvent)

    const resizeEvents = wrapper.emitted('resize')
    expect(resizeEvents).toBeDefined()
    expect(resizeEvents!.length).toBeGreaterThan(0)

    rectSpy.mockRestore()
  })

  it('emits update:sizes after drag ends', async () => {
    const wrapper = mount(Splitter, {
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    vi.spyOn(wrapper.element, 'getBoundingClientRect').mockReturnValue({
      width: 1000,
      height: 500,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 500,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect)

    gutter.trigger('mousedown', { clientX: 500, clientY: 0 })

    const moveEvent = new MouseEvent('mousemove', { clientX: 600, clientY: 0 })
    document.dispatchEvent(moveEvent)

    const upEvent = new MouseEvent('mouseup')
    document.dispatchEvent(upEvent)

    const updateEvents = wrapper.emitted('update:sizes')
    expect(updateEvents).toBeDefined()
    expect(updateEvents!.length).toBe(1)
  })

  it('emits collapsed event on double click when collapsible', async () => {
    const wrapper = mount(Splitter, {
      props: { collapsible: true },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    await gutter.trigger('dblclick')

    const collapsedEvents = wrapper.emitted('collapsed')
    expect(collapsedEvents).toBeDefined()
    expect(collapsedEvents![0]).toEqual([0, true])
  })

  it('does not collapse when collapsible is false', async () => {
    const wrapper = mount(Splitter, {
      props: { collapsible: false },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    await gutter.trigger('dblclick')

    expect(wrapper.emitted('collapsed')).toBeUndefined()
  })

  it('initializes panel sizes from props', () => {
    const wrapper = mount(Splitter, {
      props: { sizes: [30, 70] },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const panels = wrapper.findAll('.zc-splitter__panel')
    expect(panels[0].attributes('style')).toContain('30%')
    expect(panels[1].attributes('style')).toContain('70%')
  })

  it('applies gutter width style for horizontal', () => {
    const wrapper = mount(Splitter, {
      props: { gutterSize: 8, direction: 'horizontal' },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    expect(gutter.attributes('style')).toContain('width: 8px')
  })

  it('applies gutter height style for vertical', () => {
    const wrapper = mount(Splitter, {
      props: { gutterSize: 8, direction: 'vertical' },
      slots: {
        default: [h(DummyPanel, () => 'A'), h(DummyPanel, () => 'B')],
      },
    })

    const gutter = wrapper.find('.zc-splitter__gutter')
    expect(gutter.attributes('style')).toContain('height: 8px')
  })
})
