// ============================================================
// ZC UI Common Utilities
// ============================================================

import { isClient } from './dom'

// isClient is imported from './dom' which re-exports from './ssr'.
// This keeps a single source of truth and is also re-exported to consumers
// via `export * from './dom'` below.

/**
 * Check if value is defined (not null and not undefined).
 */
export function isDefined<T>(val: T | undefined | null): val is T {
  return val !== undefined && val !== null
}

/**
 * Check if value is a string.
 */
export function isString(val: unknown): val is string {
  return typeof val === 'string'
}

/**
 * Check if value is a number.
 */
export function isNumber(val: unknown): val is number {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Check if value is a boolean.
 */
export function isBoolean(val: unknown): val is boolean {
  return typeof val === 'boolean'
}

/**
 * Check if value is an object (not null, not array).
 */
export function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val)
}

/**
 * Check if value is a function.
 */
export function isFunction(val: unknown): val is (...args: unknown[]) => unknown {
  return typeof val === 'function'
}

/**
 * Get the runtime type of a value as a lowercase string.
 * Returns precise type names: 'null', 'array', 'date', 'regexp', 'promise', etc.
 *
 * @example
 * getType(null)       // 'null'
 * getType([])         // 'array'
 * getType(new Date()) // 'date'
 * getType(123)        // 'number'
 */
export function getType(val: unknown): string {
  if (val === null) return 'null'
  if (Array.isArray(val)) return 'array'
  return typeof val
}

/**
 * Generate a RFC-4122 v4 compliant unique ID (GUID).
 * Falls back to a Math.random-based ID in non-crypto environments.
 *
 * @example
 * guid() // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 */
export function guid(): string {
  if (isClient && crypto?.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: time-based pseudo-GUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generate a short unique ID with optional prefix.
 * Suitable for DOM element IDs and internal references.
 *
 * @example
 * uniqueId()       // 'zc-j3kf9x2'
 * uniqueId('el')   // 'el-j3kf9x2'
 */
export function uniqueId(prefix = 'zc'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`
}

/**
 * Clamp a number between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max)
}

/**
 * Check if value is an empty string, null, undefined, empty array, or empty object.
 */
export function isEmpty(val: unknown): boolean {
  if (val == null) return true
  if (isString(val) || Array.isArray(val)) return val.length === 0
  if (isObject(val)) return Object.keys(val).length === 0
  return false
}

/**
 * Deep-merge two or more objects. Later sources take precedence.
 */
export function deepMerge(
  ...sources: Array<Record<string, unknown> | undefined | null>
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const source of sources) {
    if (!source) continue
    for (const key of Object.keys(source)) {
      const srcVal = source[key]
      const tgtVal = result[key]
      if (Array.isArray(srcVal)) {
        result[key] = [...srcVal]
      } else if (isObject(srcVal)) {
        result[key] = isObject(tgtVal)
          ? deepMerge(tgtVal as Record<string, unknown>, srcVal as Record<string, unknown>)
          : { ...srcVal }
      } else {
        result[key] = srcVal
      }
    }
  }
  return result
}

// Export sub-modules
// Note: SSR helpers are re-exported through './dom', so no separate export needed.
export * from './dom'
export * from './install'
export * from './format'
