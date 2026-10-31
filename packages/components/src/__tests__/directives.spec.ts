import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, type Directive } from 'vue'
import ZcCopyDirective from '../directives/copy'
import ZcDebounceDirective from '../directives/debounce'

/* ------------------------------------------------------------------ *
 * Helpers
 * ------------------------------------------------------------------ */

function stubClipboard(writeText: ReturnType<typeof vi.fn>): void {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
}

function removeClipboardStub(): void {
  delete (window.navigator as unknown as Record<string, unknown>).clipboard
}

function mountWithDirectives(
  directives: Record<string, Directive>,
  template: string,
  setup: () => Record<string, unknown> = () => ({})
) {
  const Host = defineComponent({
    ...({ directives } as object),
    setup,
    template,
  })
  return mount(Host)
}

/* ------------------------------------------------------------------ *
 * v-copy
 * ------------------------------------------------------------------ */

describe('v-copy directive', () => {
  afterEach(() => {
    removeClipboardStub()
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('sets pointer cursor on the host element', () => {
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'hello'">Copy</button>`
    )
    expect((wrapper.element as HTMLElement).style.cursor).toBe('pointer')
  })

  it('copies the bound value to the clipboard on click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'hello world'">Copy</button>`
    )
    await wrapper.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('hello world')
  })

  it('dispatches copy-success event with the copied text', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const onSuccess = vi.fn()
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'some text'" @copy-success="onSuccess">Copy</button>`,
      () => ({ onSuccess })
    )
    await wrapper.trigger('click')
    await flushPromises()
    expect(onSuccess).toHaveBeenCalledTimes(1)
    const event = onSuccess.mock.calls[0][0] as CustomEvent
    expect(event.detail).toEqual({ text: 'some text' })
  })

  it('does nothing when the bound value is empty', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const onSuccess = vi.fn()
    const onError = vi.fn()
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="''" @copy-success="onSuccess" @copy-error="onError">Copy</button>`,
      () => ({ onSuccess, onError })
    )
    await wrapper.trigger('click')
    await flushPromises()
    expect(writeText).not.toHaveBeenCalled()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('falls back to execCommand when clipboard API is unavailable', async () => {
    removeClipboardStub()
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })
    const onSuccess = vi.fn()
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'legacy text'" @copy-success="onSuccess">Copy</button>`,
      () => ({ onSuccess })
    )
    await wrapper.trigger('click')
    await flushPromises()
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(onSuccess).toHaveBeenCalledTimes(1)
    delete (document as unknown as Record<string, unknown>).execCommand
  })

  it('dispatches copy-error when all copy strategies fail', async () => {
    removeClipboardStub()
    const execCommand = vi.fn(() => {
      throw new Error('denied')
    })
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })
    const onError = vi.fn()
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'nope'" @copy-error="onError">Copy</button>`,
      () => ({ onError })
    )
    await wrapper.trigger('click')
    await flushPromises()
    expect(onError).toHaveBeenCalledTimes(1)
    const event = onError.mock.calls[0][0] as CustomEvent
    expect(event.detail).toEqual({ text: 'nope' })
    delete (document as unknown as Record<string, unknown>).execCommand
  })

  it('copies the updated value after re-render (handler reads the live store)', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const Host = defineComponent({
      directives: { copy: ZcCopyDirective },
      props: { text: { type: String, required: true } },
      template: `<button v-copy="text">Copy</button>`,
    })
    const wrapper = mount(Host, { props: { text: 'v1' } })
    await wrapper.setProps({ text: 'v2' })
    await wrapper.trigger('click')
    await flushPromises()
    // The click handler reads el.__zcCopy.value, which the `updated` hook
    // refreshes — so re-renders take effect instead of copying a stale value.
    expect(writeText).toHaveBeenCalledWith('v2')
    expect((wrapper.element as unknown as { __zcCopy?: { value: string } }).__zcCopy?.value).toBe(
      'v2'
    )
  })

  it('removes the click listener on unmount', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    stubClipboard(writeText)
    const wrapper = mountWithDirectives(
      { copy: ZcCopyDirective },
      `<button v-copy="'after unmount'">Copy</button>`
    )
    const el = wrapper.element
    wrapper.unmount()
    el.dispatchEvent(new MouseEvent('click'))
    await flushPromises()
    expect(writeText).not.toHaveBeenCalled()
  })
})

/* ------------------------------------------------------------------ *
 * v-debounce
 * ------------------------------------------------------------------ */

describe('v-debounce directive', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('delays the callback by 300ms by default and fires once', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce="fn">Click</button>`,
      () => ({ fn })
    )
    const btn = wrapper.find('button')
    await btn.trigger('click')
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes the triggering event to the callback', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce="fn">Click</button>`,
      () => ({ fn })
    )
    await wrapper.find('button').trigger('click')
    vi.advanceTimersByTime(300)
    expect(fn.mock.calls[0][0]).toBeInstanceOf(Event)
    expect((fn.mock.calls[0][0] as Event).type).toBe('click')
  })

  it('collapses multiple rapid clicks into a single call', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce="fn">Click</button>`,
      () => ({ fn })
    )
    const btn = wrapper.find('button')
    await btn.trigger('click')
    await btn.trigger('click')
    await btn.trigger('click')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('resets the timer on each new click', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce="fn">Click</button>`,
      () => ({ fn })
    )
    const btn = wrapper.find('button')
    await btn.trigger('click')
    vi.advanceTimersByTime(200)
    // Second click restarts the 300ms window
    await btn.trigger('click')
    vi.advanceTimersByTime(200)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('supports a custom delay via the directive argument', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce:500="fn">Click</button>`,
      () => ({ fn })
    )
    await wrapper.find('button').trigger('click')
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
    vi.advanceTimersByTime(200)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('listens on a custom event via the .input modifier', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<input v-debounce.input="fn" />`,
      () => ({ fn })
    )
    const input = wrapper.find('input')
    await input.trigger('click')
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
    await input.trigger('input')
    vi.advanceTimersByTime(300)
    expect(fn).toHaveBeenCalledTimes(1)
    expect((fn.mock.calls[0][0] as Event).type).toBe('input')
  })

  it('cancels a pending invocation on unmount', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<button v-debounce="fn">Click</button>`,
      () => ({ fn })
    )
    await wrapper.trigger('click')
    // Unmount before the delay elapses — the pending timer must be cleared.
    wrapper.unmount()
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })

  it('removes the listener for the configured event on unmount', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const wrapper = mountWithDirectives(
      { debounce: ZcDebounceDirective },
      `<input v-debounce.input="fn" />`,
      () => ({ fn })
    )
    const input = wrapper.find('input')
    wrapper.unmount()
    // After unmount the 'input' event listener must be gone (previously only
    // the 'click' listener was removed, so debounced inputs kept firing).
    await input.trigger('input')
    vi.advanceTimersByTime(300)
    expect(fn).not.toHaveBeenCalled()
  })
})
