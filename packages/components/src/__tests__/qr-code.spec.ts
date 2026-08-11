import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import QRCode from '../qr-code/qr-code.vue'

// Mock the 'qrcode' library
vi.mock('qrcode', () => ({
  default: {
    toCanvas: vi.fn(),
    toDataURL: vi.fn().mockResolvedValue('data:image/png;base64,mockQRCodeData'),
    toString: vi.fn().mockResolvedValue('<svg xmlns="http://www.w3.org/2000/svg"></svg>'),
    create: vi.fn(),
  },
}))

// Import the mocked module for assertions
import QRCodeLib from 'qrcode'

describe('ZcQRCode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  /* --------------------------- Rendering --------------------------- */

  it('renders the root element', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'https://example.com' },
    })
    expect(wrapper.find('.zc-qrcode').exists()).toBe(true)
  })

  it('applies size as width and height style', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', size: 200 },
    })
    const style = wrapper.find('.zc-qrcode').attributes('style')
    expect(style).toContain('width: 200px')
    expect(style).toContain('height: 200px')
  })

  it('renders canvas element when type is canvas (default)', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test' },
    })
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('renders svg container when type is svg', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', type: 'svg' },
    })
    await flushPromises()
    expect(wrapper.find('.zc-qrcode__svg').exists()).toBe(true)
  })

  it('renders img element when type is image', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', type: 'image' },
    })
    await flushPromises()
    const img = wrapper.find('.zc-qrcode__image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('data:image/png;base64,mockQRCodeData')
  })

  /* ------------------------- QR Generation ------------------------- */

  it('calls QRCode.toCanvas on mount', async () => {
    mount(QRCode, {
      props: { value: 'hello world' },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'hello world',
      expect.objectContaining({
        width: 160,
        errorCorrectionLevel: 'M',
      })
    )
  })

  it('passes custom color and background to options', async () => {
    mount(QRCode, {
      props: {
        value: 'colored',
        color: '#ff0000',
        background: '#00ff00',
      },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'colored',
      expect.objectContaining({
        color: { dark: '#ff0000', light: '#00ff00' },
      })
    )
  })

  it('passes error correction level', async () => {
    mount(QRCode, {
      props: { value: 'test', level: 'H' },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ errorCorrectionLevel: 'H' })
    )
  })

  it('passes margin based on includeMargin', async () => {
    mount(QRCode, {
      props: { value: 'test', includeMargin: true },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ margin: 2 })
    )
  })

  it('passes custom size', async () => {
    mount(QRCode, {
      props: { value: 'test', size: 300 },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ width: 300 })
    )
  })

  it('calls toString for svg type', async () => {
    mount(QRCode, {
      props: { value: 'svg-test', type: 'svg' },
    })
    await flushPromises()
    expect(QRCodeLib.toString).toHaveBeenCalledWith(
      'svg-test',
      expect.objectContaining({ type: 'svg' })
    )
  })

  it('calls toDataURL for image type', async () => {
    mount(QRCode, {
      props: { value: 'img-test', type: 'image' },
    })
    await flushPromises()
    expect(QRCodeLib.toDataURL).toHaveBeenCalledWith('img-test', expect.objectContaining({}))
  })

  /* ---------------------------- Events ----------------------------- */

  it('emits ready event on successful render', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test' },
    })
    await flushPromises()
    expect(wrapper.emitted('ready')).toBeTruthy()
  })

  it('emits error event when generation fails', async () => {
    vi.mocked(QRCodeLib.toCanvas).mockRejectedValueOnce(new Error('Too much data'))
    const wrapper = mount(QRCode, {
      props: { value: 'a'.repeat(10000) },
    })
    await flushPromises()
    expect(wrapper.emitted('error')).toBeTruthy()
    const errEvent = wrapper.emitted('error')!
    expect(errEvent[0][0]).toBeInstanceOf(Error)
    expect((errEvent[0][0] as Error).message).toBe('Too much data')
  })

  it('does not render when value is empty', async () => {
    const wrapper = mount(QRCode, {
      props: { value: '' },
    })
    await flushPromises()
    expect(QRCodeLib.toCanvas).not.toHaveBeenCalled()
    expect(wrapper.emitted('ready')).toBeFalsy()
  })

  /* --------------------------- Status ------------------------------ */

  it('does not show overlay when status is active', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'active' },
    })
    expect(wrapper.find('.zc-qrcode__overlay').exists()).toBe(false)
  })

  it('shows loading overlay when status is loading', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'loading' },
    })
    expect(wrapper.find('.zc-qrcode__loading').exists()).toBe(true)
    expect(wrapper.find('.zc-qrcode__spinner').exists()).toBe(true)
  })

  it('shows expired overlay when status is expired', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'expired' },
    })
    expect(wrapper.find('.zc-qrcode__expired').exists()).toBe(true)
    expect(wrapper.find('.zc-qrcode__expired-icon').exists()).toBe(true)
  })

  it('shows scanning overlay when status is scanning', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'scanning' },
    })
    expect(wrapper.find('.zc-qrcode__scanning').exists()).toBe(true)
    expect(wrapper.find('.zc-qrcode__scan-line').exists()).toBe(true)
  })

  it('supports custom loading slot', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'loading' },
      slots: {
        loading: '<div class="custom-loading">Please wait...</div>',
      },
    })
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
    expect(wrapper.find('.zc-qrcode__spinner').exists()).toBe(false)
  })

  it('supports custom expired slot', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'expired' },
      slots: {
        expired: '<div class="custom-expired">Code expired!</div>',
      },
    })
    expect(wrapper.find('.custom-expired').exists()).toBe(true)
  })

  it('supports custom scanning slot', () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', status: 'scanning' },
      slots: {
        scanning: '<div class="custom-scan">Scanning...</div>',
      },
    })
    expect(wrapper.find('.custom-scan').exists()).toBe(true)
  })

  /* --------------------------- Methods ----------------------------- */

  it('exposes refresh() method', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test' },
    })
    await flushPromises()
    vi.clearAllMocks()

    const vm = wrapper.vm as any
    vm.refresh()
    await flushPromises()

    expect(wrapper.emitted('refresh')).toBeTruthy()
    expect(QRCodeLib.toCanvas).toHaveBeenCalled()
  })

  it('exposes toDataURL() method', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', type: 'image' },
    })
    await flushPromises()

    const vm = wrapper.vm as any
    const dataUrl = await vm.toDataURL()
    expect(dataUrl).toBe('data:image/png;base64,mockQRCodeData')
  })

  /* ------------------------- Reactivity ---------------------------- */

  it('re-renders when value changes', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'initial' },
    })
    await flushPromises()
    vi.clearAllMocks()

    await wrapper.setProps({ value: 'updated' })
    await flushPromises()

    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(expect.anything(), 'updated', expect.anything())
  })

  it('re-renders when size changes', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', size: 100 },
    })
    await flushPromises()
    vi.clearAllMocks()

    await wrapper.setProps({ size: 200 })
    await flushPromises()

    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ width: 200 })
    )
  })

  it('re-renders when level changes', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', level: 'L' },
    })
    await flushPromises()
    vi.clearAllMocks()

    await wrapper.setProps({ level: 'Q' })
    await flushPromises()

    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ errorCorrectionLevel: 'Q' })
    )
  })

  it('re-renders when color changes', async () => {
    const wrapper = mount(QRCode, {
      props: { value: 'test', color: '#000000' },
    })
    await flushPromises()
    vi.clearAllMocks()

    await wrapper.setProps({ color: '#ff0000' })
    await flushPromises()

    expect(QRCodeLib.toCanvas).toHaveBeenCalledWith(
      expect.anything(),
      'test',
      expect.objectContaining({ color: { dark: '#ff0000', light: '#ffffff' } })
    )
  })

  /* ----------------------- Auto-refresh ---------------------------- */

  it('sets up auto-refresh interval when refreshInterval is set', async () => {
    vi.useFakeTimers()
    mount(QRCode, {
      props: { value: 'test', refreshInterval: 2000 },
    })
    await flushPromises()
    vi.clearAllMocks()

    // Advance past one interval
    vi.advanceTimersByTime(2000)
    await flushPromises()

    expect(QRCodeLib.toCanvas).toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('cleans up interval on unmount', () => {
    vi.useFakeTimers()
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval')
    const wrapper = mount(QRCode, {
      props: { value: 'test', refreshInterval: 1000 },
    })
    wrapper.unmount()
    expect(clearIntervalSpy).toHaveBeenCalled()
    vi.useRealTimers()
  })

  /* ----------------------- SVG with logo --------------------------- */

  it('embeds logo in SVG when image is set', async () => {
    const wrapper = mount(QRCode, {
      props: {
        value: 'test',
        type: 'svg',
        image: 'logo.png',
        size: 200,
      },
    })
    await flushPromises()

    const svgHtml = wrapper.find('.zc-qrcode__svg').element.innerHTML
    expect(svgHtml).toContain('<image')
    expect(svgHtml).toContain('logo.png')
  })

  /* --------------------- Image Settings merge ---------------------- */

  it('uses imageSettings when provided', async () => {
    mount(QRCode, {
      props: {
        value: 'test',
        type: 'svg',
        imageSettings: {
          src: 'custom-logo.png',
          width: 40,
          height: 40,
        },
        size: 200,
      },
    })
    await flushPromises()

    expect(QRCodeLib.toString).toHaveBeenCalled()
  })
})
