/**
 * Ambient augmentation for `import.meta`.
 *
 * These fields are injected by the bundler (Vite ≥ 3.1, Nuxt ≥ 3) at build
 * time and are not present in the stock `ImportMeta` type shipped with
 * TypeScript. Declaring them here lets library code reference them without
 * per-line `@ts-expect-error` directives.
 */
interface ImportMeta {
  /** `true` in browser builds (Vite/Nuxt). `undefined` in raw Node/Webpack. */
  readonly client?: boolean
  /** Vite environment variables. */
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
