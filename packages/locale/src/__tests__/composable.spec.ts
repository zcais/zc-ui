import { describe, it, expect, beforeEach } from 'vitest'
import { defineComponent, h, nextTick, ref, readonly } from 'vue'
import { mount } from '@vue/test-utils'
import {
  createLocale,
  useLocale,
  setLocale,
  register,
  localeInjectionKey,
  type LocaleContext,
} from '../index'

/* ------------------------------------------------------------------ *
 * Helper component that uses useLocale() via inject.
 * ------------------------------------------------------------------ */
const LocaleConsumer = defineComponent({
  setup() {
    const { t, locale } = useLocale()
    return () =>
      h('div', [
        h('span', { class: 'locale' }, locale.value),
        h('span', { class: 'confirm' }, t('common.confirm')),
      ])
  },
})

const SwitchButton = defineComponent({
  props: { lang: { type: String, required: true } },
  setup(props) {
    const { setLocale } = useLocale()
    return () =>
      h('button', { class: 'switch', onClick: () => setLocale(props.lang) }, `switch-${props.lang}`)
  },
})

/* ------------------------------------------------------------------ *
 * Tests
 * ------------------------------------------------------------------ */

describe('createLocale plugin + useLocale composable', () => {
  beforeEach(() => {
    setLocale('zh-CN')
    register('zh-CN', { common: { confirm: '确定' } })
    register('en-US', { common: { confirm: 'Confirm' } })
  })

  it('provides locale context to child components', () => {
    const App = defineComponent({
      setup() {
        return () => h(LocaleConsumer)
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createLocale({ locale: 'zh-CN' })],
      },
    })

    expect(wrapper.find('.locale').text()).toBe('zh-CN')
    expect(wrapper.find('.confirm').text()).toBe('确定')
  })

  it('initializes with custom locale from plugin options', () => {
    const wrapper = mount(LocaleConsumer, {
      global: {
        plugins: [createLocale({ locale: 'en-US' })],
      },
    })

    expect(wrapper.find('.locale').text()).toBe('en-US')
    expect(wrapper.find('.confirm').text()).toBe('Confirm')
  })

  it('reactive locale switching updates component render', async () => {
    const App = defineComponent({
      setup() {
        return () => h('div', [h(LocaleConsumer), h(SwitchButton, { lang: 'en-US' })])
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [createLocale({ locale: 'zh-CN' })],
      },
    })

    // Initially zh-CN
    expect(wrapper.find('.confirm').text()).toBe('确定')

    // Click to switch
    await wrapper.find('.switch').trigger('click')
    await nextTick()

    // Should be en-US now
    expect(wrapper.find('.locale').text()).toBe('en-US')
    expect(wrapper.find('.confirm').text()).toBe('Confirm')
  })

  it('accepts custom messages via plugin options', () => {
    const wrapper = mount(LocaleConsumer, {
      global: {
        plugins: [
          createLocale({
            locale: 'ja-JP',
            messages: {
              'ja-JP': { common: { confirm: '確認' } },
            },
          }),
        ],
      },
    })

    expect(wrapper.find('.locale').text()).toBe('ja-JP')
    expect(wrapper.find('.confirm').text()).toBe('確認')
  })

  it('directly providing context via injectionKey works', () => {
    // Build a self-contained custom context (no useLocale() call outside setup)
    const customLocale = ref('zh-CN')
    const customDict: Record<string, string> = { 'common.confirm': '确定(自定义)' }
    const ctx: LocaleContext = {
      locale: readonly(customLocale),
      t: (key: string) => customDict[key] ?? key,
      setLocale: (lang: string) => {
        customLocale.value = lang
      },
      getLocale: () => customLocale.value,
      setFallbackLocale: () => {},
      getFallbackLocale: () => 'zh-CN',
      register: () => {},
    }

    const wrapper = mount(LocaleConsumer, {
      global: {
        provide: { [localeInjectionKey as symbol]: ctx },
      },
    })

    expect(wrapper.find('.confirm').text()).toBe('确定(自定义)')
  })

  it('register extends language pack at runtime', async () => {
    // Register BEFORE mounting — no messages option in createLocale,
    // so the test truly depends on the register() call above.
    register('fr-FR', { common: { confirm: 'Confirmer' } })

    const wrapper = mount(LocaleConsumer, {
      global: {
        plugins: [createLocale({ locale: 'fr-FR' })],
      },
    })

    expect(wrapper.find('.confirm').text()).toBe('Confirmer')
  })
})
