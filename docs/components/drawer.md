# Drawer 抽屉

从屏幕边缘滑出的浮层面板，用于展示详细内容或进行表单操作。

## 基础用法

通过 `v-model` 控制显示与隐藏。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">打开抽屉</ZcButton>
  <ZcDrawer v-model="visible" title="基础用法">
    <p>这是一段抽屉内容。</p>
  </ZcDrawer>
</template>
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## 不同方向

通过 `direction` 属性设置抽屉的弹出方向。

<DemoBlock>

```vue
<template>
  <ZcButton @click="open('rtl')">从右往左</ZcButton>
  <ZcButton @click="open('ltr')">从左往右</ZcButton>
  <ZcButton @click="open('ttb')">从上往下</ZcButton>
  <ZcButton @click="open('btt')">从下往上</ZcButton>
  <ZcDrawer v-model="visible" :title="title + '抽屉'" :direction="direction">
    <p>方向: {{ direction }}</p>
  </ZcDrawer>
</template>
<script setup>
import { ref } from 'vue'
const visible = ref(false)
const direction = ref('rtl')
const title = ref('从右往左')

function open(dir) {
  direction.value = dir
  const titles = { rtl: '从右往左', ltr: '从左往右', ttb: '从上往下', btt: '从下往上' }
  title.value = titles[dir]
  visible.value = true
}
</script>
```

</DemoBlock>

## 自定义底部

通过 `footer` 插槽添加底部操作区。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">带底部操作</ZcButton>
  <ZcDrawer v-model="visible" title="自定义底部">
    <p>这里是抽屉内容区域。</p>
    <template #footer>
      <ZcButton @click="visible = false">取消</ZcButton>
      <ZcButton type="primary">确定</ZcButton>
    </template>
  </ZcDrawer>
</template>
<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## Drawer API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '是否显示 Drawer (v-model)', type: 'boolean', default: 'false' },
{ name: 'title', description: 'Drawer 标题', type: 'string', default: `''` },
{ name: 'direction', description: 'Drawer 打开方向', type: `'rtl' | 'ltr' | 'ttb' | 'btt'`, default: `'rtl'` },
{ name: 'size', description: 'Drawer 尺寸（宽度或高度）', type: 'string | number', default: `'30%'` },
{ name: 'showClose', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
{ name: 'closeOnClickOverlay', description: '是否可以通过点击遮罩关闭', type: 'boolean', default: 'true' },
{ name: 'closeOnEsc', description: '是否可以通过按下 ESC 关闭', type: 'boolean', default: 'true' },
{ name: 'lockScroll', description: '是否在 Drawer 打开时锁定 body 滚动', type: 'boolean', default: 'true' },
{ name: 'resizable', description: '是否可以拖拽调整大小', type: 'boolean', default: 'false' },
{ name: 'minSize', description: '拖拽调整时的最小尺寸(px)', type: 'number', default: '200' },
{ name: 'maxSize', description: '拖拽调整时的最大尺寸(px)', type: 'number', default: '800' },
{ name: 'drawerClass', description: 'Drawer 的自定义类名', type: 'string', default: `''` },
{ name: 'withFooter', description: '是否显示底部', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'open', description: 'Drawer 打开时触发' },
  { name: 'close', description: 'Drawer 关闭时触发' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: 'Drawer 的内容' },
  { name: 'title', description: 'Drawer 标题区的自定义内容' },
  { name: 'footer', description: 'Drawer 底部区域' },
]" />
