/**
 * ZC UI Theme - CSS Layer Definitions
 *
 * CSS @layer provides a way to control the cascade order of stylesheets,
 * ensuring that ZC UI component styles have a predictable priority
 * relative to user overrides and third-party CSS.
 *
 * Layer order (lowest to highest specificity):
 *   1. zc-reset     — CSS reset / normalize (lowest)
 *   2. zc-tokens    — Design token CSS variables
 *   3. zc-base      — Base element styles
 *   4. zc-components — Component styles (buttons, inputs, etc.)
 *   5. zc-overrides — User / runtime theme overrides (highest)
 *
 * Usage in your CSS:
 *   @layer zc-reset, zc-tokens, zc-base, zc-components, zc-overrides;
 *
 *   /* Your overrides automatically win over component styles *\/
 *   @layer zc-overrides {
 *     .my-button { ... }
 *   }
 *
 * Programmatic usage:
 *   import { cssLayerOrder, cssLayerStyleSheet } from '@zc-ui/theme'
 *   // Inject layer ordering into a shadow DOM or style element
 */

/**
 * The ordered list of CSS layer names used by ZC UI.
 * Earlier layers have LOWER priority; later layers have HIGHER priority.
 */
export const cssLayerOrder = [
  'zc-reset',
  'zc-tokens',
  'zc-base',
  'zc-components',
  'zc-overrides',
] as const

/** Union type of all CSS layer names */
export type ZcCssLayer = (typeof cssLayerOrder)[number]

/**
 * The CSS `@layer` declaration string that establishes priority order.
 *
 * Place this at the very top of your CSS (before any other rules)
 * to ensure consistent cascade behavior.
 *
 * @example
 * ```css
 * @layer zc-reset, zc-tokens, zc-base, zc-components, zc-overrides;
 * ```
 */
export const cssLayerDeclaration = `@layer ${cssLayerOrder.join(', ')};`

/**
 * Generate a complete CSS string that sets up the layer order.
 * Also includes base tokens in the zc-tokens layer.
 *
 * Useful for injecting into `<style>` tags or shadow DOM.
 */
export function generateCssLayerSetup(): string {
  return [
    `/* ZC UI CSS Layer Setup */`,
    cssLayerDeclaration,
    ``,
    `/* Design tokens go in the tokens layer */`,
    `@layer zc-tokens {`,
    `  /* CSS variables are declared in styles.css */`,
    `  /* Import @zc-ui/theme/styles here or reference tokens */`,
    `}`,
  ].join('\n')
}

/**
 * Wrap a CSS string in a named layer.
 *
 * @example
 * ```ts
 * const myCss = wrapInLayer('zc-overrides', `
 *   .my-button { background: red; }
 * `)
 * ```
 */
export function wrapInLayer(layer: ZcCssLayer | string, css: string): string {
  return `@layer ${layer} {\n${css}\n}`
}

/**
 * Create a CSSStyleSheet-like text with layer ordering for
 * custom elements or shadow DOM.
 *
 * @param layers Custom layer order (default: cssLayerOrder)
 * @returns CSS text with the @layer declaration
 */
export function createLayeredStyleSheet(
  layers: readonly string[] = cssLayerOrder,
): string {
  return `@layer ${layers.join(', ')};\n`
}
