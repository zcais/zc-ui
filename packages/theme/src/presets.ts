/**
 * ZC UI Theme - Presets System
 *
 * Inspired by Naive UI's theme presets (darkTheme / lightTheme) and
 * Ant Design Vue's ConfigProvider.theme.
 *
 * A "theme preset" is a serializable collection of CSS variable values
 * that can be applied at runtime. Users can:
 *
 * 1. Use the built-in `lightTheme` and `darkTheme` presets.
 * 2. Create custom presets via `createTheme()`.
 * 3. Merge presets via `mergeThemes()`.
 * 4. Apply them via the runtime API (`applyTheme()` / ConfigProvider).
 *
 * @example
 * ```ts
 * import { lightTheme, darkTheme, createTheme, mergeThemes } from '@zc-ui/theme'
 *
 * // Use a built-in preset
 * applyTheme(lightTheme)
 *
 * // Create a custom preset
 * const brandTheme = createTheme({
 *   name: 'brand',
 *   variables: {
 *     '--color-zc-primary-500': '#722ed1',
 *     '--color-zc-primary-600': '#531dab',
 *   },
 * })
 *
 * // Merge presets
 * const customDark = mergeThemes(darkTheme, brandTheme)
 * ```
 */

import { generatePalette, paletteToCssVars, type PaletteInput } from './color-generator'
import { darkColors, colors, fontSizes, borderRadius, spacing, shadows } from './index'

// ------------------------------------------------------------------
//  Types
// ------------------------------------------------------------------

/**
 * A collection of CSS variable key-value pairs.
 * Keys are CSS custom property names (e.g. '--color-zc-primary-500').
 */
export interface ThemeVariables {
  [cssVarName: string]: string
}

/**
 * Component-level override token map.
 * Each key is a component name (e.g. 'Button'), and the value is
 * a set of CSS variables scoped to that component.
 *
 * Supports two key formats:
 * 1. **CSS variable names** (prefixed with `--`): `'--zc-button-border-radius': '8px'`
 * 2. **CamelCase shorthand** (auto-prefixed): `'borderRadius': '8px'`
 *
 * @example
 * ```ts
 * {
 *   Button: {
 *     '--zc-button-border-radius': '8px',
 *     '--zc-button-font-weight': '600',
 *   },
 *   Input: {
 *     '--zc-input-border-color': '#d9d9d9',
*   },
  * }
* ```
 */
export interface ComponentThemeOverrides {
  [componentName: string]: ThemeVariables
}

/**
 * Shorthand component override map using camelCase keys.
 * Each key is converted to `--zc-{componentName}-{kebab-case-key}`.
 *
 * @example
 * ```ts
 * {
 *   button: { bgColor: 'red', textColor: '#fff' },
 *   input: { borderColor: '#d9d9d9' },
 * }
 * // Generates:
 * // Button: { '--zc-button-bg-color': 'red', '--zc-button-text-color': '#fff' }
 * // Input:  { '--zc-input-border-color': '#d9d9d9' }
 * ```
 */
export type ComponentShorthandOverrides = {
  [componentName: string]: Record<string, string>
}

/**
 * A complete theme preset.
 */
export interface ThemePreset {
  /** Unique name for identification */
  name: string
  /** 'light' or 'dark' — determines base background and text colors */
  mode: 'light' | 'dark'
  /** Global CSS variables (colors, spacing, typography, etc.) */
  variables: ThemeVariables
  /** Per-component CSS variable overrides */
  componentOverrides?: ComponentThemeOverrides
  /** Optional metadata */
  meta?: {
    author?: string
    version?: string
    description?: string
  }
}

/**
 * Options for creating a custom theme preset.
 */
export interface CreateThemeOptions {
  /** Theme name */
  name?: string
  /** Color mode (default: 'light') */
  mode?: 'light' | 'dark'
  /**
   * Brand colors — generates full 50–950 scales automatically.
   * Any omitted color keeps the default.
   */
  brandColors?: PaletteInput
  /** Additional CSS variables to set or override */
  variables?: ThemeVariables
  /**
  * Per-component overrides using full CSS variable names.
  * @example
  * ```ts
  * componentOverrides: {
  *   Button: { '--zc-button-border-radius': '8px' },
* }
   * ```
   */
  componentOverrides?: ComponentThemeOverrides
  /**
   * Per-component overrides using camelCase shorthand.
   * Each key is auto-converted to `--zc-{component}-{kebab-case-key}`.
   *
   * @example
   * ```ts
   * components: {
   *   button: { bgColor: 'red', textColor: '#fff' },
   * }
   * // Generates: --zc-button-bg-color: red; --zc-button-text-color: #fff;
   * ```
   */
  components?: ComponentShorthandOverrides
  /** Base on an existing preset (default: lightTheme) */
  extends?: ThemePreset
  /** Metadata */
  meta?: ThemePreset['meta']
}

// ------------------------------------------------------------------
//  Component shorthand conversion
// ------------------------------------------------------------------

/**
 * Convert a camelCase key to kebab-case.
 * @example `bgColor` → `bg-color`, `focusBorderColor` → `focus-border-color`
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Convert a component name to its CSS variable prefix.
 * Handles both PascalCase ('Button') and lowercase ('button') inputs.
 * @example 'Button' → 'button', 'FormItem' → 'form-item'
 */
function componentNameToKebab(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

/**
 * Convert a shorthand component override map to full CSS variable names.
 *
 * Keys that already start with `--` are kept as-is.
 * CamelCase keys are converted to `--zc-{component}-{kebab-case}`.
 *
 * @example
 * ```ts
 * componentShorthandToCssVars('button', { bgColor: 'red', '--zc-button-font-size': '16px' })
 * // => { '--zc-button-bg-color': 'red', '--zc-button-font-size': '16px' }
 * ```
 */
export function componentShorthandToCssVars(
  componentName: string,
  shorthand: Record<string, string>,
): ThemeVariables {
  const kebab = componentNameToKebab(componentName)
  const result: ThemeVariables = {}

  for (const [key, value] of Object.entries(shorthand)) {
    if (key.startsWith('--')) {
      // Already a full CSS variable name — keep as-is
      result[key] = value
    } else {
      // Convert camelCase to --zc-{component}-{kebab-case}
      const cssVar = `--zc-${kebab}-${camelToKebab(key)}`
      result[cssVar] = value
    }
  }

  return result
}

/**
 * Convert a full `ComponentShorthandOverrides` map to `ComponentThemeOverrides`.
 */
function shorthandOverridesToFull(
  shorthand: ComponentShorthandOverrides,
): ComponentThemeOverrides {
  const result: ComponentThemeOverrides = {}
  for (const [componentName, vars] of Object.entries(shorthand)) {
    result[componentName] = componentShorthandToCssVars(componentName, vars)
  }
  return result
}

// ------------------------------------------------------------------
//  Built-in semantic token builders
// ------------------------------------------------------------------

/** Build light-mode semantic variables (text, border, fill, etc.) */
function buildLightSemanticVars(): ThemeVariables {
  return {
    '--color-zc-text-primary': colors.text.primary,
    '--color-zc-text-regular': colors.text.regular,
    '--color-zc-text-secondary': colors.text.secondary,
    '--color-zc-text-placeholder': colors.text.placeholder,
    '--color-zc-text-disabled': '#c0c4cc',

    '--color-zc-border-base': colors.border.base,
    '--color-zc-border-light': colors.border.light,
    '--color-zc-border-lighter': colors.border.lighter,
    '--color-zc-border-extralight': colors.border.extraLight,

    '--color-zc-fill-base': colors.fill.base,
    '--color-zc-fill-light': colors.fill.light,
    '--color-zc-fill-lighter': colors.fill.lighter,

    '--color-zc-bg-base': '#ffffff',
    '--color-zc-bg': '#ffffff',
    '--color-zc-white': '#ffffff',
  }
}

/** Build dark-mode semantic variables */
function buildDarkSemanticVars(): ThemeVariables {
  return {
    '--color-zc-text-primary': darkColors.text.primary,
    '--color-zc-text-regular': darkColors.text.regular,
    '--color-zc-text-secondary': darkColors.text.secondary,
    '--color-zc-text-placeholder': darkColors.text.placeholder,
    '--color-zc-text-disabled': '#5c5e62',

    '--color-zc-border-base': darkColors.border.base,
    '--color-zc-border-light': darkColors.border.light,
    '--color-zc-border-lighter': darkColors.border.lighter,
    '--color-zc-border-extralight': darkColors.border.extraLight,

    '--color-zc-fill-base': darkColors.fill.base,
    '--color-zc-fill-light': darkColors.fill.light,
    '--color-zc-fill-lighter': darkColors.fill.lighter,

    '--color-zc-bg-base': '#1d1d1d',
    '--color-zc-bg': '#1d1d1d',
    '--color-zc-white': '#1a1a1a',

    // Dark mode shadows (deeper)
    '--shadow-zc-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    '--shadow-zc-base': '0 2px 8px 0 rgba(0, 0, 0, 0.4)',
    '--shadow-zc-md': '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
    '--shadow-zc-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.6)',
    '--shadow-zc-xl': '0 16px 48px 0 rgba(0, 0, 0, 0.7)',
    '--shadow-zc-dark': '0 4px 12px 0 rgba(0, 0, 0, 0.8)',
  }
}

/** Build non-color design tokens (font, spacing, radius, etc.) */
function buildBaseDesignVars(): ThemeVariables {
  return {
    '--text-zc-xs': fontSizes.xs,
    '--text-zc-sm': fontSizes.sm,
    '--text-zc-base': fontSizes.base,
    '--text-zc-md': fontSizes.md,
    '--text-zc-lg': fontSizes.lg,
    '--text-zc-xl': fontSizes.xl,

    '--radius-zc-sm': borderRadius.sm,
    '--radius-zc-base': borderRadius.base,
    '--radius-zc-md': borderRadius.md,
    '--radius-zc-lg': borderRadius.lg,
    '--radius-zc-round': borderRadius.round,
    '--radius-zc-circle': borderRadius.circle,

    '--spacing-zc-xs': spacing.xs,
    '--spacing-zc-sm': spacing.sm,
    '--spacing-zc-base': spacing.base,
    '--spacing-zc-md': spacing.md,
    '--spacing-zc-lg': spacing.lg,
    '--spacing-zc-xl': spacing.xl,

    '--shadow-zc-sm': shadows.sm,
    '--shadow-zc-base': shadows.base,
    '--shadow-zc-md': shadows.md,
    '--shadow-zc-lg': shadows.lg,
    '--shadow-zc-xl': shadows.xl,
    '--shadow-zc-dark': shadows.dark,
  }
}

// ------------------------------------------------------------------
//  Built-in presets
// ------------------------------------------------------------------

/**
 * Build the full default color scale variables for light theme.
 */
function buildDefaultColorVars(): ThemeVariables {
  const palette = generatePalette()
  return paletteToCssVars(palette)
}

/** Light theme preset (factory to avoid singleton mutation) */
function createLightPreset(): ThemePreset {
  return {
    name: 'light',
    mode: 'light',
    variables: {
      ...buildDefaultColorVars(),
      ...buildBaseDesignVars(),
      ...buildLightSemanticVars(),
    },
  }
}

/** Dark theme preset */
function createDarkPreset(): ThemePreset {
  // Dark color scales use color-mix for adaptive tinting
  // We start from light color scales and override semantic vars
  return {
    name: 'dark',
    mode: 'dark',
    variables: {
      ...buildDefaultColorVars(),
      ...buildBaseDesignVars(),
      ...buildDarkSemanticVars(),
    },
  }
}

// Use getters so each access returns a fresh copy (prevents accidental mutation)
let _lightTheme: ThemePreset | null = null
let _darkTheme: ThemePreset | null = null

/**
 * The built-in light theme preset.
 * Contains all default color scales, semantic tokens, and design tokens.
 *
 * Accessing this returns a cached instance — do not mutate it directly.
 * Use `createTheme({ extends: lightTheme, ... })` to customize.
 */
export const lightTheme: ThemePreset = {
  get name() {
    return 'light'
  },
  get mode() {
    return 'light' as const
  },
  get variables() {
    if (!_lightTheme) _lightTheme = createLightPreset()
    return _lightTheme.variables
  },
}

/**
 * The built-in dark theme preset.
 * Contains dark-adapted color scales and semantic tokens.
 */
export const darkTheme: ThemePreset = {
  get name() {
    return 'dark'
  },
  get mode() {
    return 'dark' as const
  },
  get variables() {
    if (!_darkTheme) _darkTheme = createDarkPreset()
    return _darkTheme.variables
  },
}

// ------------------------------------------------------------------
//  Theme utilities
// ------------------------------------------------------------------

/**
 * Deep-merge two ThemeVariables objects. `override` takes precedence.
 */
function mergeVariables(base: ThemeVariables, override: ThemeVariables): ThemeVariables {
  return { ...base, ...override }
}

/**
 * Deep-merge two ComponentThemeOverrides objects.
 */
function mergeComponentOverrides(
  base?: ComponentThemeOverrides,
  override?: ComponentThemeOverrides,
): ComponentThemeOverrides | undefined {
  if (!base && !override) return undefined
  if (!base) return { ...override! }
  if (!override) return { ...base }

  const result: ComponentThemeOverrides = { ...base }
  for (const [component, vars] of Object.entries(override)) {
    result[component] = {
      ...(result[component] || {}),
      ...vars,
    }
  }
  return result
}

/**
 * Create a custom theme preset.
 *
 * This function lets you build a theme from brand colors with automatic
 * color scale generation, while also supporting fine-grained overrides.
 *
 * @example
 * ```ts
 * const purpleTheme = createTheme({
 *   name: 'purple-brand',
 *   brandColors: { primary: '#722ed1' },
 *   componentOverrides: {
 *     Button: { '--zc-button-border-radius': '8px' },
 *   },
 * })
 * ```
 */
export function createTheme(options: CreateThemeOptions = {}): ThemePreset {
  const {
    name = 'custom',
    mode,
    brandColors,
    variables,
    componentOverrides,
    components,
    extends: basePreset,
  meta,
} = options
  
  // Start from a base preset (or build from mode)
const base = basePreset ?? (mode === 'dark' ? darkTheme : lightTheme)
  
  // Resolve mode: explicit > base preset > 'light'
const resolvedMode = mode ?? base.mode
  
  // Build color scale variables if brand colors are provided
  let brandVars: ThemeVariables = {}
    if (brandColors && Object.keys(brandColors).length > 0) {
    const palette = generatePalette(brandColors)
  brandVars = paletteToCssVars(palette)
}
  
    // Convert shorthand `components` to full CSS variable overrides
    let shorthandOverrides: ComponentThemeOverrides | undefined
    if (components && Object.keys(components).length > 0) {
      shorthandOverrides = shorthandOverridesToFull(components)
      }
    
    return {
      name,
      mode: resolvedMode,
    variables: mergeVariables(
    base.variables,
  mergeVariables(brandVars, variables || {}),
),
    componentOverrides: mergeComponentOverrides(
      mergeComponentOverrides(base.componentOverrides, componentOverrides),
      shorthandOverrides,
    ),
    meta,
  }
}

/**
 * Merge multiple theme presets into one.
 * Later presets take precedence over earlier ones.
 *
 * @example
 * ```ts
 * const customDark = mergeThemes(darkTheme, brandOverride)
 * ```
 */
export function mergeThemes(...presets: ThemePreset[]): ThemePreset {
  if (presets.length === 0) {
    return createTheme()
  }

  let mergedVars: ThemeVariables = {}
  let mergedOverrides: ComponentThemeOverrides | undefined
  let mode: 'light' | 'dark' = 'light'
  let lastName = 'merged'

  for (const preset of presets) {
    mergedVars = mergeVariables(mergedVars, preset.variables)
    mergedOverrides = mergeComponentOverrides(mergedOverrides, preset.componentOverrides)
    mode = preset.mode
    lastName = preset.name
  }

  return {
    name: lastName,
    mode,
    variables: mergedVars,
    componentOverrides: mergedOverrides,
  }
}

/**
 * Get a specific component's override variables from a theme preset.
 *
 * @example
 * ```ts
 * const buttonVars = getComponentOverrides(theme, 'Button')
 * ```
 */
export function getComponentOverrides(
  theme: ThemePreset,
  componentName: string,
): ThemeVariables {
  return theme.componentOverrides?.[componentName] ?? {}
}

/**
 * Convert a theme preset's global variables to a CSS string.
 *
 * @param theme The theme preset
 * @param selector CSS selector (default: ':root')
 * @returns CSS text with variable declarations
 */
export function themeToCssText(
  theme: ThemePreset,
  selector = ':root',
): string {
  const declarations = Object.entries(theme.variables)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}
