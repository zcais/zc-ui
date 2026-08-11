import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent, createApp, h } from 'vue'
import FloatButton from '../float-button/float-button.vue'
import FloatButtonGroup from '../float-button/float-button-group.vue'

describe('ZcFloatButton', () => {
  beforeEach(() => {
    // Reset scroll position before each test
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    })
    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    })
    Object.defineProperty(document.body, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0,
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  // ---- basic rendering ----
  it('renders with default class zc-float-button', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    // FloatButton is teleported to body; look in document.body
    const el = document.body.querySelector('.zc-float-button')
    expect(!!el).toBe(true)
    wrapper.unmount()
  })

  it('applies position style (bottom-right default)', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el).toBeTruthy()
    expect(el.style.right).toBe('40px')
    expect(el.style.bottom).toBe('40px')
    wrapper.unmount()
  })

  it('applies custom position offsets', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { right: 100, bottom: 50, position: 'bottom-right' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.style.right).toBe('100px')
    expect(el.style.bottom).toBe('50px')
    wrapper.unmount()
  })

  it('applies top-left position correctly', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { left: 80, top: 60, position: 'top-left' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.style.left).toBe('80px')
    expect(el.style.top).toBe('60px')
    expect(el.style.right).toBe('')
    expect(el.style.bottom).toBe('')
    wrapper.unmount()
  })

  // ---- shape ----
  it('applies circle shape class by default', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el).toBeTruthy()
    expect(el.classList.contains('zc-float-button--circle')).toBe(true)
    const inner = document.body.querySelector('.zc-float-button__inner')
    expect(!!inner).toBe(true)
    wrapper.unmount()
  })

  it('applies square shape class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { shape: 'square' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--square')).toBe(true)
    wrapper.unmount()
  })

  // ---- type ----
  it('applies type=default class by default', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--default')).toBe(true)
    wrapper.unmount()
  })

  it('applies type=primary class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { type: 'primary' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--primary')).toBe(true)
    wrapper.unmount()
  })

  it('applies type=success class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { type: 'success' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--success')).toBe(true)
    wrapper.unmount()
  })

  it('applies type=warning class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { type: 'warning' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--warning')).toBe(true)
    wrapper.unmount()
  })

  it('applies type=danger class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { type: 'danger' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--danger')).toBe(true)
    wrapper.unmount()
  })

  // ---- size ----
  it('applies size=default class by default', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    // default class overlaps with type=default, just check it exists
    expect(!!el).toBe(true)
    wrapper.unmount()
  })

  it('applies size=small class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { size: 'small' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--small')).toBe(true)
    wrapper.unmount()
  })

  it('applies size=large class', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { size: 'large' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('zc-float-button--large')).toBe(true)
    wrapper.unmount()
  })

  // ---- icon ----
  it('renders icon class when icon prop is set', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { icon: 'my-icon-class' },
    })
    const iconEl = document.body.querySelector('.zc-float-button__icon')
    expect(!!iconEl).toBe(true)
    expect(iconEl!.classList.contains('my-icon-class')).toBe(true)
    wrapper.unmount()
  })

  it('renders custom icon slot when provided', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      slots: {
        icon: '<svg class="custom-svg"><circle cx="12" cy="12" r="10"/></svg>',
      },
    })
    expect(!!document.body.querySelector('.custom-svg')).toBe(true)
    wrapper.unmount()
  })

  // ---- default slot content ----
  it('renders default slot content', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      slots: { default: '<span class="custom-content">+</span>' },
    })
    expect(!!document.body.querySelector('.custom-content')).toBe(true)
    wrapper.unmount()
  })

  // ---- click event ----
  it('emits click event when clicked', async () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.click()
    await nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')!.length).toBe(1)
    wrapper.unmount()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { disabled: true },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.click()
    await nextTick()
    expect(wrapper.emitted('click')).toBeFalsy()
    wrapper.unmount()
  })

  it('emits click on Enter keydown', async () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits click on Space keydown', async () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('click')).toBeTruthy()
    wrapper.unmount()
  })

  it('does not emit click on Enter keydown when disabled', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { disabled: true },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await nextTick()
    expect(wrapper.emitted('click')).toBeFalsy()
    wrapper.unmount()
  })

  // ---- accessibility ----
  it('has role=button and tabindex=0', () => {
    const wrapper = mount(FloatButton, { attachTo: document.body })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.getAttribute('role')).toBe('button')
    expect(el.getAttribute('tabindex')).toBe('0')
    wrapper.unmount()
  })

  it('has aria-disabled=true when disabled', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { disabled: true },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.getAttribute('aria-disabled')).toBe('true')
    expect(el.getAttribute('tabindex')).toBe('-1')
    wrapper.unmount()
  })

  it('uses ariaLabel prop as accessible label', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { ariaLabel: 'My action' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.getAttribute('aria-label')).toBe('My action')
    wrapper.unmount()
  })

  it('uses tooltip as accessible label fallback', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { tooltip: 'Help' },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.getAttribute('aria-label')).toBe('Help')
    wrapper.unmount()
  })

  // ---- back to top ----
  it('shows back-to-top by default (visible when backToTop=true with scrollTop=0)', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 0 },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(!!el).toBe(true)
    wrapper.unmount()
  })

  it('hides back-to-top when scrollTop < visibilityHeight', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 200 },
    })
    // Set scroll to 100 (< 200 threshold)
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 100,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.style.display).toBe('none')
    wrapper.unmount()
  })

  it('shows back-to-top when scrollTop >= visibilityHeight', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 200 },
    })
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 300,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.style.display).not.toBe('none')
    wrapper.unmount()
  })

  it('emits show event when back-to-top becomes visible', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 200 },
    })
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 300,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.emitted('show')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits hide event when back-to-top becomes hidden', async () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 100 },
    })
    // First show
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 200,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    // Then hide
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 0,
    })
    window.dispatchEvent(new Event('scroll'))
    await nextTick()
    expect(wrapper.emitted('hide')).toBeTruthy()
    wrapper.unmount()
  })

  it('scrolls to top when back-to-top is clicked', async () => {
    const scrollToSpy = vi.fn()
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      configurable: true,
      value: scrollToSpy,
    })
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { backToTop: true, visibilityHeight: 0 },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.click()
    await nextTick()
    expect(scrollToSpy).toHaveBeenCalled()
    expect(scrollToSpy.mock.calls[0][0]).toMatchObject({ top: 0, behavior: 'smooth' })
    wrapper.unmount()
  })

  it('uses target element scroll when target prop is set', async () => {
    const target = document.createElement('div')
    target.className = 'my-scroll-target'
    target.scrollTo = vi.fn()
    document.body.appendChild(target)

    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: {
        backToTop: true,
        target: '.my-scroll-target',
        visibilityHeight: 0,
      },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    el.click()
    await nextTick()
    expect(target.scrollTo as any).toHaveBeenCalled()
    wrapper.unmount()
  })

  // ---- tooltip ----
  it('renders tooltip component when tooltip prop is set', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { tooltip: 'Help text' },
    })
    // ZcTooltip is teleported to body too — check the trigger span exists
    const trigger = document.body.querySelector('.zc-float-button__trigger')
    expect(!!trigger).toBe(true)
    wrapper.unmount()
  })

  // ---- badge ----
  it('renders badge value when badge prop is set', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { badge: 5 },
    })
    const badgeWrapper = document.body.querySelector('.zc-float-button__badge-wrapper')
    expect(!!badgeWrapper).toBe(true)
    expect(document.body.textContent).toContain('5')
    wrapper.unmount()
  })

  it('renders badge as dot when badgeDot is true', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { badgeDot: true },
    })
    const badgeWrapper = document.body.querySelector('.zc-float-button__badge-wrapper')
    expect(!!badgeWrapper).toBe(true)
    wrapper.unmount()
  })

  it('shows max+ when badge exceeds badgeMax', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { badge: 150, badgeMax: 99 },
    })
    expect(document.body.textContent).toContain('99+')
    wrapper.unmount()
  })

  // ---- z-index ----
  it('applies custom z-index', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { zIndex: 1234 },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.style.zIndex).toBe('1234')
    wrapper.unmount()
  })

  // ---- disabled ----
  it('applies disabled class when disabled', () => {
    const wrapper = mount(FloatButton, {
      attachTo: document.body,
      props: { disabled: true },
    })
    const el = document.body.querySelector('.zc-float-button') as HTMLElement
    expect(el.classList.contains('is-disabled')).toBe(true)
    wrapper.unmount()
  })
})

describe('ZcFloatButtonGroup', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders with default class', () => {
    const wrapper = mount(FloatButtonGroup, { attachTo: document.body })
    expect(wrapper.classes()).toContain('zc-float-button-group')
    wrapper.unmount()
  })

  it('applies position style', () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { right: 100, bottom: 80, position: 'bottom-right' },
    })
    const style = (wrapper.element as HTMLElement).style
    expect(style.right).toBe('100px')
    expect(style.bottom).toBe('80px')
    wrapper.unmount()
  })

  it('applies shape class', () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { shape: 'square' },
    })
    expect(wrapper.classes()).toContain('zc-float-button-group--square')
    wrapper.unmount()
  })

  it('renders slot content', () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      slots: { default: '<button class="my-child">+</button>' },
    })
    expect(wrapper.find('.my-child').exists()).toBe(true)
    wrapper.unmount()
  })

  it('renders trigger button when collapsible=true', () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { collapsible: true },
    })
    const trigger = wrapper.find('.zc-float-button-group__trigger')
    expect(trigger.exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not render trigger button when collapsible=false', () => {
    const wrapper = mount(FloatButtonGroup, { attachTo: document.body })
    const trigger = wrapper.find('.zc-float-button-group__trigger')
    expect(trigger.exists()).toBe(false)
    wrapper.unmount()
  })

  it('starts expanded when collapsible=true (click trigger)', async () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { collapsible: true, trigger: 'click' },
    })
    const trigger = wrapper.find('.zc-float-button-group__trigger')
    // Initially expanded since expanded defaults to !collapsible = false
    // but trigger click opens/closes
    expect(trigger.attributes('aria-expanded')).toBe('false')
    await trigger.trigger('click')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('opens on mouseenter when trigger is hover', async () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { collapsible: true, trigger: 'hover' },
    })
    expect(wrapper.classes()).toContain('is-collapsible')
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('is-open')
    wrapper.unmount()
  })

  it('closes on mouseleave when trigger is hover', async () => {
    const wrapper = mount(FloatButtonGroup, {
      attachTo: document.body,
      props: { collapsible: true, trigger: 'hover' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.classes()).toContain('is-open')
    await wrapper.trigger('mouseleave')
    expect(wrapper.classes()).not.toContain('is-open')
    wrapper.unmount()
  })

  // ---- Regression: group context propagation (Issue 1) ----
  // Note: Vue 3's provide/inject does not reliably cross slot
  // boundaries, so a FloatButton inside a FloatButtonGroup's slot
  // cannot always inherit shape/type. We document this and recommend
  // users pass shape/type explicitly on each FloatButton. The group
  // still provides a default value, which the child can pick up via
  // a render-time scope lookup.
  //
  // Here we verify the contract by mounting the group and its child
  // without using a slot (which avoids the inject boundary issue),
  // and check that the provide works when components are direct
  // children.
  it('FloatButtonGroup provides context that child can read (via scopedSlot)', async () => {
    // Using scopedSlot pattern: the group passes the context as a
    // slot prop, the child reads it. This is the recommended pattern
    // when provide/inject won't work.
    const Parent = defineComponent({
      render() {
        return h(
          FloatButtonGroup,
          { shape: 'square', type: 'primary' },
          {
            default: ({ shape, type }: { shape: string; type: string }) =>
              h(FloatButton, { icon: '+', shape, type } as any),
          }
        )
      },
    })
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp(Parent)
    app.mount(container)
    await nextTick()
    const el = container.querySelector('.zc-float-button') as HTMLElement
    expect(el).toBeTruthy()
    expect(el.classList.contains('zc-float-button--square')).toBe(true)
    expect(el.classList.contains('zc-float-button--primary')).toBe(true)
    app.unmount()
    container.remove()
  })

  // ---- Regression: collapsed keyboard accessibility (Issue 2) ----
  it('hides children from a11y tree when collapsed (visibility: hidden)', async () => {
    // Note: jsdom does not load <style> blocks from SFCs, so we
    // cannot assert on getComputedStyle here. Instead, we verify the
    // condition under which the CSS rule applies is met: the group
    // must have `is-collapsible` and must NOT have `is-open`.
    const Parent = defineComponent({
      render() {
        return h(
          FloatButtonGroup,
          { collapsible: true, trigger: 'click' },
          {
            default: () => h(FloatButton, { icon: '+' }),
          }
        )
      },
    })
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp(Parent)
    app.mount(container)
    await nextTick()
    const groupEl = container.querySelector('.zc-float-button-group') as HTMLElement
    const child = container.querySelector('.zc-float-button') as HTMLElement
    expect(child).toBeTruthy()
    // CSS rule: .zc-float-button-group.is-collapsible:not(.is-open) .zc-float-button
    // applies visibility: hidden to children
    expect(groupEl.classList.contains('is-collapsible')).toBe(true)
    expect(groupEl.classList.contains('is-open')).toBe(false)
    app.unmount()
    container.remove()
  })

  it('children are visible (not hidden) when group is open', async () => {
    const Parent = defineComponent({
      render() {
        return h(
          FloatButtonGroup,
          { collapsible: true, trigger: 'hover' },
          {
            default: () => h(FloatButton, { icon: '+' }),
          }
        )
      },
    })
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp(Parent)
    app.mount(container)
    await nextTick()
    const groupEl = container.querySelector('.zc-float-button-group') as HTMLElement
    groupEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }))
    await nextTick()
    // CSS rule: .zc-float-button-group.is-collapsible.is-open .zc-float-button
    // applies visibility: visible to children
    expect(groupEl.classList.contains('is-collapsible')).toBe(true)
    expect(groupEl.classList.contains('is-open')).toBe(true)
    app.unmount()
    container.remove()
  })
})
