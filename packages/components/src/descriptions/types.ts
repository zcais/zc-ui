import type { InjectionKey, ComputedRef, VNode } from 'vue'

export type DescriptionsDirection = 'horizontal' | 'vertical'
export type DescriptionsSize = 'large' | 'default' | 'small'

export interface DescriptionItemData {
  uid: number
  label: string
  span: number
  content?: () => VNode[]
  labelClassName?: string
  contentClassName?: string
  labelStyle?: Record<string, string>
}

export interface DescriptionsContext {
  column: ComputedRef<number>
  border: ComputedRef<boolean>
  direction: ComputedRef<DescriptionsDirection>
  size: ComputedRef<DescriptionsSize>
  colon: ComputedRef<boolean>
  labelStyle: ComputedRef<Record<string, string>>
  contentStyle: ComputedRef<Record<string, string>>
  addItem: (item: DescriptionItemData) => void
  removeItem: (uid: number) => void
}

export const DESCRIPTIONS_KEY: InjectionKey<DescriptionsContext> = Symbol('zcDescriptions')
