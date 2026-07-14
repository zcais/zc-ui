import { ref, watch, type Ref } from 'vue'
import { isClient } from '@zc-ui/utils'

/**
 * Options for useStorage.
 */
export interface UseStorageOptions<T> {
  /** Whether to watch and persist changes. Default: true */
  watch?: boolean
  /** Deep watch nested objects. Default: true */
  deep?: boolean
  /** Override the default JSON serializer */
  serializer?: {
    read: (raw: string) => T
    write: (value: T) => string
  }
  /** Listen to storage events from other tabs */
  listenToStorageEvents?: boolean
}

function getStorage(key: string, storage: Storage, deserializer: (raw: string) => any): any {
  try {
    const raw = storage.getItem(key)
    if (raw === null) return null
    return deserializer(raw)
  } catch {
    return null
  }
}

/**
 * useStorage - Reactive state that is persisted to a Web Storage (localStorage/sessionStorage).
 *
 * Changes to the returned ref are automatically written to storage.
 *
 * @example
 * const token = useStorage('auth_token', '')
 * token.value = 'abc123' // persisted to localStorage
 *
 * @example
 * // With sessionStorage
 * const session = useStorage('session', {}, sessionStorage)
 */
export function useStorage<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: T,
  storage: Storage | undefined = isClient ? localStorage : undefined,
  options: UseStorageOptions<T> = {}
): Ref<T> {
  const {
    watch: shouldWatch = true,
    deep = true,
    serializer = { read: (raw: string) => JSON.parse(raw) as T, write: (value: T) => JSON.stringify(value) },
    listenToStorageEvents = true,
  } = options

  const read = (): T => {
    if (!storage) return initialValue
    const stored = getStorage(key, storage, serializer.read)
    return stored !== null ? (stored as T) : initialValue
  }

  const data = ref<T>(read()) as Ref<T>

  const write = (value: T) => {
    if (!storage) return
    try {
      if (value === null || value === undefined) {
        storage.removeItem(key)
      } else {
        storage.setItem(key, serializer.write(value))
      }
    } catch {
      // storage might be full or unavailable
    }
  }

  if (shouldWatch) {
    watch(
      data,
      (newVal) => write(newVal as T),
      { deep }
    )
  }

  // Sync across tabs
  if (listenToStorageEvents && isClient) {
    window.addEventListener('storage', (e) => {
      if (e.key === key) {
        data.value = read()
      }
    })
  }

  return data
}

/**
 * useLocalStorage - Shorthand for useStorage with localStorage.
 *
 * @example
 * const settings = useLocalStorage('theme', { dark: false })
 */
export function useLocalStorage<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = {}
): Ref<T> {
  return useStorage(key, initialValue, isClient ? localStorage : undefined, options)
}

/**
 * useSessionStorage - Shorthand for useStorage with sessionStorage.
 *
 * @example
 * const temp = useSessionStorage('temp', '')
 */
export function useSessionStorage<T extends string | number | boolean | object | null>(
  key: string,
  initialValue: T,
  options: UseStorageOptions<T> = {}
): Ref<T> {
  return useStorage(key, initialValue, isClient ? sessionStorage : undefined, options)
}
