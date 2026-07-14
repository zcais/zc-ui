<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcSkeleton' })

export type SkeletonAnimation = 'el' | 'none'

const props = withDefaults(
  defineProps<{
    rows?: number
    animated?: boolean
    loading?: boolean
    avatar?: boolean | SkeletonAvatarProps
    title?: boolean | SkeletonTitleProps
    paragraph?: boolean | SkeletonParagraphProps
  }>(),
  {
    rows: 0,
    animated: true,
    loading: true,
    avatar: false,
    title: true,
    paragraph: true,
  }
)

export interface SkeletonAvatarProps {
  size?: 'large' | 'medium' | 'small'
  shape?: 'circle' | 'square'
}
export interface SkeletonTitleProps {
  width?: string | number
}
export interface SkeletonParagraphProps {
  rows?: number
  width?: string | number | Array<string | number>
}

const ns = useNamespace('skeleton')

const showSkeleton = computed(() => props.loading)

const avatarConfig = computed<SkeletonAvatarProps>(() => {
  if (typeof props.avatar === 'object') return props.avatar
  return props.avatar ? {} : { size: undefined, shape: undefined }
})

const titleConfig = computed<SkeletonTitleProps>(() => {
  if (typeof props.title === 'object') return props.title
  return props.title ? {} : {}
})

const paragraphConfig = computed<SkeletonParagraphProps>(() => {
  if (typeof props.paragraph === 'object') return props.paragraph
  return props.paragraph ? { rows: 3 } : {}
})

const titleWidth = computed(() => {
  const w = titleConfig.value.width
  if (!w) return '40%'
  if (typeof w === 'number') return `${w}px`
  return w
})

const paragraphRows = computed(() => {
  if (props.rows > 0) return props.rows
  return paragraphConfig.value.rows ?? 3
})

const paragraphWidths = computed(() => {
  const w = paragraphConfig.value.width
  if (Array.isArray(w)) {
    return w.map((v, i) => {
      if (i === w.length - 1) return typeof v === 'number' ? `${v}px` : v
      return typeof v === 'number' ? `${v}px` : v || '100%'
    })
  }
  // Last row is shorter by default
  const result: string[] = []
  for (let i = 0; i < paragraphRows.value; i++) {
    if (i === paragraphRows.value - 1) {
      result.push(typeof w === 'number' ? `${w}px` : w || '60%')
    } else {
      result.push('100%')
    }
  }
  return result
})
</script>

<template>
  <!-- Custom skeleton template via #template slot (SkeletonItem integration) -->
    <template v-if="showSkeleton && $slots.template">
    <slot name="template" />
    </template>
    
    <!-- Built-in skeleton (loading, no custom template) -->
  <div
    v-else-if="showSkeleton"
      :class="[ns.b(), ns.is('animated', animated)]"
      role="status"
        aria-busy="true"
        aria-live="polite"
          >
          <div :class="ns.e('container')">
          <!-- Avatar -->
        <div
      v-if="avatar"
      :class="[
        ns.e('avatar'),
        ns.em('avatar', avatarConfig.shape || 'square'),
        ns.em('avatar', avatarConfig.size || 'medium'),
        ]"
          />
            <div :class="ns.e('content')">
            <!-- Title -->
            <div v-if="title" :class="ns.e('title')" :style="{ width: titleWidth }" />
            <!-- Paragraph rows -->
          <div v-if="paragraph" :class="ns.e('paragraph')">
        <div
      v-for="(w, i) in paragraphWidths"
    :key="i"
  :class="ns.e('line')"
  :style="{ width: w }"
  />
    </div>
  </div>
</div>
  </div>
  
    <!-- Show actual content when not loading -->
  <template v-else>
    <slot />
  </template>
</template>

<style scoped>
/* ============================================================
 * ZcSkeleton styles
 * ============================================================ */

.zc-skeleton {
  --zc-skeleton-bg-color: var(--color-zc-fill-light, #f5f7fa);
--zc-skeleton-animated-bg-color: var(--color-zc-fill-lighter, #fafafa);
--zc-skeleton-border-radius: var(--radius-zc-base, 4px);
--zc-skeleton-animation-duration: 1.5s;
  
  width: 100%;
  }

.zc-skeleton__container {
display: flex;
  gap: var(--spacing-zc-base, 12px);
  align-items: flex-start;
}

.zc-skeleton__content {
flex: 1;
  min-width: 0;
  }

/* ---- Avatar ---- */
.zc-skeleton__avatar {
  flex-shrink: 0;
  background: var(--zc-skeleton-bg-color);
}

  .zc-skeleton__avatar--large {
  width: 48px;
height: 48px;
}
  .zc-skeleton__avatar--medium {
  width: 36px;
height: 36px;
}
.zc-skeleton__avatar--small {
  width: 28px;
height: 28px;
}
  
.zc-skeleton__avatar--circle {
border-radius: var(--radius-zc-circle, 50%);
}
.zc-skeleton__avatar--square {
  border-radius: var(--zc-skeleton-border-radius);
  }
  
  /* ---- Title ---- */
.zc-skeleton__title {
height: 16px;
margin-bottom: var(--spacing-zc-sm, 8px);
background: var(--zc-skeleton-bg-color);
  border-radius: var(--radius-zc-sm, 2px);
  }
  
/* ---- Paragraph ---- */
.zc-skeleton__paragraph {
display: flex;
  flex-direction: column;
  gap: var(--spacing-zc-sm, 8px);
  }

.zc-skeleton__line {
height: 12px;
background: var(--zc-skeleton-bg-color);
border-radius: var(--radius-zc-sm, 2px);
}
  
    /* ---- Animated shimmer ---- */
    .zc-skeleton.is-animated .zc-skeleton__avatar,
    .zc-skeleton.is-animated .zc-skeleton__title,
    .zc-skeleton.is-animated .zc-skeleton__line {
  background: linear-gradient(
  90deg,
  var(--zc-skeleton-bg-color) 25%,
var(--color-zc-fill-base, #f0f2f5) 37%,
    var(--zc-skeleton-animated-bg-color) 63%
  );
  background-size: 400% 100%;
  animation: zc-skeleton-loading var(--zc-skeleton-animation-duration) ease infinite;
}

@keyframes zc-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
