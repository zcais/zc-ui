import { createApp, type App } from 'vue'
import Notification from './notification.vue'
import type { NotificationType, NotificationPosition } from './notification.vue'
import { isClient } from '@zc-ui/utils'
import { getGlobalNotificationConfig } from '../config-provider/global-config'

export interface NotificationOptions {
  title?: string
  message?: string
  type?: NotificationType
  duration?: number
  showClose?: boolean
  position?: NotificationPosition
  offset?: number
  onClose?: () => void
}

export interface NotificationInstance {
  close: () => void
}

/** Typed notification function with type-specific shortcuts */
export type NotificationHandler = ((options: NotificationOptions) => NotificationInstance) & {
  info: (options: Omit<NotificationOptions, 'type'> | string) => NotificationInstance
  success: (options: Omit<NotificationOptions, 'type'> | string) => NotificationInstance
  warning: (options: Omit<NotificationOptions, 'type'> | string) => NotificationInstance
  error: (options: Omit<NotificationOptions, 'type'> | string) => NotificationInstance
}

interface ManagedInstance {
  id: string
  app: App
  el: HTMLElement
  position: string
  close: () => void
}

const instances: ManagedInstance[] = []
let seed = 0

function recalcOffsets() {
  // Group by position and recalculate offsets
  const groups = new Map<string, ManagedInstance[]>()
  for (const inst of instances) {
    if (!groups.has(inst.position)) groups.set(inst.position, [])
    groups.get(inst.position)!.push(inst)
  }

  for (const [position, group] of groups) {
    const isTop = position.startsWith('top')
    let offset = 16
    for (const inst of group) {
      const notifEl = inst.el.querySelector('.zc-notification') as HTMLElement | null
      if (notifEl) {
        if (isTop) {
          notifEl.style.top = `${offset}px`
        } else {
          notifEl.style.bottom = `${offset}px`
        }
        offset += (notifEl.offsetHeight || 80) + 16
      }
    }
  }
}

function createNotification(options: NotificationOptions): NotificationInstance {
  // SSR safety: do nothing meaningful on the server
  if (!isClient) {
    return { close: () => {} }
  }

  // Merge global config from ConfigProvider (per-call > global > hardcoded)
  const gConfig = getGlobalNotificationConfig()
  
// Resolve effective values: per-call > global > hardcoded default
  const position = options.position ?? gConfig?.position ?? 'top-right'
  
// Enforce max instance limit per position
  if (gConfig?.max && gConfig.max > 0) {
    const samePosition = instances.filter((i) => i.position === position)
    if (samePosition.length >= gConfig.max) {
    // Close the oldest notification in the same position
    const oldest = samePosition[0]
    if (oldest) oldest.close()
    }
    }
    
      const id = `zc-notification-${++seed}`
      const container = document.createElement('div')
    document.body.appendChild(container)
  
  const onClose = options.onClose

  const effectiveDuration = options.duration ?? gConfig?.duration ?? 4500
  const effectiveShowClose = options.showClose ?? gConfig?.showClose ?? true

  const app = createApp(Notification, {
    title: options.title,
    message: options.message,
    type: options.type ?? 'info',
    duration: effectiveDuration,
    showClose: effectiveShowClose,
    position,
    offset: options.offset ?? 16,
    onClose: () => {
      removeInstance(id)
      onClose?.()
    },
  })

  app.mount(container)

  const managed: ManagedInstance = {
    id,
    app,
    el: container,
    position,
    close: () => {
      removeInstance(id)
      onClose?.()
    },
  }

  instances.push(managed)
  recalcOffsets()

  function removeInstance(targetId: string) {
    const idx = instances.findIndex((i) => i.id === targetId)
    if (idx === -1) return
    const inst = instances[idx]
    instances.splice(idx, 1)
    const cleanupTimer = setTimeout(() => {
      inst.app.unmount()
      inst.el.remove()
    }, 300)
    ;(inst as any).__cleanupTimer = cleanupTimer
    recalcOffsets()
  }

  return { close: managed.close }
}

// ---- Public API ----

function notifyWithType(type: NotificationType) {
  return (options: Omit<NotificationOptions, 'type'> | string): NotificationInstance => {
    const opts: NotificationOptions =
      typeof options === 'string' ? { message: options, type } : { ...options, type }
    return createNotification(opts)
  }
}

const notify = ((options: NotificationOptions): NotificationInstance => {
  return createNotification(options)
}) as NotificationHandler

notify.info = notifyWithType('info')
notify.success = notifyWithType('success')
notify.warning = notifyWithType('warning')
notify.error = notifyWithType('error')

function closeAllNotifications() {
  if (!isClient) return
;[...instances].forEach((inst) => inst.close())
}

export { notify as ZcNotification, closeAllNotifications, notify }
export default notify
