/**
 * Ambient augmentation for `import.meta`.
 *
 * `env` is injected by Vite at build time and is not part of the stock
 * `ImportMeta` type. Declared here so library code can reference
 * `import.meta.env.DEV` without per-line `@ts-expect-error` directives.
 */
interface ImportMeta {
  readonly env?: ImportMetaEnv
}

interface ImportMetaEnv {
  readonly DEV?: boolean
  readonly PROD?: boolean
  readonly SSR?: boolean
  readonly MODE?: string
  readonly BASE_URL?: string
  readonly [key: string]: unknown
}
