import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Text from '../typography/text.vue'
import Title from '../typography/title.vue'
import Paragraph from '../typography/paragraph.vue'
import Link from '../typography/link.vue'

// Mock clipboard API for copy functionality
beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(true),
      readText: vi.fn().mockResolvedValue(''),
    },
    configurable: true,
    writable: true,
  })
})

// ============================================================
// ZcText
// ============================================================
describe('ZcText', () => {
  it('renders with default props', () => {
    const wrapper = mount(Text)
    expect(wrapper.classes()).toContain('zc-text')
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('renders slot content', () => {
    const wrapper = mount(Text, { slots: { default: 'Hello World' } })
    expect(wrapper.text()).toContain('Hello World')
  })

  // ---- Type ----
  it('does not add type class for default type', () => {
    const wrapper = mount(Text)
    expect(wrapper.classes()).not.toContain('zc-text--default')
  })

  it.each([
    ['primary', 'zc-text--primary'],
    ['success', 'zc-text--success'],
    ['warning', 'zc-text--warning'],
    ['danger', 'zc-text--danger'],
    ['info', 'zc-text--info'],
  ] as const)('applies %s type class', (type, expected) => {
    const wrapper = mount(Text, { props: { type } })
    expect(wrapper.classes()).toContain(expected)
  })

  // ---- Size ----
  it('does not add size class for inherit (default)', () => {
    const wrapper = mount(Text)
    expect(wrapper.classes()).not.toContain('zc-text--inherit')
  })

  it.each([
    ['sm', 'zc-text--sm'],
    ['base', 'zc-text--base'],
    ['lg', 'zc-text--lg'],
    ['xl', 'zc-text--xl'],
  ] as const)('applies %s size class', (size, expected) => {
    const wrapper = mount(Text, { props: { size } })
    expect(wrapper.classes()).toContain(expected)
  })

  // ---- Truncated ----
  it('applies truncated class when truncated is true', () => {
    const wrapper = mount(Text, { props: { truncated: true } })
    expect(wrapper.classes()).toContain('is-truncated')
  })

  it('does not apply truncated class by default', () => {
    const wrapper = mount(Text)
    expect(wrapper.classes()).not.toContain('is-truncated')
  })

  // ---- Strong ----
  it('applies strong class when strong is true', () => {
    const wrapper = mount(Text, { props: { strong: true } })
    expect(wrapper.classes()).toContain('is-strong')
  })

  // ---- Italic ----
  it('applies italic class when italic is true', () => {
    const wrapper = mount(Text, { props: { italic: true } })
    expect(wrapper.classes()).toContain('is-italic')
  })

  // ---- Code ----
  it('renders as code element when code is true', () => {
    const wrapper = mount(Text, { props: { code: true } })
    expect(wrapper.element.tagName).toBe('CODE')
    expect(wrapper.classes()).toContain('zc-text')
  })

  it('renders as span element when code is false (default)', () => {
    const wrapper = mount(Text)
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  // ---- Combined props ----
  it('applies multiple style props simultaneously', () => {
    const wrapper = mount(Text, {
      props: { type: 'primary', size: 'lg', strong: true, italic: true },
    })
    expect(wrapper.classes()).toContain('zc-text--primary')
    expect(wrapper.classes()).toContain('zc-text--lg')
    expect(wrapper.classes()).toContain('is-strong')
    expect(wrapper.classes()).toContain('is-italic')
  })
})

// ============================================================
// ZcTitle
// ============================================================
describe('ZcTitle', () => {
  it('renders with default props as h1', () => {
    const wrapper = mount(Title)
    expect(wrapper.classes()).toContain('zc-title')
    expect(wrapper.element.tagName).toBe('H1')
    expect(wrapper.classes()).toContain('zc-title--level-1')
  })

  it('renders slot content', () => {
    const wrapper = mount(Title, { slots: { default: 'Page Title' } })
    expect(wrapper.find('.zc-title__content').text()).toContain('Page Title')
  })

  // ---- Level ----
  it.each([1, 2, 3, 4, 5])('renders as h%s with correct level class', (level) => {
    const wrapper = mount(Title, { props: { level } })
    expect(wrapper.element.tagName).toBe(`H${level}`)
    expect(wrapper.classes()).toContain(`zc-title--level-${level}`)
  })

  // ---- Copyable ----
  it('does not show copy button by default', () => {
    const wrapper = mount(Title)
    expect(wrapper.find('.zc-title__copy').exists()).toBe(false)
  })

  it('shows copy button when copyable is true', () => {
    const wrapper = mount(Title, { props: { copyable: true } })
    expect(wrapper.find('.zc-title__copy').exists()).toBe(true)
  })

  it('emits copy event with text when copy button is clicked', async () => {
    const wrapper = mount(Title, {
      props: { copyable: true, copyText: 'Hello' },
    })
    await wrapper.find('.zc-title__copy').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
    expect(wrapper.emitted('copy')![0]).toEqual(['Hello'])
  })

  it('falls back to textContent when copyText is not provided', async () => {
    const wrapper = mount(Title, {
      props: { copyable: true },
      slots: { default: 'Title from slot' },
    })
    await wrapper.find('.zc-title__copy').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
    expect(wrapper.emitted('copy')![0]).toEqual(['Title from slot'])
  })
})

// ============================================================
// ZcParagraph
// ============================================================
describe('ZcParagraph', () => {
  it('renders with default props', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.classes()).toContain('zc-paragraph')
    expect(wrapper.find('.zc-paragraph__content').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(Paragraph, { slots: { default: 'Long text content...' } })
    expect(wrapper.find('.zc-paragraph__content').text()).toContain('Long text content...')
  })

  // ---- Ellipsis ----
  it('applies ellipsis class when ellipsis is true', () => {
    const wrapper = mount(Paragraph, { props: { ellipsis: true } })
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  it('does not apply ellipsis class when ellipsis is false', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.classes()).not.toContain('is-ellipsis')
  })

  it('applies ellipsis class with config object', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2 } },
    })
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  it('applies -webkit-line-clamp style for ellipsis', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 3 } },
    })
    const content = wrapper.find('.zc-paragraph__content')
    expect(content.attributes('style')).toContain('-webkit-line-clamp')
    expect(content.attributes('style')).toContain('3')
  })

  // ---- Expandable ----
  it('shows expand button when ellipsis expandable is true', () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: true } },
    })
    expect(wrapper.find('.zc-paragraph__expand').exists()).toBe(true)
    expect(wrapper.find('.zc-paragraph__expand').text()).toContain('展开')
  })

  it('toggles expanded state when expand button is clicked', async () => {
    const wrapper = mount(Paragraph, {
      props: { ellipsis: { rows: 2, expandable: true } },
    })
    expect(wrapper.classes()).toContain('is-ellipsis')

    await wrapper.find('.zc-paragraph__expand').trigger('click')
    expect(wrapper.classes()).not.toContain('is-ellipsis')
    expect(wrapper.find('.zc-paragraph__expand').text()).toContain('收起')

    await wrapper.find('.zc-paragraph__expand').trigger('click')
    expect(wrapper.classes()).toContain('is-ellipsis')
  })

  // ---- Copyable ----
  it('shows copy button when copyable is true', () => {
    const wrapper = mount(Paragraph, { props: { copyable: true } })
    expect(wrapper.find('.zc-paragraph__copy').exists()).toBe(true)
  })

  it('does not show copy button by default', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.find('.zc-paragraph__copy').exists()).toBe(false)
  })

  it('emits copy event when copy button is clicked', async () => {
    const wrapper = mount(Paragraph, {
      props: { copyable: true, copyText: 'Test content' },
    })
    await wrapper.find('.zc-paragraph__copy').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
    expect(wrapper.emitted('copy')![0]).toEqual(['Test content'])
  })

  // ---- Editable ----
  it('shows edit button when editable is true', () => {
    const wrapper = mount(Paragraph, { props: { editable: true } })
    expect(wrapper.find('.zc-paragraph__edit').exists()).toBe(true)
  })

  it('does not show edit button by default', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.find('.zc-paragraph__edit').exists()).toBe(false)
  })

  it('enters edit mode when edit button is clicked', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Editable text' },
    })
    expect(wrapper.classes()).not.toContain('is-editing')

    await wrapper.find('.zc-paragraph__edit').trigger('click')
    expect(wrapper.classes()).toContain('is-editing')
    expect(wrapper.find('.zc-paragraph__editor').exists()).toBe(true)
    expect(wrapper.emitted('edit-start')).toBeTruthy()
  })

  it('emits edit-end with value when confirm is clicked', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Original' },
    })
    await wrapper.find('.zc-paragraph__edit').trigger('click')
    await wrapper.find('.zc-paragraph__edit-confirm').trigger('click')
    expect(wrapper.emitted('edit-end')).toBeTruthy()
    expect(wrapper.emitted('edit-end')![0]).toEqual(['Original', false])
    expect(wrapper.classes()).not.toContain('is-editing')
  })

  it('exits edit mode without changing when cancel is clicked', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Original' },
    })
    await wrapper.find('.zc-paragraph__edit').trigger('click')
    await wrapper.find('.zc-paragraph__edit-cancel').trigger('click')
    expect(wrapper.emitted('edit-end')).toBeTruthy()
    expect(wrapper.classes()).not.toContain('is-editing')
  })

  it('emits original value and cancelled=true when edit is cancelled', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Original' },
    })
    await wrapper.find('.zc-paragraph__edit').trigger('click')
    // Simulate user typing something before cancelling
    const editor = wrapper.find('.zc-paragraph__editor')
    await editor.setValue('User typed this')
    // Cancel
    await wrapper.find('.zc-paragraph__edit-cancel').trigger('click')
    const events = wrapper.emitted('edit-end')
    expect(events).toBeTruthy()
    expect(events![0][0]).toBe('Original') // original value, NOT the typed text
    expect(events![0][1]).toBe(true) // cancelled = true
  })

  it('emits edited value and cancelled=false when edit is confirmed', async () => {
    const wrapper = mount(Paragraph, {
      props: { editable: true },
      slots: { default: 'Original' },
    })
    await wrapper.find('.zc-paragraph__edit').trigger('click')
    const editor = wrapper.find('.zc-paragraph__editor')
    await editor.setValue('New value')
    await wrapper.find('.zc-paragraph__edit-confirm').trigger('click')
    const events = wrapper.emitted('edit-end')
    expect(events).toBeTruthy()
    expect(events![0][0]).toBe('New value')
    expect(events![0][1]).toBe(false) // cancelled = false
  })

  // ---- Copyable textContent fallback ----
  it('falls back to textContent when copyText is not provided', async () => {
    const wrapper = mount(Paragraph, {
      props: { copyable: true },
      slots: { default: 'Paragraph from slot' },
    })
    await wrapper.find('.zc-paragraph__copy').trigger('click')
    expect(wrapper.emitted('copy')).toBeTruthy()
    expect(wrapper.emitted('copy')![0]).toEqual(['Paragraph from slot'])
  })

  // ---- Multi-feature combination ----
  it('renders ellipsis + copyable + editable simultaneously', () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: { rows: 2, expandable: true },
        copyable: true,
        editable: true,
      },
      slots: { default: 'Combined features text' },
    })
    expect(wrapper.classes()).toContain('is-ellipsis')
    expect(wrapper.find('.zc-paragraph__expand').exists()).toBe(true)
    expect(wrapper.find('.zc-paragraph__copy').exists()).toBe(true)
    expect(wrapper.find('.zc-paragraph__edit').exists()).toBe(true)
  })

  it('can enter edit mode from ellipsis + copyable + editable state', async () => {
    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: { rows: 2 },
        copyable: true,
        editable: true,
      },
      slots: { default: 'Combined features text' },
    })
    await wrapper.find('.zc-paragraph__edit').trigger('click')
    expect(wrapper.classes()).toContain('is-editing')
    expect(wrapper.find('.zc-paragraph__editor').exists()).toBe(true)
    expect(wrapper.emitted('edit-start')).toBeTruthy()
  })
})

// ============================================================
// ZcLink
// ============================================================
describe('ZcLink', () => {
  it('renders with default props as anchor', () => {
    const wrapper = mount(Link)
    expect(wrapper.classes()).toContain('zc-link')
    expect(wrapper.element.tagName).toBe('A')
  })

  it('renders slot content', () => {
    const wrapper = mount(Link, { slots: { default: 'Click me' } })
    expect(wrapper.text()).toContain('Click me')
  })

  // ---- Type ----
  it.each([
    ['primary', 'zc-link--primary'],
    ['success', 'zc-link--success'],
    ['warning', 'zc-link--warning'],
    ['danger', 'zc-link--danger'],
    ['info', 'zc-link--info'],
  ] as const)('applies %s type class', (type, expected) => {
    const wrapper = mount(Link, { props: { type } })
    expect(wrapper.classes()).toContain(expected)
  })

  it('does not add type class for default', () => {
    const wrapper = mount(Link)
    expect(wrapper.classes()).not.toContain('zc-link--default')
  })

  // ---- Underline ----
  it('applies underline class when underline is true', () => {
    const wrapper = mount(Link, { props: { underline: true } })
    expect(wrapper.classes()).toContain('is-underline')
  })

  it('does not apply underline class by default', () => {
    const wrapper = mount(Link)
    expect(wrapper.classes()).not.toContain('is-underline')
  })

  // ---- Disabled ----
  it('applies disabled class when disabled is true', () => {
    const wrapper = mount(Link, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('removes href when disabled is true', () => {
    const wrapper = mount(Link, {
      props: { disabled: true, href: 'https://example.com' },
    })
    expect(wrapper.attributes('href')).toBeUndefined()
  })

  it('sets tabindex to -1 when disabled', () => {
    const wrapper = mount(Link, { props: { disabled: true } })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('sets aria-disabled when disabled', () => {
    const wrapper = mount(Link, { props: { disabled: true } })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  // ---- href / target ----
  it('passes href attribute', () => {
    const wrapper = mount(Link, { props: { href: 'https://example.com' } })
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('passes target attribute', () => {
    const wrapper = mount(Link, {
      props: { href: '#', target: '_blank' },
    })
    expect(wrapper.attributes('target')).toBe('_blank')
  })

  // ---- Click ----
  it('emits click event on click', async () => {
    const wrapper = mount(Link)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(Link, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
