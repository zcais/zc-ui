# Badge 徽标

用于在图标或文字右上角显示消息数量或状态标记。

## 基础用法

通过 `value` 属性设置徽标显示的数字或文本。

<DemoBlock>

```vue
<template>
  <ZcBadge :value="12">
    <span
      style="padding: 0 12px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; display: inline-block;"
      >消息中心</span
    >
  </ZcBadge>
  <ZcBadge :value="3">
    <span
      style="padding: 0 12px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; display: inline-block;"
      >待办事项</span
    >
  </ZcBadge>
</template>
```

</DemoBlock>

## 最大值

通过 `max` 属性设置最大值，超出显示为 `max+`。

<DemoBlock>

```vue
<template>
  <ZcBadge :value="200" :max="99">
    <span
      style="padding: 0 12px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; display: inline-block;"
      >评论</span
    >
  </ZcBadge>
  <ZcBadge :value="1000" :max="999">
    <span
      style="padding: 0 12px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; display: inline-block;"
      >点赞</span
    >
  </ZcBadge>
</template>
```

</DemoBlock>

## 类型与圆点

通过 `type` 设置徽标颜色，`isDot` 显示为小圆点模式。

<DemoBlock>

```vue
<template>
  <ZcBadge :value="5" type="primary">主要</ZcBadge>
  <ZcBadge :value="5" type="success">成功</ZcBadge>
  <ZcBadge :value="5" type="warning">警告</ZcBadge>
  <ZcBadge :value="5" type="danger">危险</ZcBadge>
  <ZcBadge :value="5" type="info">信息</ZcBadge>
  <ZcBadge is-dot type="danger">消息提醒</ZcBadge>
</template>
```

</DemoBlock>

## 隐藏徽标

通过 `hidden` 属性控制徽标是否隐藏。

<DemoBlock>

```vue
<template>
  <ZcBadge :value="5" :hidden="hidden">
    <span
      style="padding: 0 12px; line-height: 36px; border: 1px solid #dcdfe6; border-radius: 4px; display: inline-block;"
      >通知</span
    >
  </ZcBadge>
  <button @click="hidden = !hidden">{{ hidden ? '显示' : '隐藏' }}徽标</button>
</template>

<script setup>
import { ref } from 'vue'
const hidden = ref(false)
</script>
```

</DemoBlock>

## Badge API

### Props

<ApiTable type="props" :data="[
  { name: 'value', description: '显示值（数字或文本）', type: 'string | number', default: '' },
  { name: 'max', description: '最大值，超出显示为 max+', type: 'number', default: '99' },
  { name: 'type', description: '徽标类型', type: 'primary | success | warning | danger | info', default: 'danger' },
  { name: 'hidden', description: '是否隐藏徽标', type: 'boolean', default: 'false' },
  { name: 'isDot', description: '是否显示为小圆点', type: 'boolean', default: 'false' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '被标记的内容（如按钮、图标等）' }
]" />
