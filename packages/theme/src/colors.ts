/**
 * ZC UI Theme - Color Scales
 *
 * Each semantic color has a 50–950 ramp (11 steps).
 * 500 is the base color; 50 is the lightest tint; 950 is the darkest shade.
 *
 * Generation method:
 *   50–400  = base mixed with white (progressively more base color)
 *   500     = base color
 *   600–950 = base mixed with black (progressively more black)
 */

/** A 50–950 color ramp */
export type ColorScale = {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

/* ------------------------------------------------------------------ *
 *  Semantic color scales
 * ------------------------------------------------------------------ */

export const primaryScale: ColorScale = {
  50: '#ecf5ff',
  100: '#d9ecff',
  200: '#c6e2ff',
  300: '#a0cfff',
  400: '#79bbff',
  500: '#409eff',
  600: '#337ecc',
  700: '#2a6cb3',
  800: '#1d4f7f',
  900: '#0d2640',
  950: '#06121e',
}

export const successScale: ColorScale = {
  50: '#f0f9eb',
  100: '#e1f3d8',
  200: '#cfe8c3',
  300: '#b3e19d',
  400: '#95d575',
  500: '#67c23a',
  600: '#529b2e',
  700: '#427a27',
  800: '#325a1c',
  900: '#1f3a10',
  950: '#0e1d07',
}

export const warningScale: ColorScale = {
  50: '#fdf6ec',
  100: '#faecd8',
  200: '#f8e3c5',
  300: '#f3d19e',
  400: '#ecbe77',
  500: '#e6a23c',
  600: '#b88230',
  700: '#946626',
  800: '#6f4c1c',
  900: '#4a3212',
  950: '#241907',
}

export const dangerScale: ColorScale = {
  50: '#fef0f0',
  100: '#fde2e2',
  200: '#fcd3d3',
  300: '#fab6b6',
  400: '#f78989',
  500: '#f56c6c',
  600: '#c45656',
  700: '#9d4444',
  800: '#763231',
  900: '#4f211f',
  950: '#2a1010',
}

export const infoScale: ColorScale = {
  50: '#f4f4f5',
  100: '#e9e9eb',
  200: '#dedfe0',
  300: '#c8c9cc',
  400: '#a6a9ad',
  500: '#909399',
  600: '#73767a',
  700: '#5c5e62',
  800: '#45474a',
  900: '#2e3032',
  950: '#171819',
}

/* ------------------------------------------------------------------ *
 *  Aggregated exports
 * ------------------------------------------------------------------ */

export const colorScales = {
  primary: primaryScale,
  success: successScale,
  warning: warningScale,
  danger: dangerScale,
  info: infoScale,
} as const

/** Semantic names for the five color families */
export type ColorName = keyof typeof colorScales

/* ------------------------------------------------------------------ *
 *  Element Plus-style light / dark aliases
 *  (light-N = white-mix, dark-N = black-mix — used by components)
 * ------------------------------------------------------------------ */

/** light-N variant lookup (1-9) for each color */
export const lightVariants: Record<ColorName, Record<number, string>> = {
  primary: { 1: '#ecf5ff', 3: '#c6e2ff', 5: '#a0cfff', 7: '#79bbff', 8: '#66b1ff', 9: '#53a8ff' },
  success: { 1: '#f0f9eb', 3: '#d1edc4', 5: '#b3e19d', 7: '#95d575', 8: '#85cf61', 9: '#76c94e' },
  warning: { 1: '#fdf6ec', 3: '#f8e3c5', 5: '#f3d19e', 7: '#ecbe77', 8: '#ebb263', 9: '#e9ab50' },
  danger: { 1: '#fef0f0', 3: '#fcd3d3', 5: '#fab6b6', 7: '#f89898', 8: '#f78989', 9: '#f67b7b' },
  info: { 1: '#f4f4f5', 3: '#dedfe0', 5: '#c8c9cc', 7: '#b1b3b8', 8: '#a6a9ad', 9: '#9b9ea3' },
}

/** dark-N variant lookup for each color */
export const darkVariants: Record<ColorName, Record<number, string>> = {
  primary: { 2: '#337ecc' },
  success: { 2: '#529b2e' },
  warning: { 2: '#b88230' },
  danger: { 2: '#c45656' },
  info: { 2: '#73767a' },
}
