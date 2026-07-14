import { ref, computed, onBeforeUnmount, getCurrentInstance, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'

/**
 * useMediaQuery - Reactively track a CSS media query.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * // isMobile.value === true/false
 */
export function useMediaQuery(query: string): Ref<boolean> {
  const matches = ref(false)

  if (!isClient || typeof window.matchMedia !== 'function') {
    return matches
  }

  const mql = window.matchMedia(query)

  const update = () => {
    matches.value = mql.matches
  }

  // Set initial value
  update()

  // Listen for changes
  if (mql.addEventListener) {
    mql.addEventListener('change', update)
    if (getCurrentInstance()) {
      onBeforeUnmount(() => mql.removeEventListener('change', update))
    }
  } else {
    // Safari < 14 fallback
    mql.addListener(update)
    if (getCurrentInstance()) {
      onBeforeUnmount(() => mql.removeListener(update))
    }
  }

  return matches
}

// ---------------------------------------------------------------
// Breakpoints (following common design systems)
// ---------------------------------------------------------------

export interface BreakpointsConfig {
  [key: string]: number
}

/** Default breakpoints matching Bootstrap/Element Plus conventions (min-width in px) */
export const DEFAULT_BREAKPOINTS: BreakpointsConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
}

/**
 * useBreakpoints - Reactive breakpoints utility.
 *
 * @example
 * const { current, isMobile, isTablet, isDesktop } = useBreakpoints()
 *
 * @example
 * // With custom breakpoints
 * const { current } = useBreakpoints({ small: 0, medium: 600, large: 1024 })
 */
export function useBreakpoints(breakpoints: BreakpointsConfig = DEFAULT_BREAKPOINTS) {
  const entries = Object.entries(breakpoints).sort((a, b) => a[1] - b[1])

  // Create media query refs for each breakpoint
  const matched = entries.map(([name, min]) => {
    const max = entries[entries.findIndex(e => e[0] === name) + 1]
    const maxVal = max ? max[1] : Infinity
    const query =
      maxVal === Infinity
        ? `(min-width: ${min}px)`
        : `(min-width: ${min}px) and (max-width: ${maxVal - 0.02}px)`
    return { name, matches: useMediaQuery(query) }
  })

  const current = computed(() => {
    for (const { name, matches } of matched) {
      if (matches.value) return name
    }
    return entries[entries.length - 1]?.[0] ?? 'unknown'
  })

  // Helper to check if at or above a named breakpoint
  const isAtLeast = (name: string): boolean => {
    const minPx = breakpoints[name]
    if (minPx === undefined) return false
    const mql = useMediaQuery(`(min-width: ${minPx}px)`)
    return mql.value
  }

  // Helper to check if below a named breakpoint
  const isBelow = (name: string): boolean => {
    const minPx = breakpoints[name]
    if (minPx === undefined) return false
    const mql = useMediaQuery(`(max-width: ${minPx - 0.02}px)`)
    return mql.value
  }

  // Pre-computed common helpers
  const isMobile = computed(() => current.value === 'xs' || current.value === 'sm')
  const isTablet = computed(() => current.value === 'md')
  const isDesktop = computed(() => current.value === 'lg' || current.value === 'xl' || current.value === 'xxl')

  return {
    current,
    matched,
    isAtLeast,
    isBelow,
    isMobile,
    isTablet,
    isDesktop,
  }
}
