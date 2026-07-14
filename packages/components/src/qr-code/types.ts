/**
 * ZcQRCode type definitions
 */

/** QR code error correction level */
export type QRCodeLevel = 'L' | 'M' | 'Q' | 'H'

/** Rendering mode for the QR code */
export type QRCodeType = 'canvas' | 'svg' | 'image'

/** Status of the QR code display */
export type QRCodeStatus = 'active' | 'expired' | 'loading' | 'scanning'

/** Image configuration for embedding a logo in the QR code center */
export interface QRCodeImageSettings {
  /** Image source URL (or data URI) */
  src: string
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number

}

export interface QRCodeProps {
  /** The content to encode into the QR code */
  value: string

  /** QR code pixel size (width = height) */
  size?: number

  /** Rendering mode: canvas, svg, or image (data URL) */
  type?: QRCodeType

  /** Foreground color (modules) */
  color?: string

  /** Background color */
  background?: string

  /** Error correction level: L (~7%), M (~15%), Q (~25%), H (~30%) */
  level?: QRCodeLevel

  /** Whether to include a quiet-zone margin around the QR code */
  includeMargin?: boolean

  /** Embedded image / logo in the QR code center */
  image?: string

  /** Detailed image settings (width, height) — overrides `image` */
  imageSettings?: QRCodeImageSettings

  /** Display status of the QR code */
  status?: QRCodeStatus

  /** Refresh interval in ms. When set, auto-refreshes the QR code periodically. */
  refreshInterval?: number
}

export interface QRCodeEmits {
  /** Emitted when QR code generation succeeds */
  ready: []
  /** Emitted when QR code generation fails */
  error: [err: Error]
  /** Emitted when refresh() is called, before regeneration */
  refresh: []
}

/** Methods exposed via template ref */
export interface QRCodeExposed {
  /** Manually trigger a QR code regeneration */
  refresh: () => void
  /** Get the data URL of the current QR code (canvas/image type only) */
  toDataURL: () => Promise<string>
}
