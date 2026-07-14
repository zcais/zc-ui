<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcNotification' })

export type NotificationType = 'info' | 'success' | 'warning' | 'error'
export type NotificationPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    type?: NotificationType
    duration?: number
    showClose?: boolean
    position?: NotificationPosition
    offset?: number
  }>(),
  {
    title: '',
    message: '',
    type: 'info',
    duration: 4500,
    showClose: true,
    position: 'top-right',
    offset: 16,
  }
)

const emit = defineEmits<{
  (e: 'close'): void
}>()

const ns = useNamespace('notification')
const isVisible = ref(true)
let timer: ReturnType<typeof setTimeout> | null = null

const iconPaths: Record<NotificationType, string> = {
  info: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 6a1 1 0 011 1v5a1 1 0 11-2 0V9a1 1 0 011-1zm0 9a1 1 0 100 2 1 1 0 000-2z',
  success:
    'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.414L6.586 12 8 10.586l3 3 5-5L17.414 10 11 16.414z',
  warning: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
  error: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z',
}

const iconPath = computed(() => iconPaths[props.type])

const isTop = computed(() => props.position.startsWith('top'))
const isRight = computed(() => props.position.endsWith('right'))

const transitionName = computed(() => `zc-notification-${props.position}`)

const containerStyle = computed(() => {
  const style: Record<string, string> = {}
  if (isTop.value) {
    style.top = `${props.offset}px`
  } else {
    style.bottom = `${props.offset}px`
  }
  style[isRight.value ? 'right' : 'left'] = '16px'
  return style
})

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
  <Transition :name="transitionName">
    <div
      v-if="isVisible"
      :class="[ns.b(), ns.m(type), ns.e(position)]"
      :style="containerStyle"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <svg v-if="iconPath" :class="ns.e('icon')" viewBox="0 0 24 24" fill="currentColor">
        <path :d="iconPath" />
      </svg>
      <div :class="ns.e('group')">
        <div v-if="title" :class="ns.e('title')">{{ title }}</div>
        <div v-if="message" :class="ns.e('content')">{{ message }}</div>
      </div>
      <button
        v-if="showClose"
        :class="ns.e('close')"
        type="button"
        aria-label="关闭通知"
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
 * ZcNotification styles
 * ============================================================ */

.zc-notification {
  /* Component-level CSS variables */
  --zc-notification-bg-color: var(--color-zc-bg-base, #fff);
  --zc-notification-title-color: var(--color-zc-text-primary, #303133);
  --zc-notification-title-font-size: var(--text-zc-md, 16px);
  --zc-notification-content-color: var(--color-zc-text-regular, #606266);
  --zc-notification-content-font-size: var(--text-zc-base, 14px);
  --zc-notification-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-notification-border-radius: var(--radius-zc-base, 4px);
  --zc-notification-box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  --zc-notification-padding: 16px;
  --zc-notification-close-color: var(--color-zc-text-placeholder, #a8abb2);

  position: fixed;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  width: 330px;
  padding: var(--zc-notification-padding);
  background: var(--zc-notification-bg-color);
  border: 1px solid var(--zc-notification-border-color);
  border-radius: var(--zc-notification-border-radius);
  box-shadow: var(--zc-notification-box-shadow);
  font-size: var(--zc-notification-content-font-size);
  z-index: var(--z-zc-message, 1600);
}

.zc-notification__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.zc-notification__group {
  flex: 1;
  min-width: 0;
}

.zc-notification__title {
  font-weight: 600;
  font-size: var(--zc-notification-title-font-size);
  color: var(--zc-notification-title-color);
  line-height: 1.5;
  margin-bottom: 4px;
}

.zc-notification__content {
  color: var(--zc-notification-content-color);
  font-size: var(--zc-notification-content-font-size);
  line-height: 1.6;
}

.zc-notification__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--zc-notification-close-color);
  padding: 0;
  flex-shrink: 0;
  transition: color var(--transition-duration-zc-base, 0.25s);
}

.zc-notification__close:hover {
  color: var(--color-zc-text-primary, #303133);
}

/* Type icons */
.zc-notification--info .zc-notification__icon {
  color: var(--color-zc-primary-500, #409eff);
}
.zc-notification--success .zc-notification__icon {
  color: var(--color-zc-success-500, #67c23a);
}
.zc-notification--warning .zc-notification__icon {
  color: var(--color-zc-warning-500, #e6a23c);
}
.zc-notification--error .zc-notification__icon {
  color: var(--color-zc-danger-500, #f56c6c);
}

/* Transitions */
.zc-notification-top-right-enter-active,
.zc-notification-top-right-leave-active,
.zc-notification-top-left-enter-active,
.zc-notification-top-left-leave-active,
.zc-notification-bottom-right-enter-active,
.zc-notification-bottom-right-leave-active,
.zc-notification-bottom-left-enter-active,
.zc-notification-bottom-left-leave-active {
  transition:
    opacity var(--transition-duration-zc-base, 0.25s),
    transform var(--transition-duration-zc-base, 0.25s);
}

/* top-left: slide from left */
.zc-notification-top-left-enter-from,
.zc-notification-top-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* top-right: slide from right */
.zc-notification-top-right-enter-from,
.zc-notification-top-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* bottom-left: slide from bottom */
.zc-notification-bottom-left-enter-from,
.zc-notification-bottom-left-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* bottom-right: slide from bottom */
.zc-notification-bottom-right-enter-from,
.zc-notification-bottom-right-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
