/**
 * Recursively flatten a nested dictionary into dot-notation keys.
 *
 * Both nested objects (`{ button: { confirm: '确定' } }`) and already-flat
 * keys (`{ 'button.confirm': '确定' }`) are supported. The result is always
 * a flat `Record<string, string>`.
 *
 * @example
 * flatten({ button: { confirm: '确定' } })
 * // → { 'button.confirm': '确定' }
 */
export function flatten(dict: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}

  for (const [key, value] of Object.entries(dict)) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flatten(value as Record<string, unknown>, fullKey))
    } else {
      result[fullKey] = String(value)
    }
  }

  return result
}
