import { componentMap, functionMap } from './component-map'
import type {
  ZcUiResolverOptions,
  ResolvedComponent,
  ComponentResolver,
} from './types'

/**
 * Default options merged with user-provided options.
 */
function resolveOptions(options: ZcUiResolverOptions = {}): Required<
  Omit<ZcUiResolverOptions, 'include'>
> & {
  include?: string[]
} {
  return {
    importStyle: 'full',
    ssr: false,
    packageName: '@zc-ui/components',
    stylePath: '@zc-ui/components/styles',
    exclude: [],
    prefix: 'Zc',
    ...options,
  }
}

/**
 * Builds the CSS side effects array based on the component directory and options.
 */
function buildSideEffects(
  componentDir: string,
  opts: ReturnType<typeof resolveOptions>,
): string[] | undefined {
  if (opts.importStyle === false) {
    return undefined
  }

  if (opts.importStyle === 'full') {
    return [opts.stylePath]
  }

  // Per-component CSS
  return [`${opts.stylePath}/${componentDir}.css`]
}

/**
 * Gets the component directory name from the component map.
 * Returns `null` if the component is not found.
 */
function getComponentDir(
  name: string,
): string | null {
  return componentMap[name] ?? null
}

/**
 * ZC UI Resolver for `unplugin-vue-components`.
 *
 * Automatically resolves `ZcXxx` components used in `<template>` to
 * on-demand imports from `@zc-ui/components`, including optional CSS.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import Components from 'unplugin-vue-components/vite'
 * import { ZcUiResolver } from '@zc-ui/resolver'
 *
 * export default {
 *   plugins: [
 *     Components({
 *       resolvers: [ZcUiResolver()],
 *     }),
 *   ],
 * }
 * ```
 *
 * @example SSR mode
 * ```ts
 * Components({
 *   resolvers: [ZcUiResolver({ ssr: true })],
 * })
 * ```
 *
 * @example Per-component CSS
 * ```ts
 * Components({
 *   resolvers: [ZcUiResolver({ importStyle: 'component' })],
 * })
 * ```
 */
export function ZcUiResolver(
  options: ZcUiResolverOptions = {},
): ComponentResolver {
  const opts = resolveOptions(options)

  return {
    type: 'component' as const,
    resolve: (name: string): ResolvedComponent | null => {
      // Check prefix
      if (!name.startsWith(opts.prefix)) {
        return null
      }

      // Check exclusions
      if (opts.exclude.includes(name)) {
        return null
      }

      // Check inclusions (if specified)
      if (opts.include && !opts.include.includes(name)) {
        return null
      }

      // For custom prefixes, map to the canonical Zc-prefixed name
      const canonicalName =
        opts.prefix === 'Zc'
          ? name
          : 'Zc' + name.slice(opts.prefix.length)

      // Resolve functional APIs (ZcMessage, ZcNotification, etc.)
      if (functionMap[canonicalName]) {
        const fn = functionMap[canonicalName]
        return {
          name: canonicalName,
          from: fn.from,
          sideEffects: opts.importStyle !== false
            ? fn.sideEffects
            : undefined,
        }
      }

      // Resolve components
      const componentDir = getComponentDir(canonicalName)
      if (componentDir === null) {
        return null
      }

      const sideEffects = buildSideEffects(componentDir, opts)

      return {
        name: canonicalName,
        from: opts.packageName,
        sideEffects,
      }
    },
  }
}

/**
 * Standalone resolve function for manual use or testing.
 *
 * Returns the resolved component info without wrapping in a
 * `ComponentResolver` object.
 *
 * @example
 * ```ts
 * import { resolveZcComponent } from '@zc-ui/resolver'
 *
 * const result = resolveZcComponent('ZcButton')
 * // { name: 'ZcButton', from: '@zc-ui/components', sideEffects: ['@zc-ui/components/styles'] }
 * ```
 */
export function resolveZcComponent(
  name: string,
  options: ZcUiResolverOptions = {},
): ResolvedComponent | null | undefined {
  const resolver = ZcUiResolver(options)
  return resolver.resolve(name)
}

/**
 * SSR-compatible resolver.
 *
 * Shortcut for `ZcUiResolver({ ssr: true })`.
 *
 * @example
 * ```ts
 * import Components from 'unplugin-vue-components/vite'
 * import { ZcUiResolverSSR } from '@zc-ui/resolver'
 *
 * Components({
 *   resolvers: [ZcUiResolverSSR()],
 * })
 * ```
 */
export function ZcUiResolverSSR(
  options: Omit<ZcUiResolverOptions, 'ssr'> = {},
): ComponentResolver {
  return ZcUiResolver({ ...options, ssr: true })
}
