import { getCurrentInstance, onBeforeUnmount } from 'vue'

/**
 * useDebounce - Create a debounced function with controls.
 *
 * The function call is delayed until `delay` ms of inactivity.
 *
 * @example
 * const { run, cancel } = useDebounce((q: string) => search(q), 300)
 * run('hello') // execute after 300ms of no further calls
 */
export function useDebounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200
): {
  run: (...args: Parameters<T>) => void
  cancel: () => void
} {
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const run = (...args: Parameters<T>) => {
    lastArgs = args
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      if (lastArgs) {
        fn(...lastArgs)
        lastArgs = null
      }
      timer = null
    }, delay)
  }

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    lastArgs = null
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(cancel)
  }

  return { run, cancel }
}

/**
 * useDebounceFn - Returns a single debounced function with `.cancel()`.
 *
 * @example
 * const debounced = useDebounceFn((q: string) => search(q), 300)
 * debounced('hello')
 * debounced.cancel()
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 200
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { run, cancel } = useDebounce(fn, delay)
  const fn2 = run as ((...args: Parameters<T>) => void) & { cancel: () => void }
  fn2.cancel = cancel
  return fn2
}

/**
 * useThrottle - Create a throttled function with controls.
 *
 * The function is called at most once per `interval` ms.
 * Trailing calls are queued so the last call is always executed.
 *
 * @example
 * const { run, cancel } = useThrottle(() => onScroll(), 100)
 */
export function useThrottle<T extends (...args: any[]) => any>(
  fn: T,
  interval = 200
): {
  run: (...args: Parameters<T>) => void
  cancel: () => void
} {
  let lastTime = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let lastArgs: Parameters<T> | null = null

  const run = (...args: Parameters<T>) => {
    const now = Date.now()
    const remaining = interval - (now - lastTime)
    lastArgs = args

    if (remaining <= 0) {
      lastTime = now
      if (timer !== null) {
        clearTimeout(timer)
        timer = null
      }
      fn(...args)
      lastArgs = null
    } else if (timer === null) {
      timer = setTimeout(() => {
        lastTime = Date.now()
        timer = null
        if (lastArgs) {
          fn(...lastArgs)
          lastArgs = null
        }
      }, remaining)
    }
  }

  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
    lastArgs = null
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(cancel)
  }

  return { run, cancel }
}

/**
 * useThrottleFn - Returns a single throttled function with `.cancel()`.
 *
 * @example
 * const throttled = useThrottleFn(() => onScroll(), 100)
 * throttled()
 * throttled.cancel()
 */
export function useThrottleFn<T extends (...args: any[]) => any>(
  fn: T,
  interval = 200
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { run, cancel } = useThrottle(fn, interval)
  const fn2 = run as ((...args: Parameters<T>) => void) & { cancel: () => void }
  fn2.cancel = cancel
  return fn2
}
