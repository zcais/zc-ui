/**
 * ZcCountdown type definitions
 */

export interface CountdownProps {
  /**
   * Target time. Can be:
   * - An absolute timestamp in milliseconds (e.g. `Date.now() + 60_000`)
   * - A relative duration in milliseconds (e.g. `60_000` for 1 minute)
   *
   * Values ≥ 1e10 (≈ 115 days in ms) are treated as absolute timestamps.
   */
  value?: number

  /**
   * Format string for the countdown display.
   * Supported tokens: YYYY, MM, DD, HH, mm, ss, SSS, S
   *
   * @default 'HH:mm:ss'
   */
  format?: string

  /** Title displayed above the countdown value */
  title?: string

  /** Prefix text/icon before the value */
  prefix?: string

  /** Suffix text/icon after the value */
  suffix?: string

  /** Inline style object applied to the value element */
  valueStyle?: Record<string, string>

  /**
   * Custom tick interval in milliseconds.
   * Defaults to 1000ms, or 50ms when the format string contains milliseconds.
   */
  interval?: number
}

export interface CountdownEmits {
  /** Emitted when the countdown reaches zero */
  finish: []
  /** Emitted on each tick with the remaining milliseconds */
  change: [remaining: number]
}

/** Methods exposed via template ref */
export interface CountdownExposed {
  /** Pause the countdown (freezes the display) */
  pause: () => void
  /** Resume the countdown from where it was paused */
  resume: () => void
  /** Reset the countdown to the initial value and restart */
  reset: () => void
}
