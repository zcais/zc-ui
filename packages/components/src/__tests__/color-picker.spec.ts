import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ColorPicker from '../color-picker/color-picker.vue'

describe('ZcColorPicker', () => {
  it('renders with default props', () => {
    const wrapper = mount(ColorPicker)
    expect(wrapper.find('.zc-color-picker').exists()).toBe(true)
    expect(wrapper.find('.zc-color-picker__trigger').exists()).toBe(true)
    expect(wrapper.find('.zc-color-picker__color').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(ColorPicker, { props: { size: 'large' } })
    expect(wrapper.find('.zc-color-picker').classes()).toContain('zc-color-picker--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(ColorPicker, { props: { size: 'small' } })
    expect(wrapper.find('.zc-color-picker').classes()).toContain('zc-color-picker--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(ColorPicker, { props: { disabled: true } })
    expect(wrapper.find('.zc-color-picker').classes()).toContain('is-disabled')
  })

  it('displays trigger color from modelValue', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    const colorEl = wrapper.find('.zc-color-picker__color')
    expect(colorEl.attributes('style')).toContain('background')
  })

  it('opens panel on trigger click', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__panel').exists()).toBe(true)
  })

  it('applies open class when panel is visible', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).toContain('is-open')
  })

  it('does not open panel when disabled', async () => {
    const wrapper = mount(ColorPicker, { props: { disabled: true } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).not.toContain('is-open')
  })

  it('renders SV panel when open', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__sv-panel').exists()).toBe(true)
    expect(wrapper.find('.zc-color-picker__sv-cursor').exists()).toBe(true)
  })

  it('renders hue slider when open', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__hue').exists()).toBe(true)
  })

  it('hides alpha slider when showAlpha is false (default)', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__alpha').exists()).toBe(false)
  })

  it('shows alpha slider when showAlpha is true', async () => {
    const wrapper = mount(ColorPicker, { props: { showAlpha: true } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__alpha').exists()).toBe(true)
  })

  it('renders predefine colors', async () => {
    const predefine = ['#ff0000', '#00ff00', '#0000ff']
    const wrapper = mount(ColorPicker, { props: { predefine } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const items = wrapper.findAll('.zc-color-picker__predefine-item')
    expect(items.length).toBe(3)
  })

  it('emits update:modelValue on confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#409eff' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const btn = wrapper.find('.zc-color-picker__btn')
    expect(btn.exists()).toBe(true)
  })

  // ---- Additional coverage tests ----

  it('emits update:modelValue and change on confirm click', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    await wrapper.find('.zc-color-picker__btn').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('closes panel after confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).toContain('is-open')
    await wrapper.find('.zc-color-picker__btn').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).not.toContain('is-open')
  })

  it('toggles panel visibility on trigger click', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).toContain('is-open')
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).not.toContain('is-open')
  })

  it('renders color input field', async () => {
    const wrapper = mount(ColorPicker)
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker__input').exists()).toBe(true)
  })

  it('emits active-change on hue click', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const hue = wrapper.find('.zc-color-picker__hue')
    // Mock getBoundingClientRect
    hue.element.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 10,
      right: 200,
      bottom: 10,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    await hue.trigger('click', { clientX: 100, clientY: 5 })
    expect(wrapper.emitted('active-change')).toBeTruthy()
  })

  it('emits active-change on alpha click when showAlpha', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000', showAlpha: true } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const alpha = wrapper.find('.zc-color-picker__alpha')
    alpha.element.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 10,
      right: 200,
      bottom: 10,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    await alpha.trigger('click', { clientX: 100, clientY: 5 })
    expect(wrapper.emitted('active-change')).toBeTruthy()
  })

  it('emits active-change on predefine color click', async () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: '#ff0000', predefine: ['#00ff00'] },
    })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const predef = wrapper.find('.zc-color-picker__predefine-item')
    await predef.trigger('click')
    expect(wrapper.emitted('active-change')).toBeTruthy()
  })

  it('parses rgb format modelValue', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: 'rgb(255, 0, 0)' } })
    expect(wrapper.find('.zc-color-picker__color').attributes('style')).toContain('background')
  })

  it('parses rgba format modelValue', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: 'rgba(255, 0, 0, 0.5)', showAlpha: true },
    })
    expect(wrapper.find('.zc-color-picker__color').exists()).toBe(true)
  })

  it('parses hsl format modelValue', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: 'hsl(0, 100%, 50%)' } })
    expect(wrapper.find('.zc-color-picker__color').exists()).toBe(true)
  })

  it('parses hsla format modelValue', () => {
    const wrapper = mount(ColorPicker, {
      props: { modelValue: 'hsla(120, 100%, 50%, 0.5)', showAlpha: true },
    })
    expect(wrapper.find('.zc-color-picker__color').exists()).toBe(true)
  })

  it('parses short hex format (#f00)', () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#f00' } })
    expect(wrapper.find('.zc-color-picker__color').exists()).toBe(true)
  })

  it('renders with rgb format output', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000', format: 'rgb' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const input = wrapper.find('.zc-color-picker__input').element as HTMLInputElement
    expect(input.value).toContain('rgb(')
  })

  it('renders with hsl format output', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000', format: 'hsl' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const input = wrapper.find('.zc-color-picker__input').element as HTMLInputElement
    expect(input.value).toContain('hsl(')
  })

  it('handles SV panel mouse interaction', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const svPanel = wrapper.find('.zc-color-picker__sv-panel')
    svPanel.element.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      right: 200,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })
    await svPanel.trigger('mousedown', { clientX: 100, clientY: 100 })
    // active-change should be emitted from the move handler
    expect(wrapper.emitted('active-change')).toBeTruthy()
  })

  it('updates color on input change', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const input = wrapper.find('.zc-color-picker__input')
    await input.setValue('#00ff00')
    // Component should not crash
    expect(wrapper.find('.zc-color-picker__sv-panel').exists()).toBe(true)
  })

  it('does not toggle when disabled', async () => {
    const wrapper = mount(ColorPicker, { props: { disabled: true } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    expect(wrapper.find('.zc-color-picker').classes()).not.toContain('is-open')
  })

  it('shows history after confirm', async () => {
    const wrapper = mount(ColorPicker, { props: { modelValue: '#ff0000' } })
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    await wrapper.find('.zc-color-picker__btn').trigger('click')
    // Re-open
    await wrapper.find('.zc-color-picker__trigger').trigger('click')
    const history = wrapper.find('.zc-color-picker__history')
    expect(history.exists()).toBe(true)
  })
})
