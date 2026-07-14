/**
 * @zc-ui/resolver
 *
 * Resolver for `unplugin-vue-components` and `unplugin-auto-import`.
 *
 * Enables automatic on-demand importing of ZC UI components.
 *
 * @example
 * ```ts
 * // vite.config.ts
 * import { defineConfig } from 'vite'
 * import Components from 'unplugin-vue-components/vite'
 * import { ZcUiResolver } from '@zc-ui/resolver'
 *
 * export default defineConfig({
 *   plugins: [
 *     Components({
 *       resolvers: [ZcUiResolver()],
 *     }),
 *   ],
 * })
 * ```
 *
 * @packageDocumentation
 */

export { ZcUiResolver, ZcUiResolverSSR, resolveZcComponent } from './resolver'
export { componentMap, functionMap, parentChildMap } from './component-map'
export type {
  ZcUiResolverOptions,
  ComponentResolver,
  ComponentResolverResult,
  ResolvedComponent,
} from './types'
