import type { InjectionKey, ComputedRef, Ref } from 'vue'

export type MenuMode = 'horizontal' | 'vertical'
export type MenuTrigger = 'hover' | 'click'
export type MenuPopperEffect = 'light' | 'dark'

export interface MenuContext {
  activeIndex: Ref<string>
  activeIndexPath: Ref<string[]>
  mode: ComputedRef<MenuMode>
  collapse: ComputedRef<boolean>
  backgroundColor: ComputedRef<string>
  textColor: ComputedRef<string>
  activeTextColor: ComputedRef<string>
  uniqueOpened: ComputedRef<boolean>
  /** How popup submenus are opened in horizontal mode ('hover' | 'click') */
  menuTrigger: ComputedRef<MenuTrigger>
  /** Popup theme for popup-mode submenus */
  popperEffect: ComputedRef<MenuPopperEffect>
  /** Gap (px) between a popup trigger and its floating panel */
  popperOffset: ComputedRef<number>
  /** Whether selecting an item navigates via vue-router */
  routerEnabled: ComputedRef<boolean>
  openedMenus: Ref<Set<string>>
  selectItem: (index: string, indexPath: string[]) => void
  openMenu: (index: string, indexPath: string[]) => void
  closeMenu: (index: string, indexPath: string[]) => void
  isMenuOpened: (index: string) => boolean
  /** Top-level items report their DOM width for the horizontal ellipsis calc */
  registerItem: (index: string, el: HTMLElement) => void
  unregisterItem: (index: string) => void
}

export const MENU_KEY: InjectionKey<MenuContext> = Symbol('zcMenu')

/** Provided by each ZcSubmenu so descendants can build their full indexPath */
export interface SubmenuContext {
  indexPath: ComputedRef<string[]>
  /** Nesting depth of this submenu; top-level submenus are level 0 */
  level: ComputedRef<number>
}

export const SUBMENU_KEY: InjectionKey<SubmenuContext> = Symbol('zcSubmenu')
