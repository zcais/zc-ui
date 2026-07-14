import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, inject } from 'vue'
import ConfigProvider from '../config-provider/config-provider.vue'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'
import {
  configProviderInjectionKey,
  type ComponentSize,
} from '../config-provider/types'
import Button from '../button/button.vue'
import Input from '../input/input.vue'
import Switch from '../switch/switch.vue'
import { getBaseZIndex } from '@zc-ui/hooks'

// ---- Helper: a child component that reads the injected context ----
const ConsumerChild = defineComponent({
  name: 'ConsumerChild',
  setup() {
    const ctx = useGlobalConfig()
    return () =>
      h('div', { class: 'consumer' }, [
        h('span', { class: 'size' }, ctx?.size.value ?? ''),
        h('span', { class: 'locale' }, ctx?.locale.value ?? ''),
        h('span', { class: 'zindex' }, String(ctx?.zIndex.value ?? '')),
        h('span', { class: 'namespace' }, ctx?.namespace.value ?? ''),
      ])
  },
})

// ---- Helper: a child that tries to access context with no provider ----
const NoProviderChild = defineComponent({
  name: 'NoProviderChild',
  setup() {
    const ctx = useGlobalConfig()
    return () => h('div', { class: 'no-provider' }, ctx ? 'has-ctx' : 'no-ctx')
  },
})

describe('ZcConfigProvider', () => {
  // ---- Basic rendering ----
  it('renders children via default slot (renderless mode)', () => {
    const wrapper = mount(ConfigProvider, {
      slots: {
        default: '<div class="content">Hello</div>',
      },
    })
    expect(wrapper.find('.content').text()).toBe('Hello')
    // Should not render its own wrapper element in renderless mode
    expect(wrapper.find('.zc-config-provider').exists()).toBe(false)
  })

  it('renders a wrapper element when `as` prop is provided', () => {
    const wrapper = mount(ConfigProvider, {
      props: { as: 'section' },
      slots: {
        default: '<div class="content">Hello</div>',
      },
    })
    expect(wrapper.find('section.zc-config-provider').exists()).toBe(true)
    expect(wrapper.find('.content').text()).toBe('Hello')
  })

  it('renders a div wrapper when as="div"', () => {
    const wrapper = mount(ConfigProvider, {
      props: { as: 'div' },
      slots: {
        default: '<span>Inner</span>',
      },
    })
    expect(wrapper.find('div.zc-config-provider').exists()).toBe(true)
  })

  // ---- Size ----
  it('provides size to child components', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.size').text()).toBe('small')
  })

  it('provides large size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.size').text()).toBe('large')
  })

  it('provides all supported size values', () => {
    const sizes: ComponentSize[] = ['large', 'medium', 'small', 'mini']
    sizes.forEach((size) => {
      const wrapper = mount(ConfigProvider, {
        props: { size },
        slots: { default: () => h(ConsumerChild) },
      })
      expect(wrapper.find('.size').text()).toBe(size)
    })
  })

  // ---- Locale ----
  it('provides locale to child components', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: 'en-US' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.locale').text()).toBe('en-US')
  })

  it('provides zh-CN locale', () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.locale').text()).toBe('zh-CN')
  })

  // ---- z-index ----
  it('provides zIndex to child components', () => {
    const wrapper = mount(ConfigProvider, {
      props: { zIndex: 5000 },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.zindex').text()).toBe('5000')
  })

  // ---- Namespace ----
  it('provides namespace to child components', () => {
    const wrapper = mount(ConfigProvider, {
      props: { namespace: 'custom-prefix' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.namespace').text()).toBe('custom-prefix')
  })

  // ---- Combined props ----
  it('supports multiple props simultaneously', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        size: 'mini',
        locale: 'ja-JP',
        zIndex: 9999,
        namespace: 'my-ns',
      },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.size').text()).toBe('mini')
    expect(wrapper.find('.locale').text()).toBe('ja-JP')
    expect(wrapper.find('.zindex').text()).toBe('9999')
    expect(wrapper.find('.namespace').text()).toBe('my-ns')
  })

  // ---- Reactivity ----
  it('updates child components when props change reactively', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.size').text()).toBe('small')

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.find('.size').text()).toBe('large')
  })

  it('reactively updates locale', async () => {
    const wrapper = mount(ConfigProvider, {
      props: { locale: 'zh-CN' },
      slots: { default: () => h(ConsumerChild) },
    })
    expect(wrapper.find('.locale').text()).toBe('zh-CN')

    await wrapper.setProps({ locale: 'en-US' })
    expect(wrapper.find('.locale').text()).toBe('en-US')
  })

  // ---- Nested providers ----
  it('nested ConfigProvider overrides only specified props', () => {
    const InnerChild = defineComponent({
      name: 'InnerChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'inner-consumer' }, [
            h('span', { class: 'inner-size' }, ctx?.size.value ?? ''),
            h('span', { class: 'inner-locale' }, ctx?.locale.value ?? ''),
            h('span', { class: 'inner-zindex' }, String(ctx?.zIndex.value ?? '')),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', locale: 'zh-CN', zIndex: 1000 },
      slots: {
        default: () =>
          h(ConfigProvider, { size: 'small' }, () => h(InnerChild)),
      },
    })

    // Inner provider overrides size but inherits locale and zIndex
    expect(wrapper.find('.inner-size').text()).toBe('small')
    expect(wrapper.find('.inner-locale').text()).toBe('zh-CN')
    expect(wrapper.find('.inner-zindex').text()).toBe('1000')
  })

  it('nested ConfigProvider can override all props', () => {
    const InnerChild = defineComponent({
      name: 'InnerChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'inner-consumer' }, [
            h('span', { class: 'inner-size' }, ctx?.size.value ?? ''),
            h('span', { class: 'inner-locale' }, ctx?.locale.value ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: { size: 'large', locale: 'zh-CN' },
      slots: {
        default: () =>
          h(
            ConfigProvider,
            { size: 'mini', locale: 'en-US' },
            () => h(InnerChild),
          ),
      },
    })

    expect(wrapper.find('.inner-size').text()).toBe('mini')
    expect(wrapper.find('.inner-locale').text()).toBe('en-US')
  })

  // ---- Message / Notification / Button configs ----
  it('provides message config to child components', () => {
    const MsgChild = defineComponent({
      name: 'MsgChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'msg-consumer' }, [
            h('span', { class: 'msg-max' }, String(ctx?.message.value?.max ?? '')),
            h('span', { class: 'msg-duration' }, String(ctx?.message.value?.duration ?? '')),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        message: { max: 5, duration: 5000 },
      },
      slots: { default: () => h(MsgChild) },
    })

    expect(wrapper.find('.msg-max').text()).toBe('5')
    expect(wrapper.find('.msg-duration').text()).toBe('5000')
  })

  it('provides notification config to child components', () => {
    const NotifChild = defineComponent({
      name: 'NotifChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'notif-consumer' }, [
            h('span', { class: 'notif-position' }, ctx?.notification.value?.position ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        notification: { position: 'bottom-right' },
      },
      slots: { default: () => h(NotifChild) },
    })

    expect(wrapper.find('.notif-position').text()).toBe('bottom-right')
  })

  it('provides button config to child components', () => {
    const BtnChild = defineComponent({
      name: 'BtnChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'btn-consumer' }, [
            h('span', { class: 'btn-auto-space' }, String(ctx?.button.value?.autoInsertSpace ?? '')),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        button: { autoInsertSpace: true },
      },
      slots: { default: () => h(BtnChild) },
    })

    expect(wrapper.find('.btn-auto-space').text()).toBe('true')
  })

  // ---- useGlobalConfig without provider ----
  it('returns safe default context when no ConfigProvider ancestor', () => {
    const wrapper = mount(NoProviderChild)
    // After fix: useGlobalConfig() returns a safe default context (truthy),
    // but all fields resolve to undefined
    const text = wrapper.find('.no-provider').text()
    expect(text).toBe('has-ctx')
  })

  // ---- Injection key direct test ----
  it('provides context via the injection key', () => {
    const KeyChild = defineComponent({
      name: 'KeyChild',
      setup() {
        const ctx = inject(configProviderInjectionKey, undefined)
        return () =>
          h(
            'div',
            { class: 'key-child' },
            ctx ? 'injected' : 'not-injected',
          )
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(KeyChild) },
    })

    expect(wrapper.find('.key-child').text()).toBe('injected')
  })

  // ---- Component name ----
  it('has the correct component name', () => {
    expect(ConfigProvider.name).toBe('ZcConfigProvider')
  })

  // ---- Theme: brandColors ----
  it('provides brandColors to child components', () => {
    const ThemeChild = defineComponent({
      name: 'ThemeChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'theme-consumer' }, [
            h('span', { class: 'brand-primary' }, ctx?.brandColors.value?.primary ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        brandColors: { primary: '#722ed1' },
      },
      slots: { default: () => h(ThemeChild) },
    })

    expect(wrapper.find('.brand-primary').text()).toBe('#722ed1')
  })

  // ---- Theme: themeVariables ----
  it('provides themeVariables to child components', () => {
    const ThemeVarChild = defineComponent({
      name: 'ThemeVarChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'themevar-consumer' }, [
            h('span', { class: 'tv-radius' }, ctx?.themeVariables.value?.['--radius-zc-base'] ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        themeVariables: { '--radius-zc-base': '8px' },
      },
      slots: { default: () => h(ThemeVarChild) },
    })

    expect(wrapper.find('.tv-radius').text()).toBe('8px')
  })

  // ---- Theme: themeOverrides ----
  it('provides themeOverrides to child components', () => {
    const OverrideChild = defineComponent({
      name: 'OverrideChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'override-consumer' }, [
            h('span', { class: 'override-btn-radius' },
              ctx?.themeOverrides.value?.Button?.['--zc-button-radius'] ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        themeOverrides: {
          Button: { '--zc-button-radius': '8px' },
        },
      },
      slots: { default: () => h(OverrideChild) },
    })

    expect(wrapper.find('.override-btn-radius').text()).toBe('8px')
  })

  // ---- Theme: nested theme override inheritance ----
  it('nested ConfigProvider inherits themeOverrides from parent', () => {
    const InnerChild = defineComponent({
      name: 'InnerThemeChild',
      setup() {
        const ctx = useGlobalConfig()
        return () =>
          h('div', { class: 'inner-theme' }, [
            h('span', { class: 'inner-brand' }, ctx?.brandColors.value?.primary ?? ''),
          ])
      },
    })

    const wrapper = mount(ConfigProvider, {
      props: {
        brandColors: { primary: '#722ed1' },
      },
      slots: {
        default: () =>
          h(ConfigProvider, { size: 'small' }, () => h(InnerChild)),
      },
    })

    expect(wrapper.find('.inner-brand').text()).toBe('#722ed1')
  })

  // ---- Integration: ConfigProvider → Button size ----
  it('Button uses global size from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(Button) },
    })
    expect(wrapper.find('button').classes()).toContain('zc-button--small')
  })

  it('Button defaults to medium when ConfigProvider has no size', () => {
    const wrapper = mount(ConfigProvider, {
      props: {},
      slots: { default: () => h(Button) },
    })
    expect(wrapper.find('button').classes()).toContain('zc-button--medium')
  })

  it('Button prop size overrides ConfigProvider global size', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(Button, { size: 'large' }) },
    })
    expect(wrapper.find('button').classes()).toContain('zc-button--large')
    expect(wrapper.find('button').classes()).not.toContain('zc-button--small')
  })

  it('Button uses all sizes from ConfigProvider', () => {
    const sizes: ComponentSize[] = ['large', 'medium', 'small', 'mini']
    sizes.forEach((size) => {
      const wrapper = mount(ConfigProvider, {
        props: { size },
        slots: { default: () => h(Button) },
      })
      expect(wrapper.find('button').classes()).toContain(`zc-button--${size}`)
    })
  })

  // ---- Integration: ConfigProvider → Input size ----
  it('Input uses global size from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'small' },
      slots: { default: () => h(Input) },
    })
    expect(wrapper.find('.zc-input').classes()).toContain('zc-input--small')
  })

  it('Input degrades mini to small from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'mini' },
      slots: { default: () => h(Input) },
    })
    expect(wrapper.find('.zc-input').classes()).toContain('zc-input--small')
    expect(wrapper.find('.zc-input').classes()).not.toContain('zc-input--mini')
  })

  // ---- Integration: ConfigProvider → Switch size ----
  it('Switch uses global size from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'large' },
      slots: { default: () => h(Switch) },
    })
    expect(wrapper.find('.zc-switch').classes()).toContain('zc-switch--large')
  })

  it('Switch degrades mini to small from ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: { size: 'mini' },
      slots: { default: () => h(Switch) },
    })
    expect(wrapper.find('.zc-switch').classes()).toContain('zc-switch--small')
  })

  // ---- useGlobalConfig returns safe default (not undefined) ----
  it('useGlobalConfig returns safe default context when no provider', () => {
    const { size } = useGlobalConfig()
    // Should not throw — returns undefined (safe ComputedRef)
    expect(size.value).toBeUndefined()
  })

  it('useGlobalConfig returns undefined for specific key when no provider', () => {
    const val = useGlobalConfig('size')
    expect(val).toBeUndefined()
  })

  // ---- Integration: ConfigProvider → z-index ----
  it('ConfigProvider zIndex sets the global base z-index', () => {
    mount(ConfigProvider, {
      props: { zIndex: 5000 },
      slots: { default: () => h('div') },
    })
    // After ConfigProvider mounts with zIndex=5000, getBaseZIndex should reflect it
    expect(getBaseZIndex()).toBeGreaterThanOrEqual(5000)
  })
})
