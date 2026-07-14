<script setup lang="ts">
import { computed, ref, onErrorCaptured } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcAvatar' })

export type AvatarSize = 'large' | 'medium' | 'small' | number
export type AvatarShape = 'circle' | 'square'

const props = withDefaults(
  defineProps<{
    src?: string
    size?: AvatarSize
    shape?: AvatarShape
    icon?: string
    alt?: string
    fit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  }>(),
  {
    src: '',
    size: 'medium',
    shape: 'circle',
    icon: '',
    alt: '',
    fit: 'cover',
  }
)

const ns = useNamespace('avatar')

const hasError = ref(false)

onErrorCaptured(() => {
  hasError.value = true
  return false
})

function handleError() {
  hasError.value = true
}

const showFallback = computed(() => !props.src || hasError.value)

const sizeStyle = computed(() => {
  if (typeof props.size === 'number') {
    return { width: `${props.size}px`, height: `${props.size}px` }
  }
  return {}
})

const sizeClass = computed(() => {
  if (typeof props.size === 'string') {
    return ns.m(props.size)
  }
  return ''
})

const classes = computed(() => [ns.b(), sizeClass.value, ns.m(props.shape)])
</script>

<template>
  <span :class="classes" :style="sizeStyle">
    <!-- Image mode -->
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt"
      :class="ns.e('img')"
      :style="{ objectFit: fit }"
      @error="handleError"
    />
    <!-- Icon fallback (only when icon prop is set or image failed) -->
    <span v-else-if="icon || (showFallback && !$slots.default)" :class="ns.e('fallback')">
      <slot name="fallback">
        <i v-if="icon" :class="icon" />
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      </slot>
    </span>
    <!-- Default slot for custom content -->
    <slot v-else />
  </span>
</template>

<style scoped>
/* ============================================================
 * ZcAvatar styles
 * BEM naming: zc-avatar / zc-avatar__img / zc-avatar__fallback
 * ============================================================ */

.zc-avatar {
  --zc-avatar-bg-color: var(--color-zc-fill-base, #f0f2f5);
  --zc-avatar-text-color: var(--color-zc-white, #fff);
  --zc-avatar-font-size: var(--text-zc-base, 14px);
  --zc-avatar-border-radius: var(--radius-zc-circle, 50%);
  --zc-avatar-size: 36px;
  --zc-avatar-icon-color: var(--color-zc-text-secondary, #909399);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: var(--zc-avatar-size);
  height: var(--zc-avatar-size);
  color: var(--zc-avatar-text-color);
  background: var(--zc-avatar-bg-color);
  font-size: var(--zc-avatar-font-size);
  border-radius: var(--zc-avatar-border-radius);
  box-sizing: border-box;
  flex-shrink: 0;
}

.zc-avatar__img {
  width: 100%;
  height: 100%;
}

.zc-avatar__fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.zc-avatar__fallback svg {
  width: 60%;
  height: 60%;
  color: var(--zc-avatar-icon-color);
}

/* ---- shapes ---- */
.zc-avatar--circle {
  --zc-avatar-border-radius: var(--radius-zc-circle, 50%);
}
.zc-avatar--square {
  --zc-avatar-border-radius: var(--radius-zc-base, 4px);
}

/* ---- sizes ---- */
.zc-avatar--large {
  --zc-avatar-size: 48px;
  --zc-avatar-font-size: var(--text-zc-md, 16px);
}
.zc-avatar--medium {
  --zc-avatar-size: 36px;
}
.zc-avatar--small {
  --zc-avatar-size: 28px;
  --zc-avatar-font-size: var(--text-zc-xs, 12px);
}
</style>
