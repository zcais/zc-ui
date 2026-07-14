import { describe, it, expect } from 'vitest'
import { createTheme } from '../presets'

describe('Component-level theme customization', () => {
  it('should convert camelCase shorthand to CSS variable names', () => {
    const theme = createTheme({
      name: 'test',
      components: {
        button: {
          bgColor: 'red',
          textColor: '#fff',
          borderRadius: '8px',
        },
        input: {
          borderColor: '#d9d9d9',
          focusBorderColor: '#409eff',
        },
      },
    })

    expect(theme.componentOverrides).toBeDefined()
    expect(theme.componentOverrides?.button).toEqual({
      '--zc-button-bg-color': 'red',
      '--zc-button-text-color': '#fff',
      '--zc-button-border-radius': '8px',
    })
    expect(theme.componentOverrides?.input).toEqual({
      '--zc-input-border-color': '#d9d9d9',
      '--zc-input-focus-border-color': '#409eff',
    })
  })

  it('should keep CSS variable names starting with -- as-is', () => {
    const theme = createTheme({
      name: 'test',
      components: {
        button: {
          '--zc-button-custom-var': 'value',
          bgColor: 'red',
        },
      },
    })

    expect(theme.componentOverrides?.button).toEqual({
      '--zc-button-custom-var': 'value',
      '--zc-button-bg-color': 'red',
    })
  })

  it('should merge component overrides correctly', () => {
    const theme1 = createTheme({
      name: 'base',
      components: {
        button: {
          bgColor: 'blue',
        },
      },
    })

    const theme2 = createTheme({
      name: 'override',
      extends: theme1,
      components: {
        button: {
          textColor: '#fff',
          borderRadius: '4px',
        },
        input: {
          borderColor: '#d9d9d9',
        },
      },
    })

    expect(theme2.componentOverrides?.button).toEqual({
      '--zc-button-bg-color': 'blue',
      '--zc-button-text-color': '#fff',
      '--zc-button-border-radius': '4px',
    })
    expect(theme2.componentOverrides?.input).toEqual({
      '--zc-input-border-color': '#d9d9d9',
    })
  })
})
