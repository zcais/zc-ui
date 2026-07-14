/**
 * ZC UI - Shared SVG icon path data
 *
 * Centralized icon definitions to avoid duplication across components.
 * Each entry is the `d` attribute of an SVG <path> element.
 */

// ---- Status icons (used by Message, Notification, Alert, etc.) ----

export const statusIconPaths = {
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0 9a1 1 0 100 2 1 1 0 000-2z',
  success:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.414L6.586 12 8 10.586l3 3 5-5L17.414 10 11 16.414z',
  warning: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
  error: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
} as const

export type StatusIconType = keyof typeof statusIconPaths

// ---- Action icons (close, check, arrow, clear, etc.) ----

export const actionIconPaths = {
  close: 'M6 6l12 12M6 18L18 6',
  check: 'M5 12l5 5L20 7',
  arrowDown: 'M6 9l6 6 6-6',
  clear: 'M8 8l8 8M16 8l-8 8',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z',
  eyeOff:
    'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24',
  filter: 'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  expand: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  compress: 'M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5',
} as const
