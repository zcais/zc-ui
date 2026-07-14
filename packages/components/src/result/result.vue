<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcResult' })

export type ResultStatus = 'success' | 'warning' | 'info' | 'error'

const props = withDefaults(
  defineProps<{
    /** Result status type */
    status?: ResultStatus
    /** Title text */
    title?: string
    /** Sub title text */
    subTitle?: string
    /** Custom icon class */
    icon?: string
  }>(),
  {
    status: 'info',
    title: '',
    subTitle: '',
    icon: '',
  }
)

const ns = useNamespace('result')

const iconPath = computed(() => {
  const paths: Record<ResultStatus, string> = {
    success: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    error:
      'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z',
  }
  return paths[props.status]
})
</script>

<template>
  <div :class="[ns.b(), ns.m(status)]">
    <!-- Icon -->
    <div :class="ns.e('icon')">
      <slot name="icon">
        <i v-if="icon" :class="icon" />
        <svg v-else viewBox="0 0 24 24" fill="currentColor" class="zc-result__icon-svg">
          <path :d="iconPath" />
        </svg>
      </slot>
    </div>

    <!-- Title -->
    <div v-if="title || $slots.title" :class="ns.e('title')">
      <slot name="title">{{ title }}</slot>
    </div>

    <!-- SubTitle -->
    <div v-if="subTitle || $slots.subTitle" :class="ns.e('subtitle')">
      <slot name="subTitle">{{ subTitle }}</slot>
    </div>

    <!-- Content -->
    <div v-if="$slots.default" :class="ns.e('content')">
      <slot />
    </div>

    <!-- Extra / actions -->
    <div v-if="$slots.extra" :class="ns.e('extra')">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcResult styles
 * ============================================================ */

.zc-result {
  --zc-result-icon-size: 64px;
  --zc-result-title-color: var(--color-zc-text-primary, #303133);
  --zc-result-title-font-size: var(--text-zc-lg, 18px);
  --zc-result-subtitle-color: var(--color-zc-text-regular, #606266);
  --zc-result-subtitle-font-size: var(--text-zc-base, 14px);
  --zc-result-padding: 40px;
  --zc-result-extra-gap: 20px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zc-result-padding) 24px;
  text-align: center;
}

/* ---- Icon ---- */
.zc-result__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--zc-result-icon-size);
  height: var(--zc-result-icon-size);
  border-radius: 50%;
}
.zc-result__icon-svg {
  width: 56px;
  height: 56px;
}

.zc-result--success .zc-result__icon {
  color: var(--color-zc-success-500, #67c23a);
}
.zc-result--warning .zc-result__icon {
  color: var(--color-zc-warning-500, #e6a23c);
}
.zc-result--info .zc-result__icon {
  color: var(--color-zc-info-500, #909399);
}
.zc-result--error .zc-result__icon {
  color: var(--color-zc-danger-500, #f56c6c);
}

/* ---- Title ---- */
.zc-result__title {
  margin-top: 20px;
  font-size: var(--zc-result-title-font-size);
  font-weight: 600;
  color: var(--zc-result-title-color);
  line-height: 1.4;
}

/* ---- SubTitle ---- */
.zc-result__subtitle {
  margin-top: 8px;
  font-size: var(--zc-result-subtitle-font-size);
  color: var(--zc-result-subtitle-color);
  line-height: 1.6;
  max-width: 480px;
}

/* ---- Content ---- */
.zc-result__content {
  margin-top: 20px;
  width: 100%;
}

/* ---- Extra ---- */
.zc-result__extra {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--zc-result-extra-gap);
}
</style>
