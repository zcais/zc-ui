/**
 * DOM utility functions
 */

// Re-export SSR helpers so consumers have a single import path.
 // The canonical definition lives in `./ssr` to keep it framework-agnostic.
 export {
 isClient,
 isServer,
importMetaClient,
  safeWindow,
  safeDocument,
  onClientOnly,
  safeRAF,
  safeCancelRAF,
} from './ssr'

/**
 * Check if element has a CSS class.
 */
export function hasClass(el: HTMLElement, cls: string): boolean {
  return el.classList.contains(cls)
}

/**
 * Add a CSS class (or multiple space-separated classes) to element.
 */
export function addClass(el: HTMLElement, cls: string): void {
  el.classList.add(...cls.trim().split(/\s+/))
}

/**
 * Remove a CSS class (or multiple space-separated classes) from element.
 */
export function removeClass(el: HTMLElement, cls: string): void {
  el.classList.remove(...cls.trim().split(/\s+/))
}

/**
 * Toggle a CSS class on element.
 */
export function toggleClass(el: HTMLElement, cls: string): void {
  el.classList.toggle(cls)
}

// ---------------------------------------------------------------
// Event binding utilities
// ---------------------------------------------------------------

/**
 * Type alias for an event target that supports addEventListener.
 */
export type EventTargetLike = HTMLElement | Window | Document

/**
 * Listener options that can be boolean or AddEventListenerOptions.
 */
export type ListenerOptions = boolean | AddEventListenerOptions

/**
 * Add an event listener with optional options.
 * Returns a cleanup function that removes the listener.
 *
 * @example
 * const off = on(document, 'click', handler)
 * off() // remove listener
 */
export function on(
  target: EventTargetLike,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: ListenerOptions
): () => void {
  target.addEventListener(event, handler, options)
  return () => target.removeEventListener(event, handler, options)
}

/**
 * Remove an event listener.
 */
export function off(
  target: EventTargetLike,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: ListenerOptions
): void {
  target.removeEventListener(event, handler, options)
}

/**
 * Add a one-time event listener that auto-removes after first trigger.
 *
 * @example
 * once(element, 'transitionend', handler)
 */
export function once(
  target: EventTargetLike,
  event: string,
  handler: EventListener,
  options?: ListenerOptions
): () => void {
  const wrapped: EventListener = (e: Event) => {
    handler(e)
    target.removeEventListener(event, wrapped, options)
  }
  target.addEventListener(event, wrapped, options)
  return () => target.removeEventListener(event, wrapped, options)
}

/**
 * Query a single element by selector (shorthand for querySelector).
 */
export function querySelector<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector<T>(selector)
}

/**
 * Query all matching elements by selector.
 */
export function querySelectorAll<T extends HTMLElement = HTMLElement>(
  selector: string,
  parent: ParentNode = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector))
}

/**
 * Check if an element matches a CSS selector.
 */
export function matches(el: HTMLElement, selector: string): boolean {
  return el.matches(selector)
}

/**
 * Get the closest ancestor matching a selector, or null.
 */
export function closest(el: HTMLElement, selector: string): HTMLElement | null {
  return el.closest<HTMLElement>(selector)
}

/**
 * Check if an element contains another element (or is the same).
 */
export function contains(parent: Node, child: Node): boolean {
  return parent.contains(child)
}
