# ZC UI 组件命名规范

> 基于 BEM (Block\_\_Element--Modifier) 方法论，适配 Vue 3 + Tailwind CSS v4 开发模式。

## 总则

| 概念                  | 格式                     | 示例                 |
| --------------------- | ------------------------ | -------------------- |
| **Block** (块)        | `zc-{name}`              | `zc-button`          |
| **Element** (元素)    | `zc-{block}__{element}`  | `zc-button__icon`    |
| **Modifier** (修饰符) | `zc-{block}--{modifier}` | `zc-button--primary` |
| **State** (状态)      | `is-{state}`             | `is-disabled`        |

## 1. Block（块）

Block 是一个独立的、可复用的组件单元。

- 使用 `zc-` 前缀，避免与第三方库冲突
- 名称使用 **kebab-case**（全小写，连字符分隔）
- 不包含层级关系（不写 `zc-form-button`，而写 `zc-button`）

```html
<!-- ✅ 正确 -->
<div class="zc-button">...</div>
<div class="zc-input">...</div>
<div class="zc-card">...</div>

<!-- ❌ 错误 -->
<div class="button">...</div>
<!-- 缺少 zc- 前缀 -->
<div class="zc-form-button">...</div>
<!-- 不应包含父级 -->
```

## 2. Element（元素）

Element 是 Block 的组成部分，不能脱离 Block 独立使用。

- 使用双下划线 `__` 与 Block 连接
- 名称使用 **kebab-case**

```html
<div class="zc-button">
  <span class="zc-button__inner">
    <i class="zc-button__icon"></i>
  </span>
</div>
```

```html
<div class="zc-card">
  <div class="zc-card__header">...</div>
  <div class="zc-card__body">...</div>
  <div class="zc-card__footer">...</div>
</div>
```

## 3. Modifier（修饰符）

Modifier 描述 Block 或 Element 的外观、尺寸、类型变体。

- 使用双连字符 `--` 与 Block/Element 连接
- 同一组件可以组合多个 Modifier

```html
<!-- 类型修饰符 -->
<button class="zc-button zc-button--primary">Primary</button>
<button class="zc-button zc-button--success">Success</button>
<button class="zc-button zc-button--danger">Danger</button>

<!-- 尺寸修饰符 -->
<button class="zc-button zc-button--large">Large</button>
<button class="zc-button zc-button--small">Small</button>

<!-- 组合使用 -->
<button class="zc-button zc-button--primary zc-button--large">Primary Large</button>
```

## 4. State（状态）

State 表示组件的交互状态，与 BEM 层级正交。

- 使用 `is-` 前缀
- 可以添加到 Block 或 Element 上

| 状态类名      | 说明                    |
| ------------- | ----------------------- |
| `is-disabled` | 禁用                    |
| `is-active`   | 激活 / 当前选中         |
| `is-loading`  | 加载中                  |
| `is-checked`  | 已勾选                  |
| `is-focused`  | 聚焦                    |
| `is-hover`    | 悬停（仅 SSR/静态场景） |
| `is-expanded` | 展开（下拉 / 折叠面板） |
| `is-round`    | 圆角                    |
| `is-plain`    | 朴素风格                |

```html
<button class="zc-button zc-button--primary is-disabled">Disabled</button>
<div class="zc-collapse is-expanded">
  <div class="zc-collapse__item is-active">...</div>
</div>
```

## 5. 在 Vue 3 中使用 — useNamespace

ZC UI 提供 `useNamespace` composable 自动生成 BEM 类名：

```ts
import { useNamespace } from '@zc-ui/hooks'

const ns = useNamespace('button')

// 生成类名
ns.b() // 'zc-button'
ns.e('icon') // 'zc-button__icon'
ns.m('primary') // 'zc-button--primary'
ns.em('icon', 'left') // 'zc-button__icon--left'
ns.bm('primary') // 'zc-button zc-button--primary'
ns.is('disabled') // 'is-disabled'
ns.is('loading', true) // 'is-loading'
ns.is('loading', false) // ''
```

### 组件示例

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { useNamespace } from '@zc-ui/hooks'

const ns = useNamespace('button')

const classes = computed(() => [ns.b(), ns.m('primary'), ns.is('disabled', props.disabled)])
</script>

<template>
  <button :class="classes">
    <span :class="ns.e('inner')">
      <slot />
    </span>
  </button>
</template>
```

## 6. 与 Tailwind CSS v4 协作

ZC UI 组件优先使用 CSS 变量 + BEM 命名编写基础样式，Tailwind 工具类用于布局和间距微调。

```html
<!-- ✅ BEM 提供组件样式，Tailwind 提供布局 -->
<div class="zc-card flex items-center gap-2 p-4">
  <div class="zc-card__header">Title</div>
</div>
```

### 设计 Token → Tailwind 映射

| Token 类型 | CSS 变量                      | Tailwind 类名         |
| ---------- | ----------------------------- | --------------------- |
| 主色 500   | `var(--color-zc-primary-500)` | `bg-zc-primary-500`   |
| 成功 100   | `var(--color-zc-success-100)` | `bg-zc-success-100`   |
| 危险 700   | `var(--color-zc-danger-700)`  | `text-zc-danger-700`  |
| 阴影 md    | `var(--shadow-zc-md)`         | `shadow-zc-md`        |
| 圆角 lg    | `var(--radius-zc-lg)`         | `rounded-zc-lg`       |
| 暗色模式   | `.dark { ... }`               | `dark:bg-zc-info-900` |

## 7. 注意事项

1. **不使用 scoped**：ZC UI 组件使用非 scoped `<style>` + BEM 命名隔离，与 Element Plus 方案一致
2. **不内联颜色**：所有颜色必须通过 `var(--color-zc-*)` 引用，确保 CSS 变量换肤生效
3. **不硬编码间距**：使用 `var(--spacing-zc-*)` 或 Tailwind 工具类
4. **CSS 变量带 fallback**：如 `var(--color-zc-primary-500, #409eff)` 以防变量未注册
5. **z-index 使用 token**：弹出层使用 `var(--z-zc-modal)`、`var(--z-zc-dropdown)` 等
