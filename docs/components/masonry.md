# Masonry 瀑布流

瀑布流布局组件，用于展示不等高的卡片/图片墙。支持 CSS columns 原生模式和 JS 均衡模式，并支持响应式断点自适应列数。

## 基础用法

通过默认插槽放入子元素，设置 `columns` 控制列数。

<DemoBlock>

```vue
<template>
  <ZcMasonry :columns="3" :gap="16">
    <div
      v-for="item in items"
      :key="item.id"
      :style="{
        background: item.color,
        height: `${item.height}px`,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 600,
      }"
    >
      {{ item.label }}
    </div>
  </ZcMasonry>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9b59b6']
const items = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i,
    label: `Item ${i + 1}`,
    height: 80 + Math.floor(Math.random() * 120),
    color: colors[i % colors.length],
  }))
)
</script>
```

</DemoBlock>

## JS 均衡模式

设置 `:use-columns="false"` 使用 JS 高度均衡模式，通过测量子元素高度将每项分配到最短列，获得更均衡的视觉效果。

<DemoBlock>

```vue
<template>
  <ZcMasonry :columns="3" :gap="16" :use-columns="false">
    <div
      v-for="item in items"
      :key="item.id"
      :style="{
        background: item.color,
        height: `${item.height}px`,
        borderRadius: '8px',
      }"
    />
  </ZcMasonry>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
const items = ref(
  Array.from({ length: 10 }, (_, i) => ({
    id: i,
    height: 60 + Math.floor(Math.random() * 140),
    color: colors[i % colors.length],
  }))
)
</script>
```

</DemoBlock>

## 响应式断点

通过 `breakpoints` 设置容器宽度与列数的映射关系，实现自适应布局。

<DemoBlock>

```vue
<template>
  <p style="margin-bottom: 12px; color: #909399">调整浏览器窗口宽度查看列数变化</p>
  <ZcMasonry :gap="12" :breakpoints="{ 768: 2, 1200: 3, 1600: 4 }">
    <div
      v-for="item in items"
      :key="item.id"
      :style="{
        background: item.color,
        height: '100px',
        borderRadius: '6px',
      }"
    />
  </ZcMasonry>
</template>

<script setup>
import { ref } from 'vue'

const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
const items = ref(
  Array.from({ length: 8 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
  }))
)
</script>
```

</DemoBlock>

## API

### Masonry Props

| 属性名      | 说明                                              | 类型                     | 默认值  |
| ----------- | ------------------------------------------------- | ------------------------ | ------- |
| columns     | 列数                                              | `number`                 | `3`     |
| gap         | 项间距（数值为 px，也可传 CSS 字符串如 `'1rem'`） | `number \| string`       | `16`    |
| useColumns  | 是否使用 CSS columns 模式（`false` 为 JS 均衡）   | `boolean`                | `true`  |
| breakpoints | 响应式断点：key 为最小宽度(px)，value 为列数      | `Record<number, number>` | -       |
| as          | 容器 HTML 标签                                    | `string`                 | `'div'` |

### Masonry Events

| 事件名     | 说明           | 回调参数                       |
| ---------- | -------------- | ------------------------------ |
| item-click | 点击某项时触发 | `(item: VNode, index: number)` |

### Masonry Methods

通过 ref 调用。

| 方法名   | 说明                                   | 参数 |
| -------- | -------------------------------------- | ---- |
| relayout | 手动触发重新布局（异步内容加载后使用） | -    |

### Slots

| 插槽名  | 说明         |
| ------- | ------------ |
| default | 瀑布流子元素 |
