# ColorPicker 颜色选择器

用于选择颜色，支持 HEX、RGB、HSL 等多种格式。

## 基础用法

通过 `v-model` 绑定颜色值。

<DemoBlock>

```vue
<template>
  <ZcColorPicker v-model="color" />
  <p>当前颜色: {{ color }}</p>
</template>
<script setup>
import { ref } from 'vue'
const color = ref('#409eff')
</script>
```

</DemoBlock>

## 透明度

设置 `show-alpha` 属性可开启透明度选择。

<DemoBlock>

```vue
<template>
  <ZcColorPicker v-model="color" show-alpha />
</template>
<script setup>
import { ref } from 'vue'
const color = ref('rgba(64, 158, 255, 0.8)')
</script>
```

</DemoBlock>

## 预定义颜色

通过 `predefine` 属性传入预定义颜色列表。

<DemoBlock>

```vue
<template>
  <ZcColorPicker v-model="color" :predefine="predefineColors" />
</template>
<script setup>
import { ref } from 'vue'
const color = ref('#409eff')
const predefineColors = [
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  '#ff69b4',
]
</script>
```

</DemoBlock>

## ColorPicker API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string', default: `'#409eff'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'format', description: '颜色格式', type: `'hex' | 'rgb' | 'hsl'`, default: `'hex'` },
{ name: 'showAlpha', description: '是否支持透明度选择', type: 'boolean', default: 'false' },
{ name: 'predefine', description: '预定义颜色', type: 'string[]', default: '[]' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '确认颜色时触发', parameters: '(value: string)' },
  { name: 'active-change', description: '面板中颜色变化时触发', parameters: '(value: string)' },
]" />
