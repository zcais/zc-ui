# TimePicker 时间选择器

用于选择或输入时间。

## 基础用法

通过 `v-model` 绑定时间值。

<DemoBlock>

```vue
<template>
  <ZcTimePicker v-model="value" placeholder="选择时间" />
</template>
<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

</DemoBlock>

## 固定时间范围

通过 `disabled-hours`、`disabled-minutes`、`disabled-seconds` 限制可选时间。

<DemoBlock>

```vue
<template>
  <ZcTimePicker v-model="value" :disabled-hours="disabledHours" placeholder="选择时间" />
</template>
<script setup>
import { ref } from 'vue'
const value = ref('')

const disabledHours = () => {
  return [0, 1, 2, 3, 4, 5, 6, 7, 22, 23]
}
</script>
```

</DemoBlock>

## 范围选择

设置 `is-range` 开启范围选择。

<DemoBlock>

```vue
<template>
  <ZcTimePicker v-model="value" is-range range-separator="至" />
</template>
<script setup>
import { ref } from 'vue'
const value = ref('')
</script>
```

</DemoBlock>

## TimePicker API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string', default: `''` },
{ name: 'placeholder', description: '占位文本', type: 'string', default: `'请选择时间'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
{ name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
{ name: 'format', description: '显示格式', type: 'string', default: `'HH:mm:ss'` },
{ name: 'valueFormat', description: '绑定值格式', type: 'string', default: `'HH:mm:ss'` },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'isRange', description: '是否为范围选择', type: 'boolean', default: 'false' },
{ name: 'startPlaceholder', description: '范围选择时起始占位文本', type: 'string', default: `'开始时间'` },
{ name: 'endPlaceholder', description: '范围选择时结束占位文本', type: 'string', default: `'结束时间'` },
{ name: 'rangeSeparator', description: '范围选择时的分隔符', type: 'string', default: `'至'` },
{ name: 'step', description: '时间步长', type: '{ hours?: number, minutes?: number, seconds?: number }', default: `''` },
{ name: 'disabledHours', description: '禁用的小时', type: '() => number[]', default: 'undefined' },
{ name: 'disabledMinutes', description: '禁用的分钟', type: '(hour: number) => number[]', default: 'undefined' },
{ name: 'disabledSeconds', description: '禁用的秒', type: '(hour: number, minute: number) => number[]', default: 'undefined' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '值变化时触发', parameters: '(value: string)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
]" />
