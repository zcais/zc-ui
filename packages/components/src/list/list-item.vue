<script setup lang="ts">
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcListItem' })

withDefaults(
  defineProps<{
    /** Extra text displayed on the right side */
    extra?: string
    /** Avatar image URL */
    avatar?: string
    /** Title text */
    title?: string
    /** Description text */
    description?: string
  }>(),
  {
    extra: '',
    avatar: '',
    title: '',
    description: '',
  }
)

const ns = useNamespace('list-item')
</script>

<template>
  <div :class="ns.b()">
    <!-- Avatar -->
    <div v-if="avatar || $slots.avatar" :class="ns.e('avatar')">
      <slot name="avatar">
        <img v-if="avatar" :src="avatar" alt="avatar" />
      </slot>
    </div>

    <!-- Content -->
    <div :class="ns.e('content')">
      <div v-if="title || $slots.title" :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <slot />
      <div v-if="description || $slots.description" :class="ns.e('description')">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>

    <!-- Extra -->
    <div v-if="extra || $slots.extra" :class="ns.e('extra')">
      <slot name="extra">{{ extra }}</slot>
    </div>

    <!-- Actions -->
    <div v-if="$slots.actions" :class="ns.e('actions')">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcListItem styles
 * Base layout is defined in list.vue (parent); this block adds
 * avatar, title, and description sub-element styles.
 * ============================================================ */

.zc-list-item__avatar {
  flex-shrink: 0;
  margin-right: 12px;
}

.zc-list-item__avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.zc-list-item__title {
  font-size: var(--zc-list-font-size);
  font-weight: 500;
  color: var(--zc-list-text-color);
  margin-bottom: 4px;
  line-height: 1.5;
}

.zc-list-item__description {
  font-size: var(--text-zc-sm, 13px);
  color: var(--zc-list-meta-color);
  line-height: 1.5;
}
</style>
