/**
 * useLocale - Re-export of the locale composable from @zc-ui/locale.
 *
 * Provides reactive locale context (t, locale, setLocale, etc.) for
 * use inside ZC UI components.
 *
 * @example
 * import { useLocale } from '@zc-ui/hooks'
 * const { t, locale, setLocale } = useLocale()
 * t('common.confirm') // '确定'
 */
export { useLocale } from '@zc-ui/locale'
export type { LocaleContext, Language, LocaleDictionary, TranslateOptions } from '@zc-ui/locale'
