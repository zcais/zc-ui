<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcPageHeader' })

const props = withDefaults(
  defineProps<{
    /** Main title */
    title?: string
    /** Subtitle / description */
    subtitle?: string
    /** Show back button */
    showBack?: boolean
    /** Back icon (SVG path data or class) */
    backIcon?: string
    /** Hide ghost area on the right */
    ghost?: boolean
  }>(),
  {
    title: '',
    subtitle: '',
    showBack: true,
    backIcon: '',
    ghost: false,
  }
)

const emit = defineEmits<{
  (e: 'back'): void
}>()

const ns = useNamespace('page-header')

const classes = computed(() => [
  ns.b(),
  ns.is('ghost', props.ghost),
  ns.is('has-back', props.showBack),
])

function handleBack() {
  emit('back')
  // Default: try history.back
  if (typeof history !== 'undefined' && history.length > 1) {
    history.back()
  }
}
</script>

<template>
  <div :class="classes">
    <!-- Left: back + breadcrumb -->
    <div :class="ns.e('left')">
      <button
        v-if="showBack"
        :class="ns.e('back')"
        type="button"
        aria-label="返回"
        @click="handleBack"
      >
        <svg viewBox="0 0 24 24" fill="none">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- Breadcrumb slot -->
      <div v-if="$slots.breadcrumb" :class="ns.e('breadcrumb')">
        <slot name="breadcrumb" />
      </div>
    </div>

    <!-- Center: title + subtitle -->
    <div :class="ns.e('title-group')">
      <slot name="title">
        <h2 v-if="title" :class="ns.e('title')">{{ title }}</h2>
      </slot>
      <slot name="subtitle">
        <span v-if="subtitle" :class="ns.e('subtitle')">{{ subtitle }}</span>
      </slot>
    </div>

    <!-- Right: extra actions -->
    <div v-if="$slots.extra" :class="ns.e('extra')">
      <slot name="extra" />
    </div>

    <!-- Footer slot (e.g. tabs) -->
    <div v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.zc-page-header {
  --zc-page-header-padding: 16px 24px;
  --zc-page-header-bg: var(--color-zc-bg-base, #fff);
  --zc-page-header-border-color: var(--color-zc-border-light, #e4e7ed);
  --zc-page-header-title-color: var(--color-zc-text-primary, #303133);
  --zc-page-header-subtitle-color: var(--color-zc-text-secondary, #909399);

  position: relative;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: var(--zc-page-header-padding);
  background: var(--zc-page-header-bg);
  border-bottom: 1px solid var(--zc-page-header-border-color);
}

.zc-page-header--ghost {
  background: transparent;
  border-bottom: none;
  padding: 16px 0;
}

/* Left section */
.zc-page-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* Back button */
.zc-page-header__back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--color-zc-text-secondary, #909399);
  cursor: pointer;
  border-radius: var(--radius-zc-base, 4px);
  transition: all 0.2s;
}

.zc-page-header__back:hover {
  color: var(--color-zc-text-primary, #303133);
  background: var(--color-zc-fill-light, #f5f7fa);
}

.zc-page-header__back svg {
  width: 18px;
  height: 18px;
}

/* Title group */
.zc-page-header__title-group {
  flex: 1;
  min-width: 0;
}

.zc-page-header__title {
  margin: 0;
  font-size: var(--text-zc-xl, 20px);
  font-weight: 600;
  color: var(--zc-page-header-title-color);
  line-height: 1.4;
}

.zc-page-header__subtitle {
  display: block;
  margin-top: 2px;
  font-size: var(--text-zc-sm, 13px);
  color: var(--zc-page-header-subtitle-color);
  line-height: 1.4;
}

/* Extra actions */
.zc-page-header__extra {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Footer */
.zc-page-header__footer {
  flex-basis: 100%;
  margin-top: 8px -8px;
  padding-top: 8px;
  border-top: 1px solid var(--zc-page-header-border-color);
}
</style>
