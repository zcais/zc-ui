import { guid } from '@zc-ui/utils'

let idCounter = 0

/**
 * useId - Generate a stable unique ID for use in the DOM.
 * The ID is generated once at setup time and persists across re-renders,
 * making it ideal for ARIA associations and label/input pairings.
 *
 * @example
 * const { id } = useId('input')
 * // id === 'input-xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx-0'
 */
export function useId(prefix = 'zc'): { id: string } {
  const id = `${prefix}-${guid()}-${++idCounter}`
  return { id }
}
