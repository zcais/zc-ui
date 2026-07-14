import { createApp, type App } from 'vue'
import Message from './message.vue'
import type { MessageType } from './message.vue'
import { isClient } from '@zc-ui/utils'
import { getGlobalMessageConfig } from '../config-provider/global-config'

export interface MessageOptions {
  /** Message text */
  message: string
  /** Message type */
  type?: MessageType
  /** Auto close duration in ms (0 = manual) */
  duration?: number
  /** Show close button */
  showClose?: boolean
  /** Center the message */
  center?: boolean
  /** Distance from top in px */
  offset?: number
  /** Called when message closes */
  onClose?: () => void
}

export interface MessageInstance {
  /** Close this message manually */
  close: () => void
}

/** Typed message function with type-specific shortcuts */
export type MessageHandler = ((options: string | MessageOptions) => MessageInstance) & {
  info: (options: string | Omit<MessageOptions, 'type'>) => MessageInstance
  success: (options: string | Omit<MessageOptions, 'type'>) => MessageInstance
  warning: (options: string | Omit<MessageOptions, 'type'>) => MessageInstance
  error: (options: string | Omit<MessageOptions, 'type'>) => MessageInstance
}

// ---- Instance management ----

interface ManagedInstance {
  id: string
  app: App
  el: HTMLElement
  offset: number
  close: () => void
}

const instances: ManagedInstance[] = []
let seed = 0

function getInstanceTop(index: number, baseOffset: number): number {
  let top = baseOffset
  for (let i = 0; i < index; i++) {
    top += 50 // approx height + gap
  }
  return top
}

function recalcOffsets() {
  instances.forEach((inst, idx) => {
    const msgEl = inst.el.querySelector('.zc-message') as HTMLElement | null
    if (msgEl) {
      msgEl.style.top = `${getInstanceTop(idx, inst.offset)}px`
    }
  })
}

function createMessage(options: MessageOptions): MessageInstance {
  // SSR safety: do nothing meaningful on the server
  if (!isClient) {
    return { close: () => {} }
  }

  // Merge global config from ConfigProvider (per-call > global > hardcoded)
  const gConfig = getGlobalMessageConfig()

  // Enforce max instance limit
  if (gConfig?.max && gConfig.max > 0 && instances.length >= gConfig.max) {
// Close the oldest message to make room
  const oldest = instances[0]
if (oldest) oldest.close()
  }
    
    const id = `zc-message-${++seed}`
    const baseOffset = options.offset ?? 20
    
    const container = document.createElement('div')
    document.body.appendChild(container)
    
      const onClose = options.onClose
      
    // Resolve effective values: per-call > global > hardcoded default
  const effectiveDuration = options.duration ?? gConfig?.duration ?? 3000
  const effectiveShowClose = options.showClose ?? gConfig?.showClose ?? false

  const app = createApp(Message, {
    message: options.message,
    type: options.type ?? 'info',
    duration: effectiveDuration,
    showClose: effectiveShowClose,
    center: options.center ?? false,
    offset: getInstanceTop(instances.length, baseOffset),
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
    offset: baseOffset,
    close: () => {
      removeInstance(id)
      onClose?.()
    },
  }

  instances.push(managed)

  function removeInstance(targetId: string) {
    const idx = instances.findIndex((i) => i.id === targetId)
    if (idx === -1) return

    const inst = instances[idx]
    instances.splice(idx, 1)

    // Delay unmount to allow leave transition
    const cleanupTimer = setTimeout(() => {
      inst.app.unmount()
      inst.el.remove()
    }, 300)

    // Store timer reference for cleanup if closeAll is called
    ;(inst as any).__cleanupTimer = cleanupTimer

    recalcOffsets()
  }

  return { close: managed.close }
}

// ---- Public API ----

function messageWithType(type: MessageType) {
  return (options: string | Omit<MessageOptions, 'type'>): MessageInstance => {
    const opts: MessageOptions =
      typeof options === 'string' ? { message: options, type } : { ...options, type }
    return createMessage(opts)
  }
}

const message = ((options: string | MessageOptions): MessageInstance => {
  const opts: MessageOptions = typeof options === 'string' ? { message: options } : options
  return createMessage(opts)
}) as MessageHandler

message.info = messageWithType('info')
message.success = messageWithType('success')
message.warning = messageWithType('warning')
message.error = messageWithType('error')

/** Close all active messages */
function closeAllMessages() {
  if (!isClient) return
;[...instances].forEach((inst) => inst.close())
}

export { message as ZcMessage, closeAllMessages, message }
export default message
