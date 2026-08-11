<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcEditable' })

export type EditableMode = 'text' | 'textarea'

const props = withDefaults(
  defineProps<{
    /** v-model value */
    modelValue?: string
    /** Default placeholder */
    placeholder?: string
    /** Edit mode */
    mode?: EditableMode
    /** Whether the editable is disabled */
    disabled?: boolean
    /** Whether to show edit/confirm icons */
    showAction?: boolean
    /** Max length for input */
    maxLength?: number
    /** Auto focus on edit */
    autofocus?: boolean
    /** Edit trigger: click or double-click */
    trigger?: 'click' | 'dblclick'
    /** Whether to confirm on blur */
    confirmOnBlur?: boolean
    /** Loading state */
    loading?: boolean
    /** Custom edit icon HTML */
    editIcon?: string
    /** Custom check icon HTML */
    checkIcon?: string
    /** Custom close icon HTML */
    closeIcon?: string
  }>(),
  {
    modelValue: '',
    placeholder: '请输入',
    mode: 'text',
    disabled: false,
    showAction: true,
    maxLength: 0,
    autofocus: true,
    trigger: 'click',
    confirmOnBlur: true,
    loading: false,
    editIcon: '',
    checkIcon: '',
    closeIcon: '',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string, oldValue: string): void
  (e: 'start'): void
  (e: 'end', value: string): void
  (e: 'cancel'): void
}>()

const ns = useNamespace('editable')

const isEditing = ref(false)
const editValue = ref(props.modelValue)
const inputRef = ref<HTMLInputElement | HTMLTextAreaElement | null>(null)

watch(
  () => props.modelValue,
  (val) => {
    if (!isEditing.value) {
      editValue.value = val
    }
  }
)

const displayText = computed(() => props.modelValue || props.placeholder || '')

const containerClasses = computed(() => [
  ns.b(),
  ns.is('editing', isEditing.value),
  ns.is('disabled', props.disabled),
  ns.is('empty', !props.modelValue),
])

const triggerEvent = computed(() => (props.trigger === 'dblclick' ? 'dblclick' : 'click'))

function startEdit() {
  if (props.disabled) return
  isEditing.value = true
  editValue.value = props.modelValue
  emit('start')
  if (props.autofocus) {
    nextTick(() => {
      focusInput()
    })
  }
}

function focusInput() {
  if (inputRef.value) {
    inputRef.value.focus()
    // Select all text
    if (inputRef.value instanceof HTMLInputElement) {
      inputRef.value.select()
    }
  }
}

function confirm() {
  const oldValue = props.modelValue
  const newValue = editValue.value
  isEditing.value = false
  if (newValue !== oldValue) {
    emit('update:modelValue', newValue)
    emit('change', newValue, oldValue)
  }
  emit('end', newValue)
}

function cancel() {
  isEditing.value = false
  editValue.value = props.modelValue
  emit('cancel')
}

function onBlur() {
  if (props.confirmOnBlur) {
    confirm()
  } else {
    cancel()
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && props.mode === 'text') {
    e.preventDefault()
    confirm()
  } else if (e.key === 'Escape') {
    e.preventDefault()
    cancel()
  }
}

const inputClasses = computed(() => [ns.e('input'), ns.m(props.mode)])

const showDisplay = computed(() => !isEditing.value)
const showInput = computed(() => isEditing.value)
</script>

<template>
  <span :class="containerClasses">
    <!-- Display mode -->
    <span v-if="showDisplay" :class="ns.e('display')" @[triggerEvent]="startEdit">
      <slot name="display" :value="displayText">
        {{ displayText }}
      </slot>
      <span v-if="showAction && !disabled" :class="ns.e('edit-icon')" @click.stop="startEdit">
        <slot name="edit-icon">
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </slot>
      </span>
    </span>

    <!-- Edit mode -->
    <span v-if="showInput" :class="ns.e('edit-wrapper')">
      <input
        v-if="mode === 'text'"
        ref="inputRef"
        v-model="editValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :maxlength="maxLength || undefined"
        :disabled="disabled"
        type="text"
        @blur="onBlur"
        @keydown="onKeyDown"
      />
      <textarea
        v-else
        ref="inputRef"
        v-model="editValue"
        :class="inputClasses"
        :placeholder="placeholder"
        :maxlength="maxLength || undefined"
        :disabled="disabled"
        rows="3"
        @blur="onBlur"
        @keydown="onKeyDown"
      />
      <span v-if="showAction" :class="ns.e('actions')">
        <button
          :class="[ns.e('action'), ns.em('action', 'confirm')]"
          type="button"
          :disabled="loading"
          @mousedown.prevent=""
          @click="confirm"
        >
          <slot name="check-icon">
            <svg
              v-if="!loading"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
            </svg>
          </slot>
        </button>
        <button
          :class="[ns.e('action'), ns.em('action', 'cancel')]"
          type="button"
          @mousedown.prevent=""
          @click="cancel"
        >
          <slot name="close-icon">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </slot>
        </button>
      </span>
    </span>
  </span>
</template>

<style scoped>
/* ============================================================
 * ZcEditable styles
 * BEM naming: zc-editable / zc-editable__display / zc-editable__input
 * ============================================================ */

.zc-editable {
  --zc-editable-text-color: var(--color-zc-text-primary, #303133);
  --zc-editable-placeholder-color: var(--color-zc-text-placeholder, #a8abb2);
  --zc-editable-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-editable-focus-color: var(--color-zc-primary, #409eff);
  --zc-editable-bg: var(--color-zc-bg-base, #fff);
  --zc-editable-confirm-color: var(--color-zc-primary, #409eff);
  --zc-editable-cancel-color: var(--color-zc-text-secondary, #606266);
  display: inline-flex;
  align-items: center;
  color: var(--zc-editable-text-color);
}

/* ---- Display mode ---- */
.zc-editable__display {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px dashed transparent;
  transition: border-color 0.2s;
  padding: 2px 0;
}

.zc-editable__display:hover {
  border-bottom-color: var(--zc-editable-border-color);
}

/* ---- Empty state ---- */
.zc-editable.is-empty .zc-editable__display {
  color: var(--zc-editable-placeholder-color);
}

/* ---- Edit icon ---- */
.zc-editable__edit-icon {
  display: inline-flex;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: var(--zc-editable-text-color);
}

.zc-editable__display:hover .zc-editable__edit-icon {
  opacity: 0.6;
}

/* ---- Edit wrapper ---- */
.zc-editable__edit-wrapper {
  display: inline-flex;
  align-items: flex-start;
  gap: 4px;
}

/* ---- Input ---- */
.zc-editable__input {
  border: 1px solid var(--zc-editable-focus-color);
  border-radius: 4px;
  padding: 2px 8px;
  font-size: inherit;
  color: var(--zc-editable-text-color);
  background-color: var(--zc-editable-bg);
  outline: none;
  width: 200px;
  box-sizing: border-box;
}

.zc-editable__input:focus {
  box-shadow: 0 0 0 2px var(--color-zc-primary-light-8, rgba(64, 158, 255, 0.12));
}

.zc-editable__input--textarea {
  width: 300px;
  resize: vertical;
  font-family: inherit;
}

/* ---- Actions ---- */
.zc-editable__actions {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding-top: 2px;
}

.zc-editable__action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.zc-editable__action:hover {
  background-color: var(--color-zc-fill-light, #f5f7fa);
}

.zc-editable__action--confirm {
  color: var(--zc-editable-confirm-color);
}

.zc-editable__action--cancel {
  color: var(--zc-editable-cancel-color);
}

/* ---- Disabled ---- */
.zc-editable.is-disabled .zc-editable__display {
  cursor: default;
  opacity: 0.5;
}

.zc-editable.is-disabled .zc-editable__display:hover {
  border-bottom-color: transparent;
}

.zc-editable.is-disabled .zc-editable__edit-icon {
  display: none;
}

/* ---- Dark mode ---- */
.dark .zc-editable {
  --zc-editable-text-color: var(--color-zc-text-primary, #e5eaf3);
  --zc-editable-border-color: var(--color-zc-border-base, #414243);
  --zc-editable-bg: var(--color-zc-bg-base, #1a1a1a);
}

.dark .zc-editable__action:hover {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>
