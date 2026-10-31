import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CodeBlock from '../code-block/code-block.vue'

describe('ZcCodeBlock', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders root element and code content', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'const a = 1', language: 'javascript' } })
    expect(wrapper.find('.zc-code-block').exists()).toBe(true)
    expect(wrapper.find('.zc-code-block__pre').text()).toContain('const a = 1')
  })

  it('renders header with dots by default', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'x' } })
    expect(wrapper.find('.zc-code-block__header').exists()).toBe(true)
    expect(wrapper.find('.zc-code-block__dot--red').exists()).toBe(true)
    expect(wrapper.find('.zc-code-block__dot--yellow').exists()).toBe(true)
    expect(wrapper.find('.zc-code-block__dot--green').exists()).toBe(true)
  })

  it('hides header when showHeader is false', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'x', showHeader: false } })
    expect(wrapper.find('.zc-code-block__header').exists()).toBe(false)
  })

  it('shows language label and applies correct label text', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: 'x', language: 'typescript', showLanguage: true },
    })
    expect(wrapper.find('.zc-code-block__language').text()).toBe('TypeScript')
  })

  it('hides language label when showLanguage is false', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'x', language: 'js', showLanguage: false } })
    expect(wrapper.find('.zc-code-block__language').exists()).toBe(false)
  })

  it('applies dark theme modifier class and is-dark on code area', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'x', theme: 'dark' } })
    expect(wrapper.find('.zc-code-block').classes()).toContain('zc-code-block--dark')
    expect(wrapper.find('.zc-code-block__code').classes()).toContain('is-dark')
  })

  it('highlights javascript keywords and strings with token classes', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: 'const msg = "hello"', language: 'javascript' },
    })
    expect(wrapper.find('.tok-keyword').text()).toBe('const')
    expect(wrapper.find('.tok-string').text()).toBe('"hello"')
  })

  it('does not add token classes for unknown language', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'const x = 1', language: 'text' } })
    expect(wrapper.find('.tok-keyword').exists()).toBe(false)
    expect(wrapper.find('.tok-string').exists()).toBe(false)
  })

  it('shows line numbers starting from startLineNumber', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: 'line1\nline2\nline3', showLineNumbers: true, startLineNumber: 10 },
    })
    const numbers = wrapper.findAll('.zc-code-block__line-number')
    expect(numbers).toHaveLength(3)
    expect(numbers[0].text()).toBe('10')
    expect(numbers[1].text()).toBe('11')
    expect(numbers[2].text()).toBe('12')
  })

  it('hides line numbers by default', () => {
    const wrapper = mount(CodeBlock, { props: { code: 'a\nb' } })
    expect(wrapper.find('.zc-code-block__line-numbers').exists()).toBe(false)
  })

  it('shows copy button by default and hides it when showCopy is false', () => {
    const withCopy = mount(CodeBlock, { props: { code: 'x' } })
    expect(withCopy.find('.zc-code-block__copy-btn').exists()).toBe(true)
    const withoutCopy = mount(CodeBlock, { props: { code: 'x', showCopy: false } })
    expect(withoutCopy.find('.zc-code-block__copy-btn').exists()).toBe(false)
  })

  it('applies fontSize and maxHeight styles to code container', () => {
    const wrapper = mount(CodeBlock, {
      props: { code: 'x', fontSize: 16, maxHeight: '200px' },
    })
    const codeEl = wrapper.find('.zc-code-block__code')
    expect(codeEl.attributes('style')).toContain('font-size: 16px')
    expect(codeEl.attributes('style')).toContain('max-height: 200px')
    expect(codeEl.attributes('style')).toContain('overflow: auto')
  })

  it('reads code from default slot when provided', () => {
    const wrapper = mount(CodeBlock, {
      props: { language: 'javascript' },
      slots: { default: 'let fromSlot = 2' },
    })
    expect(wrapper.text()).toContain('let fromSlot = 2')
    expect(wrapper.find('.tok-keyword').text()).toBe('let')
  })

  it('copies code via clipboard and emits copy event', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const wrapper = mount(CodeBlock, {
      props: { code: 'copy me', copyText: 'Copy', copiedText: 'Copied!' },
    })
    const btn = wrapper.find('.zc-code-block__copy-btn')
    expect(btn.text()).toContain('Copy')
    await btn.trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('copy me')
    expect(wrapper.emitted('copy')).toBeTruthy()
    expect(wrapper.emitted('copy')![0]).toEqual(['copy me'])
    expect(btn.classes()).toContain('is-copied')
    expect(btn.text()).toContain('Copied!')
  })

  it('resets copied state after 2 seconds', async () => {
    vi.useFakeTimers()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(window.navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const wrapper = mount(CodeBlock, {
      props: { code: 'x', copyText: 'Copy', copiedText: 'Copied!' },
    })
    await wrapper.find('.zc-code-block__copy-btn').trigger('click')
    await flushPromises()
    expect(wrapper.find('.zc-code-block__copy-btn').classes()).toContain('is-copied')
    vi.advanceTimersByTime(2000)
    await flushPromises()
    expect(wrapper.find('.zc-code-block__copy-btn').classes()).not.toContain('is-copied')
  })

  it('falls back to execCommand when clipboard is unavailable', async () => {
    // Ensure navigator.clipboard is not defined
    const desc = Object.getOwnPropertyDescriptor(window.navigator, 'clipboard')
    if (desc) delete (window.navigator as unknown as Record<string, unknown>).clipboard
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    })
    const wrapper = mount(CodeBlock, { props: { code: 'legacy copy', copyText: 'Copy' } })
    await wrapper.find('.zc-code-block__copy-btn').trigger('click')
    await flushPromises()
    expect(execCommand).toHaveBeenCalledWith('copy')
    // The fallback path shows copied feedback but does not emit the copy event
    expect(wrapper.find('.zc-code-block__copy-btn').classes()).toContain('is-copied')
    expect(wrapper.emitted('copy')).toBeFalsy()
    delete (document as unknown as Record<string, unknown>).execCommand
    if (desc) Object.defineProperty(window.navigator, 'clipboard', desc)
  })
})
