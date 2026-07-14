import { ref, watch, type Ref } from 'vue'

type ForwardRefValue<T> = Ref<T | null> | ((el: T | null) => void)

/**
 * useForwardRef - Create a single ref that forwards its value to one or more target refs.
 *
 * Useful when a component needs to expose its internal ref while also
 * allowing the consumer to pass their own ref via `defineExpose`.
 *
 * @example
 * // Inside a child component
 * const internalRef = ref<HTMLElement | null>(null)
 * // Consumer ref is passed as a prop, forwarded from parent
 * const combined = useForwardRef(internalRef)
 *
 * @example
 * // Forward to multiple targets
 * const internal = ref<HTMLElement | null>(null)
 * const parentRef = ref<HTMLElement | null>(null)
 * const combined = useForwardRef(internal, (el) => { parentRef.value = el })
 */
export function useForwardRef<T>(
  ...targets: ForwardRefValue<T>[]
): Ref<T | null> {
  const source = ref<T | null>(null) as Ref<T | null>

  watch(source, (val) => {
    for (const target of targets) {
      if (typeof target === 'function') {
        target(val)
      } else {
        target.value = val
      }
    }
  })

  return source
}
