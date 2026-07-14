export { default as ConfigProvider } from './config-provider.vue'
export { useGlobalConfig } from './useGlobalConfig'
export {
  getGlobalMessageConfig,
  setGlobalMessageConfig,
  getGlobalNotificationConfig,
  setGlobalNotificationConfig,
} from './global-config'
export {
  configProviderInjectionKey,
  configProviderContextKey,
  type ComponentSize,
  type ConfigProviderProps,
  type ConfigProviderContext,
  type MessageConfig,
  type NotificationConfig,
  type ButtonConfig,
  type ComponentThemeOverrides as ConfigComponentThemeOverrides,
  type ThemeVariables as ConfigThemeVariables,
} from './types'
