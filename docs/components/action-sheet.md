# ActionSheet 底部操作面板

底部弹出的操作菜单面板，常用于移动端提供多个操作选项。支持遮罩点击关闭、危险操作样式、标题描述和自定义内容。

## 基础用法

通过 `v-model:visible` 控制显隐，`actions` 属性传入操作列表。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">打开操作面板</ZcButton>

  <ZcActionSheet
    v-model:visible="visible"
    title="选择操作"
    :actions="actions"
    cancel-text="取消"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const actions = [
  { label: '收藏', key: 'favorite' },
  { label: '分享', key: 'share' },
  { label: '编辑', key: 'edit' },
]

function handleSelect(item) {
  console.log('选择了:', item.label)
}
</script>
```

</DemoBlock>

## 危险操作

设置 `color: 'danger'` 将操作项标记为危险操作（红色文字）。

<DemoBlock>

```vue
<template>
  <ZcButton type="danger" @click="visible = true">删除操作</ZcButton>

  <ZcActionSheet
    v-model:visible="visible"
    title="确认删除"
    description="删除后无法恢复，请谨慎操作"
    :actions="actions"
    cancel-text="取消"
    @select="handleSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const actions = [
  { label: '删除文件', key: 'delete', color: 'danger' },
  { label: '移动到回收站', key: 'trash', color: 'default' },
]

function handleSelect(item) {
  console.log('选择了:', item.label)
}
</script>
```

</DemoBlock>

## 带描述的操作项

通过 `description` 字段为每个操作项添加副标题。

<DemoBlock>

```vue
<template>
  <ZcButton @click="visible = true">分享到</ZcButton>

  <ZcActionSheet v-model:visible="visible" title="分享内容" :actions="actions" cancel-text="取消" />
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const actions = [
  { label: '微信', key: 'wechat', description: '分享给微信好友' },
  { label: '朋友圈', key: 'moments', description: '发布到朋友圈' },
  { label: '复制链接', key: 'copy', description: '复制链接到剪贴板' },
]
</script>
```

</DemoBlock>

## 禁用操作项

设置 `disabled: true` 禁用某项操作。

<DemoBlock>

```vue
<template>
  <ZcButton @click="visible = true">更多操作</ZcButton>

  <ZcActionSheet v-model:visible="visible" :actions="actions" cancel-text="取消" />
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)

const actions = [
  { label: '下载', key: 'download' },
  { label: 'VIP 专享', key: 'vip', disabled: true },
  { label: '举报', key: 'report', color: 'danger' },
]
</script>
```

</DemoBlock>

## 自定义内容

使用默认插槽完全自定义面板内容。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">自定义面板</ZcButton>

  <ZcActionSheet v-model:visible="visible" title="选择头像" cancel-text="关闭">
    <div style="padding: 20px; display: flex; justify-content: center; gap: 16px">
      <div
        v-for="i in 5"
        :key="i"
        :style="{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: colors[i - 1],
          cursor: 'pointer',
          border: selected === i ? '3px solid #409eff' : '3px solid transparent',
        }"
        @click="selected = i"
      />
    </div>
  </ZcActionSheet>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const selected = ref(null)
const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#9b59b6']
</script>
```

</DemoBlock>

## API

### ActionSheet Props

| 属性名             | 说明                     | 类型                | 默认值     |
| ------------------ | ------------------------ | ------------------- | ---------- |
| visible (v-model)  | 是否显示                 | `boolean`           | `false`    |
| actions            | 操作项列表               | `ActionSheetItem[]` | `[]`       |
| cancelText         | 取消按钮文字（空串隐藏） | `string`            | `'Cancel'` |
| title              | 标题                     | `string`            | `''`       |
| description        | 描述文字                 | `string`            | `''`       |
| closeOnClickMask   | 点击遮罩是否关闭         | `boolean`           | `true`     |
| closeOnClickAction | 点击操作项后是否关闭     | `boolean`           | `true`     |
| round              | 是否圆角                 | `boolean`           | `true`     |
| zIndex             | 层级                     | `number`            | `2000`     |
| lockScroll         | 是否锁定 body 滚动       | `boolean`           | `true`     |

### ActionSheetItem

| 属性名      | 说明         | 类型                                 | 默认值      |
| ----------- | ------------ | ------------------------------------ | ----------- |
| key         | 唯一标识     | `string \| number`                   | -           |
| label       | 显示文字     | `string`                             | -           |
| description | 副标题       | `string`                             | -           |
| color       | 文字颜色样式 | `'default' \| 'danger' \| 'primary'` | `'default'` |
| disabled    | 是否禁用     | `boolean`                            | `false`     |
| icon        | 图标         | `string`                             | -           |

### ActionSheet Events

| 事件名         | 说明               | 回调参数                                 |
| -------------- | ------------------ | ---------------------------------------- |
| update:visible | 显隐状态变化       | `(visible: boolean)`                     |
| select         | 选择操作项时触发   | `(item: ActionSheetItem, index: number)` |
| cancel         | 点击取消按钮时触发 | -                                        |
| close          | 面板关闭时触发     | -                                        |

### Slots

| 插槽名  | 说明           |
| ------- | -------------- |
| default | 自定义面板内容 |
| header  | 自定义头部区域 |
| footer  | 自定义底部区域 |
