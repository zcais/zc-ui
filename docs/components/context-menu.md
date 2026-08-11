# ContextMenu 上下文菜单

右键上下文菜单组件，支持自定义菜单项、分隔线、禁用状态、危险操作样式。

## 基础用法

通过 `items` 属性设置菜单项，使用 `visible` 和 `x`/`y` 控制显示位置。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const x = ref(0)
const y = ref(0)

const items = [
  { key: 'copy', label: '复制' },
  { key: 'paste', label: '粘贴' },
  { key: 'delete', label: '删除', disabled: true, danger: true },
]

function onContextMenu(e) {
  e.preventDefault()
  x.value = e.clientX
  y.value = e.clientY
  visible.value = true
}

function onSelect(item) {
  console.log('选中:', item)
}
</script>

<template>
  <div
    @contextmenu="onContextMenu"
    style="padding: 40px; border: 1px dashed #ccc; text-align: center; border-radius: 4px;"
  >
    右键点击此区域打开菜单
  </div>
  <ZcContextMenu v-model:visible="visible" :items="items" :x="x" :y="y" @select="onSelect" />
</template>
```

</DemoBlock>

## 分隔线与图标

通过 `divided` 属性在菜单项上方添加分隔线，`icon` 属性设置图标。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const x = ref(0)
const y = ref(0)

const items = [
  { key: 'edit', label: '编辑', icon: 'edit' },
  { key: 'share', label: '分享', icon: 'share' },
  { key: 'export', label: '导出', divided: true },
  { key: 'delete', label: '删除', danger: true },
]

function onContextMenu(e) {
  e.preventDefault()
  x.value = e.clientX
  y.value = e.clientY
  visible.value = true
}
</script>

<template>
  <div
    @contextmenu="onContextMenu"
    style="padding: 40px; border: 1px dashed #ccc; text-align: center; border-radius: 4px;"
  >
    右键打开带分隔线的菜单
  </div>
  <ZcContextMenu v-model:visible="visible" :items="items" :x="x" :y="y" />
</template>
```

</DemoBlock>

## 属性

| 属性     | 说明                | 类型                | 默认值  |
| -------- | ------------------- | ------------------- | ------- |
| items    | 菜单项列表          | `ContextMenuItem[]` | `[]`    |
| visible  | 是否显示（v-model） | `boolean`           | `false` |
| x        | X 坐标              | `number`            | `0`     |
| y        | Y 坐标              | `number`            | `0`     |
| minWidth | 最小宽度            | `number`            | `160`   |
| maxWidth | 最大宽度            | `number`            | `300`   |

## ContextMenuItem

| 属性     | 说明           | 类型      | 默认值  |
| -------- | -------------- | --------- | ------- |
| key      | 唯一标识       | `string`  | —       |
| label    | 显示文本       | `string`  | —       |
| icon     | 图标类名       | `string`  | —       |
| disabled | 是否禁用       | `boolean` | `false` |
| divided  | 是否显示分隔线 | `boolean` | `false` |
| danger   | 是否为危险操作 | `boolean` | `false` |

## 事件

| 事件名         | 说明             | 回调参数                  |
| -------------- | ---------------- | ------------------------- |
| select         | 选择菜单项时触发 | `(item: ContextMenuItem)` |
| update:visible | 显示状态变化     | `(val: boolean)`          |
