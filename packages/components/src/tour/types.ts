/**
 * ZcTour type definitions
 */

/** 12-directional placement for the tour popover panel */
export type TourPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end'

/** Indicator type: page-number dots or progress bar */
export type TourIndicatorType = 'default' | 'dot' | 'none'

/** Target resolver: CSS selector string, element ref, or function returning element */
export type TourTarget = string | HTMLElement | (() => HTMLElement | null)

/** A single tour step configuration */
export interface TourStep {
  /** Step title */
  title?: string
  /** Step description / body content */
  description?: string
  /**
   * Target element to highlight.
   * - string: CSS selector (first match is used)
   * - HTMLElement: direct element reference
   * - function: returns the element
   * If not set, the popover shows centered without highlight cutout.
   */
  target?: TourTarget
  /** Override placement for this step */
  placement?: TourPlacement
  /** Override arrow visibility for this step */
  showArrow?: boolean
  /** Override highlight padding around target (px) */
  gap?: number
  /** Override popover offset from target (px) */
  offset?: number
  /** Custom data payload accessible in slots */
  payload?: any
}

/** ZcTour component props */
export interface TourProps {
  /** Visibility (v-model / v-model:open) */
  modelValue?: boolean
  /** Alias for modelValue — supports v-model:open */
  open?: boolean
  /** Tour steps configuration */
  steps?: TourStep[]
  /** Current step index — supports v-model:current */
  current?: number
  /** Default placement (overridden by step.placement) */
  placement?: TourPlacement
  /** Show arrow indicator (default true) */
  arrow?: boolean
  /** Show mask overlay (default true) */
  showMask?: boolean
  /** Close tour when clicking the mask overlay (default true) */
  closeOnOverlayClick?: boolean
  /** Enable keyboard navigation — ESC / arrows (default true) */
  keyboard?: boolean
  /** Highlight padding around target element (px) */
  gap?: number
  /** Distance between popover panel and target element (px) */
  offset?: number
  /** Mask background color */
  maskColor?: string
  /** Z-index of the overlay layer */
  zIndex?: number
  /** Indicator type */
  indicator?: TourIndicatorType
  /** scrollIntoView options for auto-scroll */
  scrollIntoViewOptions?: ScrollIntoViewOptions
  /** Show Previous button (default true) */
  showPrevButton?: boolean
  /** Show Skip button (default true) */
  showSkipButton?: boolean
  /** Previous button text */
  prevButtonText?: string
  /** Next button text */
  nextButtonText?: string
  /** Finish button text (last step) */
  finishButtonText?: string
  /** Skip button text */
  skipButtonText?: string
}

/** ZcTour component emits */
export interface TourEmits {
  (e: 'update:modelValue', val: boolean): void
  (e: 'update:open', val: boolean): void
  (e: 'update:current', val: number): void
  (e: 'change', currentStep: number): void
  (e: 'close', currentStep: number): void
  (e: 'finish'): void
}
