import type { InjectionKey, ComputedRef, Ref } from 'vue'

export type StepsDirection = 'horizontal' | 'vertical'
export type StepsType = 'default' | 'simple'
export type StepStatus = 'wait' | 'process' | 'finish' | 'error'

export interface StepData {
  uid: number
  title: string
  description: string
  icon?: string
  status?: StepStatus
}

export interface StepsContext {
  current: ComputedRef<number>
  direction: ComputedRef<StepsDirection>
  type: ComputedRef<StepsType>
  error: ComputedRef<boolean>
  steps: Ref<StepData[]>
  addStep: (step: StepData) => void
  removeStep: (uid: number) => void
}

export const stepsKey: InjectionKey<StepsContext> = Symbol('zcSteps')
