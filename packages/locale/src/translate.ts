/**
 * Replace `{name}` placeholders in a template string with provided values.
 *
 * Placeholders not present in `options` are left as-is.
 *
 * @example
 * interpolate('Hello, {name}!', { name: 'World' })  // 'Hello, World!'
 */
export function interpolate(template: string, options?: Record<string, string | number>): string {
  if (!options) return template

  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    return key in options ? String(options[key]) : match
  })
}
