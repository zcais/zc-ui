/**
 * Shared types for ZC UI icons.
 *
 * Every icon component is a functional Vue component that accepts these props.
 * Icons are auto-generated from @tabler/icons.
 */

export interface ZcIconProps {
  /** Width / height of the SVG. Defaults to 24. */
  size?: number | string
  /** Stroke color. Defaults to 'currentColor'. */
  color?: string
  /** Stroke width. Defaults to 2. */
  strokeWidth?: number | string
  /**
   * If true, the stroke width is interpreted as absolute pixels
   * rather than scaled with the icon size. Defaults to false.
   */
  absoluteStrokeWidth?: boolean
  /** If true, applies a CSS spin animation. */
  spin?: boolean
  /** Extra CSS class(es) applied to the root <svg>. */
  class?: string | object | unknown[]
}

/**
 * Raw SVG data of a registered icon.
 * Used by `<ZcIcon name="..." />` to render an icon dynamically by name.
 */
export interface ZcIconDefinition {
  /** Inner `<path>` SVG markup. */
  path: string
  /** SVG viewBox, e.g. "0 0 24 24". */
  viewBox: string
  /** Default stroke width. */
  strokeWidth: number
  /** Default fill (usually "none"). */
  fill: string
}
