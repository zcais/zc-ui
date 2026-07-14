# Design: Container & Basic Components (ZcCard, ZcDivider, ZcCollapse, ZcScrollbar)

**Date:** 2025-06-16  
**Requirement:** req-1781588698839-30fffda6 — 1.2 容器与基础类组件  
**Priority:** P1

## Overview

Implement 4 container and basic components to complete the ZC UI component library:

- **ZcCard** — Information container with header/body/footer, shadow modes
- **ZcDivider** — Horizontal/vertical content separator with text alignment
- **ZcCollapse** — Collapsible panels with accordion mode (parent+child pattern)
- **ZcScrollbar** — CSS-only custom scrollbar wrapper

All components follow the existing project patterns: `<script setup lang="ts">`, `useNamespace`, `withInstall`, design token CSS variables.

## Architecture

All components live under `packages/components/src/` in their own directories:

- `card/card.vue`
- `divider/divider.vue`
- `collapse/collapse.vue` + `collapse/collapse-item.vue`
- `scrollbar/scrollbar.vue`

Exported from `packages/components/src/index.ts` via `withInstall()`. Tests in `packages/components/src/__tests__/`.

---

## 1. ZcCard

### Props

| Prop        | Type                                            | Default    | Description                                   |
| ----------- | ----------------------------------------------- | ---------- | --------------------------------------------- |
| `header`    | `string`                                        | `—`        | Card title text. Overridden by `header` slot. |
| `bodyStyle` | `string \| Record<string, string>`              | `—`        | Inline styles for body element                |
| `shadow`    | `CardShadow` (`'always' \| 'hover' \| 'never'`) | `'always'` | Shadow display mode                           |
| `bodyClass` | `string`                                        | `—`        | Custom class for body element                 |

### Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Card body content                       |
| `header`  | Custom header (overrides `header` prop) |
| `footer`  | Card footer content                     |

### Structure

```
.zc-card (.zc-card--shadow-always | .zc-card--shadow-hover | .zc-card--shadow-never)
├── .zc-card__header (if header prop/slot provided)
│   └── .zc-card__header-title (text from prop)
│   └── <slot name="header" /> (if provided, replaces title)
├── .zc-card__body
│   └── <slot /> (default)
└── .zc-card__footer (if footer slot provided)
    └── <slot name="footer" />
```

### CSS

- Uses `--shadow-zc-base` for `always`, `--shadow-zc-base` on hover for `hover`, `none` for `never`
- Border: `1px solid var(--color-zc-border-light)`
- Border radius: `var(--radius-zc-base)`
- Header: bottom border separator, padding using spacing tokens

---

## 2. ZcDivider

### Props

| Prop              | Type                                          | Default        | Description                          |
| ----------------- | --------------------------------------------- | -------------- | ------------------------------------ |
| `direction`       | `'horizontal' \| 'vertical'`                  | `'horizontal'` | Divider direction                    |
| `contentPosition` | `'left' \| 'center' \| 'right'`               | `'center'`     | Text alignment (horizontal only)     |
| `borderStyle`     | `'solid' \| 'dashed' \| 'dotted' \| 'double'` | `'solid'`      | Line style                           |
| `dashed`          | `boolean`                                     | `false`        | Shortcut: sets borderStyle to dashed |

### Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Text/icon content on the divider line |

### Structure

**Horizontal with content:**

```
.zc-divider.zc-divider--horizontal
├── .zc-divider__line--left (flex-grow based on position)
├── <slot /> (.zc-divider__text)
└── .zc-divider__line--right
```

**Horizontal without content:**

```
.zc-divider.zc-divider--horizontal (single line, no text)
```

**Vertical:**

```
.zc-divider.zc-divider--vertical (inline-block, vertical line)
```

### CSS

- Horizontal: `display: flex; align-items: center;` with `::before`/`::after` pseudo-elements (or child divs) as growing lines
- Vertical: `display: inline-block; height: 1em; width: 0; border-left: 1px solid`
- Color: `var(--color-zc-border-base)`
- Margin: `var(--spacing-zc-md)` vertical for horizontal divider

---

## 3. ZcCollapse (Parent + ZcCollapseItem Child)

### ZcCollapse Props

| Prop                   | Type                                                                 | Default | Description                   |
| ---------------------- | -------------------------------------------------------------------- | ------- | ----------------------------- |
| `modelValue` (v-model) | `CollapseModelValue` (`string \| number \| Array<string \| number>`) | `[]`    | Active panel name(s)          |
| `accordion`            | `boolean`                                                            | `false` | Only one panel open at a time |

### ZcCollapse Events

| Event               | Payload              | Description          |
| ------------------- | -------------------- | -------------------- |
| `update:modelValue` | `CollapseModelValue` | v-model sync         |
| `change`            | `CollapseModelValue` | Active names changed |

### ZcCollapseItem Props

| Prop       | Type               | Default | Description                             |
| ---------- | ------------------ | ------- | --------------------------------------- |
| `name`     | `string \| number` | `—`     | Panel identifier (required for v-model) |
| `title`    | `string`           | `—`     | Panel title text                        |
| `disabled` | `boolean`          | `false` | Disable toggle                          |

### ZcCollapseItem Slots

| Slot      | Description                           |
| --------- | ------------------------------------- |
| `default` | Panel content                         |
| `title`   | Custom title (overrides `title` prop) |

### ZcCollapseItem Events

| Event        | Payload                         | Description   |
| ------------ | ------------------------------- | ------------- |
| `item-click` | `string \| number \| undefined` | Panel clicked |

### Pattern: provide/inject

Collapse provides a context via `provide('zcCollapse', {...})`:

```typescript
interface CollapseContext {
  activeNames: ComputedRef<Array<string | number>>
  toggleItem: (name: string | number | undefined) => void
}
```

- CollapseItem injects context, computes `isActive` by checking if its `name` is in `activeNames`
- On header click, CollapseItem calls `toggleItem(name)`
- Collapse handles accordion logic: in accordion mode, `toggleItem` replaces the array; in normal mode, it toggles membership

### Structure

```
.zc-collapse
└── <slot /> (ZcCollapseItem children)

.zc-collapse-item (.is-active | .is-disabled)
├── .zc-collapse-item__header (click target)
│   └── <slot name="title" /> or {{ title }}
│   └── .zc-collapse-item__arrow (rotates when active)
└── .zc-collapse-item__wrapper (height transition)
    └── .zc-collapse-item__content
        └── <slot />
```

### CSS

- Header: `cursor: pointer; padding; border-bottom`
- Arrow: `▶` icon, rotates 90deg when active
- Content: CSS transition on `max-height` or use `<transition>` component with JS hooks for smooth collapse animation
- Disabled: `cursor: not-allowed; color: var(--color-zc-text-placeholder)`

---

## 4. ZcScrollbar (CSS-Only Overlay)

### Props

| Prop        | Type               | Default | Description                                                                   |
| ----------- | ------------------ | ------- | ----------------------------------------------------------------------------- |
| `height`    | `string \| number` | `—`     | Fixed height (number → px)                                                    |
| `maxHeight` | `string \| number` | `—`     | Max height (number → px)                                                      |
| `native`    | `boolean`          | `false` | Use browser default scrollbar                                                 |
| `always`    | `boolean`          | `false` | Always show scrollbar (not hover-only)                                        |
| `minSize`   | `number`           | `20`    | Minimum scrollbar thumb size in px (for ::-webkit-scrollbar-thumb min-height) |
| `tag`       | `string`           | `'div'` | Wrapper element tag                                                           |

### Structure

```
.zc-scrollbar (.is-native if native=true | .is-always if always=true)
└── .zc-scrollbar__wrap (overflow: auto)
    └── <slot />
```

### CSS

Custom scrollbar via CSS only:

**Webkit (Chrome/Safari/Edge):**

```css
.zc-scrollbar__wrap::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  background: rgba(144, 147, 153, 0.3);
  border-radius: 3px;
  min-height: var(--min-size);
}
.zc-scrollbar__wrap::-webkit-scrollbar-thumb:hover {
  background: rgba(144, 147, 153, 0.5);
}
.zc-scrollbar__wrap::-webkit-scrollbar-track {
  background: transparent;
}
```

**Firefox:**

```css
.zc-scrollbar__wrap {
  scrollbar-width: thin;
  scrollbar-color: rgba(144, 147, 153, 0.3) transparent;
}
```

**Hover-only mode (default):**

```css
.zc-scrollbar__wrap::-webkit-scrollbar-thumb {
  opacity: 0;
  transition: opacity 0.3s;
}
.zc-scrollbar__wrap:hover::-webkit-scrollbar-thumb {
  opacity: 1;
}
```

**Native mode:** Skip all custom scrollbar CSS.

---

## Type Exports

```typescript
// card
export type CardShadow = 'always' | 'hover' | 'never'

// divider
export type DividerDirection = 'horizontal' | 'vertical'
export type DividerContentPosition = 'left' | 'center' | 'right'
export type DividerBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double'

// collapse
export type CollapseModelValue = string | number | Array<string | number>
export type CollapseItemName = string | number

// scrollbar
export type ScrollbarHeight = string | number
```

## Implementation Order

1. **ZcScrollbar** — Foundation infrastructure (no dependencies)
2. **ZcDivider** — Simplest, no dependencies
3. **ZcCard** — Simple container, widely used
4. **ZcCollapse** — Most complex (parent+child, v-model, provide/inject)

Each component includes:

- Component SFC file(s)
- Registration in `index.ts` (import + `withInstall` + `withInstallAll`)
- Type exports in `index.ts`
- Comprehensive unit tests
- Documentation markdown

## Testing Strategy

Each component gets a full `spec.ts` covering:

- Default rendering
- All prop values
- Slot content
- Events (Collapse)
- provide/inject integration (Collapse)
- Edge cases (empty, disabled, accordion mode)
