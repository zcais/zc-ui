export interface ImageViewerOptions {
  /** Image URL list */
  urlList: string[]
  /** Initial image index */
  initialIndex?: number
  /** Background color of the viewer */
  zIndex?: number
  /** Show close button */
  showClose?: boolean
  /** Infinite loop navigation */
  infinite?: boolean
  /** Hide viewer after clicking on the overlay */
  closeOnPressEscape?: boolean
  /** Zoom rate per scroll */
  zoomRate?: number
  /** Min zoom */
  minScale?: number
  /** Max zoom */
  maxScale?: number
}

export interface ImageViewerProps extends ImageViewerOptions {}

export interface ImageViewerEmits {
  (e: 'switch', index: number): void
  (e: 'close'): void
}

export interface ImageViewerInstance {
  next: () => void
  prev: () => void
  setActiveItem: (index: number) => void
}
