<script setup lang="ts">
import { ref, computed, watch, onBeforeUnmount, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcActionSheet' })

export interface ActionSheetItem {
  /** Item key/identifier */
  key?: string | number
  /** Display label */
  label: string
  /** Optional description/subtitle */
  description?: string
  /** Item color (for destructive actions, use 'danger') */
  color?: 'default' | 'danger' | 'primary'
  /** Whether this item is disabled */
  disabled?: boolean
  /** Optional icon name */
  icon?: string
}

const props = withDefaults(
  defineProps<{
    /** Whether the action sheet is visible */
    visible?: boolean
    /** List of actions */
    actions?: ActionSheetItem[]
    /** Cancel button text (empty string to hide) */
    cancelText?: string
    /** Title for the sheet */
    title?: string
    /** Description below title */
    description?: string
    /** Whether clicking the mask closes the sheet */
    closeOnClickMask?: boolean
    /** Whether clicking an action closes the sheet */
    closeOnClickAction?: boolean
    /** Whether to show a round corner style */
    round?: boolean
    /** Z-index of the overlay */
    zIndex?: number
    /** Whether to lock body scroll when open */
    lockScroll?: boolean
  }>(),
  {
    visible: false,
    actions: () => [],
    cancelText: 'Cancel',
    title: '',
    description: '',
    closeOnClickMask: true,
    closeOnClickAction: true,
    round: true,
    zIndex: 2000,
    lockScroll: true,
  }
)

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void
  (e: 'select', item: ActionSheetItem, index: number): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const ns = useNamespace('action-sheet')
const slots = useSlots()

const isOpen = ref(false)
let savedOverflow = ''

// Sync internal state with v-model:visible
watch(
  () => props.visible,
  (val) => {
    if (val) {
      openSheet()
    } else {
      closeSheet()
    }
  },
  { immediate: true }
)

function openSheet() {
  if (isOpen.value) return
  isOpen.value = true
  if (props.lockScroll && typeof document !== 'undefined') {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
}

function closeSheet() {
  if (!isOpen.value) return
  isOpen.value = false
  emit('close')
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = savedOverflow
  }
}

function updateVisible(val: boolean) {
  emit('update:visible', val)
}

function handleMaskClick() {
  if (!props.closeOnClickMask) return
  updateVisible(false)
}

function handleActionClick(item: ActionSheetItem, index: number) {
  if (item.disabled) return
  emit('select', item, index)
  if (props.closeOnClickAction) {
    updateVisible(false)
  }
}

function handleCancel() {
  emit('cancel')
  updateVisible(false)
}

const showHeader = computed(() => {
  return !!(props.title || props.description || slots.header)
})

const showCancel = computed(() => {
  return props.cancelText !== '' && props.cancelText != null
})

onBeforeUnmount(() => {
  if (props.lockScroll && typeof document !== 'undefined') {
    document.body.style.overflow = savedOverflow
  }
})
</script>

<template>
  <Teleport to="body" :disabled="!isOpen">
    <Transition name="zc-action-sheet-mask">
      <div v-if="isOpen" :class="ns.e('mask')" :style="{ zIndex }" @click="handleMaskClick">
        <Transition name="zc-action-sheet-slide" appear @click.stop>
          <div
            v-if="isOpen"
            :class="[ns.e('container'), ns.is('round', round)]"
            role="dialog"
            aria-modal="true"
            :aria-label="title || 'Action Sheet'"
            @click.stop
          >
            <!-- Header -->
            <div v-if="showHeader" :class="ns.e('header')">
              <slot name="header">
                <div v-if="title" :class="ns.e('title')">{{ title }}</div>
                <div v-if="description" :class="ns.e('description')">
                  {{ description }}
                </div>
              </slot>
            </div>

            <!-- Content (default slot or actions list) -->
            <div :class="ns.e('content')">
              <slot>
                <button
                  v-for="(item, index) in actions"
                  :key="item.key ?? index"
                  :class="[
                    ns.e('item'),
                    ns.is('disabled', !!item.disabled),
                    ns.is('danger', item.color === 'danger'),
                    ns.is('primary', item.color === 'primary'),
                  ]"
                  :disabled="!!item.disabled"
                  type="button"
                  @click="handleActionClick(item, index)"
                >
                  <span v-if="item.icon" :class="ns.e('item-icon')">{{ item.icon }}</span>
                  <span :class="ns.e('item-body')">
                    <span :class="ns.e('item-label')">{{ item.label }}</span>
                    <span v-if="item.description" :class="ns.e('item-description')">{{
                      item.description
                    }}</span>
                  </span>
                </button>
              </slot>
            </div>

            <!-- Footer (cancel button or custom slot) -->
            <div v-if="showCancel || $slots.footer" :class="ns.e('footer')">
              <slot name="footer">
                <button
                  v-if="showCancel"
                  :class="ns.e('cancel')"
                  type="button"
                  @click="handleCancel"
                >
                  {{ cancelText }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ============================================================
 * ZcActionSheet styles
 * BEM naming: zc-action-sheet / zc-action-sheet__mask / ...
 * ============================================================ */

/* ---- Mask overlay ---- */
.zc-action-sheet__mask {
  --zc-action-sheet-bg-color: var(--color-zc-bg-base, #fff);
  --zc-action-sheet-mask-bg: rgba(0, 0, 0, 0.45);
  --zc-action-sheet-radius: var(--radius-zc-lg, 12px);
  --zc-action-sheet-item-min-h: 48px;
  --zc-action-sheet-title-color: var(--color-zc-text-primary, #303133);
  --zc-action-sheet-desc-color: var(--color-zc-text-secondary, #909399);
  --zc-action-sheet-label-color: var(--color-zc-text-primary, #303133);
  --zc-action-sheet-cancel-color: var(--color-zc-text-primary, #303133);
  --zc-action-sheet-danger-color: var(--color-zc-danger, #f56c6c);
  --zc-action-sheet-primary-color: var(--color-zc-primary, #409eff);
  --zc-action-sheet-disabled-color: var(--color-zc-text-placeholder, #c0c4cc);
  --zc-action-sheet-divider: var(--color-zc-border-light, #ebeef5);
  --zc-action-sheet-item-hover-bg: var(--color-zc-fill-light, #f5f7fa);
  --zc-action-sheet-item-active-bg: var(--color-zc-fill, #f0f2f5);

  position: fixed;
  inset: 0;
  background: var(--zc-action-sheet-mask-bg);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
}

/* ---- Container (bottom sheet) ---- */
.zc-action-sheet__container {
  background: var(--zc-action-sheet-bg-color);
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.zc-action-sheet__container.is-round {
  border-top-left-radius: var(--zc-action-sheet-radius);
  border-top-right-radius: var(--zc-action-sheet-radius);
}

/* ---- Header ---- */
.zc-action-sheet__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 16px 8px;
  text-align: center;
  flex-shrink: 0;
}

.zc-action-sheet__title {
  font-size: var(--text-zc-base, 14px);
  font-weight: 500;
  color: var(--zc-action-sheet-title-color);
  line-height: 1.5;
}

.zc-action-sheet__description {
  margin-top: 4px;
  font-size: var(--text-zc-sm, 12px);
  color: var(--zc-action-sheet-desc-color);
  line-height: 1.5;
}

/* ---- Content area ---- */
.zc-action-sheet__content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: column;
}

/* ---- Action items ---- */
.zc-action-sheet__item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  min-height: var(--zc-action-sheet-item-min-h);
  padding: 14px 16px;
  border: none;
  background: transparent;
  font-size: var(--text-zc-lg, 16px);
  color: var(--zc-action-sheet-label-color);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease;
  flex-shrink: 0;
}

.zc-action-sheet__item + .zc-action-sheet__item {
  border-top: 1px solid var(--zc-action-sheet-divider);
}

.zc-action-sheet__item:hover:not(.is-disabled) {
  background: var(--zc-action-sheet-item-hover-bg);
}

.zc-action-sheet__item:active:not(.is-disabled) {
  background: var(--zc-action-sheet-item-active-bg);
}

.zc-action-sheet__item.is-disabled {
  color: var(--zc-action-sheet-disabled-color);
  cursor: not-allowed;
}

.zc-action-sheet__item.is-danger {
  color: var(--zc-action-sheet-danger-color);
}

.zc-action-sheet__item.is-primary {
  color: var(--zc-action-sheet-primary-color);
}

/* Item internal layout */
.zc-action-sheet__item-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.zc-action-sheet__item-label {
  font-size: var(--text-zc-lg, 16px);
  line-height: 1.4;
}

.zc-action-sheet__item-description {
  font-size: var(--text-zc-sm, 12px);
  color: var(--zc-action-sheet-desc-color);
  line-height: 1.4;
}

.zc-action-sheet__item.is-danger .zc-action-sheet__item-description {
  opacity: 0.7;
}

/* ---- Footer & Cancel button ---- */
.zc-action-sheet__footer {
  flex-shrink: 0;
  margin-top: 8px;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.zc-action-sheet__cancel {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--zc-action-sheet-item-min-h);
  padding: 14px 16px;
  border: none;
  background: var(--zc-action-sheet-bg-color);
  font-size: var(--text-zc-lg, 16px);
  font-weight: 500;
  color: var(--zc-action-sheet-cancel-color);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 0.15s ease;
  border-top: 8px solid var(--color-zc-fill-light, #f5f7fa);
}

.zc-action-sheet__cancel:hover {
  background: var(--zc-action-sheet-item-hover-bg);
}

.zc-action-sheet__cancel:active {
  background: var(--zc-action-sheet-item-active-bg);
}

/* ---- Mask transition ---- */
.zc-action-sheet-mask-enter-active,
.zc-action-sheet-mask-leave-active {
  transition: opacity 0.3s ease;
}

.zc-action-sheet-mask-enter-from,
.zc-action-sheet-mask-leave-to {
  opacity: 0;
}

/* ---- Slide-up transition ---- */
.zc-action-sheet-slide-enter-active {
  transition: transform 0.3s var(--ease-zc-out, cubic-bezier(0.16, 1, 0.3, 1));
}

.zc-action-sheet-slide-leave-active {
  transition: transform 0.25s var(--ease-zc-in-out, ease);
}

.zc-action-sheet-slide-enter-from {
  transform: translateY(100%);
}

.zc-action-sheet-slide-leave-to {
  transform: translateY(100%);
}

/* ---- Dark mode ---- */
.dark .zc-action-sheet__mask {
  --zc-action-sheet-bg-color: var(--color-zc-bg-base, #1d1e1f);
  --zc-action-sheet-mask-bg: rgba(0, 0, 0, 0.6);
  --zc-action-sheet-divider: var(--color-zc-border-light, #414243);
  --zc-action-sheet-item-hover-bg: rgba(255, 255, 255, 0.06);
  --zc-action-sheet-item-active-bg: rgba(255, 255, 255, 0.1);
  --zc-action-sheet-title-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-action-sheet-label-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-action-sheet-cancel-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-action-sheet-desc-color: var(--color-zc-text-secondary, #a3a6ad);
  --zc-action-sheet-disabled-color: var(--color-zc-text-placeholder, #4c4d4f);
}

.dark .zc-action-sheet__cancel {
  border-top-color: rgba(255, 255, 255, 0.08);
}
</style>
