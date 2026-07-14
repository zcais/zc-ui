<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'
import { useLocale } from '@zc-ui/locale'

defineOptions({ name: 'ZcEmpty' })

const props = withDefaults(
  defineProps<{
    description?: string
    image?: string
    imageSize?: number
  }>(),
  {
    description: '',
    image: '',
    imageSize: 0,
  }
)

const ns = useNamespace('empty')
const { t } = useLocale()

const descriptionText = computed(() => props.description || t('zc.empty.description'))

const imgStyle = computed(() => {
  if (props.imageSize > 0) {
    return { width: `${props.imageSize}px`, height: `${props.imageSize}px` }
  }
  return {}
})
</script>

<template>
  <div :class="ns.b()" role="status">
    <!-- Custom image slot/prop or default SVG -->
    <div :class="ns.e('image')" :style="imgStyle">
      <slot name="image">
        <img v-if="image" :src="image" alt="empty" :class="ns.e('img')" />
        <svg v-else viewBox="0 0 280 200" fill="none" :class="ns.e('default')" aria-hidden="true">
          <rect
            x="40"
            y="40"
            width="200"
            height="120"
            rx="8"
            stroke="var(--color-zc-border-base, #dcdfe6)"
            stroke-width="2"
            fill="var(--color-zc-fill-light, #f5f7fa)"
          />
          <rect
            x="60"
            y="60"
            width="160"
            height="12"
            rx="6"
            fill="var(--color-zc-border-light, #e4e7ed)"
          />
          <rect
            x="60"
            y="84"
            width="100"
            height="8"
            rx="4"
            fill="var(--color-zc-border-lighter, #ebeef5)"
          />
          <rect
            x="60"
            y="102"
            width="120"
            height="8"
            rx="4"
            fill="var(--color-zc-border-lighter, #ebeef5)"
          />
          <circle
            cx="200"
            cy="130"
            r="12"
            stroke="var(--color-zc-border-base, #dcdfe6)"
            stroke-width="2"
            fill="var(--color-zc-fill-lighter, #fafafa)"
          />
        </svg>
      </slot>
    </div>
    <!-- Description -->
    <div :class="ns.e('description')">
      <slot name="description">{{ descriptionText }}</slot>
    </div>
    <!-- Extra content slot -->
    <div v-if="$slots.default" :class="ns.e('extra')">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcEmpty styles
 * ============================================================ */

.zc-empty {
  --zc-empty-text-color: var(--color-zc-text-primary, #303133);
  --zc-empty-description-color: var(--color-zc-text-secondary, #909399);
  --zc-empty-font-size: var(--text-zc-base, 14px);
  --zc-empty-description-font-size: var(--text-zc-sm, 13px);
  --zc-empty-icon-size: 64px;
  --zc-empty-padding: 40px 0;
--zc-empty-image-size: 100px;

display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--zc-empty-padding);
font-size: var(--zc-empty-font-size);
color: var(--zc-empty-text-color);
box-sizing: border-box;
  }
  
.zc-empty__image {
display: flex;
align-items: center;
  justify-content: center;
  max-width: 100%;
  width: var(--zc-empty-image-size);
}

.zc-empty__img {
  width: 100%;
  height: auto;
  }
  
.zc-empty__default {
width: 280px;
max-width: 100%;
  height: auto;
}

.zc-empty__description {
  margin-top: var(--spacing-zc-sm, 8px);
  font-size: var(--zc-empty-description-font-size);
  color: var(--zc-empty-description-color);
  text-align: center;
}

.zc-empty__extra {
  margin-top: var(--spacing-zc-base, 12px);
}
</style>
