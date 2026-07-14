import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImports,
  addComponent,
} from '@nuxt/kit'
import type { Component } from '@zc-ui/components'
import * as ZcComponents from '@zc-ui/components'

/**
 * Module options for `@zc-ui/nuxt`.
 */
export interface ModuleOptions {
  /**
   * Whether to globally register all ZC UI components.
   * When `true` (default), all components are auto-imported.
   * Set to `false` to manually import only what you need.
   *
   * @default true
   */
  components?: boolean

  /**
   * Whether to auto-import composables (useMessage, useNotification, useLoading, etc.)
   *
   * @default true
   */
  composables?: boolean

  /**
   * Whether to inject the default CSS theme.
   *
   * @default true
   */
  styles?: boolean

  /**
   * Component name prefix.
   *
   * @default 'Zc'
   */
  prefix?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@zc-ui/nuxt',
    configKey: 'zcUi',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  defaults: {
    components: true,
    composables: true,
    styles: true,
    prefix: 'Zc',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // ---- 1. Transpile @zc-ui packages for SSR ----
    nuxt.options.build.transpile.push('@zc-ui/components')
    nuxt.options.build.transpile.push('@zc-ui/utils')
    nuxt.options.build.transpile.push('@zc-ui/hooks')
    nuxt.options.build.transpile.push('@zc-ui/locale')

    // ---- 2. Inject CSS theme ----
    if (options.styles) {
      nuxt.options.css.push('@zc-ui/theme/dist/index.css')
    }

    // ---- 3. Register a plugin for imperative APIs (message, notification, loading) ----
    // The plugin runs on client-side and provides app-level context.
    addPlugin({
      src: resolve('./runtime/plugin'),
      mode: 'client',
    })

    // ---- 4. Auto-register components ----
    if (options.components) {
      const prefix = options.prefix ?? 'Zc'
      for (const [exportName, component] of Object.entries(ZcComponents)) {
        // Skip non-component exports (types, functions, etc.)
        if (exportName.startsWith('Zc') && typeof component === 'object' && component !== null && 'install' in component) {
          addComponent({
            name: exportName,
            filePath: '@zc-ui/components',
            export: exportName,
            // Ensure SSR-friendly: components resolve their own environment
            mode: 'all',
          })
        }
      }

      // Also register the imperative API components
      void prefix
    }

    // ---- 5. Auto-import composables ----
    if (options.composables) {
      // Hooks from @zc-ui/hooks
      const hookComposables = [
        'useNamespace',
        'useEventListener',
        'useClickOutside',
        'useSize',
        'useZIndex',
        'useId',
        'useFocusTrap',
        'useTimeoutFn',
        'useIntervalFn',
        'useDebounce',
        'useDebounceFn',
        'useThrottle',
        'useThrottleFn',
        'useScroll',
        'useStorage',
        'useLocalStorage',
        'useSessionStorage',
        'useMediaQuery',
        'useBreakpoints',
        'useClipboard',
        'useResizeObserver',
        'useIntersectionObserver',
        'useDark',
        'useColorMode',
        'useToggle',
      ]

      for (const name of hookComposables) {
        addImports({
          name,
          from: '@zc-ui/hooks',
        })
      }

      // Imperative APIs from @zc-ui/components
      const apiComposables = [
        'ZcMessage',
        'ZcMessageCloseAll',
        'ZcNotification',
        'ZcNotificationCloseAll',
        'ZcLoadingDirective',
        'ZcLoadingService',
      ]

      for (const name of apiComposables) {
        addImports({
          name,
          from: '@zc-ui/components',
        })
      }

      // SSR utilities from @zc-ui/utils
      addImports({
        name: 'isClient',
        from: '@zc-ui/utils',
      })
      addImports({
        name: 'isServer',
        from: '@zc-ui/utils',
      })
    }

    // Provide runtime config
    nuxt.options.runtimeConfig.public.zcUi = {
      components: options.components,
      composables: options.composables,
      styles: options.styles,
      prefix: options.prefix,
    }
  },
})

export type { ModuleOptions }
// Re-export types for consumers
export type { Component }
