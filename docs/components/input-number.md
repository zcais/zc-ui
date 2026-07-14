# InputNumber 计数器

仅允许输入标准的数字值，可定义范围。

## 基础用法

要使用它，只需要在 `ZcInputNumber` 元素中使用 `v-model` 绑定变量即可。

<DemoBlock>

```vue
<template>
  <ZcInputNumber v-model="num" :min="1" :max="10" />
</template>
<script setup>
import { ref } from 'vue'
const num = ref(1)
</script>
```

</DemoBlock>

## 禁用状态与步长

通过 `disabled` 设置禁用，`step` 设置步长。

<DemoBlock>

```vue
<template>
  <ZcInputNumber v-model="num1" :step="2" />
  <ZcInputNumber v-model="num2" disabled />
</template>
<script setup>
import { ref } from 'vue'
const num1 = ref(5)
const num2 = ref(1)
</script>
```

</DemoBlock>

## 精度与按钮位置

通过 `precision` 设置精度，`controls-position` 改变控制按钮位置。

<DemoBlock>

```vue
<template>
  <ZcInputNumber v-model="num1" :precision="2" :step="0.1" :max="10" />
  <ZcInputNumber v-model="num2" controls-position="right" />
</template>
<script setup>
import { ref } from 'vue'
const num1 = ref(1.5)
const num2 = ref(1)
</script>
```

</DemoBlock>

## InputNumber API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'number | undefined', default: 'undefined' },
{ name: 'min', description: '设置计数器允许的最小值', type: 'number', default: '-Infinity' },
{ name: 'max', description: '设置计数器允许的最大值', type: 'number', default: 'Infinity' },
{ name: 'step', description: '计数器步长', type: 'number', default: '1' },
{ name: 'stepStrictly', description: '是否只能输入 step 的倍数', type: 'boolean', default: 'false' },
{ name: 'precision', description: '数值精度', type: 'number', default: 'undefined' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'controls', description: '是否使用控制按钮', type: 'boolean', default: 'true' },
{ name: 'controlsPosition', description: '控制按钮位置', type: `'' | 'right'`, default: `''` },
{ name: 'size', description: '计数器尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'placeholder', description: '输入框占位文本', type: 'string', default: `''` },
{ name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '绑定值被改变时触发', parameters: '(currentValue, oldValue)' },
  { name: 'input', description: '输入时触发', parameters: '(value)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
]" />

### Expose

<ApiTable type="methods" :data="[
  { name: 'focus', description: '使 input 获取焦点' },
  { name: 'blur', description: '使 input 失去焦点' },
  { name: 'increase', description: '增加数值' },
  { name: 'decrease', description: '减少数值' },
]" />
