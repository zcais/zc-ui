<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcMessage' })

export type MessageType = 'info' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    message: string
    type?: MessageType
    duration?: number
    showClose?: boolean
    center?: boolean
    offset?: number
  }>(),
  {
    type: 'info',
    duration: 3000,
    showClose: false,
    center: false,
    offset: 20,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const ns = useNamespace('message')
const isVisible = ref(true)
let timer: ReturnType<typeof setTimeout> | null = null

const iconPaths: Record<MessageType, string> = {
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0 9a1 1 0 100 2 1 1 0 000-2z',
  success:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.414L6.586 12 8 10.586l3 3 5-5L17.414 10 11 16.414z',
  warning: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
  error: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
}

const iconPath = computed(() => iconPaths[props.type])

function startTimer() {
  if (props.duration > 0) {
    timer = setTimeout(() => close(), props.duration)
  }
}

function clearTimer() {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function close() {
  isVisible.value = false
  emit('close')
}

onMounted(() => {
  isVisible.value = true
  startTimer()
})

onBeforeUnmount(() => {
  clearTimer()
})

defineExpose({ close })
</script>

<template>
  <Transition name="zc-message">
    <div
      v-if="isVisible"
      :class="[ns.b(), ns.m(type), ns.is('center', center)]"
      :style="{ top: `${offset}px` }"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <svg v-if="iconPath" :class="ns.e('icon')" viewBox="0 0 24 24" fill="currentColor">
        <path :d="iconPath" />
      </svg>
      <span :class="ns.e('content')">{{ message }}</span>
      <button
        v-if="showClose"
        :class="ns.e('close')"
        type="button"
        aria-label="关闭消息"
        @click="close"
      >
        <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
          <path
            d="M6 6l12 12M6 18L18 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
/* ============================================================
 * ZcMessage styles
 * ============================================================ */

.zc-message {
  /* Component-level CSS variables */
  --zc-message-bg-color: var(--color-zc-bg-base, #fff);
  --zc-message-text-color: var(--color-zc-text-regular, #606266);
  --zc-message-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-message-border-radius: var(--radius-zc-base, 4px);
  --zc-message-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-message-font-size: var(--text-zc-base, 14px);
  --zc-message-padding: 12px 16px;
  --zc-message-icon-size: 16px;

  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: var(--zc-message-padding);
  background: var(--zc-message-bg-color);
  border: 1px solid var(--zc-message-border-color);
  border-radius: var(--zc-message-border-radius);
  box-shadow: var(--zc-message-box-shadow);
  font-size: var(--zc-message-font-size);
  color: var(--zc-message-text-color);
  z-index: var(--z-zc-message, 1600);
  transition: top var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-message.is-center {
  text-align: center;
}

.zc-message__icon {
  width: var(--zc-message-icon-size);
  height: var(--zc-message-icon-size);
  flex-shrink: 0;
}

.zc-message__content {
  line-height: 1.5;
}

.zc-message__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  padding: 0;
  margin-left: 4px;
  transition: color var(--transition-duration-zc-base, 0.25s);
}

.zc-message__close:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* Type modifiers */
.zc-message--info .zc-message__icon {
  color: var(--color-zc-primary-500, #409eff);
}
.zc-message--success .zc-message__icon {
  color: var(--color-zc-success-500, #67c23a);
}
.zc-message--warning .zc-message__icon {
  color: var(--color-zc-warning-500, #e6a23c);
}
.zc-message--error .zc-message__icon {
  color: var(--color-zc-danger-500, #f56c6c);
}

/* Transitions */
.zc-message-enter-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}
.zc-message-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}
.zc-message-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
.zc-message-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
