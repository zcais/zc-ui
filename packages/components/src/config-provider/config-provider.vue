<script setup lang="ts">
/**
 * ZcConfigProvider - Global configuration provider component.
 *
 * Wraps a sub-tree of the component hierarchy and provides reactive
 * global configuration via Vue's provide/inject mechanism.
 *
 * Supported configurations:
 * 1. **size** — Default component size (large/medium/small/mini)
 * 2. **locale** — Internationalization language
 * 3. **zIndex** — Base z-index for overlays
 * 4. **namespace** — CSS class namespace prefix (multi-theme isolation)
 * 5. **button** — Button default behaviors
 * 6. **message** — Message default behaviors
 * 7. **notification** — Notification default behaviors
 * 8. **brandColors** — Brand color overrides (auto-generates color scales)
 * 9. **themeVariables** — Global CSS variable overrides
 * 10. **themeOverrides** — Per-component CSS variable overrides
 *
 * @example
 * <ZcConfigProvider :size="size" locale="en-US" :z-index="3000">
 *   <App />
 * </ZcConfigProvider>
 *
 * @example Theme overrides
 * <ZcConfigProvider
 *   :brand-colors="{ primary: '#722ed1' }"
 *   :theme-overrides="{
 *     Button: { '--zc-button-border-radius': '8px' },
 *   }"
 * >
 *   <App />
 * </ZcConfigProvider>
 */
import {
  computed,
  provide,
  watch,
  watchEffect,
  inject,
  ref,
  onBeforeUnmount,
  type ComputedRef,
} from 'vue'
import { useNamespace, setBaseZIndex } from '@zc-ui/hooks'
import { setLocale as setGlobalLocale } from '@zc-ui/locale'
import { generateColorScale } from '@zc-ui/theme'
import {
  configProviderInjectionKey,
  type ConfigProviderProps,
  type ConfigProviderContext,
  type ComponentSize,
} from './types'
import {
  setGlobalMessageConfig,
  setGlobalNotificationConfig,
} from './global-config'

defineOptions({ name: 'ZcConfigProvider', inheritAttrs: false })

const props = withDefaults(defineProps<ConfigProviderProps>(), {
  size: undefined,
  locale: undefined,
  zIndex: undefined,
  namespace: undefined,
  button: undefined,
  message: undefined,
  notification: undefined,
  brandColors: undefined,
  themeVariables: undefined,
  themeOverrides: undefined,
  as: undefined,
})

const ns = useNamespace('config-provider')

// ---- Merge with parent ConfigProvider (nested support) ----

const parentCtx = inject(configProviderInjectionKey, null)

/**
 * Each computed value falls back to the parent provider's value,
 * enabling nested ConfigProviders to override only specific keys.
 */
const mergedSize: ComputedRef<ComponentSize | undefined> = computed(
  () => props.size ?? parentCtx?.size.value,
)

const mergedLocale = computed(() => props.locale ?? parentCtx?.locale.value)

const mergedZIndex = computed(
  () => props.zIndex ?? parentCtx?.zIndex.value,
)

const mergedNamespace = computed(
  () => props.namespace ?? parentCtx?.namespace.value,
)

const mergedButton = computed(
  () => props.button ?? parentCtx?.button.value,
)

const mergedMessage = computed(
  () => props.message ?? parentCtx?.message.value,
)

const mergedNotification = computed(
  () => props.notification ?? parentCtx?.notification.value,
)

const mergedBrandColors = computed(
  () => props.brandColors ?? parentCtx?.brandColors.value,
)

const mergedThemeVariables = computed(
  () => props.themeVariables ?? parentCtx?.themeVariables.value,
)

const mergedThemeOverrides = computed(
  () => props.themeOverrides ?? parentCtx?.themeOverrides.value,
)

// ---- Sync locale to global locale system ----

watch(
  mergedLocale,
  (lang) => {
    if (lang) {
      setGlobalLocale(lang)
    }
  },
  { immediate: true },
)

// ---- Sync zIndex to global z-index system ----

watch(
  mergedZIndex,
  (val) => {
    if (val != null) {
      setBaseZIndex(val)
    }
  },
  { immediate: true },
)

// ---- Sync message / notification config for service-style APIs ----

watch(
  mergedMessage,
  (val) => {
    setGlobalMessageConfig(val ?? undefined)
  },
  { immediate: true },
)

watch(
  mergedNotification,
  (val) => {
    setGlobalNotificationConfig(val ?? undefined)
  },
  { immediate: true },
)

// ---- Apply brand colors at runtime ----

const rootRef = ref<HTMLElement | null>(null)

watchEffect(() => {
  const brandColors = mergedBrandColors.value
  if (!brandColors) return

  const target = rootRef.value ?? document.documentElement
  if (!target) return

  for (const [name, hex] of Object.entries(brandColors)) {
    if (hex) {
      const scale = generateColorScale(hex)
      for (const [step, value] of Object.entries(scale)) {
        target.style.setProperty(`--color-zc-${name}-${step}`, value)
      }
    }
  }
})

// ---- Apply global theme variables at runtime ----

watchEffect(() => {
  const themeVars = mergedThemeVariables.value
  if (!themeVars) return

  const target = rootRef.value ?? document.documentElement
  if (!target) return

  for (const [name, value] of Object.entries(themeVars)) {
    target.style.setProperty(name, value)
  }
})

// ---- Apply component-level theme overrides ----

/** Track the last applied overrides for cleanup */
let lastOverrides: Record<string, Record<string, string>> | null = null

watchEffect(() => {
  const overrides = mergedThemeOverrides.value
  const target = rootRef.value ?? document.documentElement

  if (!target) return

  // Clean up previously applied overrides
  if (lastOverrides) {
    for (const [, vars] of Object.entries(lastOverrides)) {
      for (const name of Object.keys(vars)) {
        target.style.removeProperty(name)
      }
    }
  }

  lastOverrides = overrides ? { ...overrides } : null

  if (!overrides) return

  // Apply new overrides
  for (const [, vars] of Object.entries(overrides)) {
    for (const [name, value] of Object.entries(vars)) {
      target.style.setProperty(name, value)
    }
  }
})

onBeforeUnmount(() => {
  // Clean up all applied theme overrides on unmount
  const target = rootRef.value ?? document.documentElement
  if (!target || !lastOverrides) return

  for (const [, vars] of Object.entries(lastOverrides)) {
    for (const name of Object.keys(vars)) {
      target.style.removeProperty(name)
    }
  }
})

// ---- Provide context ----

const context: ConfigProviderContext = {
  size: mergedSize,
  locale: mergedLocale,
  zIndex: mergedZIndex,
  namespace: mergedNamespace,
  button: mergedButton,
  message: mergedMessage,
  notification: mergedNotification,
  brandColors: mergedBrandColors,
  themeVariables: mergedThemeVariables,
  themeOverrides: mergedThemeOverrides,
}

provide(configProviderInjectionKey, context)
</script>

<template>
  <!--
    Renderless by default: only renders children.
    When `as` is specified, wraps children in the given element tag
    (useful for scoped styling / theme isolation areas).
  -->
  <component :is="as || 'div'" v-if="as" ref="rootRef" :class="ns.b()">
    <slot />
  </component>
  <slot v-else />
</template>
