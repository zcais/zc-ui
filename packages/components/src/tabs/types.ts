/**
 * ZcTabs type definitions
 */

/** Tab visual style */
export type TabsType = '' | 'card' | 'border-card'

/** Tab header position */
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left'

/** Tab pane data */
export interface PaneData {
  uid: number
  name: string | number
  title?: string
  lazy?: boolean
  closable?: boolean
  disabled?: boolean
}

/** Before-leave hook */
export type TabsBeforeLeave = (
  activeName: string | number,
  oldActiveName: string | number
) => boolean | Promise<boolean>

/** Tabs props */
export interface TabsProps {
  /** Currently active tab (v-model) */
  modelValue?: string | number
  /** Tab style */
  type?: TabsType
  /** Tab header position */
  position?: TabsPosition
  /** Whether tabs are closable */
  closable?: boolean
  /** Whether tabs can be added */
  addable?: boolean
  /** Whether tabs are editable (add + close) */
  editable?: boolean
  /** Guard function before leaving a tab */
  beforeLeave?: TabsBeforeLeave
}

/** Tabs emit events */
export interface TabsEmits {
  (e: 'update:modelValue', name: string | number): void
  (e: 'tab-click', name: string | number, event: MouseEvent): void
  (e: 'tab-remove', name: string | number): void
  (e: 'tab-add'): void
  (e: 'edit', name: string | number | undefined, action: 'remove' | 'add'): void
}
