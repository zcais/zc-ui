import { createApp, type App, h } from 'vue'
import MessageBox from './message-box.vue'
import { isClient } from '@zc-ui/utils'
import type { MessageBoxOptions, MessageBoxResult, MessageBoxType } from './types'

/**
 * Creates a MessageBox instance dynamically.
 * Uses Vue's createApp to mount the component imperatively.
 */
function createMessageBox(
  type: MessageBoxType,
  options: MessageBoxOptions = {}
): Promise<MessageBoxResult> {
  return new Promise((resolve, reject) => {
    if (!isClient) {
      reject('cancel')
      return
    }

    const container = document.createElement('div')
    document.body.appendChild(container)

    let app: App | null = null

    function destroy() {
      if (app) {
        app.unmount()
        app = null
      }
      if (container.parentNode) {
        container.remove()
      }
    }

    function handleConfirm(value: string) {
      resolve({ action: 'confirm', value })
      // Delay destroy for leave transition
      setTimeout(destroy, 300)
    }

    function handleCancel() {
      reject(type === 'confirm' ? 'cancel' : 'cancel')
      setTimeout(destroy, 300)
    }

    app = createApp({
      render() {
        return h(MessageBox, {
          type,
          title: options.title,
          message: options.message,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          confirmButtonType: options.confirmButtonType,
          cancelButtonType: options.cancelButtonType,
          inputPlaceholder: options.inputPlaceholder,
          inputValue: options.inputValue,
          inputType: options.inputType,
          inputValidator: options.inputValidator,
          showClose: options.showClose,
          closeOnClickOverlay: options.closeOnClickOverlay,
          center: options.center,
          width: options.width,
          dangerouslyUseHTMLString: options.dangerouslyUseHTMLString,
          onConfirm: handleConfirm,
          onCancel: handleCancel,
          onClose: handleCancel,
        })
      },
    })

    app.mount(container)
  })
}

/**
 * Shows an alert dialog with a single confirm button.
 *
 * @example
 * ```ts
 * await ZcMessageBox.alert('操作成功', '提示')
 * ```
 */
function alert(options: MessageBoxOptions): Promise<MessageBoxResult>
function alert(
  message: string,
  title?: string,
  options?: MessageBoxOptions
): Promise<MessageBoxResult>
function alert(
  messageOrOptions: string | MessageBoxOptions,
  title?: string,
  extra?: MessageBoxOptions
): Promise<MessageBoxResult> {
  const options: MessageBoxOptions =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions, title, ...extra }
      : messageOrOptions
  return createMessageBox('alert', options)
}

/**
 * Shows a confirmation dialog with confirm and cancel buttons.
 *
 * @example
 * ```ts
 * try {
 *   await ZcMessageBox.confirm('确定删除？', '警告')
 *   // User confirmed
 * } catch {
 *   // User cancelled
 * }
 * ```
 */
function confirm(options: MessageBoxOptions): Promise<MessageBoxResult>
function confirm(
  message: string,
  title?: string,
  options?: MessageBoxOptions
): Promise<MessageBoxResult>
function confirm(
  messageOrOptions: string | MessageBoxOptions,
  title?: string,
  extra?: MessageBoxOptions
): Promise<MessageBoxResult> {
  const options: MessageBoxOptions =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions, title, ...extra }
      : messageOrOptions
  return createMessageBox('confirm', options)
}

/**
 * Shows a prompt dialog with an input field.
 *
 * @example
 * ```ts
 * try {
 *   const { value } = await ZcMessageBox.prompt('请输入名称', '重命名')
 *   console.log(value)
 * } catch {
 *   // User cancelled
 * * }
 * ```
 */
function prompt(options: MessageBoxOptions): Promise<MessageBoxResult>
function prompt(
  message: string,
  title?: string,
  options?: MessageBoxOptions
): Promise<MessageBoxResult>
function prompt(
  messageOrOptions: string | MessageBoxOptions,
  title?: string,
  extra?: MessageBoxOptions
): Promise<MessageBoxResult> {
  const options: MessageBoxOptions =
    typeof messageOrOptions === 'string'
      ? { message: messageOrOptions, title, ...extra }
      : messageOrOptions
  return createMessageBox('prompt', options)
}

export const ZcMessageBox = {
  alert,
  confirm,
  prompt,
}

export type { MessageBoxOptions, MessageBoxResult, MessageBoxType }

export default ZcMessageBox
