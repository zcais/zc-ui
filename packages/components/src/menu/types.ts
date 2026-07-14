import type { InjectionKey, ComputedRef, Ref } from 'vue'

export type MenuMode = 'horizontal' | 'vertical'

export interface MenuContext {
  activeIndex: Ref<string>
  mode: ComputedRef<MenuMode>
  collapse: ComputedRef<boolean>
  backgroundColor: ComputedRef<string>
  textColor: ComputedRef<string>
  activeTextColor: ComputedRef<string>
  uniqueOpened: ComputedRef<boolean>
  openedMenus: Ref<Set<string>>
  selectItem: (index: string, indexPath: string[]) => void
  openMenu: (index: string, indexPath: string[]) => void
  closeMenu: (index: string, indexPath: string[]) => void
  isMenuOpened: (index: string) => boolean
}

export const MENU_KEY: InjectionKey<MenuContext> = Symbol('zcMenu')
