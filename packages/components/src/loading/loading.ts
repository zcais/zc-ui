import { createApp, type App, type Directive, type DirectiveBinding } from 'vue'
import LoadingComponent from './loading.vue'
import { isClient } from '@zc-ui/utils'

export interface LoadingOptions {
  text?: string
  size?: number
  background?: string
  color?: string
  fullscreen?: boolean
  lock?: boolean
  target?: string | HTMLElement
}

export interface LoadingInstance {
  close: () => void
}

// ---- v-loading directive ----

interface LoadingElement extends HTMLElement {
  __zcLoading?: {
    app: App
    el: HTMLElement
    options: LoadingOptions
  }
}

function mountLoading(
  el: HTMLElement,
  options: LoadingOptions
): { app: App; container: HTMLElement } {
  const container = document.createElement('div')
  if (options.fullscreen) {
    document.body.appendChild(container)
  } else {
    el.appendChild(container)
  }

  const app = createApp(LoadingComponent, {
    text: options.text,
    size: options.size ?? 32,
    background: options.background,
    color: options.color,
    fullscreen: options.fullscreen ?? false,
    lock: options.lock ?? false,
  })
  app.mount(container)
  return { app, container }
}

function unmountLoading(el: LoadingElement) {
  if (el.__zcLoading) {
    el.__zcLoading.app.unmount()
    el.__zcLoading.el.remove()
    delete el.__zcLoading
  }
}

export const vLoading: Directive = {
  mounted(el: LoadingElement, binding: DirectiveBinding<boolean | LoadingOptions>) {
    if (!isClient) return
    
    // Make relative for overlay positioning
      const computedStyle = window.getComputedStyle(el)
    if (computedStyle.position === 'static') {
      el.style.position = 'relative'
    }

    const isActive = typeof binding.value === 'boolean' ? binding.value : true
    if (!isActive) return

    const options: LoadingOptions =
      typeof binding.value === 'object' && binding.value !== null ? binding.value : {}

    const { app, container } = mountLoading(el, options)
    el.__zcLoading = { app, el: container, options }
  },
  updated(el: LoadingElement, binding: DirectiveBinding<boolean | LoadingOptions>) {
    const isActive = typeof binding.value === 'boolean' ? binding.value : true

    if (isActive) {
      const options: LoadingOptions =
        typeof binding.value === 'object' && binding.value !== null ? binding.value : {}

      // Only remount if options changed significantly (text, fullscreen, etc.)
      if (!el.__zcLoading) {
        if (!isClient) return
        const computedStyle = window.getComputedStyle(el)
        if (computedStyle.position === 'static') {
          el.style.position = 'relative'
        }
        const { app, container } = mountLoading(el, options)
        el.__zcLoading = { app, el: container, options }
      }
    } else {
      unmountLoading(el)
    }
  },
  unmounted(el: LoadingElement) {
    unmountLoading(el)
    // Restore original positioning
    if (el.style.position === 'relative') {
      el.style.position = ''
    }
  },
}

// ---- Service API ----

const LoadingService = {
  service(options: LoadingOptions = {}): LoadingInstance {
    if (!isClient) return { close: () => {} }

    const { app, container } = mountLoading(document.body, {
      ...options,
      fullscreen: true,
    })

    if (options.lock) {
      document.body.style.overflow = 'hidden'
    }

    return {
      close: () => {
        app.unmount()
        container.remove()
        if (options.lock) {
          document.body.style.overflow = ''
        }
      },
    }
  },
}

export type LoadingServiceType = typeof LoadingService

export { vLoading as ZcLoadingDirective, LoadingService as ZcLoadingService }
export default {
  directive: vLoading,
  service: LoadingService,
}
