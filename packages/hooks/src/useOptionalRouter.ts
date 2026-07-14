import { getCurrentInstance, computed, type ComputedRef } from 'vue'

/**
 * useOptionalRouter - Safely access the Vue Router instance.
 *
 * Encapsulates the `getCurrentInstance()` pattern in a composable so
 * individual components don't use it directly. Returns null when
 * vue-router is not installed.
 *
 * @example
 * const router = useOptionalRouter()
 * router.value?.push('/home')
 */
export function useOptionalRouter(): ComputedRef<any | null> {
  const instance = getCurrentInstance()
  return computed(() => instance?.appContext.config.globalProperties.$router ?? null)
}
