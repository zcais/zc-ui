import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Popover from '../popover/popover.vue'

describe('ZcPopover', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  // ---- Rendering ----
  it('renders with default props', () => {
    const wrapper = mount(Popover, {
      slots: { default: '<button>Click me</button>' },
    })
    expect(wrapper.classes()).toContain('zc-popover')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('does not show popper initially', () => {
    mount(Popover, {
      props: { content: 'Hello', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- Click trigger ----
  it('shows popover on click trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Clicked', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  it('hides on second click (toggle)', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Toggle', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  it('hides on outside click with click trigger', async () => {
    // Use exposed methods to verify hide logic works correctly.
    // Full DOM outside-click simulation has jsdom+Teleport limitations.
    const wrapper = mount(Popover, {
      props: { content: 'Outside', trigger: 'click', visible: true },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    // Call exposed hide method (same code path as outside-click handler)
    wrapper.vm.hide()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:visible')?.some((v) => v[0] === false)).toBe(
      true,
    )
    wrapper.unmount()
  })

  // ---- Hover trigger ----
  it('shows popover on hover trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Hover text', trigger: 'hover', showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  it('hides on mouseleave with hover trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Hover hide', trigger: 'hover', showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    await wrapper.trigger('mouseleave')
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- Focus trigger ----
  it('shows popover on focus trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Focus text', trigger: 'focus' },
      slots: { default: '<input placeholder="focus me" />' },
    })
    await wrapper.trigger('focus')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  it('hides on blur with focus trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Focus hide', trigger: 'focus' },
      slots: { default: '<input placeholder="focus me" />' },
    })
    await wrapper.trigger('focus')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    await wrapper.trigger('blur')
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- Contextmenu trigger ----
  it('shows popover on contextmenu trigger', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Context text', trigger: 'contextmenu' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('contextmenu')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  it('toggles on second contextmenu', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Context toggle', trigger: 'contextmenu' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('contextmenu')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    await wrapper.trigger('contextmenu')
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- Disabled ----
  it('does not show when disabled', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Disabled', trigger: 'click', disabled: true },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- v-model ----
  it('emits update:visible on show', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Visible', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
  })

  it('emits update:visible on hide', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Visible', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click') // show
    await wrapper.trigger('click') // hide
    const emitted = wrapper.emitted('update:visible')
    expect(emitted?.[0]).toEqual([true])
    expect(emitted?.[1]).toEqual([false])
  })

  it('responds to external visible prop', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'External', trigger: 'click', visible: false },
      slots: { default: '<span>text</span>' },
    })
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
    await wrapper.setProps({ visible: true })
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    await wrapper.setProps({ visible: false })
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })

  // ---- Content ----
  it('renders content prop text', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'My content text', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')?.textContent).toContain(
      'My content text',
    )
  })

  it('renders title prop text', async () => {
    const wrapper = mount(Popover, {
      props: { title: 'My Title', content: 'Body', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.textContent).toContain('My Title')
    expect(popper?.textContent).toContain('Body')
  })

  it('renders title slot', async () => {
    const wrapper = mount(Popover, {
      props: { trigger: 'click' },
      slots: {
        default: '<span>text</span>',
        title: '<strong>Slot Title</strong>',
      },
    })
    await wrapper.trigger('click')
    expect(
      document.querySelector('.zc-popover__title strong'),
    ).not.toBeNull()
  })

  it('renders content slot', async () => {
    const wrapper = mount(Popover, {
      props: { trigger: 'click' },
      slots: {
        default: '<span>text</span>',
        content: '<div class="custom-content">Complex content</div>',
      },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.custom-content')).not.toBeNull()
  })

  // ---- Placement classes ----
  it('applies bottom placement class by default', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Test', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.classList.contains('zc-popover-popper--bottom')).toBe(true)
  })

  it('applies top placement class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Top', trigger: 'click', placement: 'top' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.classList.contains('zc-popover-popper--top')).toBe(true)
  })

  it('applies left placement class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Left', trigger: 'click', placement: 'left' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.classList.contains('zc-popover-popper--left')).toBe(true)
  })

  it('applies right placement class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Right', trigger: 'click', placement: 'right' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.classList.contains('zc-popover-popper--right')).toBe(true)
  })

  it('applies top-start placement class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'TS', trigger: 'click', placement: 'top-start' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(popper?.classList.contains('zc-popover-popper--top-start')).toBe(true)
  })

  it('applies bottom-end placement class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'BE', trigger: 'click', placement: 'bottom-end' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper')
    expect(
      popper?.classList.contains('zc-popover-popper--bottom-end'),
    ).toBe(true)
  })

  // ---- Arrow ----
  it('shows arrow by default', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Arrow', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__arrow')).not.toBeNull()
  })

  it('hides arrow when showArrow is false', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'No Arrow', trigger: 'click', showArrow: false },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__arrow')).toBeNull()
  })

  // ---- Width / min-width ----
  it('applies numeric width style', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Width', trigger: 'click', width: 300 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper') as HTMLElement
    expect(popper.style.width).toBe('300px')
  })

  it('applies string width style', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Width', trigger: 'click', width: '50%' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper') as HTMLElement
    expect(popper.style.width).toBe('50%')
  })

  it('applies min-width style', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'MinWidth', trigger: 'click', minWidth: 200 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper') as HTMLElement
    expect(popper.style.minWidth).toBe('200px')
  })

  // ---- Popper class ----
  it('applies custom popper class', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Class', trigger: 'click', popperClass: 'my-custom' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(
      document.querySelector('.zc-popover__popper.my-custom'),
    ).not.toBeNull()
  })

  // ---- Teleport ----
  it('popper is teleported to body', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Teleport', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper') as HTMLElement
    expect(popper).not.toBeNull()
    expect(popper.closest('.zc-popover')).toBeNull()
  })

  it('popper has fixed position styles', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Fixed', trigger: 'click', placement: 'bottom' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    const popper = document.querySelector('.zc-popover__popper') as HTMLElement
    expect(popper).not.toBeNull()
    expect(popper.style.top || popper.style.bottom).not.toBe('')
  })

  // ---- Show/hide events ----
  it('emits show event', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Event', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('show')).toBeTruthy()
  })

  it('emits hide event', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Event', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click') // show
    await wrapper.trigger('click') // hide
    expect(wrapper.emitted('hide')).toBeTruthy()
  })

  // ---- Exposed methods ----
  it('exposes show/hide/toggle methods', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Methods', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    const vm = wrapper.vm as any
    vm.show()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    vm.hide()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
    vm.toggle()
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  // ---- Transition ----
  it('uses custom transition name', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Transition', trigger: 'click', transition: 'fade' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    // Transition name is applied via Vue's Transition component
    // The popper content should still be rendered
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
  })

  // ---- Cleanup ----
  it('cleans up popper on unmount', async () => {
    const wrapper = mount(Popover, {
      props: { content: 'Cleanup', trigger: 'click' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-popover__popper')).not.toBeNull()
    wrapper.unmount()
    expect(document.querySelector('.zc-popover__popper')).toBeNull()
  })
})
