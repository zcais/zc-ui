import { computed, watch, type Ref, type WritableComputedRef } from 'vue'
import { isClient } from '@zc-ui/utils'
import { useLocalStorage } from './useStorage'
import { useMediaQuery } from './useMediaQuery'

export type ColorMode = 'light' | 'dark' | 'auto'

/**
 * Options for useColorMode.
 */
export interface UseColorModeOptions {
  /** Attribute applied to html element to signal the mode. Default: 'data-theme' */
  attribute?: string
  /** CSS selector for the root element. Default: 'html' */
  selector?: string
  /** Initial mode when no stored preference. Default: 'auto' */
  initialValue?: ColorMode
  /** Storage key for persistence. Default: 'zc-color-mode' */
  storageKey?: string
  /** Map mode to attribute value. Default: mode-as-is */
  modes?: Record<string, string>
}

/**
 * useColorMode - Reactive color mode (light/dark/auto) with persistence.
 *
 * When mode is 'auto', it follows the system preference via `prefers-color-scheme`.
 * Applies the mode to a root element attribute for CSS targeting.
 *
 * @example
 * const { mode, isDark, store } = useColorMode()
 * mode.value = 'dark'
 */
export function useColorMode(
  options: UseColorModeOptions = {}
): {
  mode: WritableComputedRef<ColorMode>
  isDark: Ref<boolean>
  store: Ref<ColorMode>
  system: Ref<ColorMode>
} {
  const {
    attribute = 'data-theme',
    selector = 'html',
    initialValue = 'auto',
    storageKey = 'zc-color-mode',
    modes,
  } = options

  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const system = computed<ColorMode>(() => (systemPrefersDark.value ? 'dark' : 'light'))

  const store = useLocalStorage<ColorMode>(storageKey, initialValue)

  const mode = computed<ColorMode>({
    get() {
      return store.value
    },
    set(val) {
      store.value = val
    },
  })

  const isDark = computed<boolean>(() => {
    const resolved = mode.value === 'auto' ? system.value : mode.value
    return resolved === 'dark'
  })

  const applyMode = () => {
    if (!isClient) return
    const el = document.querySelector(selector)
    if (!el) return

    const resolved = mode.value === 'auto' ? system.value : mode.value
    const attrVal = modes?.[resolved] ?? resolved
    el.setAttribute(attribute, attrVal)
  }

  watch([mode, systemPrefersDark], applyMode, { immediate: true })

  return { mode, isDark, store, system }
}

/**
 * Options for useDark.
 */
export interface UseDarkOptions {
  /** CSS selector for the root element. Default: 'html' */
  selector?: string
  /** Attribute applied to html element. Default: 'class' */
  attribute?: string
  /** Value to add when dark. Default: 'dark' */
  valueDark?: string
  /** Value to add when light. Default: '' (removes attribute) */
  valueLight?: string
  /** Storage key. Default: 'zc-dark-mode' */
  storageKey?: string
}

/**
 * useDark - Reactive dark mode toggle with system preference support.
 *
 * @example
 * const { isDark, toggle } = useDark()
 * toggle() // switch dark/light
 */
export function useDark(
  options: UseDarkOptions = {}
): {
  isDark: WritableComputedRef<boolean>
  toggle: () => void
} {
  const {
    selector = 'html',
    attribute = 'class',
    valueDark = 'dark',
    valueLight = '',
    storageKey = 'zc-dark-mode',
  } = options

  const stored = useLocalStorage<boolean>(storageKey, false)

  const isDark = computed<boolean>({
    get() {
      return stored.value
    },
    set(val) {
      stored.value = val
    },
  })

  const applyDark = (dark: boolean) => {
    if (!isClient) return
    const el = document.querySelector(selector)
    if (!el) return

    if (attribute === 'class') {
      const cls = el.getAttribute('class') || ''
      const classes = cls.split(/\s+/).filter(Boolean)
      if (dark && !classes.includes(valueDark)) {
        classes.push(valueDark)
      } else if (!dark) {
        const idx = classes.indexOf(valueDark)
        if (idx >= 0) classes.splice(idx, 1)
      }
      el.setAttribute('class', classes.join(' '))
    } else {
      if (dark) {
        el.setAttribute(attribute, valueDark)
      } else {
        if (valueLight) {
          el.setAttribute(attribute, valueLight)
        } else {
          el.removeAttribute(attribute)
        }
      }
    }
  }

  watch(isDark, applyDark, { immediate: true })

  const toggle = () => {
    isDark.value = !isDark.value
  }

  return { isDark, toggle }
}
