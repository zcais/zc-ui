/**
 * SSR (Server-Side Rendering) environment detection utilities.
 *
 * These helpers provide safe guards for code that must only execute in a browser.
 * They are compatible with:
 *   - Vite (import.meta.client / import.meta.env.SSR)
 *   - Nuxt 3 (import.meta.client)
 *   - Webpack/vm-based SSR (typeof window checks)
 *   - jsdom / happy-dom test environments
 */

/**
 * Runtime check: `true` when running in a browser with DOM access.
 *
 * Uses `typeof window` so it works in ALL bundlers/runtimes (Vite, Nuxt, Webpack,
 * Node SSR, jsdom, happy-dom). This is the **most reliable** check and serves as
 * the single source of truth — `isClient` in `dom.ts` re-exports this value.
 */
export const isClient: boolean = typeof window !== 'undefined' && typeof document !== 'undefined'

/**
 * Runtime check: `true` when running on the server (Node.js).
 */
export const isServer: boolean = !isClient

/**
 * Build-time check powered by Vite / Nuxt's `import.meta.client`.
 *
 * When the target bundler supports `import.meta.client` (Vite ≥ 3.1, Nuxt ≥ 3),
 * the bundler can tree-shake the `false` branch, reducing server bundle size.
 *
 * In environments where `import.meta.client` is undefined (e.g. Webpack, raw
 * Node), falls back to the runtime `isClient` check.
 *
 * @example
 * if (import.metaClient) {
 *   // browser-only code — dead-code eliminated on server builds
 * }
 */
export const importMetaClient: boolean =
  typeof import.meta !== 'undefined' && import.meta.client === true ? true : isClient

/**
 * Safely access `window` in SSR-aware code.
 *
 * Returns the `window` object when in a browser, or `undefined` on the server.
 *
 * @example
 * const w = safeWindow()
 * if (w) w.scrollTo(0, 0)
 */
export function safeWindow(): Window | undefined {
  return isClient ? window : undefined
}

/**
 * Safely access `document` in SSR-aware code.
 *
 * Returns the `document` object when in a browser, or `undefined` on the server.
 *
 * @example
 * const d = safeDocument()
 * d?.querySelector('.my-element')
 */
export function safeDocument(): Document | undefined {
  return isClient ? document : undefined
}

/**
 * Execute a function only when running in the browser (client-side).
 * On the server, the function is silently skipped.
 *
 * @example
 * onClientOnly(() => {
 *   window.addEventListener('resize', handler)
 * })
 */
export function onClientOnly<T>(fn: () => T): T | undefined {
  if (isClient) {
    return fn()
  }
  return undefined
}

/**
 * SSR-safe wrapper for `requestAnimationFrame`.
 * Falls back to `setTimeout(cb, 16)` when RAF is not available.
 */
export function safeRAF(cb: () => void): number {
  if (isClient && typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(cb)
  }
  return setTimeout(cb, 16) as unknown as number
}

/**
 * SSR-safe wrapper for `cancelAnimationFrame`.
 */
export function safeCancelRAF(id: number): void {
  if (isClient && typeof cancelAnimationFrame === 'function') {
    cancelAnimationFrame(id)
  } else {
    clearTimeout(id)
  }
}
