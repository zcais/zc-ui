/** Props for ErrorBoundary component */
export interface ErrorBoundaryProps {
  /** Whether to catch errors (false = let errors propagate) */
  catchErrors?: boolean
  /** Whether to show error details in development */
  showDetails?: boolean
  /** Custom error title */
  errorTitle?: string
  /** Error description text */
  errorDescription?: string
}

/** Events emitted by ErrorBoundary */
export interface ErrorBoundaryEmits {
  /** Emitted when an error is captured */
  (e: 'error', error: Error, info: string): void
  /** Emitted when the user clicks retry / reset */
  (e: 'reset'): void
}

/** Exposed methods via template ref */
export interface ErrorBoundaryExposed {
  /** Reset the error state and re-render children */
  reset: () => void
}
