/**
 * ZC UI Theme - Color Generator
 *
 * Generates a complete 50–950 color scale from a single brand color.
 *
 * Algorithm:
 *   - Convert base hex to HSL for perceptual adjustments.
 *   - 50–400: Lighten by increasing lightness toward ~97%.
 *   - 500:    Keep the original color.
 *   - 600–950: Darken by decreasing lightness toward ~10%.
 *   - Saturation is gently adjusted at extremes for natural appearance.
 *
 * @example
 * const scale = generateColorScale('#409eff')
 * // scale = { 50: '#eaf3ff', ..., 500: '#409eff', ..., 950: '#0a1f3d' }
 *
 * @example Generate a full theme palette
 * const palette = generatePalette({ primary: '#409eff', success: '#67c23a' })
 */

import type { ColorScale } from './colors'

// ------------------------------------------------------------------
//  Color space conversion utilities
// ------------------------------------------------------------------

/** RGB triplet (0–255 each) */
export interface RGB {
  r: number
  g: number
  b: number
}

/** HSL triplet (h: 0–360, s: 0–100, l: 0–100) */
export interface HSL {
  h: number
  s: number
  l: number
}

/**
 * Parse a hex color string (#RGB, #RRGGBB, or without #) into RGB.
 */
export function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const num = parseInt(h, 16)
  if (isNaN(num) || h.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`)
  }
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  }
}

/**
 * Convert RGB to HSL.
 */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rN = r / 255
  const gN = g / 255
  const bN = b / 255

  const max = Math.max(rN, gN, bN)
  const min = Math.min(rN, gN, bN)
  const delta = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case rN:
        h = ((gN - bN) / delta + (gN < bN ? 6 : 0)) * 60
        break
      case gN:
        h = ((bN - rN) / delta + 2) * 60
        break
      case bN:
        h = ((rN - gN) / delta + 4) * 60
        break
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Convert HSL back to RGB.
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const hN = h / 360
  const sN = s / 100
  const lN = l / 100

  if (sN === 0) {
    const v = Math.round(lN * 255)
    return { r: v, g: v, b: v }
  }

  const q = lN < 0.5 ? lN * (1 + sN) : lN + sN - lN * sN
  const p = 2 * lN - q

  const hueToRgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  return {
    r: Math.round(hueToRgb(p, q, hN + 1 / 3) * 255),
    g: Math.round(hueToRgb(p, q, hN) * 255),
    b: Math.round(hueToRgb(p, q, hN - 1 / 3) * 255),
  }
}

/**
 * Convert RGB to hex string (#RRGGBB).
 */
export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (v: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(v)))
    return clamped.toString(16).padStart(2, '0')
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/**
 * Convert a hex color directly to HSL.
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex))
}

/**
 * Convert a hex color directly to another hex by adjusting HSL.
 */
export function adjustHsl(hex: string, adjustments: Partial<HSL>): string {
  const hsl = hexToHsl(hex)
  const adjusted: HSL = {
    h: adjustments.h ?? hsl.h,
    s: adjustments.s ?? hsl.s,
    l: adjustments.l ?? hsl.l,
  }
  return rgbToHex(hslToRgb(adjusted))
}

// ------------------------------------------------------------------
//  Color scale generation
// ------------------------------------------------------------------

/**
 * Lightness targets for the 50–950 ramp.
 * Perceptually tuned for smooth transitions.
 *
 * Index 0 = step 50, index 5 = step 500 (base), index 10 = step 950.
 */
const LIGHTNESS_RAMP = [97, 93, 86, 77, 66, 50, 44, 38, 31, 21, 12]

/**
 * Saturation multiplier for the ramp.
 * Lower saturation at extremes (50, 950) for more natural muted tones.
 */
const SATURATION_RAMP = [0.85, 0.92, 0.96, 0.98, 1.0, 1.0, 1.0, 1.0, 0.97, 0.93, 0.88]

/**
 * The 11 steps of a ColorScale.
 */
const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * Generate a complete 50–950 color scale from a single base color.
 *
 * The base color is mapped to step 500. Lighter steps (50–400) are generated
 * by increasing lightness, and darker steps (600–950) by decreasing it.
 *
 * @param baseHex The brand/base color as a hex string (e.g. '#409eff')
 * @returns A complete ColorScale object
 *
 * @example
 * ```ts
 * const scale = generateColorScale('#409eff')
 * console.log(scale[500]) // '#409eff'
 * console.log(scale[100]) // light tint
 * ```
 */
export function generateColorScale(baseHex: string): ColorScale {
  const baseHsl = hexToHsl(baseHex)

  const result = {} as ColorScale

  SCALE_STEPS.forEach((step, index) => {
    if (step === 500) {
      result[step] = baseHex.toLowerCase()
      return
    }

    const targetL = LIGHTNESS_RAMP[index]
    const satMultiplier = SATURATION_RAMP[index]
    const adjustedS = Math.round(baseHsl.s * satMultiplier)

    result[step] = adjustHsl(baseHex, {
      h: baseHsl.h,
      s: Math.min(100, Math.max(0, adjustedS)),
      l: targetL,
    })
  })

  return result
}

// ------------------------------------------------------------------
//  Palette generation
// ------------------------------------------------------------------

/**
 * Input for full palette generation.
 * Any omitted color will keep its default value.
 */
export interface PaletteInput {
  /** Primary / brand color */
  primary?: string
  /** Success / positive color */
  success?: string
  /** Warning / caution color */
  warning?: string
  /** Danger / error color */
  danger?: string
  /** Info / neutral accent color */
  info?: string
}

/**
 * A complete palette containing color scales for all semantic colors.
 */
export interface ColorPalette {
  primary: ColorScale
  success: ColorScale
  warning: ColorScale
  danger: ColorScale
  info: ColorScale
}

/** Default brand colors used when not overridden */
const DEFAULT_BRAND_COLORS = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  info: '#909399',
} as const

/**
 * Generate a complete color palette from one or more brand colors.
 *
 * @example
 * ```ts
 * // Generate from a single brand color (others keep defaults)
 * const palette = generatePalette({ primary: '#722ed1' })
 *
 * // Generate from all custom colors
 * const custom = generatePalette({
 *   primary: '#722ed1',
 *   success: '#52c41a',
 *   warning: '#faad14',
 *   danger: '#ff4d4f',
 *   info: '#8c8c8c',
 * })
 * ```
 */
export function generatePalette(input: PaletteInput = {}): ColorPalette {
  const colors = { ...DEFAULT_BRAND_COLORS, ...input }

  return {
    primary: generateColorScale(colors.primary),
    success: generateColorScale(colors.success),
    warning: generateColorScale(colors.warning),
    danger: generateColorScale(colors.danger),
    info: generateColorScale(colors.info),
  }
}

// ------------------------------------------------------------------
//  CSS variable generation
// ------------------------------------------------------------------

/** CSS variable prefix used by ZC UI */
export const CSS_VAR_PREFIX = '--color-zc'

/**
 * Generate CSS custom property declarations from a color palette.
 *
 * @param palette The palette to convert
 * @param prefix  CSS variable prefix (default: '--color-zc')
 * @returns Record of CSS variable name → hex value
 *
 * @example
 * ```ts
 * const vars = paletteToCssVars(palette)
 * // vars['--color-zc-primary-500'] = '#409eff'
 * ```
 */
export function paletteToCssVars(
  palette: ColorPalette,
  prefix = CSS_VAR_PREFIX,
): Record<string, string> {
  const vars: Record<string, string> = {}

  for (const [name, scale] of Object.entries(palette)) {
    for (const [step, hex] of Object.entries(scale)) {
      vars[`${prefix}-${name}-${step}`] = String(hex)
    }
  }

  return vars
}

/**
 * Generate a CSS string of `:root { ... }` declarations from a palette.
 * Useful for generating theme CSS files.
 *
 * @param palette The palette to convert
 * @param selector CSS selector (default: ':root')
 * @param prefix  CSS variable prefix
 * @returns CSS text
 */
export function paletteToCssText(
  palette: ColorPalette,
  selector = ':root',
  prefix = CSS_VAR_PREFIX,
): string {
  const vars = paletteToCssVars(palette, prefix)
  const declarations = Object.entries(vars)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join('\n')

  return `${selector} {\n${declarations}\n}`
}

// ------------------------------------------------------------------
//  Color utility helpers
// ------------------------------------------------------------------

/**
 * Calculate the relative luminance of a hex color (for contrast calculation).
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex)
  const [rN, gN, bN] = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rN + 0.7152 * gN + 0.0722 * bN
}

/**
 * Calculate the contrast ratio between two hex colors (1–21).
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1)
  const lum2 = getLuminance(hex2)
  const [lighter, darker] = lum1 > lum2 ? [lum1, lum2] : [lum2, lum1]
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Pick the best text color (black or white) for a given background.
 */
export function getReadableTextColor(bgHex: string): string {
  const whiteContrast = getContrastRatio(bgHex, '#ffffff')
  const blackContrast = getContrastRatio(bgHex, '#000000')
  return whiteContrast >= blackContrast ? '#ffffff' : '#000000'
}
