# Tooltip 文字提示

常用于展示鼠标悬浮时的提示信息，支持多种触发方式和展示方向。

## 基础用法

使用 `content` 属性设置提示内容，默认通过 `hover` 触发。

<DemoBlock>

```vue
<template>
  <ZcTooltip content="这是一段提示文字">
    <ZcButton>鼠标悬浮</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="带箭头提示" :show-arrow="true">
    <ZcButton>带箭头</ZcButton>
  </ZcTooltip>
</template>
```

</DemoBlock>

## 触发方式

通过 `triggers` 属性设置触发方式，支持 `hover`、`click`、`focus`。

<DemoBlock>

```vue
<template>
  <ZcTooltip content="Click 触发" :triggers="['click']">
    <ZcButton>点击触发</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="Focus 触发" :triggers="['focus']">
    <ZcButton>聚焦触发</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="Hover 触发" :triggers="['hover']">
    <ZcButton>悬浮触发</ZcButton>
  </ZcTooltip>
</template>
```

</DemoBlock>

## 提示位置

通过 `placement` 属性控制提示框的展示位置，支持 12 种方向。

<DemoBlock>

```vue
<template>
  <ZcTooltip content="上左" placement="top-start">
    <ZcButton>上左</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="上方" placement="top">
    <ZcButton>上方</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="上右" placement="top-end">
    <ZcButton>上右</ZcButton>
  </ZcTooltip>
  <br /><br />
  <ZcTooltip content="下方" placement="bottom">
    <ZcButton>下方</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="左侧" placement="left">
    <ZcButton>左侧</ZcButton>
  </ZcTooltip>
  <ZcTooltip content="右侧" placement="right">
    <ZcButton>右侧</ZcButton>
  </ZcTooltip>
</template>
```

</DemoBlock>

## 延迟显示与隐藏

通过 `show-delay` 和 `hide-delay` 设置延迟时间（毫秒）。

<DemoBlock>

```vue
<template>
  <ZcTooltip content="延迟300ms显示" :show-delay="300" :hide-delay="200">
    <ZcButton>悬浮延迟</ZcButton>
  </ZcTooltip>
</template>
```

</DemoBlock>

## 禁用状态

设置 `disabled` 属性后，Tooltip 将不再显示。

<DemoBlock>

```vue
<template>
  <ZcTooltip content="提示内容" disabled>
    <ZcButton>禁用提示</ZcButton>
  </ZcTooltip>
</template>
```

</DemoBlock>

## Tooltip API

### Props

<ApiTable type="props" :data="[
  { name: 'content', description: '提示文字内容', type: 'string', default: '' },
  { name: 'placement', description: '提示框位置', type: 'top | top-start | top-end | bottom | bottom-start | bottom-end | left | left-start | left-end | right | right-start | right-end', default: 'top' },
  { name: 'triggers', description: '触发方式', type: 'hover | click | focus[]', default: '[hover]' },
  { name: 'show-delay', description: '显示延迟（毫秒）', type: 'number', default: '100' },
  { name: 'hide-delay', description: '隐藏延迟（毫秒）', type: 'number', default: '100' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'visible', description: '手动控制可见性（v-model）', type: 'boolean', default: 'false' },
  { name: 'show-arrow', description: '是否显示箭头', type: 'boolean', default: 'true' },
  { name: 'popper-class', description: '自定义弹出层类名', type: 'string', default: '' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:visible', description: '可见性变化时触发', parameters: '(visible: boolean)' },
  { name: 'show', description: '提示框显示时触发', parameters: '—' },
  { name: 'hide', description: '提示框隐藏时触发', parameters: '—' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '触发提示的元素内容' },
  { name: 'content', description: '自定义提示内容，不设置则使用 content 属性' }
]" />

## 注意事项

- **SSR 兼容性**：Tooltip 使用 `Teleport` 将 popper 挂载到 `document.body`，在 SSR 环境中需确保仅在客户端渲染。
- **定位机制**：Tooltip 使用 CSS 绝对定位，基于触发元素的相对位置计算。在复杂嵌套布局中，确保父元素没有 `overflow: hidden` 截断。
- **延迟控制**：默认显示/隐藏延迟各 100ms，可通过 `show-delay` 和 `hide-delay` 调整。设为 `0` 可实现立即响应。
- **无障碍**：Tooltip 会自动设置 `role="tooltip"`。对于关键信息，考虑使用 `aria-describedby` 关联触发元素。
