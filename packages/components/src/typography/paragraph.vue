<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useNamespace, useClipboard } from '@zc-ui/hooks'

defineOptions({ name: 'ZcParagraph' })

export type ParagraphEllipsisConfig = {
  /** Number of lines to show before truncating */
  rows?: number
  /** Whether to show expand/collapse action */
  expandable?: boolean
  /** Text for expand action */
  expandText?: string
  /** Text for collapse action */
  collapseText?: string
  /** Tooltip suffix when collapsed */
  suffix?: string
}

const props = withDefaults(
  defineProps<{
    /** Enable ellipsis with rows config */
    ellipsis?: boolean | ParagraphEllipsisConfig
    /** Show copy button */
    copyable?: boolean
    /** Custom text to copy (defaults to textContent) */
    copyText?: string
    /** Enable inline editing */
    editable?: boolean
    /** Custom tooltip for copy button */
    copyTooltip?: string
  }>(),
  {
    ellipsis: false,
    copyable: false,
    copyText: undefined,
    editable: false,
    copyTooltip: undefined,
  },
)

const emit = defineEmits<{
  (e: 'copy', text: string): void
  (e: 'edit-start'): void
  (e: 'edit-end', value: string, cancelled: boolean): void
}>()

const ns = useNamespace('paragraph')
const { copy, copied } = useClipboard()

// ---- Ellipsis logic ----
const ellipsisConfig = computed<ParagraphEllipsisConfig>(() => {
  if (!props.ellipsis) return { rows: 0, expandable: false }
  if (props.ellipsis === true) return { rows: 1, expandable: false }
  return {
    rows: props.ellipsis.rows ?? 3,
    expandable: props.ellipsis.expandable ?? false,
    expandText: props.ellipsis.expandText ?? '展开',
    collapseText: props.ellipsis.collapseText ?? '收起',
    suffix: props.ellipsis.suffix ?? '...',
  }
})

const isEllipsis = computed(() => !!props.ellipsis)
const isExpanded = ref(false)
const shouldClamp = computed(
  () => isEllipsis.value && !isExpanded.value && ellipsisConfig.value.rows > 0,
)

function handleExpand() {
  isExpanded.value = !isExpanded.value
}

// ---- Copy logic ----
const paragraphRef = ref<HTMLElement>()

async function handleCopy() {
  const text = props.copyText ?? paragraphRef.value?.textContent ?? ''
  const ok = await copy(text)
  if (ok) {
    emit('copy', text)
  }
}

// ---- Edit logic ----
const isEditing = ref(false)
const editValue = ref('')
const originalValue = ref('')
const editRef = ref<HTMLTextAreaElement | HTMLInputElement>()

function startEdit() {
  originalValue.value = paragraphRef.value?.textContent ?? ''
  editValue.value = originalValue.value
  isEditing.value = true
  emit('edit-start')
  nextTick(() => {
    editRef.value?.focus()
    editRef.value?.select?.()
  })
}

function confirmEdit() {
  isEditing.value = false
  emit('edit-end', editValue.value, false)
}

function cancelEdit() {
  isEditing.value = false
  // Restore the original value so the emitted value is meaningful
  emit('edit-end', originalValue.value, true)
}

// Reset expansion when ellipsis config changes
watch(
  () => props.ellipsis,
  () => {
    isExpanded.value = false
  },
)

const classes = computed(() => [
  ns.b(),
  ns.is('ellipsis', shouldClamp.value),
  ns.is('editing', isEditing.value),
])

const contentStyle = computed(() => {
  if (!shouldClamp.value) return {}
  return {
    '-webkit-line-clamp': String(ellipsisConfig.value.rows),
    '-webkit-box-orient': 'vertical' as const,
    display: '-webkit-box',
    overflow: 'hidden',
  }
})
</script>

<template>
  <div :class="classes">
    <!-- Display mode -->
    <template v-if="!isEditing">
      <p ref="paragraphRef" :class="ns.e('content')" :style="contentStyle">
        <slot>{{ editValue }}</slot>
      </p>
      <!-- Suffix (ellipsis + expandable) -->
      <span v-if="shouldClamp && ellipsisConfig.expandable" :class="ns.e('actions')">
        <span :class="ns.e('suffix')">{{ ellipsisConfig.suffix }}</span>
        <button :class="ns.e('expand')" type="button" @click="handleExpand">
          {{ ellipsisConfig.expandText }}
        </button>
      </span>
      <span v-else-if="isExpanded && ellipsisConfig.expandable" :class="ns.e('actions')">
        <button :class="ns.e('expand')" type="button" @click="handleExpand">
          {{ ellipsisConfig.collapseText }}
        </button>
      </span>
      <!-- Copy -->
      <button
        v-if="copyable"
        :class="[ns.e('copy'), ns.is('copied', copied)]"
        type="button"
        :title="copyTooltip ?? (copied ? '已复制' : '复制')"
        @click="handleCopy"
      >
        <svg v-if="!copied" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </button>
      <!-- Edit trigger -->
      <button
        v-if="editable"
        :class="ns.e('edit')"
        type="button"
        title="编辑"
        @click="startEdit"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </template>

    <!-- Edit mode -->
    <template v-else>
      <textarea
        ref="editRef"
        v-model="editValue"
        :class="ns.e('editor')"
        rows="3"
        @keydown.enter.prevent="confirmEdit"
        @keydown.esc.prevent="cancelEdit"
      />
      <div :class="ns.e('edit-actions')">
        <button :class="[ns.e('edit-confirm')]" type="button" @click="confirmEdit">确定</button>
        <button :class="ns.e('edit-cancel')" type="button" @click="cancelEdit">取消</button>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcParagraph styles
 * BEM naming: zc-paragraph / zc-paragraph__content / ...
 * ============================================================ */

.zc-paragraph {
  --zc-paragraph-color: var(--color-zc-text-primary, #303133);
  --zc-paragraph-font-size: var(--text-zc-base, 14px);
  --zc-paragraph-line-height: 1.6;
  --zc-paragraph-margin-bottom: 1em;

  color: var(--zc-paragraph-color);
  font-size: var(--zc-paragraph-font-size);
  line-height: var(--zc-paragraph-line-height);
  margin-bottom: var(--zc-paragraph-margin-bottom);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px;
}

.zc-paragraph__content {
  margin: 0;
  flex: 1 1 auto;
  min-width: 0;
}

/* ---- Ellipsis ---- */
.zc-paragraph.is-ellipsis .zc-paragraph__content {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
}

/* ---- Actions ---- */
.zc-paragraph__actions {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}

.zc-paragraph__suffix {
  color: var(--color-zc-text-primary, #303133);
}

.zc-paragraph__expand {
  display: inline-flex;
  align-items: center;
  padding: 0 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-primary-500, #409eff);
  font-size: inherit;
  line-height: inherit;
  white-space: nowrap;
}

.zc-paragraph__expand:hover {
  color: var(--color-zc-primary-600, #337ecc);
}

/* ---- Copy ---- */
.zc-paragraph__copy {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  border-radius: var(--radius-zc-base, 4px);
  transition: color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  flex-shrink: 0;
}

.zc-paragraph__copy:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-paragraph__copy svg {
  width: 16px;
  height: 16px;
}

.zc-paragraph__copy.is-copied {
  color: var(--color-zc-success-500, #67c23a);
}

/* ---- Edit ---- */
.zc-paragraph__edit {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--color-zc-text-secondary, #909399);
  border-radius: var(--radius-zc-base, 4px);
  transition: color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
  flex-shrink: 0;
}

.zc-paragraph__edit:hover {
  color: var(--color-zc-primary-500, #409eff);
}

.zc-paragraph__edit svg {
  width: 16px;
  height: 16px;
}

/* ---- Editing ---- */
.zc-paragraph.is-editing {
  flex-direction: column;
}

.zc-paragraph__editor {
  width: 100%;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: 6px 10px;
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-bg-base, #fff);
  color: inherit;
  resize: vertical;
  outline: none;
  transition: border-color var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-paragraph__editor:focus {
  border-color: var(--color-zc-primary-500, #409eff);
}

.zc-paragraph__edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.zc-paragraph__edit-confirm,
.zc-paragraph__edit-cancel {
  padding: 2px 12px;
  font-size: var(--text-zc-sm, 13px);
  border: 1px solid var(--color-zc-border-base, #dcdfe6);
  border-radius: var(--radius-zc-base, 4px);
  background: var(--color-zc-bg-base, #fff);
  cursor: pointer;
  transition: all var(--transition-duration-zc-fast, 0.15s) var(--ease-zc-in-out, ease);
}

.zc-paragraph__edit-confirm {
  background: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #fff);
}

.zc-paragraph__edit-confirm:hover {
  background: var(--color-zc-primary-600, #337ecc);
  border-color: var(--color-zc-primary-600, #337ecc);
}

.zc-paragraph__edit-cancel:hover {
  border-color: var(--color-zc-text-secondary, #909399);
  color: var(--color-zc-text-secondary, #909399);
}

/* ---- Dark mode ---- */
html[data-theme='dark'] .zc-paragraph {
  --zc-paragraph-color: var(--color-zc-text-primary, #e5eaf3);
}

html[data-theme='dark'] .zc-paragraph__editor {
  background: var(--color-zc-bg-overlay, #1d1e1f);
  border-color: var(--color-zc-border-base, #4c4d4f);
  color: var(--color-zc-text-primary, #e5eaf3);
}

html[data-theme='dark'] .zc-paragraph__edit-confirm,
html[data-theme='dark'] .zc-paragraph__edit-cancel {
  background: var(--color-zc-bg-overlay, #1d1e1f);
  border-color: var(--color-zc-border-base, #4c4d4f);
  color: var(--color-zc-text-primary, #e5eaf3);
}

html[data-theme='dark'] .zc-paragraph__edit-confirm {
  background: var(--color-zc-primary-500, #409eff);
  border-color: var(--color-zc-primary-500, #409eff);
  color: #fff;
}
</style>
