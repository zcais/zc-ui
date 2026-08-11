import type { InjectionKey, ComputedRef } from 'vue'
import type { Language, LocaleContext } from '@zc-ui/locale'
import type { ComponentThemeOverrides, ThemeVariables } from '@zc-ui/theme'

/**
 * Component size scale supported throughout ZC UI.
 */
export type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

/**
 * Default configuration options for Message and Notification.
 * These can be set globally via ConfigProvider and will be merged
 * with per-call options.
 */
export interface MessageConfig {
  /** Maximum number of simultaneous messages (0 = unlimited) */
  max?: number
  /** Default auto-close duration in ms */
  duration?: number
  /** Whether to show the close button by default */
  showClose?: boolean
}

export interface NotificationConfig {
  /** Maximum number of simultaneous notifications (0 = unlimited) */
  max?: number
  /** Default auto-close duration in ms */
  duration?: number
  /** Whether to show the close button by default */
  showClose?: boolean
  /** Default position */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

/**
 * Button-level defaults that can be configured globally.
 */
export interface ButtonConfig {
  /** Auto-insert space between two adjacent Chinese characters */
  autoInsertSpace?: boolean
}

/**
 * The reactive global configuration object provided by ConfigProvider
 * and injectable by any descendant component via `useGlobalConfig()`.
 */
export interface ConfigProviderContext {
  /** Default component size for all child components */
  size: ComputedRef<ComponentSize | undefined>
  /** Current language for i18n */
  locale: ComputedRef<Language | undefined>
  /** Base z-index for overlays; child overlays will stack above this */
  zIndex: ComputedRef<number | undefined>
  /** Namespace prefix for CSS classes (default: 'zc') */
  namespace: ComputedRef<string | undefined>
  /** Button-specific defaults */
  button: ComputedRef<ButtonConfig | undefined>
  /** Message defaults */
  message: ComputedRef<MessageConfig | undefined>
  /** Notification defaults */
  notification: ComputedRef<NotificationConfig | undefined>
  /** Brand color overrides (e.g. { primary: '#722ed1' }) */
  brandColors: ComputedRef<Record<string, string> | undefined>
  /** Global CSS variable overrides */
  themeVariables: ComputedRef<ThemeVariables | undefined>
  /** Per-component CSS variable overrides */
  themeOverrides: ComputedRef<ComponentThemeOverrides | undefined>
}

/**
 * Raw props accepted by `<ZcConfigProvider>`.
 */
export interface ConfigProviderProps {
  /** Default component size for all child components */
  size?: ComponentSize
  /** Locale language code (e.g. 'zh-CN', 'en-US') */
  locale?: Language
  /** Base z-index for overlays */
  zIndex?: number
  /** CSS namespace prefix */
  namespace?: string
  /** Button defaults */
  button?: ButtonConfig
  /** Message defaults */
  message?: MessageConfig
  /** Notification defaults */
  notification?: NotificationConfig
  /**
   * Brand color overrides — auto-generates full 50–950 scales.
   * @example { primary: '#722ed1', danger: '#ff4d4f' }
   */
  brandColors?: Record<string, string>
  /**
   * Global CSS variable overrides.
   * @example { '--color-zc-primary-500': '#722ed1', '--radius-zc-base': '8px' }
   */
  themeVariables?: ThemeVariables
  /**
   * Per-component CSS variable overrides (themeOverrides).
   * Each key is a component name, value is a set of CSS variables.
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
  themeOverrides?: ComponentThemeOverrides
  /** Render as a DOM element instead of renderless (default: false) */
  as?: string
}

/**
 * Injection key for ConfigProvider context.
 */
export const configProviderInjectionKey: InjectionKey<ConfigProviderContext> =
  Symbol('zcConfigProvider')

/**
 * Alias kept for discoverability — same symbol.
 */
export const configProviderContextKey = configProviderInjectionKey

export type { Language, LocaleContext, ComponentThemeOverrides, ThemeVariables }
