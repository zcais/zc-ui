import { onBeforeUnmount, getCurrentInstance } from 'vue'

/**
 * Options for useTimeoutFn.
 */
export interface UseTimeoutFnOptions {
  /** Start the timer immediately. Default: true */
  immediate?: boolean
}

/**
 * useTimeoutFn - A wrapper for `setTimeout` with reactive controls.
 *
 * Automatically clears the timer on component unmount.
 *
 * @example
 * const { start, stop, isPending } = useTimeoutFn(() => {
 *   console.log('Fired after 2s')
 * }, 2000)
 *
 * // Cancel manually
 * stop()
 */
export function useTimeoutFn(
  callback: () => void,
  delay: number,
  options: UseTimeoutFnOptions = {}
): {
  start: () => void
  stop: () => void
  isPending: () => boolean
} {
  const { immediate = true } = options
  let timer: ReturnType<typeof setTimeout> | null = null
  let pending = false

  const clear = () => {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  const stop = () => {
    pending = false
    clear()
  }

  const start = () => {
    clear()
    pending = true
    timer = setTimeout(() => {
      pending = false
      timer = null
      callback()
    }, delay)
  }

  if (immediate) {
    start()
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(stop)
  }

  return {
    start,
    stop,
    isPending: () => pending,
  }
}

/**
 * Options for useIntervalFn.
 */
export interface UseIntervalFnOptions {
  /** Start the interval immediately. Default: true */
  immediate?: boolean
}

/**
 * useIntervalFn - A wrapper for `setInterval` with reactive controls.
 *
 * Automatically clears the interval on component unmount.
 *
 * @example
 * const { start, stop, isPending } = useIntervalFn(() => {
 *   console.log('Tick')
 * }, 1000)
 */
export function useIntervalFn(
  callback: () => void,
  interval: number,
  options: UseIntervalFnOptions = {}
): {
  start: () => void
  stop: () => void
  isPending: () => boolean
} {
  const { immediate = true } = options
  let timer: ReturnType<typeof setInterval> | null = null
  let pending = false

  const clear = () => {
    if (timer !== null) {
      clearInterval(timer)
      timer = null
    }
  }

  const stop = () => {
    pending = false
    clear()
  }

  const start = () => {
    clear()
    pending = true
    timer = setInterval(callback, interval)
  }

  if (immediate) {
    start()
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(stop)
  }

  return {
    start,
    stop,
    isPending: () => pending,
  }
}
