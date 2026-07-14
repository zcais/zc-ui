/**
 * ZC UI Theme - CSS Variable Namespace System
 *
 * Supports multiple sets of CSS variable prefixes coexisting on the same page.
 * This is useful for:
 *   - White-label applications with multiple brand themes
 *   - Component isolation (each section has its own theme)
 *   - Theme preview / comparison tools
 *
 * @example
 * ```ts
 * import { createNamespace, applyNamespace } from '@zc-ui/theme'
 *
 * // Create a namespace with custom brand colors
 * const ns = createNamespace('brand-a', { primary: '#722ed1' })
 *
 * // Apply it to a specific element
 * applyNamespace(document.querySelector('.section-a'), ns)
 *
 * // The section now has `--color-brand-a-primary-500` variables
 * // Use `var(--color-brand-a-primary-500)` in CSS within that section
 * ```
 */

import {
  generatePalette,
  paletteToCssVars,
  type PaletteInput,
} from './color-generator'
import type { ThemeVariables, ThemePreset } from './presets'

// ------------------------------------------------------------------
//  Types
// ------------------------------------------------------------------

/**
 * A CSS variable namespace definition.
 */
export interface CssVarNamespace {
  /** Unique name / prefix for this namespace */
  name: string
  /** CSS variables scoped to this namespace */
  variables: ThemeVariables
}

/**
 * Options for creating a CSS variable namespace.
 */
export interface CreateNamespaceOptions {
  /** Brand colors to generate scales for */
  brandColors?: PaletteInput
  /** Additional CSS variables */
  variables?: ThemeVariables
  /** A theme preset to use as the base */
  preset?: ThemePreset
}

// ------------------------------------------------------------------
//  Implementation
// ------------------------------------------------------------------

/**
 * Default ZC UI CSS variable prefix.
 */
export const DEFAULT_CSS_VAR_PREFIX = '--color-zc'

/**
 * Create a CSS variable namespace with a custom prefix.
 *
 * Variables are generated as `--color-{name}-{semanticColor}-{step}`.
 *
 * @example
 * ```ts
 * const ns = createNamespace('brand-a', {
 *   brandColors: { primary: '#722ed1' },
 * })
 * // ns.variables['--color-brand-a-primary-500'] = '#...'
 * ```
 */
export function createNamespace(
  name: string,
  options: CreateNamespaceOptions = {},
): CssVarNamespace {
  const { brandColors, variables, preset } = options

  // Build color scale variables
  let colorVars: ThemeVariables = {}
  if (brandColors && Object.keys(brandColors).length > 0) {
    const palette = generatePalette(brandColors)
    colorVars = paletteToCssVars(palette, `--color-${name}`)
  }

  // Build from preset if provided
  const presetVars: ThemeVariables = {}
  if (preset) {
    for (const [key, value] of Object.entries(preset.variables)) {
      // Replace '--color-zc-' prefix with '--color-{name}-'
      const newKey = key.replace('--color-zc-', `--color-${name}-`)
      presetVars[newKey] = value
    }
  }

  // Custom variables — prefix non-namespaced variable names
  let customVars: ThemeVariables = {}
  if (variables) {
    customVars = { ...variables }
  }

  return {
    name,
    variables: {
      ...colorVars,
      ...presetVars,
      ...customVars,
    },
  }
}

/**
 * Apply a namespace's CSS variables to a target element.
 *
 * @param element  The HTML element to apply variables to
 * @param namespace The namespace to apply
 *
 * @example
 * ```ts
 * const ns = createNamespace('brand-a', { brandColors: { primary: '#722ed1' } })
 * applyNamespace(document.querySelector('.brand-a-section'), ns)
 * ```
 */
export function applyNamespace(
  element: HTMLElement,
  namespace: CssVarNamespace,
): void {
  for (const [name, value] of Object.entries(namespace.variables)) {
    element.style.setProperty(name, value)
  }
}

/**
 * Remove a namespace's CSS variables from a target element.
 */
export function removeNamespace(
  element: HTMLElement,
  namespace: CssVarNamespace,
): void {
  for (const name of Object.keys(namespace.variables)) {
    element.style.removeProperty(name)
  }
}

/**
 * Generate a CSS text block for a namespace.
 * Useful for creating stylesheets or `<style>` tags.
 *
 * @param namespace The namespace to convert
 * @param selector CSS selector (default: ':root')
 * @returns CSS text
 */
export function namespaceToCssText(
  namespace: CssVarNamespace,
  selector = ':root',
): string {
  const declarations = Object.entries(namespace.variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}

/**
 * Create a scoped CSS variable resolver.
 * Returns a function that converts standard ZC variable names
 * to namespace-specific ones.
 *
 * @example
 * ```ts
 * const resolve = createVarResolver('brand-a')
 * resolve('--color-zc-primary-500') // '--color-brand-a-primary-500'
 * ```
 */
export function createVarResolver(
  namespaceName: string,
): (cssVar: string) => string {
  const prefix = `--color-${namespaceName}`
  return (cssVar: string) => {
    if (cssVar.startsWith('--color-zc')) {
      return cssVar.replace('--color-zc', prefix)
    }
    return cssVar
  }
}
