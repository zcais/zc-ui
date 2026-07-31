import { onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'

export interface UseMutationObserverOptions {
  /** Observe child list changes */
  childList?: boolean
  /** Observe subtree */
  subtree?: boolean
  /** Observe attribute changes */
  attributes?: boolean
  /** Observe character data changes */
  characterData?: boolean
  /** Specific attributes to observe */
  attributeFilter?: string[]
  /** Observe attribute old value */
  attributeOldValue?: boolean
  /** Observe character data old value */
  characterDataOldValue?: boolean
  /** Run immediately on mount */
  immediate?: boolean
}

/**
 * Observe DOM mutations on a target element.
 *
 * @example
 * ```ts
 * const el = ref<HTMLElement>()
 * const { isSupported } = useMutationObserver(
 *   el,
 *   (mutations) => { console.log('DOM changed', mutations) },
 *   { childList: true, subtree: true }
 * )
 * ```
 */
export function useMutationObserver(
  target: Ref<HTMLElement | null | undefined>,
  callback: MutationCallback,
  options: UseMutationObserverOptions = {}
) {
  const {
    childList = true,
    subtree = false,
    attributes = false,
    characterData = false,
    attributeFilter,
    attributeOldValue = false,
    characterDataOldValue = false,
    immediate = false,
  } = options

  const isSupported = ref(typeof MutationObserver !== 'undefined')
  let observer: MutationObserver | null = null

  function start() {
    if (!isSupported.value || !target.value) return

    observer = new MutationObserver(callback)
    observer.observe(target.value, {
      childList,
      subtree,
      attributes,
      characterData,
      attributeFilter,
      attributeOldValue,
      characterDataOldValue,
    })
  }

  function stop() {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    start()
    if (immediate && target.value) {
      callback([], observer!)
    }
  })

  // Re-observe when target changes
  watch(target, () => {
    stop()
    start()
  })

  onBeforeUnmount(() => {
    stop()
  })

  return {
    isSupported,
    stop,
    start,
  }
}

export default useMutationObserver
