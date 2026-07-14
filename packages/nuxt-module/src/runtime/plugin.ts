import { defineNuxtPlugin } from '#app'
import {
  ZcMessage,
  ZcMessageCloseAll,
  ZcNotification,
  ZcNotificationCloseAll,
  ZcLoadingService,
  ZcLoadingDirective,
} from '@zc-ui/components'

/**
 * Client-side Nuxt plugin that registers ZC UI's imperative APIs as
 * app-level provides. This ensures message/notification/loading are
 * available in any component via `useNuxtApp()`.
 *
 * This plugin only runs on the client (`mode: 'client'`) to avoid
 * SSR-side DOM access.
 */
export default defineNuxtPlugin((nuxtApp) => {
  // Provide imperative APIs
  nuxtApp.provide('zcMessage', ZcMessage)
  nuxtApp.provide('zcMessageCloseAll', ZcMessageCloseAll)
  nuxtApp.provide('zcNotification', ZcNotification)
  nuxtApp.provide('zcNotificationCloseAll', ZcNotificationCloseAll)
  nuxtApp.provide('zcLoading', ZcLoadingService)

  // Register v-loading directive globally
  nuxtApp.vueApp.directive('loading', ZcLoadingDirective)
})
