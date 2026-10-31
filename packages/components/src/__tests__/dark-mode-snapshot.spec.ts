import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { applyDarkMode } from '@zc-ui/theme'

import Title from '../typography/title.vue'
import Text from '../typography/text.vue'
import Link from '../typography/link.vue'
import Paragraph from '../typography/paragraph.vue'
import FloatButton from '../float-button/float-button.vue'
import FloatButtonGroup from '../float-button/float-button-group.vue'
import Calendar from '../calendar/calendar.vue'
import ErrorBoundary from '../error-boundary/error-boundary.vue'
import Card from '../card/card.vue'
import Comment from '../comment/comment.vue'
import Divider from '../divider/divider.vue'
import Spin from '../spin/spin.vue'
import StatisticCard from '../statistic-card/statistic-card.vue'
import InputOTP from '../input-otp/input-otp.vue'
import Splitter from '../splitter/splitter.vue'
import TextEllipsis from '../text-ellipsis/text-ellipsis.vue'

/**
 * Dark mode snapshot regression tests.
 *
 * Verifies that applyDarkMode(true) toggles .dark class on the root element,
 * and that all components previously using non-.dark selectors now respond
 * correctly to the unified .dark class convention.
 */

afterEach(() => {
  document.documentElement.classList.remove('dark')
  document.documentElement.removeAttribute('data-theme')
  document.documentElement.removeAttribute('data-mode')
})

describe('Dark mode: applyDarkMode()', () => {
  it('adds .dark class when isDark=true', () => {
    applyDarkMode(true)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes .dark class when isDark=false', () => {
    applyDarkMode(true)
    applyDarkMode(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('cleans up legacy data-theme="dark" attribute', () => {
    document.documentElement.setAttribute('data-theme', 'dark')
    applyDarkMode(true)
    expect(document.documentElement.getAttribute('data-theme')).toBeNull()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('cleans up legacy data-mode="dark" attribute', () => {
    document.documentElement.setAttribute('data-mode', 'dark')
    applyDarkMode(true)
    expect(document.documentElement.getAttribute('data-mode')).toBeNull()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('works with custom target element', () => {
    const div = document.createElement('div')
    applyDarkMode(true, div)
    expect(div.classList.contains('dark')).toBe(true)
    applyDarkMode(false, div)
    expect(div.classList.contains('dark')).toBe(false)
  })
})

/**
 * Component snapshot tests under .dark mode.
 *
 * Each test mounts the component inside a .dark container and snapshots
 * the rendered HTML. Since jsdom doesn't process CSS, these snapshots
 * capture the component structure and class names — verifying that
 * components mount without errors under .dark and that no legacy
 * selector patterns leak into the rendered output.
 */
function mountInDark(component: any, options: Parameters<typeof mount>[1] = {}) {
  const wrapper = mount(component, {
    ...options,
    attachTo: document.body,
  })
  // Apply .dark to the document element (simulating applyDarkMode)
  document.documentElement.classList.add('dark')
  return wrapper
}

describe('Dark mode: component snapshots', () => {
  it('Title renders correctly under .dark', () => {
    const wrapper = mountInDark(Title, { props: { level: 1 } })
    expect(wrapper.classes()).toContain('zc-title')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Title level-5 renders correctly under .dark', () => {
    const wrapper = mountInDark(Title, { props: { level: 5 } })
    expect(wrapper.classes()).toContain('zc-title--level-5')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Text renders correctly under .dark', () => {
    const wrapper = mountInDark(Text, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('zc-text')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Text with all types renders under .dark', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info'] as const
    const wrappers = types.map((type) => mountInDark(Text, { props: { type } }))
    const html = wrappers.map((w) => w.html()).join('\n')
    expect(html).toMatchSnapshot()
    wrappers.forEach((w) => w.unmount())
  })

  it('Link renders correctly under .dark', () => {
    const wrapper = mountInDark(Link, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('zc-link')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Link with all types renders under .dark', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info'] as const
    const wrappers = types.map((type) => mountInDark(Link, { props: { type } }))
    const html = wrappers.map((w) => w.html()).join('\n')
    expect(html).toMatchSnapshot()
    wrappers.forEach((w) => w.unmount())
  })

  it('Paragraph renders correctly under .dark', () => {
    const wrapper = mountInDark(Paragraph, { slots: { default: 'Dark mode paragraph text' } })
    expect(wrapper.classes()).toContain('zc-paragraph')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('FloatButton renders correctly under .dark', () => {
    const wrapper = mountInDark(FloatButton)
    const el = document.body.querySelector('.zc-float-button')
    expect(el).not.toBeNull()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('FloatButtonGroup renders correctly under .dark', () => {
    const wrapper = mountInDark(FloatButtonGroup)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Calendar renders correctly under .dark', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 15))
    const wrapper = mountInDark(Calendar)
    expect(wrapper.classes()).toContain('zc-calendar')
    expect(wrapper.html()).toMatchSnapshot()
    vi.useRealTimers()
  })

  it('ErrorBoundary renders correctly under .dark', () => {
    const NormalChild = defineComponent({
      name: 'NormalChild',
      render() {
        return h('p', { class: 'normal-content' }, 'Hello from child')
      },
    })
    const wrapper = mountInDark(ErrorBoundary, {
      slots: { default: h(NormalChild) },
    })
    expect(wrapper.find('.normal-content').exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('ErrorBoundary error state renders correctly under .dark', async () => {
    const ThrowingChild = defineComponent({
      name: 'ThrowingChild',
      setup() {
        throw new Error('Test error from child')
      },
      render() {
        return h('div', 'should not render')
      },
    })
    const wrapper = mountInDark(ErrorBoundary, {
      slots: { default: h(ThrowingChild) },
      global: {
        config: {
          errorHandler: () => {},
        },
      },
    })
    await flushPromises()
    expect(wrapper.find('.zc-error-boundary').exists()).toBe(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Card renders correctly under .dark', () => {
    const wrapper = mountInDark(Card, { slots: { default: 'Card content in dark mode' } })
    expect(wrapper.classes()).toContain('zc-card')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Comment renders correctly under .dark', () => {
    const wrapper = mountInDark(Comment, {
      props: { author: 'Test', content: 'Dark mode comment' },
    })
    expect(wrapper.classes()).toContain('zc-comment')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Divider renders correctly under .dark', () => {
    const wrapper = mountInDark(Divider)
    expect(wrapper.classes()).toContain('zc-divider')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Spin renders correctly under .dark', () => {
    const wrapper = mountInDark(Spin)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('StatisticCard renders correctly under .dark', () => {
    const wrapper = mountInDark(StatisticCard, {
      props: { title: 'Revenue', value: 9999 },
    })
    expect(wrapper.classes()).toContain('zc-statistic-card')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('InputOTP renders correctly under .dark', () => {
    const wrapper = mountInDark(InputOTP)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Splitter renders correctly under .dark', () => {
    const wrapper = mountInDark(Splitter, {
      slots: {
        default: () => [h('div', 'Panel 1'), h('div', 'Panel 2')],
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('TextEllipsis renders correctly under .dark', () => {
    const wrapper = mountInDark(TextEllipsis, {
      props: { text: 'A very long text that should be ellipsized in dark mode' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

/**
 * Verify that no component output contains legacy dark mode selectors
 * in inline styles or data attributes.
 */
describe('Dark mode: no legacy selectors in rendered output', () => {
  it('no component renders data-theme="dark"', () => {
    const components = [
      { comp: Title, props: { level: 1 } },
      { comp: Text, props: { type: 'primary' } },
      { comp: Link, props: { type: 'primary' } },
      { comp: Card },
      { comp: Divider },
      { comp: Comment, props: { author: 'A', content: 'C' } },
    ]
    for (const { comp, props } of components) {
      const wrapper = mountInDark(comp, { props })
      expect(wrapper.html()).not.toContain("data-theme='dark'")
      expect(wrapper.html()).not.toContain('data-theme="dark"')
      wrapper.unmount()
    }
  })

  it('no component renders data-mode="dark"', () => {
    const components = [{ comp: Title, props: { level: 1 } }, { comp: Calendar }, { comp: Card }]
    for (const { comp, props } of components) {
      const wrapper = mountInDark(comp, { props })
      expect(wrapper.html()).not.toContain("data-mode='dark'")
      expect(wrapper.html()).not.toContain('data-mode="dark"')
      wrapper.unmount()
    }
  })
})
