# Tag 标签

用于标记和分类的标签组件，支持多种类型、主题和可关闭功能。

## 基础用法

通过 `type` 属性设置标签类型。

<DemoBlock>

```vue
<template>
  <ZcTag>默认标签</ZcTag>
  <ZcTag type="primary">主要标签</ZcTag>
  <ZcTag type="success">成功标签</ZcTag>
  <ZcTag type="warning">警告标签</ZcTag>
  <ZcTag type="danger">危险标签</ZcTag>
  <ZcTag type="info">信息标签</ZcTag>
</template>
```

</DemoBlock>

## 主题效果

通过 `effect` 属性设置标签主题，支持 `light`、`dark` 和 `plain`。

<DemoBlock>

```vue
<template>
  <ZcTag type="primary">浅色主题</ZcTag>
  <ZcTag type="primary" effect="dark">深色主题</ZcTag>
  <ZcTag type="primary" effect="plain">朴素主题</ZcTag>
</template>
```

</DemoBlock>

## 可关闭与圆角

通过 `closable` 属性显示关闭按钮，`round` 属性设置圆角样式。

<DemoBlock>

```vue
<template>
  <ZcTag type="primary" closable @close="handleClose">可关闭标签</ZcTag>
  <ZcTag type="success" round>圆角标签</ZcTag>
  <ZcTag type="warning" round closable>圆角可关闭</ZcTag>
</template>

<script setup>
function handleClose(event) {
  console.log('关闭事件', event)
}
</script>
```

</DemoBlock>

## Tag API

### Props

<ApiTable type="props" :data="[
  { name: 'type', description: '标签类型', type: 'primary | success | warning | danger | info', default: 'info' },
  { name: 'effect', description: '主题效果', type: 'dark | light | plain', default: 'light' },
  { name: 'closable', description: '是否显示关闭按钮', type: 'boolean', default: 'false' },
  { name: 'round', description: '是否为圆角标签', type: 'boolean', default: 'false' },
  { name: 'hit', description: '是否有边框高亮', type: 'boolean', default: 'false' },
  { name: 'disableTransitions', description: '是否禁用过渡动画', type: 'boolean', default: 'false' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'close', description: '点击关闭按钮时触发', parameters: '(event: MouseEvent)' },
  { name: 'click', description: '点击标签时触发', parameters: '(event: MouseEvent)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '标签内容' }
]" />
