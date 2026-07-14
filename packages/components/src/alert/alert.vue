<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcAlert' })

import type { AlertType } from './types'

const props = withDefaults(
  defineProps<{
    /** Alert type */
    type?: AlertType
    /** Alert title */
    title?: string
    /** Alert description text */
    description?: string
    /** Show icon */
    showIcon?: boolean
    /** Center the content */
    center?: boolean
    /** Whether alert can be closed */
    closable?: boolean
    /** Close button text */
    closeText?: string
    /** Visual style: light or dark */
    effect?: 'light' | 'dark'
  }>(),
  {
    type: 'info',
    title: '',
    description: '',
    showIcon: false,
    center: false,
    closable: true,
    closeText: '',
    effect: 'light',
  }
)

const emit = defineEmits<{
  (e: 'close', event: MouseEvent): void
}>()

const ns = useNamespace('alert')
const { t } = useLocale()
const visible = ref(true)

const iconPath = computed(() => {
  const icons: Record<AlertType, string> = {
    success: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
    warning: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z',
    info: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z',
    error:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z',
  }
  return icons[props.type]
})

function handleClose(e: MouseEvent) {
  visible.value = false
  emit('close', e)
}
</script>

<template>
  <Transition name="zc-alert-fade">
    <div
      v-if="visible"
      :class="[
        ns.b(),
        ns.m(type),
        ns.is('center', center),
        ns.is('with-description', !!description),
        ns.is('dark', effect === 'dark'),
      ]"
      role="alert"
    >
      <span v-if="showIcon" :class="ns.e('icon')" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor" class="zc-alert__icon-svg">
          <path :d="iconPath" />
        </svg>
      </span>

      <div :class="ns.e('content')">
        <span v-if="title" :class="ns.e('title')">{{ title }}</span>
        <span v-if="description" :class="ns.e('description')">{{ description }}</span>
        <slot />
      </div>

      <button
        v-if="closable"
        :class="ns.e('close')"
        type="button"
        :aria-label="t('zc.alert.close')"
        @click="handleClose"
      >
        <template v-if="closeText">
          <span :class="ns.e('close-text')">{{ closeText }}</span>
        </template>
        <template v-else>
          <svg viewBox="0 0 24 24" fill="none" class="zc-alert__close-icon" aria-hidden="true">
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </template>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================================
 * ZcAlert styles
 * ============================================================ */

.zc-alert {
  --zc-alert-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-alert-text-color: var(--color-zc-info-600, #73767a);
  --zc-alert-border-color: transparent;
  --zc-alert-title-color: var(--zc-alert-text-color);
  --zc-alert-title-font-size: var(--text-zc-base, 14px);
  --zc-alert-description-font-size: var(--text-zc-sm, 13px);
  --zc-alert-border-radius: var(--radius-zc-base, 4px);
  --zc-alert-padding: 8px 16px;
--zc-alert-icon-size: 16px;
--zc-alert-close-color: var(--color-zc-text-placeholder, #909399);
--zc-alert-close-hover-color: var(--color-zc-text-primary, #303133);
  
  display: flex;
align-items: flex-start;
gap: 8px;
padding: var(--zc-alert-padding);
border-radius: var(--zc-alert-border-radius);
  font-size: var(--zc-alert-title-font-size);
  line-height: 1.5;
background: var(--zc-alert-bg-color);
color: var(--zc-alert-text-color);
  border: 1px solid var(--zc-alert-border-color);
  transition: opacity var(--transition-duration-zc-base, 0.25s);
}

  .zc-alert.is-center {
  justify-content: center;
text-align: center;
}
  
  /* ---- Light effect (default) ---- */
.zc-alert--success {
--zc-alert-bg-color: var(--color-zc-success-50, #f0f9eb);
--zc-alert-text-color: var(--color-zc-success-600, #529b2e);
--zc-alert-title-color: var(--zc-alert-text-color);
  }
  .zc-alert--warning {
--zc-alert-bg-color: var(--color-zc-warning-50, #fdf6ec);
--zc-alert-text-color: var(--color-zc-warning-600, #b88230);
  --zc-alert-title-color: var(--zc-alert-text-color);
  }
.zc-alert--info {
--zc-alert-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-alert-text-color: var(--color-zc-info-600, #73767a);
  --zc-alert-title-color: var(--zc-alert-text-color);
}
.zc-alert--error {
  --zc-alert-bg-color: var(--color-zc-danger-50, #fef0f0);
  --zc-alert-text-color: var(--color-zc-danger-600, #c45656);
--zc-alert-title-color: var(--zc-alert-text-color);
}

/* ---- Dark effect ---- */
  .zc-alert.is-dark.zc-alert--success {
  --zc-alert-bg-color: var(--color-zc-success-500, #67c23a);
  --zc-alert-text-color: var(--color-zc-white, #fff);
  --zc-alert-title-color: var(--zc-alert-text-color);
}
.zc-alert.is-dark.zc-alert--warning {
  --zc-alert-bg-color: var(--color-zc-warning-500, #e6a23c);
  --zc-alert-text-color: var(--color-zc-white, #fff);
--zc-alert-title-color: var(--zc-alert-text-color);
}
.zc-alert.is-dark.zc-alert--info {
--zc-alert-bg-color: var(--color-zc-info-500, #909399);
  --zc-alert-text-color: var(--color-zc-white, #fff);
  --zc-alert-title-color: var(--zc-alert-text-color);
}
.zc-alert.is-dark.zc-alert--error {
  --zc-alert-bg-color: var(--color-zc-danger-500, #f56c6c);
  --zc-alert-text-color: var(--color-zc-white, #fff);
  --zc-alert-title-color: var(--zc-alert-text-color);
}

  /* ---- Icon ---- */
  .zc-alert__icon {
  display: inline-flex;
  align-items: center;
flex-shrink: 0;
margin-top: 2px;
}
.zc-alert__icon-svg {
  width: var(--zc-alert-icon-size);
  height: var(--zc-alert-icon-size);
  }
  
  /* ---- Content ---- */
  .zc-alert__content {
  flex: 1;
  min-width: 0;
  }
.zc-alert__title {
font-weight: 600;
  font-size: var(--zc-alert-title-font-size);
color: var(--zc-alert-title-color);
line-height: 1.5;
  }
  .zc-alert__description {
display: block;
margin-top: 4px;
  font-size: var(--zc-alert-description-font-size);
line-height: 1.5;
}

/* ---- Close ---- */
.zc-alert__close {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--zc-alert-close-color);
  opacity: 0.7;
  border: none;
  background: transparent;
  padding: 0;
  transition: opacity var(--transition-duration-zc-base, 0.25s), color var(--transition-duration-zc-base, 0.25s);
}
.zc-alert__close:hover {
  opacity: 1;
  color: var(--zc-alert-close-hover-color);
}
.zc-alert__close-icon {
  width: var(--zc-alert-icon-size);
  height: var(--zc-alert-icon-size);
}
.zc-alert__close-text {
  font-size: var(--zc-alert-description-font-size);
}

/* ---- Transition ---- */
.zc-alert-fade-enter-active,
.zc-alert-fade-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}
.zc-alert-fade-enter-from,
.zc-alert-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
