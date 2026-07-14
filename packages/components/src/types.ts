import type { Plugin } from 'vue'

/**
 * Base type for ZC UI component plugins
 */
export type ZcPlugin = Plugin

/**
 * Size prop type used across components
 */
export type ComponentSize = 'large' | 'medium' | 'small' | 'mini'

/**
 * Common component props
 */
export interface BaseProps {
  size?: ComponentSize
}

/**
 * Shared layout component types.
 * Re-exported from individual component files for convenience.
 */

/** Responsive breakpoint sizes for Row/Col system */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/** Responsive breakpoint pixel values */
export const breakpointValues: Record<Breakpoint, number> = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}
