# ImageViewer 图片预览

全屏图片预览组件，支持缩放、旋转、拖拽、多图切换。

## 基础用法

通过 `urlList` 设置图片列表，`visible` 控制显示隐藏。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const urlList = [
  'https://picsum.photos/800/600?random=1',
  'https://picsum.photos/800/600?random=2',
  'https://picsum.photos/800/600?random=3',
]
</script>

<template>
  <ZcButton @click="visible = true">打开图片预览</ZcButton>
  <ZcImageViewer v-model:visible="visible" :url-list="urlList" />
</template>
```

</DemoBlock>

## 指定初始索引

通过 `modelValue` 设置初始展示的图片索引。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const visible = ref(false)
const urlList = ['https://picsum.photos/800/600?random=4', 'https://picsum.photos/800/600?random=5']
const initialIndex = ref(1)
</script>

<template>
  <ZcButton @click="visible = true">从第二张开始预览</ZcButton>
  <ZcImageViewer v-model:visible="visible" v-model="initialIndex" :url-list="urlList" />
</template>
```

</DemoBlock>

## 属性

| 属性       | 说明                        | 类型       | 默认值  |
| ---------- | --------------------------- | ---------- | ------- |
| urlList    | 图片 URL 列表               | `string[]` | `[]`    |
| modelValue | 当前图片索引（v-model）     | `number`   | `0`     |
| visible    | 是否可见（v-model:visible） | `boolean`  | `false` |
| showClose  | 是否显示关闭按钮            | `boolean`  | `true`  |
| infinite   | 是否无限循环                | `boolean`  | `true`  |
| zoomRate   | 缩放速率                    | `number`   | `0.2`   |
| minScale   | 最小缩放比例                | `number`   | `0.2`   |
| maxScale   | 最大缩放比例                | `number`   | `7`     |
| zIndex     | 层级                        | `number`   | —       |

## 事件

| 事件名            | 说明           | 回调参数          |
| ----------------- | -------------- | ----------------- |
| update:modelValue | 索引变化       | `(index: number)` |
| update:visible    | 可见状态变化   | `(val: boolean)`  |
| switch            | 切换图片时触发 | `(index: number)` |
| close             | 关闭时触发     | —                 |

## 暴露方法

| 方法名               | 说明             |
| -------------------- | ---------------- |
| next()               | 切换到下一张     |
| prev()               | 切换到上一张     |
| setActiveItem(index) | 设置当前图片索引 |
