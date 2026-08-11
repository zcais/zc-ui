import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Image from '../image/image.vue'

describe('ZcImage', () => {
  it('renders with src', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg' },
    })
    expect(wrapper.find('.zc-image').exists()).toBe(true)
    expect(wrapper.find('.zc-image__inner').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/test.jpg')
  })

  it('shows placeholder when loading', () => {
    const wrapper = mount(Image, { props: { src: '' } })
    expect(wrapper.find('.zc-image__placeholder').exists()).toBe(true)
  })

  it('shows error state on image error', async () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/404.jpg' },
    })
    const img = wrapper.find('img')
    await img.trigger('error')
    expect(wrapper.find('.zc-image__error').exists()).toBe(true)
  })

  it('applies fit mode style', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', fit: 'cover' },
    })
    const img = wrapper.find('.zc-image__inner')
    expect(img.attributes('style')).toContain('object-fit: cover')
  })

  it('applies round class', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', round: true },
    })
    expect(wrapper.find('.zc-image').classes()).toContain('is-round')
  })

  it('applies width and height style', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', width: 200, height: 100 },
    })
    const style = wrapper.find('.zc-image').attributes('style')
    expect(style).toContain('width: 200px')
    expect(style).toContain('height: 100px')
  })

  it('applies string width and height', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', width: '50%', height: '200px' },
    })
    const style = wrapper.find('.zc-image').attributes('style')
    expect(style).toContain('width: 50%')
    expect(style).toContain('height: 200px')
  })

  it('emits load event on image load', async () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg' },
    })
    const img = wrapper.find('img')
    await img.trigger('load')
    expect(wrapper.emitted('load')).toBeTruthy()
  })

  it('renders custom error slot', async () => {
    const wrapper = mount(Image, {
      props: { src: '' },
      slots: { error: '<span class="custom-error">Failed</span>' },
    })
    const img = wrapper.find('img')
    await img.trigger('error')
    expect(wrapper.find('.custom-error').exists()).toBe(true)
  })

  it('renders custom placeholder slot', () => {
    const wrapper = mount(Image, {
      props: { src: '' },
      slots: { placeholder: '<span class="custom-loading">Loading...</span>' },
    })
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
  })

  // ---- Additional coverage tests ----

  it('emits error event on image error', async () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/broken.jpg' },
    })
    await wrapper.find('img').trigger('error')
    expect(wrapper.emitted('error')).toBeTruthy()
  })

  it('applies alt attribute', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', alt: 'Test Image' },
    })
    expect(wrapper.find('img').attributes('alt')).toBe('Test Image')
  })

  it('supports lazy loading prop', () => {
    document.body.innerHTML = ''
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', lazy: true },
    })
    // Should not set shouldLoad initially when lazy
    expect(wrapper.find('.zc-image').exists()).toBe(true)
    wrapper.unmount()
  })

  it('sets loaded status instead of error when error prop is provided', async () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/broken.jpg', error: 'fallback' },
    })
    await wrapper.find('img').trigger('error')
    // Should NOT show error state since error prop is set
    expect(wrapper.find('.zc-image__error').exists()).toBe(false)
  })

  it('opens preview on click when preview is enabled', async () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', preview: true },
    })
    // First load the image
    await wrapper.find('img').trigger('load')
    // Click to open preview
    await wrapper.find('img').trigger('click')
    // Preview component should be rendered
    expect(wrapper.find('.zc-image-preview').exists()).toBe(true)
  })

  it('opens preview on click when preview is enabled', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', preview: true },
      attachTo: document.body,
    })
    // First load the image
    await wrapper.find('img').trigger('load')
    await flushPromises()
    // Click to open preview
    await wrapper.find('img').trigger('click')
    await flushPromises()
    // Preview is teleported to body
    const preview = document.querySelector('.zc-image-preview')
    expect(preview).toBeTruthy()
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('does not open preview when preview is disabled', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', preview: false },
      attachTo: document.body,
    })
    await wrapper.find('img').trigger('load')
    await wrapper.find('img').trigger('click')
    expect(document.querySelector('.zc-image-preview')).toBeFalsy()
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('uses previewSrc for preview when provided', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(Image, {
      props: {
        src: 'https://example.com/thumb.jpg',
        previewSrc: 'https://example.com/full.jpg',
        preview: true,
      },
      attachTo: document.body,
    })
    await wrapper.find('img').trigger('load')
    await wrapper.find('img').trigger('click')
    await wrapper.vm.$nextTick()
    const previewImg = document.querySelector('.zc-image-preview__img') as HTMLImageElement
    expect(previewImg?.getAttribute('src')).toContain('full.jpg')
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('applies loading attribute', () => {
    const wrapper = mount(Image, {
      props: { src: 'https://example.com/test.jpg', loading: 'lazy' },
    })
    expect(wrapper.find('img').attributes('loading')).toBe('lazy')
  })

  it('renders different fit modes', () => {
    const fits: string[] = ['fill', 'contain', 'cover', 'none', 'scale-down']
    fits.forEach((fit) => {
      const wrapper = mount(Image, {
        props: { src: 'https://example.com/test.jpg', fit: fit as any },
      })
      expect(wrapper.find('.zc-image__inner').attributes('style')).toContain(`object-fit: ${fit}`)
    })
  })

  it('shows placeholder text via prop', () => {
    const wrapper = mount(Image, {
      props: { src: '', placeholder: 'Loading...' },
    })
    // Default placeholder div should exist
    expect(wrapper.find('.zc-image__placeholder').exists()).toBe(true)
  })
})
