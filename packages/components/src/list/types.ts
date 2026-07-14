import type { InjectionKey, ComputedRef } from 'vue'

export interface ListContext {
  split: ComputedRef<boolean>
  splitPosition: ComputedRef<'inside' | 'outside'>
  size: ComputedRef<'large' | 'default' | 'small'>
  layout: ComputedRef<'vertical' | 'horizontal'>
  bordered: ComputedRef<boolean>
}

export const LIST_KEY: InjectionKey<ListContext> = Symbol('zcList')
