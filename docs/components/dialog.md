# Dialog 对话框

在保留当前页面状态的情况下，弹出一个模态对话框，告知用户信息或进行交互操作。

## 基础用法

通过 `v-model` 控制对话框的显示与隐藏。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="dialogVisible = true">打开对话框</ZcButton>
  <ZcDialog v-model="dialogVisible" title="提示">
    <p>这是一段对话框内容</p>
  </ZcDialog>
</template>

<script setup>
import { ref } from 'vue'
const dialogVisible = ref(false)
</script>
```

</DemoBlock>

## 尺寸预设

通过 `size` 属性快速设置对话框宽度，支持 `small`、`medium`、`large`、`full` 四种尺寸。

<DemoBlock>

```vue
<template>
  <ZcButton @click="openDialog('small')">小尺寸</ZcButton>
    <ZcButton @click="openDialog('medium')">中等尺寸</ZcButton>
      <ZcButton @click="openDialog('large')">大尺寸</ZcButton>
      <ZcButton @click="openDialog('full')">全屏</ZcButton>
    <ZcDialog v-model="visible" :size="size" title="对话框尺寸">
    <p>当前尺寸：{{ size }}</p>
  </ZcDialog>
  </template>
    
      <script setup>
      import { ref } from 'vue'
    const visible = ref(false)
    const size = ref('medium')
  
  function openDialog(s) {
    size.value = s
      visible.value = true
      }
    </script>
    ```
</DemoBlock>

## 自定义宽度

通过 `width` 属性自定义对话框宽度，支持 CSS 字符串或数字（px）。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">600px宽度</ZcButton>
  <ZcDialog v-model="visible" title="自定义宽度" :width="600">
    <p>对话框宽度为 600px</p>
  </ZcDialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## 拖拽与全屏

通过 `draggable` 启用拖拽，`fullscreen` 显示全屏切换按钮。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">可拖拽对话框</ZcButton>
  <ZcDialog v-model="visible" title="拖拽标题栏" draggable fullscreen>
    <p>按住标题栏拖动，或点击全屏按钮。</p>
  </ZcDialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## 关闭行为

通过 `show-close`、`close-on-click-overlay`、`close-on-esc` 控制关闭方式。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="visible = true">打开对话框</ZcButton>
  <ZcDialog v-model="visible" title="关闭设置" :show-close="false" :close-on-click-overlay="false">
    <p>关闭了右上角关闭按钮和点击遮罩层关闭，请使用底部按钮。</p>
    <template #footer>
      <ZcButton @click="visible = false">关闭</ZcButton>
    </template>
  </ZcDialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

</DemoBlock>

## Dialog API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '对话框是否显示（v-model）', type: 'boolean', default: 'false' },
  { name: 'title', description: '对话框标题', type: 'string', default: '' },
  { name: 'width', description: '对话框宽度（CSS 值或 px 数字）', type: 'string | number', default: '—' },
  { name: 'size', description: '尺寸预设', type: 'small | medium | large | full', default: 'medium' },
  { name: 'fullscreen', description: '是否显示全屏切换按钮', type: 'boolean', default: 'false' },
  { name: 'draggable', description: '是否可拖拽', type: 'boolean', default: 'false' },
  { name: 'show-close', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
  { name: 'center', description: '是否居中布局', type: 'boolean', default: 'false' },
  { name: 'close-on-click-overlay', description: '点击遮罩层是否关闭', type: 'boolean', default: 'true' },
  { name: 'close-on-esc', description: '按下 Escape 是否关闭', type: 'boolean', default: 'true' },
  { name: 'lock-scroll', description: '打开时是否锁定 body 滚动', type: 'boolean', default: 'true' },
  { name: 'overlay-class', description: '遮罩层自定义类名', type: 'string', default: '' },
  { name: 'dialog-class', description: '对话框自定义类名', type: 'string', default: '' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '对话框显示状态变化时触发', parameters: '(visible: boolean)' },
  { name: 'open', description: '对话框打开时触发', parameters: '—' },
  { name: 'close', description: '对话框关闭时触发', parameters: '—' },
  { name: 'closed', description: '对话框关闭动画完成后触发', parameters: '—' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '对话框主体内容' },
  { name: 'title', description: '自定义标题内容' },
  { name: 'footer', description: '对话框底部操作区' }
]" />

## 注意事项

- **SSR 兼容性**：Dialog 使用 `Teleport` 将内容挂载到 `document.body`，在 SSR 环境中需确保仅在客户端渲染。
- **滚动锁定**：默认锁定 body 滚动（`lock-scroll: true`），关闭后自动恢复。如需保留背景滚动，设置 `lock-scroll: false`。
- **z-index 管理**：Dialog 使用全局 z-index 管理器自动递增，确保后打开的 Dialog 始终覆盖在先打开的之上。
- **拖拽限制**：启用 `draggable` 后仅可通过 header 区域拖拽。全屏模式下拖拽会被禁用。
- **无障碍**：建议为 Dialog 添加语义化的 `title` 属性，以便屏幕阅读器正确识别对话框标题。
