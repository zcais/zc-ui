<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcComment' })

const props = withDefaults(
  defineProps<{
    /** Author name */
    author?: string
    /** Avatar URL */
    avatar?: string
    /** Datetime string */
    datetime?: string
    /** Whether to show nested replies */
    nested?: boolean
    /** Alignment of avatar */
    avatarSize?: number
    /** Content of the comment (can also use default slot) */
    content?: string
  }>(),
  {
    author: '',
    avatar: '',
    datetime: '',
    nested: false,
    avatarSize: 40,
    content: '',
  }
)

const emit = defineEmits<{
  (e: 'reply', author: string): void
  (e: 'like'): void
}>()

const ns = useNamespace('comment')
const slots = useSlots()

const hasActions = computed(() => !!slots.actions)
const hasNested = computed(() => props.nested && !!slots['comment-list'])

const avatarStyle = computed(() => ({
  width: `${props.avatarSize}px`,
  height: `${props.avatarSize}px`,
}))

/** Build the initials for fallback avatar */
const avatarInitial = computed(() => {
  if (props.author) {
    return props.author.charAt(0).toUpperCase()
  }
  return ''
})

function handleReply() {
  emit('reply', props.author)
}

function handleLike() {
  emit('like')
}
</script>

<template>
  <div :class="ns.b()">
    <!-- Avatar -->
    <div :class="ns.e('avatar')" :style="avatarStyle">
      <slot name="avatar">
        <img v-if="avatar" :src="avatar" :alt="author" :class="ns.e('avatar-img')" />
        <span v-else :class="ns.e('avatar-placeholder')">{{ avatarInitial }}</span>
      </slot>
    </div>

    <!-- Content area -->
    <div :class="ns.e('content')">
      <!-- Header: author + datetime -->
      <div v-if="author || datetime || slots.author || slots.datetime" :class="ns.e('header')">
        <span :class="ns.e('author')">
          <slot name="author">{{ author }}</slot>
        </span>
        <span v-if="datetime || slots.datetime" :class="ns.e('datetime')">
          <slot name="datetime">{{ datetime }}</slot>
        </span>
      </div>

      <!-- Body: comment content -->
      <div :class="ns.e('body')">
        <slot>{{ content }}</slot>
      </div>

      <!-- Actions -->
      <div v-if="hasActions" :class="ns.e('actions')">
        <slot name="actions" :reply="handleReply" :like="handleLike" />
      </div>

      <!-- Default action buttons when no actions slot -->
      <div v-else :class="ns.e('actions')">
        <button
          type="button"
          :class="[ns.e('action'), 'zc-comment__action--reply']"
          @click="handleReply"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z" />
          </svg>
          <span>Reply</span>
        </button>
        <button
          type="button"
          :class="[ns.e('action'), 'zc-comment__action--like']"
          @click="handleLike"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
            <path
              d="M2 21h2V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
            />
          </svg>
          <span>Like</span>
        </button>
      </div>

      <!-- Nested replies -->
      <transition name="zc-comment-nested">
        <div v-if="hasNested" :class="ns.e('nested')">
          <slot name="comment-list" />
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
 * ZcComment styles
 * BEM naming: zc-comment / zc-comment__avatar / zc-comment__content
 *              zc-comment__author / zc-comment__datetime
 *              zc-comment__actions / zc-comment__action
 *              zc-comment__nested
 * ============================================================ */

.zc-comment {
  --zc-comment-font-size: var(--text-zc-base, 14px);
  --zc-comment-line-height: 1.6;
  --zc-comment-text-color: var(--color-zc-text-primary, #303133);
  --zc-comment-secondary-color: var(--color-zc-text-secondary, #606266);
  --zc-comment-action-color: var(--color-zc-text-regular, #909399);
  --zc-comment-action-hover-color: var(--color-zc-primary, #409eff);
  --zc-comment-border-color: var(--color-zc-border-base, #dcdfe6);
  --zc-comment-avatar-bg: var(--color-zc-fill-base, #f0f2f5);
  --zc-comment-gap: 12px;
  --zc-comment-nested-margin-top: 12px;
  --zc-comment-nested-padding-left: 52px;

  display: flex;
  gap: var(--zc-comment-gap);
  font-size: var(--zc-comment-font-size);
  line-height: var(--zc-comment-line-height);
  color: var(--zc-comment-text-color);
}

/* ---- Avatar ---- */
.zc-comment__avatar {
  flex-shrink: 0;
  border-radius: var(--radius-zc-circle, 50%);
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--zc-comment-avatar-bg);
}

.zc-comment__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zc-comment__avatar-placeholder {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: var(--text-zc-md, 16px);
  font-weight: 500;
  color: var(--zc-comment-secondary-color);
}

/* ---- Content area ---- */
.zc-comment__content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* ---- Header ---- */
.zc-comment__header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.zc-comment__author {
  font-weight: 600;
  font-size: var(--text-zc-md, 15px);
  color: var(--zc-comment-text-color);
}

.zc-comment__datetime {
  font-size: var(--text-zc-xs, 12px);
  color: var(--zc-comment-secondary-color);
}

/* ---- Body ---- */
.zc-comment__body {
  color: var(--zc-comment-text-color);
  word-break: break-word;
}

/* ---- Actions ---- */
.zc-comment__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.zc-comment__action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: var(--text-zc-sm, 13px);
  color: var(--zc-comment-action-color);
  border-radius: var(--radius-zc-base, 4px);
  transition:
    color 0.2s ease,
    background-color 0.2s ease;
  outline: none;
}

.zc-comment__action:hover {
  color: var(--zc-comment-action-hover-color);
  background-color: var(--color-zc-fill-light, rgba(64, 158, 255, 0.08));
}

.zc-comment__action:focus-visible {
  color: var(--zc-comment-action-hover-color);
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
}

.zc-comment__action svg {
  flex-shrink: 0;
}

/* ---- Nested ---- */
.zc-comment__nested {
  margin-top: var(--zc-comment-nested-margin-top);
  padding-left: var(--zc-comment-nested-padding-left);
}

/* ---- Nested transition ---- */
.zc-comment-nested-enter-active,
.zc-comment-nested-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.zc-comment-nested-enter-from,
.zc-comment-nested-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---- Dark mode ---- */
.dark .zc-comment {
  --zc-comment-text-color: var(--color-zc-text-primary, #e5e7eb);
  --zc-comment-secondary-color: var(--color-zc-text-secondary, #9ca3af);
  --zc-comment-action-color: var(--color-zc-text-regular, #8b95a5);
  --zc-comment-border-color: var(--color-zc-border-base, #414243);
  --zc-comment-avatar-bg: var(--color-zc-fill-base, #2a2b2c);
}

.dark .zc-comment__action:hover {
  background-color: rgba(64, 158, 255, 0.15);
}
</style>
