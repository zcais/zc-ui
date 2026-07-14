/**
 * ZC UI Theme - Design tokens and CSS variables
 */

export {
  colorScales,
  primaryScale,
  successScale,
  warningScale,
  dangerScale,
  infoScale,
  lightVariants,
  darkVariants,
} from './colors'
export type { ColorScale, ColorName } from './colors'

// ---- Color Generator ----
export {
  generateColorScale,
  generatePalette,
  paletteToCssVars,
  paletteToCssText,
  hexToRgb,
  rgbToHex,
  hexToHsl,
  rgbToHsl,
  hslToRgb,
  adjustHsl,
  getLuminance,
  getContrastRatio,
  getReadableTextColor,
  CSS_VAR_PREFIX,
} from './color-generator'
export type { PaletteInput, ColorPalette, RGB, HSL } from './color-generator'

// ---- Theme Presets ----
export {
  lightTheme,
  darkTheme,
  createTheme,
  mergeThemes,
  getComponentOverrides,
  themeToCssText,
componentShorthandToCssVars,
} from './presets'
  export type {
  ThemeVariables,
  ComponentThemeOverrides,
  ComponentShorthandOverrides,
ThemePreset,
  CreateThemeOptions,
} from './presets'

// ---- Runtime Theme API ----
export {
  applyTheme,
  setBrandColor,
  setBrandColors,
  setThemeVariable,
  removeThemeVariable,
  applyDarkMode,
  clearThemeOverrides,
  applyComponentOverrides,
  removeComponentOverrides,
  registerTheme,
  unregisterTheme,
  getRegisteredTheme,
  listRegisteredThemes,
  switchTheme,
  getCurrentThemeName,
  createThemeController,
} from './runtime-theme'
export type { ApplyThemeOptions } from './runtime-theme'

// ---- CSS Layer Support ----
export {
  cssLayerOrder,
  cssLayerDeclaration,
  generateCssLayerSetup,
  wrapInLayer,
  createLayeredStyleSheet,
} from './css-layers'
export type { ZcCssLayer } from './css-layers'

// ---- CSS Variable Namespace ----
export {
  createNamespace,
  applyNamespace,
  removeNamespace,
  namespaceToCssText,
  createVarResolver,
  DEFAULT_CSS_VAR_PREFIX,
} from './namespace'
export type { CssVarNamespace, CreateNamespaceOptions } from './namespace'

import { colorScales } from './colors'

/**
 * Legacy single-value color tokens (500 = base).
 * Kept for backward compatibility.
 */
export const colors = {
  primary: colorScales.primary[500],
  success: colorScales.success[500],
  warning: colorScales.warning[500],
  danger: colorScales.danger[500],
  info: colorScales.info[500],

  text: {
    primary: '#303133',
    regular: '#606266',
    secondary: '#909399',
    placeholder: '#a8abb2',
  },

  border: {
    base: '#dcdfe6',
    light: '#e4e7ed',
    lighter: '#ebeef5',
    extraLight: '#f2f6fc',
  },

  fill: {
    base: '#f0f2f5',
    light: '#f5f7fa',
    lighter: '#fafafa',
  },
} as const

/**
 * Font size design tokens
 */
export const fontSizes = {
  xs: '12px',
  sm: '13px',
  base: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
} as const

/**
 * Spacing design tokens
 */
export const spacing = {
  xs: '4px',
  sm: '8px',
  base: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
} as const

/**
 * Border radius design tokens
 */
export const borderRadius = {
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  round: '20px',
  circle: '50%',
} as const

/**
 * Shadow (box-shadow) design tokens.
 * Used by cards, popovers, modals, etc.
 */
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
  md: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
  lg: '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
  xl: '0 16px 48px 0 rgba(0, 0, 0, 0.16)',
  dark: '0 4px 12px 0 rgba(0, 0, 0, 0.5)',
} as const

/**
 * Transition design tokens.
 * Unified animation duration and easing for all components.
 */
export const transitions = {
  duration: {
    fast: '0.15s',
    base: '0.25s',
    slow: '0.35s',
  },
  timingFunction: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },
} as const

/**
 * Z-index layer tokens.
 * Ensures consistent stacking order across components.
 */
export const zIndex = {
  base: 1,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  tooltip: 1500,
  message: 1600,
} as const

/**
 * CSS variable name prefix
 */
export const cssVarPrefix = '--zc'

/**
 * Dark mode color overrides.
 * Applied when the `.dark` class is present on <html>.
 */
export const darkColors = {
  text: {
    primary: '#e5eaf3',
    regular: '#cfd3dc',
    secondary: '#a3a6ad',
    placeholder: '#8d9095',
  },
  border: {
    base: '#4c4d4f',
    light: '#414243',
    lighter: '#363637',
    extraLight: '#2b2b2c',
  },
  fill: {
    base: '#303030',
    light: '#262727',
    lighter: '#1d1d1d',
  },
} as const

/* ------------------------------------------------------------------ *
 *  Dark mode runtime API
 * ------------------------------------------------------------------ */

/** Attribute on <html> that stores the current theme mode */
const DARK_MODE_ATTR = 'dark'

/**
 * Toggle dark mode on/off.
 * Adds or removes the `dark` class on the <html> element.
 */
export function toggleDark(isDark?: boolean): boolean {
  const html = document.documentElement
  const next = isDark ?? !html.classList.contains(DARK_MODE_ATTR)
  html.classList.toggle(DARK_MODE_ATTR, next)
  return next
}

/**
 * Check if dark mode is currently active.
 */
export function isDarkMode(): boolean {
  return document.documentElement.classList.contains(DARK_MODE_ATTR)
}

/**
 * Set the theme explicitly.
 * @param mode 'light' or 'dark'
 */
export function setTheme(mode: 'light' | 'dark'): void {
  const html = document.documentElement
  if (mode === 'dark') {
    html.classList.add(DARK_MODE_ATTR)
  } else {
    html.classList.remove(DARK_MODE_ATTR)
  }
}

/**
 * Get the current theme mode.
 */
export function getTheme(): 'light' | 'dark' {
  return isDarkMode() ? 'dark' : 'light'
}

/**
 * Tailwind CSS v4 theme mapping reference.
 *
 * Note: The actual Tailwind integration is handled by `styles.css`
 * using the CSS-first `@theme` block. This object is kept as a
 * programmatic reference that includes the full color scale.
 */
export const tailwindTheme = {
  colors: {
    primary: colorScales.primary,
    success: colorScales.success,
    warning: colorScales.warning,
    danger: colorScales.danger,
    info: colorScales.info,
  },
} as const
