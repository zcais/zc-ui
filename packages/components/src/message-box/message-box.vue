<script setup lang="ts">
import { ref, computed, watch, nextTick, shallowRef } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useZIndex, useFocusTrap } from '@zc-ui/hooks'
import type { MessageBoxType } from './types'

defineOptions({ name: 'ZcMessageBox' })

const props = withDefaults(
  defineProps<{
    /** Box type: alert | confirm | prompt */
    type: MessageBoxType
    /** Title */
    title?: string
    /** Message content */
    message?: string
    /** Confirm button text */
    confirmText?: string
    /** Cancel button text */
    cancelText?: string
    /** Confirm button type */
    confirmButtonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
    /** Cancel button type */
    cancelButtonType?: 'default' | 'primary' | 'text'
    /** Input placeholder (prompt mode) */
    inputPlaceholder?: string
    /** Input initial value (prompt mode) */
    inputValue?: string
    /** Input type (prompt mode) */
    inputType?: string
    /** Input validator (prompt mode) */
    inputValidator?: (value: string) => boolean | string
    /** Show close button */
    showClose?: boolean
    /** Close on overlay click */
    closeOnClickOverlay?: boolean
    /** Center the box */
    center?: boolean
    /** Box width */
    width?: string | number
    /** Use danger style */
    dangerouslyUseHTMLString?: boolean
  }>(),
  {
    title: '',
    message: '',
    confirmText: '确定',
    cancelText: '取消',
    confirmButtonType: 'primary',
    cancelButtonType: 'default',
    inputPlaceholder: '请输入',
    inputValue: '',
    inputType: 'text',
    showClose: true,
    closeOnClickOverlay: false,
    center: false,
    width: '420px',
    dangerouslyUseHTMLString: false,
  }
)

const emit = defineEmits<{
  (e: 'confirm', value: string): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const ns = useNamespace('message-box')
const { nextZIndex } = useZIndex()
const focusTrap = useFocusTrap()

const isVisible = ref(false)
const zIndex = ref(2000)
const inputValue = ref(props.inputValue)
const inputError = ref('')
const isConfirming = ref(false)
const isCancelling = ref(false)

const inputRef = shallowRef<HTMLInputElement>()
const panelRef = shallowRef<HTMLElement>()

const showCancel = computed(() => props.type !== 'alert')
const showInput = computed(() => props.type === 'prompt')

const boxWidth = computed(() =>
  typeof props.width === 'number' ? `${props.width}px` : props.width
)

const confirmBtnClass = computed(() => ns.e(`btn-${props.confirmButtonType}`))

/** Icon by box type */
const iconName = computed(() => {
  switch (props.type) {
    case 'confirm':
      return 'confirm'
    case 'prompt':
      return 'edit'
    default:
      return 'info'
  }
})

function open() {
  isVisible.value = true
  zIndex.value = nextZIndex()
  nextTick(() => {
    if (showInput.value && inputRef.value) {
      inputRef.value.focus()
    } else if (panelRef.value) {
      focusTrap.activate(panelRef)
    }
  })
}

function handleConfirm() {
  if (isConfirming.value) return

  // Validate input for prompt mode
  if (showInput.value && props.inputValidator) {
    const result = props.inputValidator(inputValue.value)
    if (result === false) {
      inputError.value = '输入无效'
      return
    }
    if (typeof result === 'string') {
      inputError.value = result
      return
    }
  }
  inputError.value = ''

  isConfirming.value = true
  emit('confirm', inputValue.value)
}

function handleCancel() {
  if (isCancelling.value) return
  isCancelling.value = true
  emit('cancel')
}

function handleClose() {
  if (props.type === 'alert') {
    handleCancel()
  } else {
    handleCancel()
  }
}

function handleOverlayClick() {
  if (props.closeOnClickOverlay) handleClose()
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && isVisible.value) {
    e.preventDefault()
    handleConfirm()
  } else if (e.key === 'Escape' && isVisible.value) {
    e.preventDefault()
    handleCancel()
  }
}

watch(isVisible, (val) => {
  if (val) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

// Auto-open on mount
open()
</script>

<template>
  <Teleport to="body">
    <Transition name="zc-msgbox-overlay">
      <div
        v-if="isVisible"
        :class="ns.e('overlay')"
        :style="{ zIndex }"
        @click="handleOverlayClick"
      >
        <Transition name="zc-msgbox" appear>
          <div
            v-if="isVisible"
            ref="panelRef"
            :class="[ns.e('panel'), ns.is('center', center)]"
            :style="{ width: boxWidth }"
            role="alertdialog"
            aria-modal="true"
            @click.stop
          >
            <!-- Close button -->
            <button
              v-if="showClose"
              :class="ns.e('close')"
              type="button"
              aria-label="关闭"
              @click="handleClose"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <!-- Body -->
            <div :class="ns.e('content')">
              <!-- Icon -->
              <div v-if="iconName" :class="ns.e('icon')">
                <svg v-if="iconName === 'info'" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
                  <path
                    d="M12 8v4M12 16h.01"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
                <svg v-else-if="iconName === 'confirm'" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 9v4M12 17h.01"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 20h9M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4L16.5 3.5z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Text -->
              <div :class="ns.e('text')">
                <div v-if="title" :class="ns.e('title')">{{ title }}</div>
                <div v-if="dangerouslyUseHTMLString" :class="ns.e('message')" v-html="message" />
                <div v-else :class="ns.e('message')">{{ message }}</div>

                <!-- Input (prompt mode) -->
                <div v-if="showInput" :class="ns.e('input-wrap')">
                  <input
                    ref="inputRef"
                    v-model="inputValue"
                    :type="inputType"
                    :placeholder="inputPlaceholder"
                    :class="[ns.e('input'), { 'is-error': inputError }]"
                    @keydown.enter.prevent="handleConfirm"
                  />
                  <div v-if="inputError" :class="ns.e('input-error')">{{ inputError }}</div>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div :class="ns.e('footer')">
              <button
                v-if="showCancel"
                :class="[ns.e('btn'), ns.e('btn-default'), { 'is-loading': isCancelling }]"
                type="button"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                :class="[ns.e('btn'), confirmBtnClass, { 'is-loading': isConfirming }]"
                type="button"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
 * ZcMessageBox styles
 * ============================================================ */

.zc-message-box__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3000;
}

.zc-message-box__panel {
  position: relative;
  background: var(--color-zc-bg-base, #fff);
  border-radius: var(--radius-zc-lg, 8px);
  box-shadow: var(--shadow-zc-xl, 0 16px 48px rgba(0, 0, 0, 0.16));
  padding: 0;
  max-width: calc(100vw - 32px);
  animation: zc-msgbox-enter 0.25s ease;
}

/* Content */
.zc-message-box__content {
  display: flex;
  gap: 12px;
  padding: 24px 24px 16px;
}

.zc-message-box__icon {
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: var(--color-zc-warning, #e6a23c);
}

.zc-message-box__icon svg {
  width: 100%;
  height: 100%;
}

.zc-message-box__text {
  flex: 1;
  min-width: 0;
}

.zc-message-box__title {
  font-size: var(--text-zc-lg, 18px);
  font-weight: 600;
  color: var(--color-zc-text-primary, #303133);
  margin-bottom: 8px;
  line-height: 1.5;
}

.zc-message-box__message {
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-regular, #606266);
  line-height: 1.6;
  word-break: break-word;
}

/* Input */
.zc-message-box__input-wrap {
  margin-top: 12px;
}

.zc-message-box__input {
  width: 100%;
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--color-zc-border, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-base, 14px);
  color: var(--color-zc-text-primary, #303133);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.zc-message-box__input:focus {
  border-color: var(--color-zc-primary, #409eff);
}

.zc-message-box__input.is-error {
  border-color: var(--color-zc-danger, #f56c6c);
}

.zc-message-box__input-error {
  margin-top: 4px;
  font-size: var(--text-zc-xs, 12px);
  color: var(--color-zc-danger, #f56c6c);
}

/* Close button */
.zc-message-box__close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-zc-text-secondary, #909399);
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.zc-message-box__close svg {
  width: 16px;
  height: 16px;
}

.zc-message-box__close:hover {
  color: var(--color-zc-text-primary, #303133);
  background: var(--color-zc-fill-light, #f5f7fa);
}

/* Footer */
.zc-message-box__footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 0 24px 20px;
}

.zc-message-box.is-center .zc-message-box__footer {
  justify-content: center;
}

/* Buttons */
.zc-message-box__btn {
  min-width: 72px;
  height: 36px;
  padding: 0 20px;
  border: 1px solid var(--color-zc-border, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  font-size: var(--text-zc-base, 14px);
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  box-sizing: border-box;
}

.zc-message-box__btn-default {
  background: var(--color-zc-bg-base, #fff);
  color: var(--color-zc-text-regular, #606266);
}

.zc-message-box__btn-default:hover {
  border-color: var(--color-zc-primary-light-5, #a0cfff);
  color: var(--color-zc-primary, #409eff);
}

.zc-message-box__btn-primary {
  background: var(--color-zc-primary, #409eff);
  border-color: var(--color-zc-primary, #409eff);
  color: #fff;
}

.zc-message-box__btn-primary:hover {
  opacity: 0.9;
}

.zc-message-box__btn-success {
  background: var(--color-zc-success, #67c23a);
  border-color: var(--color-zc-success, #67c23a);
  color: #fff;
}

.zc-message-box__btn-success:hover {
  opacity: 0.9;
}

.zc-message-box__btn-warning {
  background: var(--color-zc-warning, #e6a23c);
  border-color: var(--color-zc-warning, #e6a23c);
  color: #fff;
}

.zc-message-box__btn-warning:hover {
  opacity: 0.9;
}

.zc-message-box__btn-danger {
  background: var(--color-zc-danger, #f56c6c);
  border-color: var(--color-zc-danger, #f56c6c);
  color: #fff;
}

.zc-message-box__btn-danger:hover {
  opacity: 0.9;
}

.zc-message-box__btn.is-loading {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
.zc-msgbox-overlay-enter-active,
.zc-msgbox-overlay-leave-active {
  transition: opacity 0.25s;
}
.zc-msgbox-overlay-enter-from,
.zc-msgbox-overlay-leave-to {
  opacity: 0;
}

.zc-msgbox-enter-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.zc-msgbox-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.zc-msgbox-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.zc-msgbox-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
