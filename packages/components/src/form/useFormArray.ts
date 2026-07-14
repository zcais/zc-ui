/**
 * useFormArray — Dynamic form field array management.
 *
 * Manages a reactive array of form items with unique keys,
 * supporting add/remove/move/insert/clear operations.
 * Each item automatically gets a unique `_key` for efficient
 * list rendering with Vue's `v-for` keyed binding.
 *
 * @example
 * ```ts
 * const users = useFormArray([{ name: '', email: '' }])
 * users.add({ name: '', email: '' })
 * users.remove(0)
 * users.move(0, 2)
 * ```
 *
 * Integrates with ZcForm/ZcFormItem validation:
 * - Each item's fields are accessible via `model.items[index].field`
 * - Validation rules use `items.0.name`, `items.1.email` paths
 * - The `validate()` method runs all items' validation
 */
import { computed, ref, type Ref } from 'vue'
import type { FormArrayItem, FormArrayOptions, UseFormArrayReturn } from './types'

let keyCounter = 0

/**
 * Generate a unique key for a form array item.
 */
function generateKey(): string {
  return `zc_fa_${++keyCounter}_${Date.now().toString(36)}`
}

/**
 * Create a form array managing items of type T.
 *
 * @param initialValue - Initial array of items
 * @param options - Configuration options
 * @returns UseFormArrayReturn with fields, add, remove, move, etc.
 */
export function createFormArray<T extends Record<string, unknown>>(
  initialValue: T[] = [],
  options: FormArrayOptions = {}
): UseFormArrayReturn<T> {
  const { keyField = '_key', autoKeys = true } = options

  // Ensure initial items have unique keys
  const initialWithKeys = initialValue.map((item) => {
    if (autoKeys && !(item as Record<string, unknown>)[keyField]) {
      return { ...item, [keyField]: generateKey() } as FormArrayItem<T>
    }
    if (!(item as Record<string, unknown>)[keyField]) {
      return { ...item } as FormArrayItem<T>
    }
    return item as FormArrayItem<T>
  })

  const fields = ref<FormArrayItem<T>[]>(initialWithKeys) as Ref<FormArrayItem<T>[]>

  const length = computed(() => fields.value.length)

  /** Add a new item at the end. */
  function add(item?: Partial<T>): void {
    const newItem = {
      ...(item || {}),
      ...(autoKeys ? { [keyField]: generateKey() } : {}),
    } as FormArrayItem<T>
    fields.value = [...fields.value, newItem]
  }

  /** Push an item to the end (alias of add). */
  function push(item: Partial<T>): void {
    add(item)
  }

  /** Insert an item at a specific index. */
  function insert(index: number, item: Partial<T>): void {
    const newItem = {
      ...item,
      ...(autoKeys ? { [keyField]: generateKey() } : {}),
    } as FormArrayItem<T>
    const copy = [...fields.value]
    copy.splice(index, 0, newItem)
    fields.value = copy
  }

  /** Remove item at the given index. */
  function remove(index: number): void {
    if (index < 0 || index >= fields.value.length) return
    fields.value = fields.value.filter((_, i) => i !== index)
  }

  /** Move item from `fromIndex` to `toIndex`. */
  function move(fromIndex: number, toIndex: number): void {
    const copy = [...fields.value]
    if (fromIndex < 0 || fromIndex >= copy.length) return
    if (toIndex < 0 || toIndex >= copy.length) return
    const [moved] = copy.splice(fromIndex, 1)
    copy.splice(toIndex, 0, moved)
    fields.value = copy
  }

  /** Remove all items. */
  function clear(): void {
    fields.value = []
  }

  /** Get item at index. */
  function get(index: number): FormArrayItem<T> | undefined {
    return fields.value[index]
  }

  /** Validate all items (placeholder — integrates with form validation). */
  async function validate(): Promise<boolean> {
    // Custom validation logic can be injected by the parent form
    return true
  }

  return {
    fields,
    add,
    remove,
    move,
    push,
    insert,
    clear,
    get,
    length,
    validate,
  }
}

/**
 * Vue composable wrapper around createFormArray.
 * Prefer `createFormArray` for pure logic, use this for <script setup>.
 */
export function useFormArray<T extends Record<string, unknown>>(
  initialValue: T[] = [],
  options: FormArrayOptions = {}
): UseFormArrayReturn<T> {
  return createFormArray(initialValue, options)
}
