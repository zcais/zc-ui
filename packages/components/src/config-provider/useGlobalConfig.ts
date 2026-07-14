/**
 * useGlobalConfig - Inject the ConfigProvider context in child components.
 *
 * Any descendant of `<ZcConfigProvider>` can call this composable to
 * access the reactive global configuration.
 *
 * @example
 * import { useGlobalConfig } from '@zc-ui/components'
 *
 * const { size, locale, zIndex } = useGlobalConfig()
 * // size.value → 'small' (if configured by an ancestor ConfigProvider)
 *
 * @example
 * // Get only size with a local fallback
 * const { size } = useGlobalConfig()
 * const effectiveSize = computed(() => size.value ?? 'medium')
 */
import { computed, inject } from 'vue'
import {
  configProviderInjectionKey,
  type ConfigProviderContext,
} from './types'

/**
 * A safe default context returned when no ConfigProvider ancestor is found.
 * All fields are ComputedRefs that resolve to `undefined`, allowing
 * safe destructuring without runtime errors:
 *
 * ```ts
 * const { size } = useGlobalConfig()
 * size.value // undefined (not a TypeError)
 * ```
 */
const defaultContext: ConfigProviderContext = {
  size: computed(() => undefined),
  locale: computed(() => undefined),
  zIndex: computed(() => undefined),
  namespace: computed(() => undefined),
  button: computed(() => undefined),
  message: computed(() => undefined),
  notification: computed(() => undefined),
  brandColors: computed(() => undefined),
  themeVariables: computed(() => undefined),
  themeOverrides: computed(() => undefined),
}

export function useGlobalConfig(): ConfigProviderContext
export function useGlobalConfig<T>(key: keyof ConfigProviderContext): T | undefined
export function useGlobalConfig<T>(
  key?: keyof ConfigProviderContext,
): ConfigProviderContext | T | undefined {
  const ctx = inject(configProviderInjectionKey, undefined)
  if (!ctx) {
    // Return a safe default context so destructuring never throws
    return key ? undefined : defaultContext
  }
  return key ? (ctx[key] as unknown as T) : ctx
}
