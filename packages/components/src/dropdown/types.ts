import type { InjectionKey } from 'vue'

export type DropdownTrigger = 'hover' | 'click' | 'contextmenu'
export type DropdownPlacement =
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

export interface DropdownContext {
  handleCommand: (command: string | number | object) => void
  hide: () => void
}

export const DROPDOWN_KEY: InjectionKey<DropdownContext> = Symbol('zcDropdown')
