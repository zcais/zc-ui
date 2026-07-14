<script lang="ts">
import type { InjectionKey } from 'vue'
import type { FloatButtonShape, FloatButtonType } from './float-button.vue'

/** Shape of the whole group (square/circle) — passed to children if not overridden. */
export type FloatButtonGroupShape = FloatButtonShape
/** Trigger mode for the collapsible group. */
export type FloatButtonGroupTrigger = 'hover' | 'click'

/** Context provided from group to nested buttons. */
export interface FloatButtonGroupContext {
  shape: FloatButtonGroupShape
  type: FloatButtonType
}

/** Context key for nested float buttons. */
export const floatButtonGroupKey: InjectionKey<FloatButtonGroupContext> =
  Symbol('ZcFloatButtonGroup')
</script>

<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

defineOptions({ name: 'ZcFloatButtonGroup' })

const props = withDefaults(
  defineProps<{
    /** Shape inherited by child FloatButtons. */
    shape?: FloatButtonGroupShape
    /** Type inherited by child FloatButtons. */
    type?: FloatButtonType
    /** Whether the group can collapse/expand on hover/click. */
    collapsible?: boolean
    /** Trigger for opening the group. */
    trigger?: FloatButtonGroupTrigger
    /** Position of the group. */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
    /** Right offset (px). */
    right?: number
    /** Bottom offset (px). */
    bottom?: number
    /** Left offset (px). */
    left?: number
    /** Top offset (px). */
    top?: number
  }>(),
  {
    shape: 'circle',
    type: 'default',
    collapsible: false,
    trigger: 'hover',
    position: 'bottom-right',
    right: 40,
    bottom: 40,
    left: 40,
    top: 40,
  }
)

const ns = useNamespace('float-button-group')
const expanded = ref(!props.collapsible)
const groupHover = ref(false)
const groupFocus = ref(false)

const open = computed(() => expanded.value || groupHover.value || groupFocus.value)

const positionStyle = computed<Record<string, string>>(() => {
  const styles: Record<string, string> = {}
  if (props.position.includes('right')) styles.right = `${props.right}px`
  if (props.position.includes('left')) styles.left = `${props.left}px`
  if (props.position.includes('bottom')) styles.bottom = `${props.bottom}px`
  if (props.position.includes('top')) styles.top = `${props.top}px`
  return styles
})

const classes = computed(() => [
  ns.b(),
  ns.m(props.shape),
  ns.m(props.position),
  ns.is('collapsible', props.collapsible),
  ns.is('open', open.value),
])

// Provide defaults to children
provide(floatButtonGroupKey, {
  shape: props.shape,
  type: props.type,
})

function handleTriggerClick() {
  if (!props.collapsible) return
  expanded.value = !expanded.value
}

function handleMouseEnter() {
  if (props.collapsible && props.trigger === 'hover') {
    groupHover.value = true
  }
}

function handleMouseLeave() {
  if (props.collapsible && props.trigger === 'hover') {
    groupHover.value = false
  }
}

function handleFocusin() {
  if (props.collapsible && props.trigger === 'click') {
    groupFocus.value = true
  }
}

function handleFocusout() {
  if (props.collapsible && props.trigger === 'click') {
    groupFocus.value = false
  }
}
</script>

<template>
  <div
    :class="classes"
    :style="positionStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusin"
    @focusout="handleFocusout"
  >
    <!--
      Expose the group context as a scoped slot prop, so children can
      opt-in to inheriting shape/type without relying solely on
      provide/inject (which doesn't cross slot boundaries reliably).
    -->
    <slot v-bind="{ shape: props.shape, type: props.type }" />
    <button
      v-if="collapsible"
      type="button"
      :class="ns.e('trigger')"
      :aria-expanded="open"
      :aria-label="open ? '折叠悬浮按钮' : '展开悬浮按钮'"
      @click="handleTriggerClick"
    >
      <svg
        v-if="open"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="ns.e('icon')"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <svg
        v-else
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="ns.e('icon')"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  </div>
</template>

<style>
/* ============================================================
 * ZcFloatButtonGroup styles
 *
 * NOTE: Not using `scoped` here because we need to target slotted
 * FloatButton children (which have their own scope from the child
 * component). Using :slotted() with a scoped parent won't reach the
 * child's rendered DOM, so we use global class-based selectors.
 * ============================================================ */
.zc-float-button-group {
  --zc-float-button-group-gap: 12px;
  --zc-float-button-group-z-index: 999;

  position: fixed;
  z-index: var(--zc-float-button-group-z-index);
  display: inline-flex;
  flex-direction: column;
  gap: var(--zc-float-button-group-gap);
  outline: none;
}

/* For top positions, reverse the column direction so children stack downward */
.zc-float-button-group--top-right,
.zc-float-button-group--top-left {
  flex-direction: column;
}
.zc-float-button-group--bottom-right,
.zc-float-button-group--bottom-left {
  flex-direction: column-reverse;
}

/* ---- Trigger (expand/collapse) button ---- */
.zc-float-button-group__trigger {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--color-zc-primary-500, #409eff);
  color: var(--color-zc-white, #ffffff);
  border: none;
  border-radius: var(--radius-zc-circle, 50%);
  box-shadow: var(--shadow-zc-md, 0 4px 12px 0 rgba(0, 0, 0, 0.1));
  cursor: pointer;
  transition:
    background var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease);
}

.zc-float-button-group__trigger:hover {
  background: var(--color-zc-primary-400, #79bbff);
}

.zc-float-button-group__trigger:active {
  transform: scale(0.96);
}

.zc-float-button-group__trigger:focus-visible {
  outline: 2px solid var(--color-zc-primary-300, #a0cfff);
  outline-offset: 2px;
}

.zc-float-button-group__icon {
  width: 20px;
  height: 20px;
}

/* ---- Collapsible children animation ----
 * Target slotted .zc-float-button children globally so the rules apply
 * regardless of scoped attribute on the child component.
 */
.zc-float-button-group.is-collapsible .zc-float-button {
  transition:
    transform var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    opacity var(--transition-duration-zc-base, 0.25s) var(--ease-zc-in-out, ease),
    visibility 0s linear var(--transition-duration-zc-base, 0.25s);
}

/* When collapsed: hide from a11y tree (visibility: hidden removes from
 * tab order and screen readers), but still allow children to receive
 * focus when the group is reopened. We don't use display:none because
 * that would break the slide animation. */
.zc-float-button-group.is-collapsible:not(.is-open) .zc-float-button {
  pointer-events: none;
  visibility: hidden;
  transform: scale(0.4);
  opacity: 0;
}

.zc-float-button-group.is-collapsible.is-open .zc-float-button {
  pointer-events: auto;
  visibility: visible;
  transform: scale(1);
  opacity: 1;
  transition-delay: 0s;
}

/* ---- Dark mode ---- */
html.zc-dark .zc-float-button-group__trigger,
.zc-dark .zc-float-button-group__trigger,
[data-theme='dark'] .zc-float-button-group__trigger {
  background: var(--color-zc-primary-600, #337ecc);
}
</style>
