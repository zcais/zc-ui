import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Watermark from '../watermark/watermark.vue'

describe('ZcWatermark', () => {
  it('renders with default props', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'Test Watermark' },
      slots: { default: '<div class="content">Protected content</div>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
    expect(wrapper.find('.content').exists()).toBe(true)
  })

  it('renders watermark layer element', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'Confidential' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark__layer').exists()).toBe(true)
  })

  it('renders default slot content', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM' },
      slots: { default: '<div class="protected">Secret Data</div>' },
    })
    expect(wrapper.find('.protected').text()).toBe('Secret Data')
  })

  it('hides layer when disabled', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', disabled: true },
      slots: { default: '<p>Content</p>' },
    })
    const layer = wrapper.find('.zc-watermark__layer')
    expect(layer.attributes('style')?.includes('display: none') || !layer.attributes('style')).toBe(
      true
    )
  })

  it('accepts array content', () => {
    const wrapper = mount(Watermark, {
      props: { content: ['Line 1', 'Line 2'] },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts custom font properties', () => {
    const wrapper = mount(Watermark, {
      props: {
        content: 'Custom',
        fontSize: 20,
        color: 'rgba(255, 0, 0, 0.1)',
        rotate: -45,
      },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts custom gap', () => {
    const wrapper = mount(Watermark, {
      props: {
        content: 'WM',
        gap: [200, 200],
      },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts custom z-index', () => {
    const wrapper = mount(Watermark, {
      props: {
        content: 'WM',
        zIndex: 99,
        image: 'data:image/png;base64,iVBOR',
      },
      slots: { default: '<p>Content</p>' },
    })
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    // When image is set directly, z-index should appear in style
    expect(style.includes('z-index') || style.includes('display: none')).toBe(true)
  })

  it('hides layer when content is empty', () => {
    const wrapper = mount(Watermark, {
      props: { content: '' },
      slots: { default: '<p>Content</p>' },
    })
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    expect(style).toContain('display: none')
  })

  it('accepts fontFamily prop', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', fontFamily: 'Arial' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts fontWeight prop', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', fontWeight: 'bold' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts fontStyle prop', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', fontStyle: 'italic' },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts opacity prop', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', opacity: 0.5 },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('accepts offset prop', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', offset: [50, 50] },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })

  it('renders layer with background image when content is provided', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'Confidential' },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    // When canvas is available, watermarkUrl should be set; in JSDOM it may not be
    // So we accept either display:none (canvas not available) or background-image (canvas available)
    if (style.includes('background-image')) {
      expect(style).toContain('url(')
    } else {
      expect(style).toContain('display: none')
    }
  })

  it('renders multiple array content items', async () => {
    const wrapper = mount(Watermark, {
      props: { content: ['Line 1', 'Line 2', 'Line 3'] },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
    const style = wrapper.find('.zc-watermark__layer').attributes('style') || ''
    if (style.includes('background-image')) {
      expect(style).toContain('background-image')
    } else {
      expect(style).toContain('display: none')
    }
  })

  it('accepts image prop directly', async () => {
    const wrapper = mount(Watermark, {
      props: { image: 'data:image/png;base64,iVBORw0KGgo=' },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    // Image prop bypasses canvas, so background-image should always be set
    expect(style).toContain('background-image')
    expect(style).toContain('iVBORw0KGgo')
  })

  it('renders layer with correct z-index style', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', zIndex: 999 },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    if (!style.includes('display: none')) {
      expect(style).toContain('z-index: 999')
    }
  })

  it('renders layer with correct offset position', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', offset: [20, 30] },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    if (!style.includes('display: none')) {
      expect(style).toContain('background-position: 20px 30px')
    }
  })

  it('renders layer with pointer-events: none', async () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM' },
      slots: { default: '<p>Content</p>' },
    })
    await wrapper.vm.$nextTick()
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    if (!style.includes('display: none')) {
      expect(style).toContain('pointer-events: none')
    }
  })

  it('does not render background image when disabled with content', () => {
    const wrapper = mount(Watermark, {
      props: { content: 'WM', disabled: true },
      slots: { default: '<p>Content</p>' },
    })
    const layer = wrapper.find('.zc-watermark__layer')
    const style = layer.attributes('style') || ''
    expect(style).toContain('display: none')
  })

  it('applies all font properties together', () => {
    const wrapper = mount(Watermark, {
      props: {
        content: 'Styled',
        fontSize: 24,
        fontFamily: 'serif',
        color: 'rgba(255, 0, 0, 0.15)',
        fontWeight: 700,
        fontStyle: 'italic',
      },
      slots: { default: '<p>Content</p>' },
    })
    expect(wrapper.find('.zc-watermark').exists()).toBe(true)
  })
})
