/**
 * Type definitions for the ZC UI resolver.
 */

/**
 * Options for the ZC UI component resolver.
 */
export interface ZcUiResolverOptions {
  /**
   * Whether to import CSS styles automatically.
   *
   * - `'full'` — Import the entire stylesheet (recommended for most projects).
   * - `'component'` — Import per-component CSS (requires per-component CSS build).
   * - `false` — Don't import any CSS.
   *
   * @default 'full'
   */
  importStyle?: 'full' | 'component' | false

  /**
   * Whether the project uses SSR (Server-Side Rendering).
   *
   * When enabled, the resolver uses CJS-compatible import paths.
   *
   * @default false
   */
  ssr?: boolean

  /**
   * Custom package name for ZC UI components.
   *
   * Useful if the package is published under a different name or
   * you're using a fork.
   *
   * @default '@zc-ui/components'
   */
  packageName?: string

  /**
   * Custom CSS import path prefix.
   *
   * When `importStyle` is `'full'`, CSS is imported from
   * `${stylePath}`. When `importStyle` is `'component'`, CSS is imported from
   * `${stylePath}/${componentDir}.css`.
   *
   * @default '@zc-ui/components/styles'
   */
  stylePath?: string

  /**
   * List of component names to exclude from auto-import.
   *
   * Example: `['ZcMessage', 'ZcNotification']`
   *
   * @default []
   */
  exclude?: string[]

  /**
   * Only resolve these component names.
   * If set, only listed components will be auto-imported.
   *
   * @default undefined (resolve all)
   */
  include?: string[]

  /**
   * Prefix for component names.
   * Components in templates must start with this prefix to be resolved.
   *
   * @default 'Zc'
   */
  prefix?: string
}

/**
 * Return type of the resolver function.
 * Compatible with `unplugin-vue-components` ComponentResolver interface.
 */
export interface ComponentResolverResult {
  type: 'component'
  resolve: (name: string) => ResolvedComponent | null | undefined
}

export interface ResolvedComponent {
  /** The export name to import */
  name: string
  /** The module path to import from */
  from: string
  /** CSS side effects to import */
  sideEffects?: string[]
}

/**
 * A component resolver compatible with `unplugin-vue-components`.
 * Returns `{ type, resolve }` object.
 */
export type ComponentResolver = ComponentResolverResult
