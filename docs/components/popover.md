# Popover 弹出框

通用的悬浮信息容器，比 Tooltip 更强大，可嵌入复杂内容和操作（按钮、表单等）。

## 基础用法

使用 `content` 属性设置弹出内容，`trigger` 默认为 `click`。

<DemoBlock>

```vue
<template>
  <ZcPopover content="这是一段弹出内容">
    <ZcButton>点击弹出</ZcButton>
  </ZcPopover>
</template>
```

</DemoBlock>

## 标题与内容

通过 `title` 和 `content` 属性设置标题和内容。

<DemoBlock>

```vue
<template>
  <ZcPopover title="标题" content="这是一段详细的说明内容，可以放置较长的文本。">
    <ZcButton>带标题的弹出</ZcButton>
  </ZcPopover>
</template>
```

</DemoBlock>

## 触发方式

支持 `click`、`hover`、`focus`、`contextmenu` 四种触发方式。

<DemoBlock>

```vue
<template>
  <ZcSpace>
    <ZcPopover trigger="click" content="click 触发">
      <ZcButton>Click</ZcButton>
    </ZcPopover>
    <ZcPopover trigger="hover" content="hover 触发" :show-delay="0" :hide-delay="0">
      <ZcButton>Hover</ZcButton>
    </ZcPopover>
    <ZcPopover trigger="focus" content="focus 触发">
      <ZcButton>Focus</ZcButton>
    </ZcPopover>
    <ZcPopover trigger="contextmenu" content="右键触发">
      <ZcButton>右键菜单</ZcButton>
    </ZcPopover>
  </ZcSpace>
</template>
```

</DemoBlock>

## 弹出位置

支持 12 个方向的弹出位置。

<DemoBlock>

```vue
<template>
  <ZcSpace wrap>
    <ZcPopover placement="top" content="上方弹出">
      <ZcButton size="small">Top</ZcButton>
    </ZcPopover>
    <ZcPopover placement="top-start" content="左上方弹出">
      <ZcButton size="small">Top Start</ZcButton>
    </ZcPopover>
    <ZcPopover placement="top-end" content="右上方弹出">
      <ZcButton size="small">Top End</ZcButton>
    </ZcPopover>
    <ZcPopover placement="bottom" content="下方弹出">
      <ZcButton size="small">Bottom</ZcButton>
    </ZcPopover>
    <ZcPopover placement="bottom-start" content="左下方弹出">
      <ZcButton size="small">Bottom Start</ZcButton>
    </ZcPopover>
    <ZcPopover placement="bottom-end" content="右下方弹出">
      <ZcButton size="small">Bottom End</ZcButton>
    </ZcPopover>
    <ZcPopover placement="left" content="左侧弹出">
      <ZcButton size="small">Left</ZcButton>
    </ZcPopover>
    <ZcPopover placement="right" content="右侧弹出">
      <ZcButton size="small">Right</ZcButton>
    </ZcPopover>
  </ZcSpace>
</template>
```

</DemoBlock>

## 自定义内容

通过 `content` 插槽可以嵌入任意内容（按钮、表单等）。

<DemoBlock>

```vue
<template>
  <ZcPopover trigger="click" :width="280">
    <template #content>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <p>请选择操作：</p>
        <ZcSpace>
          <ZcButton size="small" type="primary">确定</ZcButton>
          <ZcButton size="small">取消</ZcButton>
        </ZcSpace>
      </div>
    </template>
    <ZcButton>自定义内容</ZcButton>
  </ZcPopover>
</template>
```

</DemoBlock>

## v-model 控制显隐

通过 `v-model:visible` 双向绑定控制 Popover 的显示与隐藏。

<DemoBlock>

```vue
<template>
  <ZcSpace>
    <ZcPopover v-model:visible="visible" content="通过 v-model 控制">
      <ZcButton>{{ visible ? '点击关闭' : '点击打开' }}</ZcButton>
    </ZcPopover>
    <ZcButton type="primary" @click="visible = !visible">外部切换</ZcButton>
  </ZcSpace>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## Popover API

### Props

<ApiTable type="props" :data="[
  { name: 'title', description: '弹出框标题', type: 'string', default: `''` },
  { name: 'content', description: '弹出框内容文本', type: 'string', default: `''` },
  { name: 'visible', description: '是否显示 (v-model:visible)', type: 'boolean', default: 'false' },
  { name: 'placement', description: '弹出位置', type: `'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'`, default: `'bottom'` },
  { name: 'trigger', description: '触发方式', type: `'hover' | 'click' | 'focus' | 'contextmenu'`, default: `'click'` },
  { name: 'showDelay', description: '显示延迟（毫秒，仅 hover）', type: 'number', default: '100' },
  { name: 'hideDelay', description: '隐藏延迟（毫秒，仅 hover）', type: 'number', default: '100' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'showArrow', description: '是否显示箭头', type: 'boolean', default: 'true' },
  { name: 'popperClass', description: '自定义类名', type: 'string', default: `''` },
  { name: 'width', description: '弹出框宽度（px 或 CSS 字符串）', type: 'number | string', default: '-' },
  { name: 'minWidth', description: '弹出框最小宽度（px 或 CSS 字符串）', type: 'number | string', default: '-' },
  { name: 'transition', description: '过渡动画名称', type: 'string', default: `'zc-popover'` },
  { name: 'offset', description: '触发元素与弹出框之间的间距（px）', type: 'number', default: '8' },
  { name: 'hideAfterClickOutside', description: '点击外部是否自动关闭', type: 'boolean', default: 'true' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:visible', description: '显隐状态变化时触发' },
  { name: 'show', description: '显示时触发' },
  { name: 'hide', description: '隐藏时触发' },
  { name: 'after-enter', description: '显示动画结束后触发' },
  { name: 'after-leave', description: '隐藏动画结束后触发' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '触发元素' },
  { name: 'title', description: '标题内容' },
  { name: 'content', description: '弹出内容（支持任意 HTML/Vue 组件）' },
]" />

### Exposed Methods

<ApiTable type="methods" :data="[
  { name: 'show()', description: '手动显示弹出框' },
  { name: 'hide()', description: '手动隐藏弹出框' },
  { name: 'toggle()', description: '切换显示/隐藏' },
  { name: 'updatePosition()', description: '手动更新弹出框位置' },
]" />
