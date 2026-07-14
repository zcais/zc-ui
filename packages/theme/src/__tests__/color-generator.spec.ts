import { describe, it, expect } from 'vitest'
import {
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
} from '../color-generator'

describe('Color Generator', () => {
  // ---- Color conversion ----
  describe('hexToRgb', () => {
    it('converts 6-digit hex', () => {
      expect(hexToRgb('#409eff')).toEqual({ r: 64, g: 158, b: 255 })
    })

    it('converts 3-digit hex', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    })

    it('converts without hash prefix', () => {
      expect(hexToRgb('409eff')).toEqual({ r: 64, g: 158, b: 255 })
    })

    it('throws on invalid hex', () => {
      expect(() => hexToRgb('invalid')).toThrow()
      expect(() => hexToRgb('#12')).toThrow()
    })
  })

  describe('rgbToHex', () => {
    it('converts RGB to hex', () => {
      expect(rgbToHex({ r: 64, g: 158, b: 255 })).toBe('#409eff')
    })

    it('pads single digit values', () => {
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000')
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff')
    })
  })

  describe('hexToHsl', () => {
    it('converts blue to HSL', () => {
      const hsl = hexToHsl('#409eff')
      expect(hsl.h).toBeGreaterThanOrEqual(0)
      expect(hsl.h).toBeLessThanOrEqual(360)
      expect(hsl.s).toBeGreaterThanOrEqual(0)
      expect(hsl.s).toBeLessThanOrEqual(100)
      expect(hsl.l).toBeGreaterThanOrEqual(0)
      expect(hsl.l).toBeLessThanOrEqual(100)
    })

    it('converts white to HSL', () => {
      const hsl = hexToHsl('#ffffff')
      expect(hsl.l).toBe(100)
    })

    it('converts black to HSL', () => {
      const hsl = hexToHsl('#000000')
      expect(hsl.l).toBe(0)
    })
  })

  describe('hslToRgb', () => {
    it('converts HSL to RGB (round trip)', () => {
      const original = hexToRgb('#409eff')
      const hsl = rgbToHsl(original)
      const rgb = hslToRgb(hsl)
      // Allow for rounding differences
      expect(Math.abs(rgb.r - original.r)).toBeLessThanOrEqual(3)
      expect(Math.abs(rgb.g - original.g)).toBeLessThanOrEqual(3)
      expect(Math.abs(rgb.b - original.b)).toBeLessThanOrEqual(3)
    })
  })

  describe('adjustHsl', () => {
    it('adjusts lightness', () => {
      const result = adjustHsl('#409eff', { l: 90 })
      const hsl = hexToHsl(result)
      expect(hsl.l).toBe(90)
    })

    it('preserves unadjusted channels', () => {
      const original = hexToHsl('#409eff')
      const result = adjustHsl('#409eff', { l: 50 })
      const newHsl = hexToHsl(result)
      expect(newHsl.h).toBe(original.h)
    })
  })

  // ---- Color scale generation ----
  describe('generateColorScale', () => {
    it('generates all 11 steps', () => {
      const scale = generateColorScale('#409eff')
      const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
      for (const step of steps) {
        expect(scale[step as keyof typeof scale]).toBeTruthy()
        expect(scale[step as keyof typeof scale]).toMatch(/^#[0-9a-f]{6}$/i)
      }
    })

    it('keeps the base color at step 500', () => {
      const scale = generateColorScale('#722ed1')
      expect(scale[500]).toBe('#722ed1')
    })

    it('generates lighter colors for low steps', () => {
      const scale = generateColorScale('#409eff')
      const lightness50 = hexToHsl(scale[50]).l
      const lightness500 = hexToHsl(scale[500]).l
      expect(lightness50).toBeGreaterThan(lightness500)
    })

    it('generates darker colors for high steps', () => {
      const scale = generateColorScale('#409eff')
      const lightness950 = hexToHsl(scale[950]).l
      const lightness500 = hexToHsl(scale[500]).l
      expect(lightness950).toBeLessThan(lightness500)
    })

    it('generates progressive lightness ramp', () => {
      const scale = generateColorScale('#409eff')
      const steps = [50, 100, 200, 300, 400, 500] as const
      for (let i = 0; i < steps.length - 1; i++) {
        const l1 = hexToHsl(scale[steps[i]]).l
        const l2 = hexToHsl(scale[steps[i + 1]]).l
        expect(l1).toBeGreaterThan(l2)
      }
    })
  })

  // ---- Palette generation ----
  describe('generatePalette', () => {
    it('generates all semantic colors', () => {
      const palette = generatePalette()
      expect(palette.primary).toBeDefined()
      expect(palette.success).toBeDefined()
      expect(palette.warning).toBeDefined()
      expect(palette.danger).toBeDefined()
      expect(palette.info).toBeDefined()
    })

    it('overrides primary color', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      expect(palette.primary[500]).toBe('#722ed1')
    })

    it('keeps defaults for omitted colors', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      expect(palette.success[500]).toBe('#67c23a')
    })

    it('overrides multiple colors', () => {
      const palette = generatePalette({
        primary: '#722ed1',
        danger: '#ff4d4f',
      })
      expect(palette.primary[500]).toBe('#722ed1')
      expect(palette.danger[500]).toBe('#ff4d4f')
    })
  })

  // ---- CSS variable conversion ----
  describe('paletteToCssVars', () => {
    it('generates CSS variable names', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      const vars = paletteToCssVars(palette)
      expect(vars['--color-zc-primary-500']).toBe('#722ed1')
      expect(vars['--color-zc-primary-50']).toBeDefined()
      expect(vars['--color-zc-primary-950']).toBeDefined()
    })

    it('supports custom prefix', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      const vars = paletteToCssVars(palette, '--color-custom')
      expect(vars['--color-custom-primary-500']).toBe('#722ed1')
    })
  })

  describe('paletteToCssText', () => {
    it('generates CSS declarations', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      const css = paletteToCssText(palette)
      expect(css).toContain(':root')
      expect(css).toContain('--color-zc-primary-500: #722ed1')
    })

    it('supports custom selector', () => {
      const palette = generatePalette({ primary: '#722ed1' })
      const css = paletteToCssText(palette, '.my-theme')
      expect(css).toContain('.my-theme')
    })
  })

  // ---- Contrast utilities ----
  describe('getLuminance', () => {
    it('returns 1 for white', () => {
      expect(getLuminance('#ffffff')).toBeCloseTo(1, 1)
    })

    it('returns 0 for black', () => {
      expect(getLuminance('#000000')).toBeCloseTo(0, 1)
    })
  })

  describe('getContrastRatio', () => {
    it('returns 21 for white vs black', () => {
      expect(getContrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 0)
    })

    it('returns 1 for same colors', () => {
      expect(getContrastRatio('#409eff', '#409eff')).toBeCloseTo(1, 1)
    })
  })

  describe('getReadableTextColor', () => {
    it('returns white for dark backgrounds', () => {
      expect(getReadableTextColor('#000000')).toBe('#ffffff')
    })

    it('returns black for light backgrounds', () => {
      expect(getReadableTextColor('#ffffff')).toBe('#000000')
    })
  })
})
