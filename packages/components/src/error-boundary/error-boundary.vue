<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcErrorBoundary' })

const props = withDefaults(
  defineProps<{
    /** Whether to catch errors (false = let errors propagate) */
    catchErrors?: boolean
    /** Whether to show error details in development */
    showDetails?: boolean
    /** Custom error title */
    errorTitle?: string
    /** Error description text */
    errorDescription?: string
  }>(),
  {
    catchErrors: true,
    showDetails: import.meta.env?.DEV ?? true,
    errorTitle: 'Something went wrong',
    errorDescription: '',
  }
)

const emit = defineEmits<{
  (e: 'error', error: Error, info: string): void
  (e: 'reset'): void
}>()

const ns = useNamespace('error-boundary')
const { t } = useLocale()

const hasError = ref(false)
const errorObj = ref<Error | null>(null)
const errorInfo = ref('')
const showStack = ref(false)

onErrorCaptured((err, _instance, info) => {
  if (!props.catchErrors) {
    // Do not capture — let the error propagate to parent error handlers
    return true
  }

  hasError.value = true
  errorObj.value = err as Error
  errorInfo.value = info

  emit('error', err as Error, info)

  // return false to prevent the error from propagating further up
  return false
})

function reset() {
  hasError.value = false
  errorObj.value = null
  errorInfo.value = ''
  showStack.value = false
  emit('reset')
}

function toggleStack() {
  showStack.value = !showStack.value
}

defineExpose({ reset })
</script>

<template>
  <template v-if="!hasError">
    <slot />
  </template>

  <div v-else :class="ns.b()" role="alert" aria-live="polite">
    <!-- Custom error slot -->
    <slot name="error" :error="errorObj!" :reset="reset">
      <div :class="ns.e('content')">
        <!-- Icon -->
        <div :class="ns.e('icon')" aria-hidden="true">
          <svg viewBox="0 0 64 64" width="56" height="56" fill="none">
            <circle cx="32" cy="32" r="28" stroke="currentColor" stroke-width="3" opacity="0.15" />
            <path d="M32 18v16" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            <circle cx="32" cy="44" r="3" fill="currentColor" />
          </svg>
        </div>

        <!-- Title -->
        <div :class="ns.e('title')">{{ errorTitle }}</div>

        <!-- Description -->
        <div v-if="errorDescription" :class="ns.e('description')">
          {{ errorDescription }}
        </div>

        <!-- Action -->
        <div :class="ns.e('action')">
          <button type="button" :class="ns.e('retry-btn')" @click="reset">
            {{ t('zc.errorBoundary.retry') }}
          </button>
        </div>

        <!-- Details (collapsible) -->
        <div v-if="showDetails && errorObj" :class="ns.e('details')">
          <button type="button" :class="ns.e('details-toggle')" @click="toggleStack">
            {{ showStack ? '▾' : '▸' }} {{ t('zc.errorBoundary.details') }}
          </button>
          <pre
            v-if="showStack"
            :class="ns.e('stack')"
          ><code>{{ errorObj.stack || errorObj.message }}<template v-if="errorInfo">

[Info: {{ errorInfo }}]</template></code></pre>
        </div>
      </div>
    </slot>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcErrorBoundary styles
 * ============================================================ */

.zc-error-boundary {
  --zc-error-boundary-color: var(--color-zc-text-primary, #303133);
  --zc-error-boundary-title-color: var(--color-zc-text-primary, #303133);
  --zc-error-boundary-description-color: var(--color-zc-text-secondary, #909399);
  --zc-error-boundary-icon-color: var(--color-zc-danger, #f56c6c);
  --zc-error-boundary-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-error-boundary-bg: var(--color-zc-fill-light, #f5f7fa);
  --zc-error-boundary-font-size: var(--text-zc-base, 14px);
  --zc-error-boundary-title-font-size: var(--text-zc-lg, 16px);
  --zc-error-boundary-description-font-size: var(--text-zc-sm, 13px);
  --zc-error-boundary-padding: 32px;
  --zc-error-boundary-radius: var(--radius-zc-base, 8px);

  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: var(--zc-error-boundary-padding);
  font-size: var(--zc-error-boundary-font-size);
  color: var(--zc-error-boundary-color);
  background-color: var(--zc-error-boundary-bg);
  border-radius: var(--zc-error-boundary-radius);
  box-sizing: border-box;
}

.zc-error-boundary__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 480px;
  text-align: center;
}

.zc-error-boundary__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-zc-base, 12px);
  color: var(--zc-error-boundary-icon-color);
}

.zc-error-boundary__title {
  margin-bottom: var(--spacing-zc-xs, 4px);
  font-size: var(--zc-error-boundary-title-font-size);
  font-weight: 600;
  color: var(--zc-error-boundary-title-color);
  line-height: 1.4;
}

.zc-error-boundary__description {
  margin-bottom: var(--spacing-zc-lg, 16px);
  font-size: var(--zc-error-boundary-description-font-size);
  color: var(--zc-error-boundary-description-color);
  line-height: 1.5;
}

.zc-error-boundary__action {
  display: flex;
  gap: var(--spacing-zc-sm, 8px);
}

.zc-error-boundary__retry-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  font-size: var(--text-zc-sm, 13px);
  font-weight: 500;
  line-height: 1;
  color: #fff;
  white-space: nowrap;
  cursor: pointer;
  background-color: var(--color-zc-primary, #409eff);
  border: 1px solid var(--color-zc-primary, #409eff);
  border-radius: var(--radius-zc-base, 6px);
  outline: none;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.zc-error-boundary__retry-btn:hover {
  background-color: var(--color-zc-primary-light-3, #79bbff);
  border-color: var(--color-zc-primary-light-3, #79bbff);
}

.zc-error-boundary__retry-btn:active {
  background-color: var(--color-zc-primary-dark-2, #337ecc);
  border-color: var(--color-zc-primary-dark-2, #337ecc);
}

.zc-error-boundary__details {
  width: 100%;
  margin-top: var(--spacing-zc-lg, 16px);
  text-align: left;
}

.zc-error-boundary__details-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  font-size: var(--text-zc-xs, 12px);
  font-weight: 500;
  color: var(--zc-error-boundary-description-color);
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
  transition: color 0.2s ease;
  -webkit-appearance: none;
  appearance: none;
}

.zc-error-boundary__details-toggle:hover {
  color: var(--zc-error-boundary-title-color);
}

.zc-error-boundary__stack {
  margin-top: var(--spacing-zc-sm, 8px);
  padding: var(--spacing-zc-sm, 8px) var(--spacing-zc-base, 12px);
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: var(--text-zc-xs, 12px);
  line-height: 1.6;
  color: var(--zc-error-boundary-description-color);
  white-space: pre-wrap;
  word-break: break-word;
  background-color: var(--color-zc-fill-darker, #f0f0f0);
  border: 1px solid var(--zc-error-boundary-border-color);
  border-radius: var(--radius-zc-sm, 4px);
}

/* ============================================================
 * Dark mode
 * ============================================================ */

:where(.dark, [data-theme='dark']) .zc-error-boundary {
  --zc-error-boundary-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-error-boundary-title-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-error-boundary-description-color: var(--color-zc-text-secondary, #a3a6ad);
  --zc-error-boundary-icon-color: var(--color-zc-danger, #f89898);
  --zc-error-boundary-border-color: var(--color-zc-border-light, #414243);
  --zc-error-boundary-bg: var(--color-zc-fill-light, #262727);
  --zc-error-boundary-title-font-size: var(--text-zc-lg, 16px);
}

:where(.dark, [data-theme='dark']) .zc-error-boundary__stack {
  background-color: var(--color-zc-fill-darker, #1d1e1f);
}
</style>
