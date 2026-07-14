/**
 * SSR Safety Tests
 *
 * Verifies that ZC UI's imperative APIs and utilities are safe to use
 * in a server-side rendering (SSR) environment.
 */
import { describe, it, expect, vi } from 'vitest'
import {
  isClient,
  isServer,
  safeWindow,
  safeDocument,
  onClientOnly,
  safeRAF,
  safeCancelRAF,
} from '@zc-ui/utils'
import { message as ZcMessage, closeAllMessages as ZcMessageCloseAll } from '../message/message'
import { notify as ZcNotification, closeAllNotifications as ZcNotificationCloseAll } from '../notification/notification'
import { ZcLoadingService, ZcLoadingDirective } from '../loading/loading'

describe('SSR Utilities', () => {
  it('should export isClient as a boolean', () => {
    expect(typeof isClient).toBe('boolean')
  })

  it('should export isServer as a boolean', () => {
    expect(typeof isServer).toBe('boolean')
  })

  it('isServer should be the inverse of isClient', () => {
    expect(isServer).toBe(!isClient)
  })

  it('should provide safeWindow that returns Window or undefined', () => {
    const result = safeWindow()
    if (isClient) {
      expect(result).toBe(window)
    } else {
      expect(result).toBeUndefined()
    }
  })

  it('should provide safeDocument that returns Document or undefined', () => {
    const result = safeDocument()
    if (isClient) {
      expect(result).toBe(document)
    } else {
      expect(result).toBeUndefined()
    }
  })

  it('onClientOnly should execute fn when isClient', () => {
    const fn = vi.fn(() => 42)
    const result = onClientOnly(fn)
    if (isClient) {
      expect(fn).toHaveBeenCalledOnce()
      expect(result).toBe(42)
    } else {
      expect(fn).not.toHaveBeenCalled()
      expect(result).toBeUndefined()
    }
  })

  it('safeRAF should return a number', () => {
    const id = safeRAF(() => {})
    expect(typeof id).toBe('number')
  })

  it('safeCancelRAF should not throw', () => {
    const id = safeRAF(() => {})
    expect(() => safeCancelRAF(id)).not.toThrow()
  })
})

describe('SSR Message Safety', () => {
  it('should export message API with type shortcuts', () => {
    expect(typeof ZcMessage).toBe('function')
    expect(typeof ZcMessage.info).toBe('function')
    expect(typeof ZcMessage.success).toBe('function')
    expect(typeof ZcMessage.warning).toBe('function')
    expect(typeof ZcMessage.error).toBe('function')
  })

  it('should export closeAllMessages as a function', () => {
    expect(typeof ZcMessageCloseAll).toBe('function')
  })

  it('calling message should not throw', () => {
    expect(() => {
      const inst = ZcMessage('test')
      inst.close()
    }).not.toThrow()
  })

  it('calling closeAllMessages should not throw', () => {
    expect(() => ZcMessageCloseAll()).not.toThrow()
  })
})

describe('SSR Notification Safety', () => {
  it('should export notification API with type shortcuts', () => {
    expect(typeof ZcNotification).toBe('function')
    expect(typeof ZcNotification.info).toBe('function')
    expect(typeof ZcNotification.success).toBe('function')
  })

  it('should export closeAllNotifications as a function', () => {
    expect(typeof ZcNotificationCloseAll).toBe('function')
  })

  it('calling notification should not throw', () => {
    expect(() => {
      const inst = ZcNotification({ message: 'test' })
      inst.close()
    }).not.toThrow()
  })

  it('calling closeAllNotifications should not throw', () => {
    expect(() => ZcNotificationCloseAll()).not.toThrow()
  })
})

describe('SSR Loading Safety', () => {
  it('should export loading service and directive', () => {
    expect(ZcLoadingService).toBeDefined()
    expect(ZcLoadingDirective).toBeDefined()
  })

  it('ZcLoadingService.service should return instance with close', () => {
    const instance = ZcLoadingService.service({ fullscreen: true })
    expect(instance).toBeDefined()
    expect(typeof instance.close).toBe('function')
    instance.close()
  })

  it('v-loading directive should have SSR-safe hooks', () => {
    expect(typeof ZcLoadingDirective.mounted).toBe('function')
    expect(typeof ZcLoadingDirective.updated).toBe('function')
    expect(typeof ZcLoadingDirective.unmounted).toBe('function')
  })
})
