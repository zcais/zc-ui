import { ref, type Ref } from 'vue'

// Re-export all composables from individual modules
export {
  useEventListener,
  type EventTargetLike,
  type UseEventListenerOptions,
} from './useEventListener'
export { useClickOutside, type ClickOutsideOptions } from './useClickOutside'
export { useSize, type ElementSize, type UseSizeReturn } from './useSize'
export { useZIndex, getBaseZIndex, setBaseZIndex } from './useZIndex'
export { useId } from './useId'
export { useFocusTrap, type FocusTrapOptions } from './useFocusTrap'
export { useOptionalRouter } from './useOptionalRouter'
export { useVirtualList } from './useVirtualList'
export { useTimeoutFn, useIntervalFn, type UseTimeoutFnOptions, type UseIntervalFnOptions } from './useTimeoutFn'
export { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from './useDebounce'
export { useScroll, type ScrollTarget, type UseScrollOptions } from './useScroll'
export {
  useStorage,
  useLocalStorage,
  useSessionStorage,
  type UseStorageOptions,
} from './useStorage'
export {
  useMediaQuery,
  useBreakpoints,
  DEFAULT_BREAKPOINTS,
  type BreakpointsConfig,
} from './useMediaQuery'
export { useClipboard, type UseClipboardReturn } from './useClipboard'
export {
  useResizeObserver,
  type ResizeObserverEntry,
} from './useResizeObserver'
export {
  useIntersectionObserver,
  type UseIntersectionObserverOptions,
} from './useIntersectionObserver'
export { useDark, useColorMode, type ColorMode, type UseColorModeOptions, type UseDarkOptions } from './useDark'
export { useEscapeKeydown } from './useEscapeKeydown'
export { useForwardRef } from './useForwardRef'
export { useLocale, type LocaleContext, type Language, type LocaleDictionary, type TranslateOptions } from './useLocale'

// ---------------------------------------------------------------
// Simple inline composables
// ---------------------------------------------------------------

/**
 * useToggle - A simple boolean toggle composable.
 *
 * @example
 * const { value, toggle, set } = useToggle(false)
 * toggle() // value becomes true
 * set(false) // value is now false
 */
export function useToggle(initialValue = false): {
  value: Ref<boolean>
  toggle: () => void
  set: (val: boolean) => void
} {
  const value = ref(initialValue)
  const toggle = () => {
    value.value = !value.value
  }
  const set = (val: boolean) => {
    value.value = val
  }
  return { value, toggle, set }
}

/**
 * useNamespace - BEM class name generator for ZC UI components.
 *
 * Follows the convention: zc-{block}__{element}--{modifier}
 *
 * @example
 * const ns = useNamespace('button')
 * ns.b()              // 'zc-button'
 * ns.e('icon')        // 'zc-button__icon'
 * ns.m('primary')     // 'zc-button--primary'
 * ns.em('icon','left') // 'zc-button__icon--left'
 * ns.is('disabled')   // 'is-disabled'
 * ns.is('loading', true) // 'is-loading'
 */
export function useNamespace(block: string) {
  const prefix = 'zc'

  /** block: zc-button */
  const b = () => `${prefix}-${block}`

  /** element: zc-button__icon */
  const e = (el: string) => (el ? `${b()}__${el}` : '')

  /** modifier: zc-button--primary */
  const m = (mod: string) => (mod ? `${b()}--${mod}` : '')

  /** element + modifier: zc-button__icon--left */
  const em = (el: string, mod: string) => (el && mod ? `${b()}__${el}--${mod}` : '')

  /** block + modifier: zc-button zc-button--primary */
  const bm = (mod: string) => (mod ? `${b()} ${b()}--${mod}` : b())

  /** state: is-disabled */
  const is = (name: string, state = true) => (state ? `is-${name}` : '')

  return { b, e, m, em, bm, is }
}
