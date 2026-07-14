/**
 * Global configuration bridge for service-style APIs (Message, Notification).
 *
 * These services mount their instances outside the Vue component tree via
 * `createApp()`, so they cannot use `inject()` to read ConfigProvider context.
 * Instead, ConfigProvider syncs the relevant config here via the setter
 * functions, and the services read it via the getter functions.
 *
 * Priority: per-call options > global config (from ConfigProvider) > hardcoded defaults
 */
import type { MessageConfig, NotificationConfig } from './types'

// ---- Module-level reactive state ----

let _messageConfig: MessageConfig | undefined
let _notificationConfig: NotificationConfig | undefined

// ---- Message ----

export function getGlobalMessageConfig(): MessageConfig | undefined {
  return _messageConfig
}

export function setGlobalMessageConfig(config: MessageConfig | undefined): void {
  _messageConfig = config
}

// ---- Notification ----

export function getGlobalNotificationConfig(): NotificationConfig | undefined {
  return _notificationConfig
}

export function setGlobalNotificationConfig(
  config: NotificationConfig | undefined,
): void {
  _notificationConfig = config
}
