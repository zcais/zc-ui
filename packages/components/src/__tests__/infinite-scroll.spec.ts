import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import ZcInfiniteScrollDirective from '../infinite-scroll/infinite-scroll'

/**
 * In jsdom the host element has no scrollable ancestor, so
 * getScrollContainer() resolves to `window`. Scroll events are dispatched
 * manually on window. Because jsdom has no layout, scrollTop/clientHeight/
 * scrollHeight are all 0 — meaning the element is always "near bottom"
 * (0 + 0 >= 0 - distance), which makes the disabled/immediate/throttle
 * logic the meaningful behaviors to assert.
 */

function mountHost(template: string, setupReturn: Record<string, unknown>) {
  const Host = defineComponent({
    directives: { 'infinite-scroll': ZcInfiniteScrollDirective },
    setup() {
      return setupReturn
    },
    template,
  })
  return mount(Host)
}

function fireWindowScroll(): void {
  window.dispatchEvent(new Event('scroll'))
}

describe('v-infinite-scroll directive', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('calls the handler when a scroll event is dispatched', () => {
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler">item</div>`, { handler })
    fireWindowScroll()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call the handler when infinite-scroll-disabled is "true"', () => {
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler" infinite-scroll-disabled="true">item</div>`, {
      handler,
    })
    fireWindowScroll()
    expect(handler).not.toHaveBeenCalled()
  })

  it('does not call the handler when the .disabled modifier is used', () => {
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll.disabled="handler">item</div>`, { handler })
    fireWindowScroll()
    expect(handler).not.toHaveBeenCalled()
  })

  it('resumes calling the handler after disabled is set back to "false"', async () => {
    const handler = vi.fn()
    const wrapper = mountHost(
      `<div v-infinite-scroll="handler" infinite-scroll-disabled="true">item</div>`,
      { handler }
    )
    // MutationObserver picks up the attribute change
    wrapper.element.setAttribute('infinite-scroll-disabled', 'false')
    await flushPromises()
    fireWindowScroll()
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('stops calling the handler when disabled changes to "true" at runtime', async () => {
    const handler = vi.fn()
    const wrapper = mountHost(`<div v-infinite-scroll="handler">item</div>`, { handler })
    // MutationObserver picks up the attribute change
    wrapper.element.setAttribute('infinite-scroll-disabled', 'true')
    await flushPromises()
    fireWindowScroll()
    expect(handler).not.toHaveBeenCalled()
  })

  it('calls the handler immediately on mount with infinite-scroll-immediate="true"', () => {
    vi.useFakeTimers()
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler" infinite-scroll-immediate="true">item</div>`, {
      handler,
    })
    expect(handler).not.toHaveBeenCalled()
    vi.advanceTimersByTime(10)
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('does not call the handler on mount without the immediate option', () => {
    vi.useFakeTimers()
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler">item</div>`, { handler })
    vi.advanceTimersByTime(100)
    expect(handler).not.toHaveBeenCalled()
  })

  it('reads the distance option from the attribute', () => {
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler" infinite-scroll-distance="50">item</div>`, {
      handler,
    })
    fireWindowScroll()
    // jsdom has no layout: distance 50 still counts as "near bottom"
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('throttles rapid scroll events', () => {
    vi.useFakeTimers()
    const handler = vi.fn()
    mountHost(`<div v-infinite-scroll="handler">item</div>`, { handler })
    fireWindowScroll()
    fireWindowScroll()
    fireWindowScroll()
    expect(handler).toHaveBeenCalledTimes(1)
    // After the 200ms throttle window the pending call flushes
    vi.advanceTimersByTime(200)
    expect(handler).toHaveBeenCalledTimes(2)
  })

  it('warns and ignores a non-function directive value', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mountHost(`<div v-infinite-scroll="notFn">item</div>`, {
      notFn: 'not a function',
    })
    expect(warn).toHaveBeenCalledWith('[ZcInfiniteScroll] directive value must be a function')
    fireWindowScroll()
    expect(
      (wrapper.element as unknown as Record<string, unknown>).__zcInfiniteScroll
    ).toBeUndefined()
  })

  it('removes the scroll listener on unmount', () => {
    const handler = vi.fn()
    const wrapper = mountHost(`<div v-infinite-scroll="handler">item</div>`, { handler })
    wrapper.unmount()
    fireWindowScroll()
    expect(handler).not.toHaveBeenCalled()
  })
})
