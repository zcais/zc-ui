import { ref, computed } from 'vue'

/**
 * Base z-index for ZC UI overlays.
 * All popups/dropdowns/modals will start above this value.
 *
 * This is a mutable ref so ConfigProvider can override it at runtime
 * via `setBaseZIndex()`.
 */
const BASE_Z_INDEX = ref(1300)

/**
 * useZIndex - Manage z-index values for popup/dropdown/modal layers.
 * Each call to `nextZIndex()` returns a monotonically increasing value,
 * ensuring newly opened layers always appear above previously opened ones.
 *
 * @example
 * const { currentZIndex, nextZIndex } = useZIndex()
 *
 * const dropdownStyle = computed(() => ({
 *   zIndex: nextZIndex()
 * }))
 */
export function useZIndex() {
  const currentZIndex = computed(() => BASE_Z_INDEX.value)

  /**
   * Increment and return the next available z-index.
   */
  const nextZIndex = (): number => {
    return ++BASE_Z_INDEX.value
  }

  /**
   * Reset z-index back to base value.
   * Useful for tests or full-page teardown.
   */
  const resetZIndex = (): void => {
    BASE_Z_INDEX.value = 1300
  }

  return {
    currentZIndex,
    nextZIndex,
    resetZIndex,
  }
}

/**
 * Set the base z-index at runtime.
 * Called by ConfigProvider when the `zIndex` prop is provided.
 */
export function setBaseZIndex(value: number): void {
  BASE_Z_INDEX.value = value
}

/**
 * Get the current base z-index value.
 */
export function getBaseZIndex(): number {
  return BASE_Z_INDEX.value
}
