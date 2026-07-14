import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Affix from '../affix/affix.vue'

describe('ZcAffix', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders with default props', () => {
    const wrapper = mount(Affix, {
      slots: { default: '<div>Affix content</div>' },
    })
    expect(wrapper.classes()).toContain('zc-affix')
    expect(wrapper.text()).toContain('Affix content')
  })

  it('renders slot content', () => {
    const wrapper = mount(Affix, {
      slots: { default: '<button>Fixed Button</button>' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('does not apply fixed style initially', () => {
    const wrapper = mount(Affix, {
      slots: { default: '<div>Content</div>' },
    })
    const fixedDiv = wrapper.find('.zc-affix > div')
    expect(fixedDiv.classes()).not.toContain('zc-affix--fixed')
  })

  it('emits scroll event on scroll', async () => {
    const wrapper = mount(Affix, {
      props: { offset: 100 },
      slots: { default: '<div>Content</div>' },
    })
    // Simulate scroll
    Object.defineProperty(window, 'pageYOffset', {
      writable: true,
      configurable: true,
      value: 150,
    })
    window.dispatchEvent(new Event('scroll'))
    expect(wrapper.emitted('scroll')).toBeTruthy()
  })
})
