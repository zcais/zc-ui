/**
 * Formatting utility functions
 */

/**
 * Format a number to a fixed number of decimal places
 */
export function toFixed(val: number, decimals = 2): string {
  return val.toFixed(decimals)
}

/**
 * Pad a number with leading zeros
 */
export function padZero(val: number | string, length = 2): string {
  return String(val).padStart(length, '0')
}
