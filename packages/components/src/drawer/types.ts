/**
 * ZcDrawer type definitions
 */

/** Drawer open direction */
export type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

/** Drawer props */
export interface DrawerProps {
  /** Visibility (v-model) */
  modelValue: boolean
  /** Drawer title */
  title?: string
  /** Drawer direction: rtl(right)|ltr(left)|ttb(top)|btt(bottom) */
  direction?: DrawerDirection
  /** Drawer size (width for ltr/rtl, height for ttb/btt) */
  size?: string | number
  /** Show close button */
  showClose?: boolean
  /** Close on overlay click */
  closeOnClickOverlay?: boolean
  /** Close on Escape key */
  closeOnEsc?: boolean
  /** Lock body scroll when open */
  lockScroll?: boolean
  /** Enable drag to resize */
  resizable?: boolean
  /** Min size when dragging */
  minSize?: number
  /** Max size when dragging */
  maxSize?: number
  /** Custom drawer class */
  drawerClass?: string
  /** Show footer */
  withFooter?: boolean
}

/** Drawer emit events */
export interface DrawerEmits {
  (e: 'update:modelValue', val: boolean): void
  (e: 'open'): void
  (e: 'close'): void
}
