/**
 * Minimal date token formatter/parser shared by ZcDatePicker.
 *
 * Supported tokens (dayjs-style subset, no external dependency):
 *   YYYY — 4-digit year          MM — 2-digit month (01-12)
 *   DD   — 2-digit day (01-31)   HH — 2-digit hours (00-23)
 *   mm   — 2-digit minutes       ss — 2-digit seconds
 */

const TOKEN_RE = /(YYYY|MM|DD|HH|mm|ss)/g

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** Format a Date according to the token format string. */
export function formatDateWithTokens(date: Date, format: string): string {
  return format.replace(TOKEN_RE, (token) => {
    switch (token) {
      case 'YYYY':
        return String(date.getFullYear())
      case 'MM':
        return pad(date.getMonth() + 1)
      case 'DD':
        return pad(date.getDate())
      case 'HH':
        return pad(date.getHours())
      case 'mm':
        return pad(date.getMinutes())
      case 'ss':
        return pad(date.getSeconds())
      default:
        return token
    }
  })
}

interface FormatPart {
  token: string
  literal: string
}

/** Split a format string into token / literal segments. */
function tokenizeFormat(format: string): FormatPart[] {
  const parts: FormatPart[] = []
  let lastIndex = 0
  for (const match of format.matchAll(TOKEN_RE)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      parts.push({ token: '', literal: format.slice(lastIndex, index) })
    }
    parts.push({ token: match[0], literal: '' })
    lastIndex = index + match[0].length
  }
  if (lastIndex < format.length) {
    parts.push({ token: '', literal: format.slice(lastIndex) })
  }
  return parts
}

/**
 * Parse a string according to the token format string.
 * Returns `null` when the text does not match the format.
 */
export function parseDateWithTokens(text: string, format: string): Date | null {
  const parts = tokenizeFormat(format)
  const values: Record<string, number> = {}
  let pos = 0

  for (const part of parts) {
    if (part.token === '') {
      // Literal must match exactly
      if (!text.startsWith(part.literal, pos)) return null
      pos += part.literal.length
      continue
    }

    const isNumeric = part.token !== 'YYYY'
    const len = isNumeric ? 2 : 4
    const segment = text.slice(pos, pos + len)
    if (!/^\d+$/.test(segment)) return null
    values[part.token] = parseInt(segment, 10)
    pos += len
  }

  // Trailing characters mean the text doesn't match the format
  if (pos !== text.length) return null

  const year = values['YYYY']
  const month = values['MM']
  const day = values['DD']
  if (year === undefined || month === undefined || day === undefined) return null
  if (month < 1 || month > 12 || day < 1 || day > 31) return null

  const date = new Date(
    year,
    month - 1,
    day,
    values['HH'] ?? 0,
    values['mm'] ?? 0,
    values['ss'] ?? 0
  )
  // Reject rollover dates like Feb 30
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null
  }
  return date
}
