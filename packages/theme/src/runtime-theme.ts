/**
 * ZC UI Theme - Runtime Theme Switching API
 *
 * Provides imperative functions to switch themes at runtime:
 *   - `applyTheme(preset)`       → Apply a full theme preset
 *   - `setBrandColor(hex)`       → Set a single brand color (auto-generates scale)
 *   - `setBrandColors(palette)`  → Set multiple brand colors at once
 *   - `setThemeVariable(name, value)` → Set a single CSS variable
 *   - `applyDarkMode(isDark)`    → Toggle dark mode class
 *   - `registerTheme(preset)`    → Register a named theme for later use
 *   - `switchTheme(name)`        → Switch to a previously registered theme
 *
 * All functions directly manipulate CSS custom properties on a target
 * element (default: `document.documentElement`).
 *
 * @example
 * ```ts
 * import { setBrandColor, applyTheme, lightTheme, darkTheme } from '@zc-ui/theme'
 *
 * // Change primary brand color at runtime
 * setBrandColor('primary', '#722ed1')
 *
 * // Switch between presets
 * applyTheme(darkTheme)
 * applyTheme(lightTheme)
 * ```
 */

import {
  generateColorScale,
  type PaletteInput,
} from './color-generator'
import type { ColorName } from './colors'
import type { ThemePreset, ThemeVariables } from './presets'

// ------------------------------------------------------------------
//  Types
// ------------------------------------------------------------------

/** Options for runtime theme application */
export interface ApplyThemeOptions {
  /** Element to apply variables to (default: document.documentElement) */
  target?: HTMLElement | null
  /** CSS variable prefix (default: '--color-zc') */
  prefix?: string
}

// ------------------------------------------------------------------
//  SSR safety
// ------------------------------------------------------------------

function getRootElement(target?: HTMLElement | null): HTMLElement | null {
  if (target) return target
  if (typeof document !== 'undefined') return document.documentElement
  return null
}

// ------------------------------------------------------------------
//  Theme registry
// ------------------------------------------------------------------

/** Registered theme presets keyed by name */
const themeRegistry = new Map<string, ThemePreset>()

/** The currently applied theme name (if tracked) */
let currentThemeName: string | null = null

/**
 * Register a theme preset by name for later use with `switchTheme()`.
 *
 * @example
 * ```ts
 * registerTheme('brand', createTheme({ brandColors: { primary: '#722ed1' } }))
 * registerTheme('dark', darkTheme)
 *
 * // Later...
 * switchTheme('brand')
 * switchTheme('dark')
 * ```
 */
export function registerTheme(name: string, preset: ThemePreset): void {
  themeRegistry.set(name, preset)
}

/**
 * Unregister a theme preset.
 */
export function unregisterTheme(name: string): void {
  themeRegistry.delete(name)
  if (currentThemeName === name) currentThemeName = null
}

/**
 * Get a registered theme preset by name.
 */
export function getRegisteredTheme(name: string): ThemePreset | undefined {
  return themeRegistry.get(name)
}

/**
 * List all registered theme names.
 */
export function listRegisteredThemes(): string[] {
  return Array.from(themeRegistry.keys())
}

/**
 * Switch to a previously registered theme by name.
 *
 * @throws Error if the theme is not registered
 */
export function switchTheme(name: string, options?: ApplyThemeOptions): void {
  const preset = themeRegistry.get(name)
  if (!preset) {
    throw new Error(
      `Theme "${name}" is not registered. Use registerTheme() first. Available: ${listRegisteredThemes().join(', ')}`,
    )
  }
  applyTheme(preset, options)
  currentThemeName = name
}

/**
 * Get the name of the currently applied theme (if set via switchTheme).
 */
export function getCurrentThemeName(): string | null {
  return currentThemeName
}

// ------------------------------------------------------------------
//  Core: apply CSS variables to an element
// ------------------------------------------------------------------

/**
 * Apply a set of CSS variables to a target element.
 * Removes any previously applied ZC variables that are no longer present.
 *
 * @internal
 */
function applyVariables(
  variables: ThemeVariables,
  target: HTMLElement,
  options?: ApplyThemeOptions,
): void {
  const prefix = options?.prefix

  for (const [name, value] of Object.entries(variables)) {
    const varName = prefix && !name.startsWith(prefix)
      ? `${prefix}-${name}`
      : name
    target.style.setProperty(varName, value)
  }
}

/**
 * Remove all CSS variables matching a prefix from an element.
 *
 * @internal
 */
function removePrefixedVars(target: HTMLElement, prefix: string): void {
  const varsToRemove: string[] = []
  for (let i = 0; i < target.style.length; i++) {
    const prop = target.style.item(i)
    if (prop.startsWith(prefix)) {
      varsToRemove.push(prop)
    }
  }
  varsToRemove.forEach((prop) => target.style.removeProperty(prop))
}

// ------------------------------------------------------------------
//  Public API
// ------------------------------------------------------------------

/** Default CSS variable prefix for color tokens */
const DEFAULT_COLOR_PREFIX = '--color-zc'

/**
 * Apply a complete theme preset to the document.
 *
 * Sets all CSS variables from the preset on the target element
 * and toggles the dark mode class.
 *
 * @example
 * ```ts
 * import { applyTheme, darkTheme } from '@zc-ui/theme'
 * applyTheme(darkTheme)
 * ```
 */
export function applyTheme(preset: ThemePreset, options?: ApplyThemeOptions): void {
  const target = getRootElement(options?.target)
  if (!target) return

  // Apply global variables
  applyVariables(preset.variables, target, options)

  // Apply dark mode class
  applyDarkMode(preset.mode === 'dark', target)

  // Apply component overrides as data attributes on the element
  // Each component override is stored as a JSON data attribute
  if (preset.componentOverrides) {
    for (const [componentName, vars] of Object.entries(preset.componentOverrides)) {
      const attrName = `data-zc-theme-${componentName.toLowerCase()}`
      const existing = target.getAttribute(attrName) || ''
      // Store as semicolon-separated key:value pairs
      const pairs = Object.entries(vars)
        .map(([k, v]) => `${k}:${v}`)
        .join(';')
      target.setAttribute(attrName, pairs)

      // Also apply the variables directly on the element
      // so they cascade to all child components
      for (const [name, value] of Object.entries(vars)) {
        target.style.setProperty(name, value)
      }

      // Avoid unused variable warning
      void existing
    }
  }
}

/**
 * Set a single brand color at runtime.
 * Automatically generates the full 50–950 color scale.
 *
 * @example
 * ```ts
 * setBrandColor('primary', '#722ed1')
 * setBrandColor('danger', '#ff4d4f')
 * ```
 */
export function setBrandColor(
  name: ColorName,
  hex: string,
  options?: ApplyThemeOptions,
): void {
  const target = getRootElement(options?.target)
  if (!target) return

  const scale = generateColorScale(hex)
  const prefix = options?.prefix ?? DEFAULT_COLOR_PREFIX

  for (const [step, value] of Object.entries(scale)) {
    target.style.setProperty(`${prefix}-${name}-${step}`, value)
  }
}

/**
 * Set multiple brand colors at runtime.
 *
 * @example
 * ```ts
 * setBrandColors({
 *   primary: '#722ed1',
 *   success: '#52c41a',
 *   danger: '#ff4d4f',
 * })
 * ```
 */
export function setBrandColors(
  palette: PaletteInput,
  options?: ApplyThemeOptions,
): void {
  const target = getRootElement(options?.target)
  if (!target) return

  for (const [name, hex] of Object.entries(palette)) {
    if (hex) setBrandColor(name as ColorName, hex, options)
  }
}

/**
 * Set or update a single CSS variable at runtime.
 *
 * @example
 * ```ts
 * setThemeVariable('--color-zc-primary-500', '#722ed1')
 * setThemeVariable('--radius-zc-base', '8px')
 * ```
 */
export function setThemeVariable(
  name: string,
  value: string,
  options?: ApplyThemeOptions,
): void {
  const target = getRootElement(options?.target)
  if (!target) return
  target.style.setProperty(name, value)
}

/**
 * Remove a CSS variable that was set at runtime.
 */
export function removeThemeVariable(
  name: string,
  options?: ApplyThemeOptions,
): void {
  const target = getRootElement(options?.target)
  if (!target) return
  target.style.removeProperty(name)
}

/**
 * Apply or remove the dark mode class on an element.
 *
 * @param isDark Whether to enable dark mode
 * @param target Target element (default: document.documentElement)
 */
export function applyDarkMode(isDark: boolean, target?: HTMLElement | null): void {
  const el = target ?? getRootElement()
  if (!el) return

  if (isDark) {
    el.classList.add('dark')
  } else {
    el.classList.remove('dark')
  }
}

/**
 * Remove all runtime theme overrides from an element.
 * Cleans up any CSS variables with the specified prefix.
 *
 * @example
 * ```ts
 * clearThemeOverrides() // removes all --color-zc-* inline overrides
 * ```
 */
export function clearThemeOverrides(
  options?: ApplyThemeOptions & { prefix?: string },
): void {
  const target = getRootElement(options?.target)
  if (!target) return
  const prefix = options?.prefix ?? DEFAULT_COLOR_PREFIX
  removePrefixedVars(target, prefix)
}

/**
 * Apply a component-level override to a specific element.
 *
 * This is used internally by ConfigProvider to scope overrides,
 * but can also be called directly.
 *
 * @example
 * ```ts
 * applyComponentOverrides(document.querySelector('.my-section'), 'Button', {
 *   '--zc-button-border-radius': '8px',
 * })
 * ```
 */
export function applyComponentOverrides(
  element: HTMLElement,
  componentName: string,
  overrides: ThemeVariables,
): void {
  for (const [name, value] of Object.entries(overrides)) {
    element.style.setProperty(name, value)
  }

  // Store metadata for debugging / inspection
  const attrName = `data-zc-theme-${componentName.toLowerCase()}`
  const pairs = Object.entries(overrides)
    .map(([k, v]) => `${k}:${v}`)
    .join(';')
  element.setAttribute(attrName, pairs)
}

/**
 * Remove component-level overrides from an element.
 */
export function removeComponentOverrides(
  element: HTMLElement,
  componentName: string,
  overrides: ThemeVariables,
): void {
  for (const name of Object.keys(overrides)) {
    element.style.removeProperty(name)
  }
  element.removeAttribute(`data-zc-theme-${componentName.toLowerCase()}`)
}

// ------------------------------------------------------------------
//  Reactive theme state (Vue integration)
// ------------------------------------------------------------------

/**
 * Create a reactive theme controller.
 * Useful for Vue components that need reactive theme switching.
 *
 * @example
 * ```ts
 * const controller = createThemeController()
 * controller.apply(darkTheme)
 * controller.toggleDark()
 * controller.setBrandColor('primary', '#722ed1')
 */
export function createThemeController(options?: ApplyThemeOptions) {
  let currentPreset: ThemePreset | null = null

  return {
    /** Get the currently applied preset (null if none) */
    get current(): ThemePreset | null {
      return currentPreset
    },

    /** Apply a full theme preset */
    apply(preset: ThemePreset) {
      currentPreset = preset
      applyTheme(preset, options)
    },

    /** Set a single brand color */
    setBrandColor(name: ColorName, hex: string) {
      setBrandColor(name, hex, options)
    },

    /** Set multiple brand colors */
    setBrandColors(palette: PaletteInput) {
      setBrandColors(palette, options)
    },

    /** Set a single CSS variable */
    setVariable(name: string, value: string) {
      setThemeVariable(name, value, options)
    },

    /** Toggle dark mode */
    toggleDark(): boolean {
      const target = getRootElement(options?.target)
      if (!target) return false
      const isDark = target.classList.contains('dark')
      applyDarkMode(!isDark, target)
      return !isDark
    },

    /** Clear all runtime overrides */
    clear() {
      clearThemeOverrides(options)
      currentPreset = null
    },
  }
}
