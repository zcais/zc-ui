<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useGlobalConfig } from '../config-provider/useGlobalConfig'

defineOptions({ name: 'ZcButton' })

export type ButtonType = 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
export type ButtonSize = 'large' | 'medium' | 'small' | 'mini'
export type ButtonNativeType = 'button' | 'submit' | 'reset'

const props = withDefaults(
  defineProps<{
    type?: ButtonType
    size?: ButtonSize
    disabled?: boolean
    loading?: boolean
    round?: boolean
    plain?: boolean
    icon?: string
    nativeType?: ButtonNativeType
  }>(),
  {
    type: 'default',
    size: undefined,
    disabled: false,
    loading: false,
    round: false,
    plain: false,
    nativeType: 'button',
  },
)

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const ns = useNamespace('button')

// ---- ConfigProvider size integration ----
  // Priority: explicit prop > ConfigProvider global size > default 'medium'
  const { size: globalSize } = useGlobalConfig()
  const effectiveSize = computed<ButtonSize>(
  () => props.size ?? globalSize.value ?? 'medium',
  )
  
  const classes = computed(() => [
  ns.b(),
  ns.is('disabled', props.disabled),
  ns.is('loading', props.loading),
  // Type modifier: zc-button--primary, etc.
props.type !== 'default' ? ns.m(props.type) : '',
  // Size modifier: zc-button--large, etc.
  ns.m(effectiveSize.value),
  // Shape modifier
  ns.is('round', props.round),
  // Style variant
  ns.is('plain', props.plain),
])

function handleClick(event: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', event)
}
</script>

<template>
  <button :class="classes" :disabled="disabled || loading" :type="nativeType" @click="handleClick">
    <span v-if="loading" :class="ns.e('loading')" aria-hidden="true">
      <svg class="zc-button__loading-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
    </span>
    <span v-if="icon && !loading" :class="ns.e('icon')" aria-hidden="true">
      <i :class="icon" />
    </span>
    <span v-if="$slots.default" :class="ns.e('inner')">
      <slot />
    </span>
  </button>
</template>

<style scoped>
/* ============================================================
 * ZcButton styles
 * BEM naming: zc-button / zc-button__inner / zc-button--primary
 *
 * Component-level CSS variables (--zc-button-*) reference global
* design tokens by default. Override any variable to customize:
*
  *   .my-section { --zc-button-bg-color: red; }
  *
  * Or via createTheme({ components: { button: { bgColor: 'red' } } })
  * ============================================================ */
  
  .zc-button {
  /* ---- Component-level CSS variables (global token defaults) ---- */
  --zc-button-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-button-text-color: var(--color-zc-text-regular, #606266);
  --zc-button-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-button-hover-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-button-hover-text-color: var(--color-zc-primary-500, #409eff);
  --zc-button-hover-border-color: var(--color-zc-primary-300, #a0cfff);
  --zc-button-active-bg-color: var(--color-zc-primary-100, #d9ecff);
  --zc-button-active-text-color: var(--color-zc-primary-600, #337ecc);
    --zc-button-active-border-color: var(--color-zc-primary-400, #79bbff);
    --zc-button-focus-outline-color: var(--color-zc-primary-400, #79bbff);
    --zc-button-disabled-bg-color: var(--color-zc-fill-light, #f5f7fa);
--zc-button-disabled-text-color: var(--color-zc-text-placeholder, #a8abb2);
--zc-button-disabled-border-color: var(--color-zc-border-light, #e4e7ed);
--zc-button-border-radius: var(--radius-zc-base, 4px);
  --zc-button-font-size: var(--text-zc-base, 14px);
  --zc-button-font-weight: 500;
  --zc-button-gap: var(--spacing-zc-sm, 8px);

display: inline-flex;
align-items: center;
  justify-content: center;
  line-height: 1;
gap: var(--zc-button-gap);
  border: 1px solid var(--zc-button-border-color);
  color: var(--zc-button-text-color);
  background: var(--zc-button-bg-color);
  padding: 8px 16px;
  font-size: var(--zc-button-font-size);
  font-weight: var(--zc-button-font-weight);
  border-radius: var(--zc-button-border-radius);
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition:
    color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    background-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    border-color var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-button:hover {
  color: var(--zc-button-hover-text-color);
  border-color: var(--zc-button-hover-border-color);
  background: var(--zc-button-hover-bg-color);
}

.zc-button:active {
  color: var(--zc-button-active-text-color);
  border-color: var(--zc-button-active-border-color);
  background: var(--zc-button-active-bg-color);
}

.zc-button:focus-visible {
  outline: 2px solid var(--zc-button-focus-outline-color);
  outline-offset: 1px;
}

/* ---- Loading ---- */
.zc-button__loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1em;
  height: 1em;
}

.zc-button__loading-icon {
  width: 100%;
  height: 100%;
  animation: zc-button-spin 0.6s linear infinite;
}

@keyframes zc-button-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* ---- Icon ---- */
.zc-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* ---- Element ---- */
.zc-button__inner {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

/* ---- Modifiers: type ---- */
/* Each type modifier overrides the component-level CSS variables */
  .zc-button--primary {
  --zc-button-bg-color: var(--color-zc-primary-500, #409eff);
  --zc-button-text-color: var(--color-zc-white, #fff);
--zc-button-border-color: var(--color-zc-primary-500, #409eff);
--zc-button-hover-bg-color: var(--color-zc-primary-400, #79bbff);
  --zc-button-hover-text-color: var(--color-zc-white, #fff);
  --zc-button-hover-border-color: var(--color-zc-primary-400, #79bbff);
  }
.zc-button--success {
--zc-button-bg-color: var(--color-zc-success-500, #67c23a);
--zc-button-text-color: var(--color-zc-white, #fff);
  --zc-button-border-color: var(--color-zc-success-500, #67c23a);
  --zc-button-hover-bg-color: var(--color-zc-success-400, #95d575);
  --zc-button-hover-text-color: var(--color-zc-white, #fff);
--zc-button-hover-border-color: var(--color-zc-success-400, #95d575);
}
  .zc-button--warning {
  --zc-button-bg-color: var(--color-zc-warning-500, #e6a23c);
  --zc-button-text-color: var(--color-zc-white, #fff);
--zc-button-border-color: var(--color-zc-warning-500, #e6a23c);
--zc-button-hover-bg-color: var(--color-zc-warning-400, #ecbe77);
--zc-button-hover-text-color: var(--color-zc-white, #fff);
  --zc-button-hover-border-color: var(--color-zc-warning-400, #ecbe77);
  }
  .zc-button--danger {
--zc-button-bg-color: var(--color-zc-danger-500, #f56c6c);
--zc-button-text-color: var(--color-zc-white, #fff);
  --zc-button-border-color: var(--color-zc-danger-500, #f56c6c);
  --zc-button-hover-bg-color: var(--color-zc-danger-400, #f78989);
  --zc-button-hover-text-color: var(--color-zc-white, #fff);
--zc-button-hover-border-color: var(--color-zc-danger-400, #f78989);
}
.zc-button--info {
  --zc-button-bg-color: var(--color-zc-info-500, #909399);
  --zc-button-text-color: var(--color-zc-white, #fff);
  --zc-button-border-color: var(--color-zc-info-500, #909399);
--zc-button-hover-bg-color: var(--color-zc-info-400, #a6a9ad);
--zc-button-hover-text-color: var(--color-zc-white, #fff);
  --zc-button-hover-border-color: var(--color-zc-info-400, #a6a9ad);
  }

/* ---- Modifiers: size ---- */
.zc-button--large {
  padding: 12px 20px;
  font-size: var(--text-zc-md, 16px);
}
.zc-button--medium {
  padding: 8px 16px;
  font-size: var(--text-zc-base, 14px);
}
.zc-button--small {
  padding: 6px 12px;
  font-size: var(--text-zc-sm, 13px);
}
.zc-button--mini {
  padding: 4px 8px;
  font-size: var(--text-zc-xs, 12px);
}

/* ---- States ---- */
.zc-button.is-disabled,
.zc-button.is-disabled:hover {
  opacity: 0.5;
  cursor: not-allowed;
  color: var(--zc-button-disabled-text-color);
  background: var(--zc-button-disabled-bg-color);
  border-color: var(--zc-button-disabled-border-color);
}

/* ---- Shape ---- */
.zc-button.is-round {
  border-radius: var(--radius-zc-round, 20px);
}

/* ---- Plain variant ---- */
.zc-button.is-plain {
  background: transparent;
}
.zc-button.is-plain.zc-button--primary {
  --zc-button-text-color: var(--color-zc-primary-500, #409eff);
  --zc-button-bg-color: var(--color-zc-primary-50, #ecf5ff);
  --zc-button-border-color: var(--color-zc-primary-300, #a0cfff);
}
.zc-button.is-plain.zc-button--success {
  --zc-button-text-color: var(--color-zc-success-500, #67c23a);
  --zc-button-bg-color: var(--color-zc-success-50, #f0f9eb);
  --zc-button-border-color: var(--color-zc-success-300, #b3e19d);
}
.zc-button.is-plain.zc-button--warning {
  --zc-button-text-color: var(--color-zc-warning-500, #e6a23c);
  --zc-button-bg-color: var(--color-zc-warning-50, #fdf6ec);
  --zc-button-border-color: var(--color-zc-warning-300, #f3d19e);
}
.zc-button.is-plain.zc-button--danger {
  --zc-button-text-color: var(--color-zc-danger-500, #f56c6c);
  --zc-button-bg-color: var(--color-zc-danger-50, #fef0f0);
  --zc-button-border-color: var(--color-zc-danger-300, #fab6b6);
}
.zc-button.is-plain.zc-button--info {
  --zc-button-text-color: var(--color-zc-info-500, #909399);
  --zc-button-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-button-border-color: var(--color-zc-info-300, #c8c9cc);
}
</style>
