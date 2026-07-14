import { ref, getCurrentInstance, onBeforeUnmount } from 'vue'
import { isClient } from '@zc-ui/utils'

/**
 * Return type of useClipboard.
 */
export interface UseClipboardReturn {
  /** The current clipboard text (updates on read) */
  text: ReturnType<typeof ref<string>>
  /** Whether the clipboard was copied successfully */
  copied: ReturnType<typeof ref<boolean>>
  /** Copy text to clipboard. Returns true on success */
  copy: (text: string) => Promise<boolean>
  /** Read from clipboard */
  read: () => Promise<string>
  /** Whether the Clipboard API is supported */
  isSupported: boolean
}

/**
 * useClipboard - Reactively copy text to and read from the clipboard.
 *
 * Uses the modern Clipboard API when available, with a legacy fallback.
 *
 * @example
 * const { text, copy, copied, isSupported } = useClipboard()
 * await copy('Hello World')
 * // copied.value === true for 1.5s
 */
export function useClipboard(options: { copiedDuration?: number } = {}): UseClipboardReturn {
  const { copiedDuration = 1500 } = options

  const text = ref('')
  const copied = ref(false)
  const isSupported = isClient && typeof navigator !== 'undefined' && !!navigator.clipboard

  let timer: ReturnType<typeof setTimeout> | null = null

  const copy = async (value: string): Promise<boolean> => {
    if (!isClient) return false

    text.value = value

    // Try modern API first
    if (isSupported) {
      try {
        await navigator.clipboard.writeText(value)
        setCopied()
        return true
      } catch {
        // Fall through to legacy
      }
    }

    // Legacy fallback using execCommand
    try {
      const textarea = document.createElement('textarea')
      textarea.value = value
      textarea.style.position = 'fixed'
      textarea.style.top = '-9999px'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      if (ok) setCopied()
      return ok
    } catch {
      return false
    }
  }

  const read = async (): Promise<string> => {
    if (!isSupported) return text.value
    try {
      const value = await navigator.clipboard.readText()
      text.value = value
      return value
    } catch {
      return text.value
    }
  }

  function setCopied() {
    copied.value = true
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
    }, copiedDuration)
  }

  if (getCurrentInstance()) {
    onBeforeUnmount(() => {
      if (timer !== null) clearTimeout(timer)
    })
  }

  return { text, copied, copy, read, isSupported }
}
