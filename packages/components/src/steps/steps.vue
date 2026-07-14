<script setup lang="ts">
import { ref, computed, provide, type Ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { stepsKey, type StepData, type StepsContext } from './types'

defineOptions({ name: 'ZcSteps' })

const props = withDefaults(
  defineProps<{
    /** Current active step (0-based index) */
    current?: number
    /** Steps direction */
    direction?: 'horizontal' | 'vertical'
    /** Simple / card mode */
    type?: 'default' | 'simple'
    /** Mark current step as error */
    error?: boolean
  }>(),
  {
    current: 0,
    direction: 'horizontal',
    type: 'default',
    error: false,
  }
)

const ns = useNamespace('steps')

/* ---- Collect child steps ---- */
const steps = ref<StepData[]>([])

const ctx: StepsContext = {
  current: computed(() => props.current),
  direction: computed(() => props.direction as 'horizontal' | 'vertical'),
  type: computed(() => props.type as 'default' | 'simple'),
  error: computed(() => props.error),
  steps: steps as Ref<StepData[]>,
  addStep(step: StepData) {
    steps.value.push(step)
  },
  removeStep(uid: number) {
    const idx = steps.value.findIndex((s) => s.uid === uid)
    if (idx > -1) steps.value.splice(idx, 1)
  },
}

provide(stepsKey, ctx)
</script>

<template>
  <div :class="[ns.b(), ns.m(direction), ns.is('simple', type === 'simple')]" role="list">
    <slot />
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcSteps styles
 * ============================================================ */

.zc-steps {
  --zc-steps-text-color: var(--color-zc-text-regular, #606266);
  --zc-steps-active-color: var(--color-zc-primary-500, #409eff);
  --zc-steps-finish-color: var(--color-zc-success-500, #67c23a);
  --zc-steps-wait-color: var(--color-zc-text-placeholder, #a8abb2);
--zc-steps-error-color: var(--color-zc-danger-500, #f56c6c);
  --zc-steps-font-size: var(--text-zc-base, 14px);
  --zc-steps-icon-size: 24px;
  --zc-steps-line-color: var(--color-zc-border-light, #e4e7ed);
  --zc-steps-line-bg-color: var(--color-zc-border-light, #e4e7ed);

  display: flex;
  width: 100%;
  font-size: var(--zc-steps-font-size);
  line-height: 1.5;
}

.zc-steps--vertical {
  flex-direction: column;
  gap: 0;
}

/* Simple mode: steps are inline cards without connecting lines */
.zc-steps.is-simple {
  display: flex;
  align-items: center;
  gap: var(--spacing-zc-sm, 8px);
}
</style>
