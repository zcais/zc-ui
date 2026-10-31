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

<ApiTable type="props" :data="[
{ name: 'urlList', description: '图片 URL 列表', type: 'string[]', default: '[]' },
{ name: 'modelValue', description: '当前图片索引（v-model）', type: 'number', default: '0' },
{ name: 'visible', description: '是否可见（v-model:visible）', type: 'boolean', default: 'false' },
{ name: 'showClose', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
{ name: 'infinite', description: '是否无限循环', type: 'boolean', default: 'true' },
{ name: 'zoomRate', description: '缩放速率', type: 'number', default: '0.2' },
{ name: 'minScale', description: '最小缩放比例', type: 'number', default: '0.2' },
{ name: 'maxScale', description: '最大缩放比例', type: 'number', default: '7' },
{ name: 'zIndex', description: '层级', type: 'number', default: '—' }
]" />

## 事件

<ApiTable type="events" :data="[
{ name: '(index: number)', description: '索引变化' },
{ name: '(val: boolean)', description: '可见状态变化' },
{ name: '(index: number)', description: '切换图片时触发' },
{ name: '—', description: '关闭时触发' }
]" />

## 暴露方法

<ApiTable type="methods" :data="[
{ name: 'next()', description: '切换到下一张' },
{ name: 'prev()', description: '切换到上一张' },
{ name: 'setActiveItem(index)', description: '设置当前图片索引' }
]" />
