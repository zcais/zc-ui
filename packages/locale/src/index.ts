/**
 * ZC UI Locale - Internationalization framework
 */

import { ref, reactive, readonly, inject, type Ref, type InjectionKey } from 'vue'
import type { App, Plugin } from 'vue'
import { flatten } from './dictionary'
import { interpolate } from './translate'

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

/** Language code. Defaults to 'zh-CN' / 'en-US'; any string is valid. */
export type Language = string

/** Dictionary value: a string or a nested dictionary object. */
export interface LocaleDictionary {
  [key: string]: string | LocaleDictionary
}

/** Named interpolation parameters. */
export type TranslateOptions = Record<string, string | number>

/** Locale context exposed via provide/inject and useLocale(). */
export interface LocaleContext {
  /** Reactive current language (read-only) */
  locale: Readonly<Ref<Language>>
  /** Translate a key with optional named parameters */
  t: (key: string, options?: TranslateOptions) => string
  /** Set the current language */
  setLocale: (lang: Language) => void
  /** Get the current language */
  getLocale: () => Language
  /** Set the fallback language (used when a key is missing in current locale) */
  setFallbackLocale: (lang: Language) => void
  /** Get the fallback language */
  getFallbackLocale: () => Language
  /** Register/extend a language pack */
  register: (lang: Language, dict: LocaleDictionary) => void
}

// ---------------------------------------------------------------
// Built-in messages (flat dot-notation)
// ---------------------------------------------------------------

const zhCNMessages: Record<string, string> = {
  'common.confirm': '确定',
  'common.cancel': '取消',
  'common.loading': '加载中...',
  'common.empty': '暂无数据',
  'common.ok': '确定',
  'common.save': '保存',
  'common.delete': '删除',
  'common.close': '关闭',
  'zc.pagination.total': '共 {total} 条',
  'zc.pagination.goto': '前往',
  'zc.pagination.pageClassifier': '页',
  'zc.empty.description': '暂无数据',
  'zc.select.placeholder': '请选择',
  'zc.select.noData': '暂无数据',
  'zc.select.noMatch': '无匹配数据',
  'zc.select.loading': '加载中...',
  'zc.select.selectAll': '全选',
  'zc.select.deselectAll': '取消全选',
  'zc.timePicker.placeholder': '请选择时间',
  'zc.timePicker.startPlaceholder': '开始时间',
  'zc.timePicker.endPlaceholder': '结束时间',
  'zc.timePicker.rangeSeparator': '至',
  'zc.autoComplete.placeholder': '请输入',
  'zc.autoComplete.noData': '暂无数据',
  'zc.autoComplete.searching': '搜索中...',
  'zc.treeSelect.placeholder': '请选择',
  'zc.treeSelect.searchPlaceholder': '搜索',
  'zc.treeSelect.noData': '暂无数据',
  'zc.cascader.placeholder': '请选择',
  'zc.carousel.prev': '上一张',
  'zc.carousel.next': '下一张',
  'zc.carousel.indicator': '切换到第 {index} 张',
  'zc.carousel.label': '走马灯',
  'zc.carousel.empty': '暂无内容',
  'zc.alert.close': '关闭',
  'zc.backtop.backToTop': '返回顶部',
  'zc.datePicker.placeholder': '请选择日期',
  'zc.datePicker.startPlaceholder': '开始日期',
  'zc.datePicker.endPlaceholder': '结束日期',
  'zc.datePicker.year': '年',
  'zc.datePicker.weekdays.sun': '日',
  'zc.datePicker.weekdays.mon': '一',
  'zc.datePicker.weekdays.tue': '二',
  'zc.datePicker.weekdays.wed': '三',
  'zc.datePicker.weekdays.thu': '四',
  'zc.datePicker.weekdays.fri': '五',
  'zc.datePicker.weekdays.sat': '六',
  'zc.datePicker.months.jan': '一月',
  'zc.datePicker.months.feb': '二月',
  'zc.datePicker.months.mar': '三月',
  'zc.datePicker.months.apr': '四月',
  'zc.datePicker.months.may': '五月',
  'zc.datePicker.months.jun': '六月',
  'zc.datePicker.months.jul': '七月',
  'zc.datePicker.months.aug': '八月',
  'zc.datePicker.months.sep': '九月',
  'zc.datePicker.months.oct': '十月',
  'zc.datePicker.months.nov': '十一月',
  'zc.datePicker.months.dec': '十二月',
  'zc.mention.placeholder': '请输入内容',
  'zc.mention.loading': '加载中…',
  'zc.mention.empty': '暂无匹配结果',
  'zc.upload.dragTip': '将文件拖到此处，或',
  'zc.upload.clickToUpload': '点击上传',
  'zc.form.required': '该字段为必填项',
  'zc.form.min': '长度不能少于 {min}',
  'zc.form.max': '长度不能超过 {max}',
  'zc.form.pattern': '格式不正确',
  'zc.form.validateFailed': '校验失败',
  'zc.image.preview': '图片预览',
  'zc.image.closePreview': '关闭预览',
  'zc.image.zoomIn': '放大',
  'zc.image.zoomOut': '缩小',
  'zc.image.rotateLeft': '向左旋转',
  'zc.image.rotateRight': '向右旋转',
  'zc.rate.texts.1': '极差',
  'zc.rate.texts.2': '失望',
  'zc.rate.texts.3': '一般',
  'zc.rate.texts.4': '满意',
  'zc.rate.texts.5': '惊喜',
  'zc.transfer.titleLeft': '列表 1',
  'zc.transfer.titleRight': '列表 2',
  'zc.transfer.filterPlaceholder': '请输入搜索内容',
  'zc.transfer.noData': '暂无数据',
  'zc.table.emptyText': '暂无数据',
  'zc.tag.close': '移除标签',
  'zc.calendar.today': '今天',
  'zc.calendar.title': '日历',
  'zc.floatButton.backToTop': '回到顶部',
  'zc.floatButton.expand': '展开悬浮按钮',
  'zc.floatButton.collapse': '折叠悬浮按钮',
}

const enUSMessages: Record<string, string> = {
  'common.confirm': 'Confirm',
  'common.cancel': 'Cancel',
  'common.loading': 'Loading...',
  'common.empty': 'No data',
  'common.ok': 'OK',
  'common.save': 'Save',
  'common.delete': 'Delete',
  'common.close': 'Close',
  'zc.pagination.total': 'Total {total}',
  'zc.pagination.goto': 'Go to',
  'zc.pagination.pageClassifier': '',
  'zc.pagination.label': 'Pagination',
  'zc.empty.description': 'No Data',
  'zc.select.placeholder': 'Please select',
  'zc.select.noData': 'No data',
  'zc.select.noMatch': 'No matching data',
  'zc.select.loading': 'Loading...',
  'zc.select.selectAll': 'Select all',
  'zc.select.deselectAll': 'Deselect all',
  'zc.timePicker.placeholder': 'Select time',
  'zc.timePicker.startPlaceholder': 'Start time',
  'zc.timePicker.endPlaceholder': 'End time',
  'zc.timePicker.rangeSeparator': 'To',
  'zc.autoComplete.placeholder': 'Please input',
  'zc.autoComplete.noData': 'No data',
  'zc.autoComplete.searching': 'Searching...',
  'zc.treeSelect.placeholder': 'Please select',
  'zc.treeSelect.searchPlaceholder': 'Search',
  'zc.treeSelect.noData': 'No data',
  'zc.cascader.placeholder': 'Please select',
  'zc.carousel.prev': 'Previous',
  'zc.carousel.next': 'Next',
  'zc.carousel.indicator': 'Go to slide {index}',
  'zc.carousel.label': 'Carousel',
  'zc.carousel.empty': 'No content',
  'zc.alert.close': 'Close',
  'zc.backtop.backToTop': 'Back to top',
  'zc.datePicker.placeholder': 'Select date',
  'zc.datePicker.startPlaceholder': 'Start date',
  'zc.datePicker.endPlaceholder': 'End date',
  'zc.datePicker.year': '',
  'zc.datePicker.weekdays.sun': 'Su',
  'zc.datePicker.weekdays.mon': 'Mo',
  'zc.datePicker.weekdays.tue': 'Tu',
  'zc.datePicker.weekdays.wed': 'We',
  'zc.datePicker.weekdays.thu': 'Th',
  'zc.datePicker.weekdays.fri': 'Fr',
  'zc.datePicker.weekdays.sat': 'Sa',
  'zc.datePicker.months.jan': 'January',
  'zc.datePicker.months.feb': 'February',
  'zc.datePicker.months.mar': 'March',
  'zc.datePicker.months.apr': 'April',
  'zc.datePicker.months.may': 'May',
  'zc.datePicker.months.jun': 'June',
  'zc.datePicker.months.jul': 'July',
  'zc.datePicker.months.aug': 'August',
  'zc.datePicker.months.sep': 'September',
  'zc.datePicker.months.oct': 'October',
  'zc.datePicker.months.nov': 'November',
  'zc.datePicker.months.dec': 'December',
  'zc.mention.placeholder': 'Please enter content',
  'zc.upload.dragTip': 'Drop files here, or ',
  'zc.upload.clickToUpload': 'click to upload',
  'zc.form.required': 'This field is required',
  'zc.form.min': 'Length cannot be less than {min}',
  'zc.form.max': 'Length cannot be greater than {max}',
  'zc.form.pattern': 'Invalid format',
  'zc.form.validateFailed': 'Validation failed',
  'zc.image.preview': 'Image Preview',
  'zc.image.closePreview': 'Close preview',
  'zc.image.zoomIn': 'Zoom In',
  'zc.image.zoomOut': 'Zoom Out',
  'zc.image.rotateLeft': 'Rotate Left',
  'zc.image.rotateRight': 'Rotate Right',
  'zc.rate.texts.1': 'Very Bad',
  'zc.rate.texts.2': 'Disappointed',
  'zc.rate.texts.3': 'Normal',
  'zc.rate.texts.4': 'Satisfied',
  'zc.rate.texts.5': 'Surprised',
  'zc.transfer.titleLeft': 'List 1',
  'zc.transfer.titleRight': 'List 2',
  'zc.transfer.filterPlaceholder': 'Enter search content',
  'zc.transfer.noData': 'No data',
  'zc.table.emptyText': 'No Data',
  'zc.tag.close': 'Remove tag',
  'zc.calendar.today': 'Today',
  'zc.calendar.title': 'Calendar',
  'zc.floatButton.backToTop': 'Back to top',
  'zc.floatButton.expand': 'Expand float button',
  'zc.floatButton.collapse': 'Collapse float button',
}

// ---------------------------------------------------------------
// Module-level reactive singleton state
//
// NOTE: These are module-level singletons, meaning all components in an
// application share the same locale state. This is the standard pattern
// used by Element Plus, Naive UI, and other Vue 3 component libraries.
//
// **SSR Limitation**: In Server-Side Rendering scenarios, different
// requests will share the same module state, which can cause locale
// cross-contamination between requests. For SSR applications, consider
// scoping locale state per-request (e.g. via app.runWithContext() or a
// custom createApp-level store). For typical SPA usage this is not an issue.
// ---------------------------------------------------------------

const _localeRef = ref<Language>('zh-CN')
const _fallbackLocaleRef = ref<Language>('zh-CN')

const _messages = reactive<Record<Language, Record<string, string>>>({
  'zh-CN': { ...zhCNMessages },
  'en-US': { ...enUSMessages },
})

// ---------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------

/**
 * Set the current language (reactive).
 */
export function setLocale(lang: Language): void {
  _localeRef.value = lang
}

/**
 * Get the current language.
 */
export function getLocale(): Language {
  return _localeRef.value
}

/**
 * Set the fallback language used when a key is missing in the current locale.
 * Defaults to 'zh-CN'.
 */
export function setFallbackLocale(lang: Language): void {
  _fallbackLocaleRef.value = lang
}

/**
 * Get the fallback language.
 */
export function getFallbackLocale(): Language {
  return _fallbackLocaleRef.value
}

/**
 * Translate a key for the current language.
 *
 * Lookup order:
 * 1. Current locale dictionary
 * 2. Fallback locale dictionary (default: 'zh-CN')
 * 3. The key itself (raw)
 *
 * Supports named parameter interpolation via options.
 *
 * @example
 * t('common.confirm')                     // '确定'
 * t('welcome', { name: '张三' })          // '欢迎, 张三'
 */
export function t(key: string, options?: TranslateOptions): string {
  const currentDict = _messages[_localeRef.value]
  const fallbackDict = _messages[_fallbackLocaleRef.value]
  const raw = currentDict?.[key] ?? fallbackDict?.[key] ?? key
  return interpolate(raw, options)
}

/**
 * Register or extend a language pack.
 * Nested objects are flattened to dot-notation keys.
 * If the language already exists, new keys are merged in.
 *
 * @example
 * register('ja-JP', { common: { confirm: '確認' } })
 * register('zh-CN', { 'custom.key': '自定义' })
 */
export function register(lang: Language, dict: LocaleDictionary): void {
  const flat = flatten(dict)
  _messages[lang] = { ..._messages[lang], ...flat }
}

// ---------------------------------------------------------------
// provide/inject
// ---------------------------------------------------------------

/** Injection key for locale context */
export const localeInjectionKey: InjectionKey<LocaleContext> = Symbol('zcLocale')

// ---------------------------------------------------------------
// useLocale composable
// ---------------------------------------------------------------

/**
 * Access the locale context within a component.
 *
 * **Must be called inside a component `setup()` function.** When called
 * within a provide tree (i.e. after `app.use(createLocale())`), it returns
 * the injected context. As a fallback for non-component usage (e.g. in
 * utility modules), it returns the module-level singleton context — note
 * that this fallback will trigger a Vue dev-mode warning about `inject()`
 * being called outside setup, which can be safely ignored.
 *
 * @example
 * // In a component setup:
 * const { t, locale, setLocale } = useLocale()
 * t('common.confirm')   // '确定'
 * setLocale('en-US')    // reactive switch
 */
export function useLocale(): LocaleContext {
  const ctx = inject(localeInjectionKey, null)
  if (ctx) return ctx

  return {
    locale: readonly(_localeRef),
    t,
    setLocale,
    getLocale,
    setFallbackLocale,
    getFallbackLocale,
    register,
  }
}

// ---------------------------------------------------------------
// createLocale plugin
// ---------------------------------------------------------------

/**
 * Create a locale plugin with optional initial configuration.
 *
 * @example
 * import { createLocale } from '@zc-ui/locale'
 * app.use(createLocale({ locale: 'en-US' }))
 *
 * @example
 * // With custom messages and fallback
 * app.use(createLocale({
 *   locale: 'en-US',
 *   fallbackLocale: 'zh-CN',
 *   messages: { 'ja-JP': { common: { ok: 'OK' } } }
 * }))
 */
export function createLocale(options?: {
  locale?: Language
  fallbackLocale?: Language
  messages?: Record<Language, LocaleDictionary>
}): Plugin {
  return {
    install(app: App) {
      if (options?.locale) {
        setLocale(options.locale)
      }
      if (options?.fallbackLocale) {
        setFallbackLocale(options.fallbackLocale)
      }
      if (options?.messages) {
        for (const [lang, dict] of Object.entries(options.messages)) {
          register(lang, dict)
        }
      }

      const ctx: LocaleContext = {
        locale: readonly(_localeRef),
        t,
        setLocale,
        getLocale,
        setFallbackLocale,
        getFallbackLocale,
        register,
      }

      app.provide(localeInjectionKey, ctx)
    },
  }
}
