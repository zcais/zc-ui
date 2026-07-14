# Popconfirm 气泡确认框

点击元素弹出气泡确认框，常用于一些需要二次确认的危险操作。

## 基础用法

在需要二次确认的元素外包一层 `ZcPopconfirm` 即可。

<DemoBlock>

```vue
<template>
  <ZcPopconfirm title="确定删除吗？" @confirm="handleConfirm">
    <ZcButton type="danger">删除</ZcButton>
  </ZcPopconfirm>
</template>
<script setup>
const handleConfirm = () => {
  console.log('确认删除')
}
</script>
```

</DemoBlock>

## 危险操作

使用 `danger` 属性将确认按钮标红，强调操作的危险性。

<DemoBlock>

```vue
<template>
  <ZcPopconfirm
    title="确定要删除这条记录吗？此操作不可恢复。"
    description="删除后数据将永久丢失。"
    danger
    confirm-button-text="确定删除"
    @confirm="handleConfirm"
  >
    <ZcButton type="danger">危险操作</ZcButton>
  </ZcPopconfirm>
</template>
<script setup>
const handleConfirm = () => {
  console.log('确认删除')
}
</script>
```

</DemoBlock>

## 自定义内容

使用插槽自定义气泡内容，通过 `v-model:visible` 控制显隐。

<DemoBlock>

```vue
<template>
  <ZcPopconfirm
    title="自定义标题"
    description="这是一段描述信息"
    :visible="visible"
    @update:visible="visible = $event"
    @confirm="handleConfirm"
  >
    <ZcButton @click="visible = !visible">自定义触发</ZcButton>
  </ZcPopconfirm>
</template>
<script setup>
import { ref } from 'vue'
const visible = ref(false)
const handleConfirm = () => {
  console.log('确认')
  visible.value = false
}
</script>
```

</DemoBlock>

## Popconfirm API

### Props

<ApiTable type="props" :data="[
{ name: 'title', description: '确认框标题', type: 'string', default: `'Are you sure?'` },
{ name: 'description', description: '确认框描述', type: 'string', default: `''` },
{ name: 'confirmButtonText', description: '确认按钮文字', type: 'string', default: `'Confirm'` },
{ name: 'cancelButtonText', description: '取消按钮文字', type: 'string', default: `'Cancel'` },
{ name: 'confirmButtonType', description: '确认按钮类型', type: 'string', default: `'primary'` },
{ name: 'cancelButtonType', description: '取消按钮类型', type: 'string', default: `'default'` },
{ name: 'danger', description: '是否为危险操作', type: 'boolean', default: 'false' },
{ name: 'hideCancelButton', description: '是否隐藏取消按钮', type: 'boolean', default: 'false' },
{ name: 'hideConfirmButton', description: '是否隐藏确认按钮', type: 'boolean', default: 'false' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'placement', description: '弹出位置', type: `'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end'`, default: `'top'` },
{ name: 'trigger', description: '触发方式', type: `'hover' | 'click'`, default: `'click'` },
{ name: 'visible', description: '是否显示 (v-model:visible)', type: 'boolean', default: 'false' },
{ name: 'showArrow', description: '是否显示箭头', type: 'boolean', default: 'true' },
{ name: 'width', description: '弹出框宽度', type: 'number', default: '220' },
{ name: 'icon', description: '自定义图标类名', type: 'string', default: `''` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'confirm', description: '点击确认按钮时触发' },
  { name: 'cancel', description: '点击取消按钮时触发' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '触发元素' },
]" />
