# Slider 滑块

通过拖动滑块在一个固定区间内进行选择。

## 基础用法

通过 `v-model` 绑定当前值。

<DemoBlock>

```vue
<template>
  <ZcSlider v-model="value" />
  <ZcSlider v-model="value" show-input />
</template>
<script setup>
import { ref } from 'vue'
const value = ref(30)
</script>
```

</DemoBlock>

## 范围选择

设置 `range` 属性开启范围选择，此时 `v-model` 绑定一个数组。

<DemoBlock>

```vue
<template>
  <ZcSlider v-model="value" range :max="100" />
</template>
<script setup>
import { ref } from 'vue'
const value = ref([20, 60])
</script>
```

</DemoBlock>

## 离散值与刻度

通过 `step` 设置步长，`marks` 设置刻度标签。

<DemoBlock>

```vue
<template>
  <ZcSlider v-model="value1" :step="10" show-stops />
  <ZcSlider
    v-model="value2"
    :marks="{ 0: '0°C', 25: '25°C', 50: '50°C', 75: '75°C', 100: '100°C' }"
  />
</template>
<script setup>
import { ref } from 'vue'
const value1 = ref(30)
const value2 = ref(40)
</script>
```

</DemoBlock>

## Slider API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'number | [number, number]', default: '0' },
{ name: 'min', description: '最小值', type: 'number', default: '0' },
{ name: 'max', description: '最大值', type: 'number', default: '100' },
{ name: 'step', description: '步长', type: 'number', default: '1' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'vertical', description: '是否竖向', type: 'boolean', default: 'false' },
{ name: 'showTooltip', description: '是否显示 tooltip', type: 'boolean', default: 'true' },
{ name: 'range', description: '是否范围选择', type: 'boolean', default: 'false' },
{ name: 'marks', description: '刻度标签', type: 'SliderMark[]', default: '[]' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'showInput', description: '是否显示输入框', type: 'boolean', default: 'false' },
{ name: 'tooltipClass', description: 'tooltip 自定义类名', type: 'string', default: `''` },
{ name: 'height', description: '竖向模式高度', type: 'string', default: `''` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '值改变时触发（拖动结束）', parameters: '(value, oldValue)' },
  { name: 'input', description: '数据改变时触发（拖动过程中）', parameters: '(value)' },
]" />
