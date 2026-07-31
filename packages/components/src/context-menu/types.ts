export interface ContextMenuItem {
  /** Unique key */
  key: string
  /** Display label */
  label: string
  /** Icon class or SVG */
  icon?: string
  /** Disable this item */
  disabled?: boolean
  /** Divider above this item */
  divided?: boolean
  /** Danger style */
  danger?: boolean
  /** Children for submenu */
  children?: ContextMenuItem[]
}

export interface ContextMenuOptions {
  /** Menu items */
  items: ContextMenuItem[]
  /** X position */
  x: number
  /** Y position */
  y: number
  /** Min width */
  minWidth?: number
  /** Max width */
  maxWidth?: number
}

export interface ContextMenuProps {
  /** Menu items via prop */
  items?: ContextMenuItem[]
  /** Min width */
  minWidth?: number
  /** Max width */
  maxWidth?: number
}

export interface ContextMenuEmits {
  (e: 'select', item: ContextMenuItem): void
}
