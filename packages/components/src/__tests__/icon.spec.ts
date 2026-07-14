import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Icon from '../icon/icon.vue'

describe('ZcIcon', () => {
  it('renders with default props', () => {
    const wrapper = mount(Icon)
    expect(wrapper.classes()).toContain('zc-icon')
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('applies size prop as number', () => {
    const wrapper = mount(Icon, { props: { size: 24 } })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('width: 24px')
    expect(style).toContain('height: 24px')
  })

  it('applies size prop as string', () => {
    const wrapper = mount(Icon, { props: { size: '2em' } })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('width: 2em')
    expect(style).toContain('height: 2em')
  })

  it('applies color prop', () => {
    const wrapper = mount(Icon, { props: { color: '#ff0000' } })
    const style = wrapper.attributes('style') || ''
    expect(style).toContain('color') // jsdom may convert hex to rgb
    expect(style).not.toContain('color: ;')
  })

  it('renders path from name prop', () => {
    const testPath = 'M12 2L2 22h20L12 2z'
    const wrapper = mount(Icon, { props: { name: testPath } })
    const path = wrapper.find('svg path')
    expect(path.attributes('d')).toBe(testPath)
  })

  it('renders path from path prop (takes priority over name)', () => {
    const wrapper = mount(Icon, {
      props: { name: 'M1', path: 'M2' },
    })
    const path = wrapper.find('svg path')
    expect(path.attributes('d')).toBe('M2')
  })

  it('applies custom viewBox', () => {
    const wrapper = mount(Icon, {
      props: { viewBox: '0 0 32 32' },
    })
    const svg = wrapper.find('svg')
    expect(svg.attributes('viewBox')).toBe('0 0 32 32')
  })

  it('renders slot content when no path/name', () => {
    const wrapper = mount(Icon, {
      slots: { default: '<circle cx="12" cy="12" r="6" />' },
    })
    expect(wrapper.find('svg circle').exists()).toBe(true)
  })

  it('sets aria-hidden when no label', () => {
    const wrapper = mount(Icon)
    expect(wrapper.attributes('aria-hidden')).toBe('true')
  })

  it('sets role img and aria-label when label provided', () => {
    const wrapper = mount(Icon, { props: { label: 'Settings' } })
    expect(wrapper.attributes('role')).toBe('img')
    expect(wrapper.attributes('aria-label')).toBe('Settings')
  })
})
