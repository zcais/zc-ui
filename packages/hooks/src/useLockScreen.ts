/**
 * Reference-counted body scroll lock.
 *
 * Multiple overlays (dialog, drawer, message-box, image-viewer,
 * action-sheet, fullscreen loading) may be open at the same time. A naive
 * `body.style.overflow = 'hidden'` / `= ''` pair breaks in that case: closing
 * one overlay unlocks scrolling while another is still open.
 *
 * Usage:
 *   import { lockBodyScroll, unlockBodyScroll } from '@zc-ui/hooks'
 *
 *   onOpen:  lockBodyScroll()
 *   onClose: unlockBodyScroll()
 *
 * The first lock remembers the previous `overflow` value and restores it
 * when the last lock is released. Calls are idempotent per consumer — pair
 * exactly one unlock with each lock (guard on the consumer side if open()
 * can run twice without an intervening close).
 */

let lockCount = 0
let savedOverflow: string | null = null

export function lockBodyScroll(): void {
  if (typeof document === 'undefined') return
  if (lockCount === 0) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  lockCount++
}

export function unlockBodyScroll(): void {
  if (typeof document === 'undefined') return
  if (lockCount === 0) return
  lockCount--
  if (lockCount === 0) {
    document.body.style.overflow = savedOverflow ?? ''
    savedOverflow = null
  }
}

/** Test helper: current number of active scroll locks. */
export function getBodyScrollLockCount(): number {
  return lockCount
}
