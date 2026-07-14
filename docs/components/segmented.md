# Segmented 分段控制器

分段控制器是一种类似 iOS 风格的选项切换组件，用于在多个互斥选项之间快速切换。

## 基础用法

使用 `v-model` 绑定当前选中值，通过 `options` 配置选项。

<DemoBlock>

```vue
<template>
  <ZcSegmented v-model="value" :options="options" />
  <p style="margin-top: 12px">当前值：{{ value }}</p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('daily')
const options = [
  { label: '每日', value: 'daily' },
  { label: '每周', value: 'weekly' },
  { label: '每月', value: 'monthly' },
]
</script>
```

</DemoBlock>

## 简写字符串选项

当选项的 label 和 value 相同时，可以直接使用字符串数组。

<DemoBlock>

```vue
<template>
  <ZcSegmented v-model="value" :options="['列表', '卡片', '表格']" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('列表')
</script>
```

</DemoBlock>

## 禁用状态

支持整体禁用和单项禁用。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <ZcSegmented v-model="value1" disabled :options="['A', 'B', 'C']" />
    <ZcSegmented v-model="value2" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref('A')
const value2 = ref('list')
const options = [
  { label: '列表', value: 'list' },
  { label: '卡片（禁用）', value: 'card', disabled: true },
  { label: '表格', value: 'table' },
]
</script>
```

</DemoBlock>

## 尺寸

提供 `large`、`default`、`small` 三种尺寸。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px">
    <ZcSegmented v-model="value" size="large" :options="['大', '中', '小']" />
    <ZcSegmented v-model="value" size="default" :options="['大', '中', '小']" />
    <ZcSegmented v-model="value" size="small" :options="['大', '中', '小']" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('中')
</script>
```

</DemoBlock>

## Block 撑满模式

设置 `block` 属性使组件撑满父容器宽度，每个选项等宽分布。

<DemoBlock>

```vue
<template>
  <ZcSegmented v-model="value" block :options="['选项一', '选项二', '选项三']" />
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('选项一')
</script>
```

</DemoBlock>

## 自定义内容

通过 `item-{value}` 具名插槽自定义单个选项的内容。

<DemoBlock>

```vue
<template>
  <ZcSegmented v-model="value" :options="options">
    <template #item-list="{ selected }">
      <span :style="{ fontWeight: selected ? 'bold' : 'normal' }">📋 列表</span>
    </template>
    <template #item-grid="{ selected }">
      <span :style="{ fontWeight: selected ? 'bold' : 'normal' }">🔲 网格</span>
    </template>
  </ZcSegmented>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('list')
const options = [
  { label: '列表', value: 'list' },
  { label: '网格', value: 'grid' },
]
</script>
```

</DemoBlock>

## change 事件

监听 `change` 事件获取变化后的值。

<DemoBlock>

```vue
<template>
  <ZcSegmented v-model="value" :options="options" @change="onChange" />
  <p v-if="lastChange" style="margin-top: 12px; color: #909399">
    切换至：{{ lastChange }}
  </p>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref('A')
const lastChange = ref('')
const options = ['A', 'B', 'C']

function onChange(val: string | number | boolean) {
  lastChange.value = String(val)
}
</script>
```

</DemoBlock>

## Segmented API

### Segmented Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值，当前选中项的 value', type: 'string | number | boolean', default: '—' },
  { name: 'options', description: '选项配置数组，支持字符串/数字简写或对象形式', type: 'Array<string | number | SegmentedOption>', default: '[]' },
  { name: 'size', description: '尺寸', type: 'large | default | small', default: 'default' },
  { name: 'block', description: '是否撑满父容器宽度', type: 'boolean', default: 'false' },
  { name: 'disabled', description: '是否整体禁用', type: 'boolean', default: 'false' },
  { name: 'name', description: '原生 name 属性，用于表单提交', type: 'string', default: '—' }
]" />

### SegmentedOption

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 选项显示文本 | `string` | — |
| value | 选项值 | `string \| number \| boolean` | — |
| disabled | 是否禁用该项 | `boolean` | `false` |
| payload | 自定义附加数据 | `any` | — |

### Segmented Events

<ApiTable
  type="events"
  :data="[
    {
      name: 'update:modelValue',
      description: '选中值变化时触发',
      parameters: '(value: string | number | boolean)'
    },
    {
      name: 'change',
      description: '选中值变化时触发',
      parameters: '(value: string | number | boolean)'
    }
  ]"
/>

### Segmented Slots

| 插槽名 | 说明 | 参数 |
| --- | --- | --- |
| item-{value} | 自定义某个选项的内容（`{value}` 替换为选项的 value） | `{ option: SegmentedOption, selected: boolean }` |

### Segmented Keyboard

| 按键 | 说明 |
| --- | --- |
| `Tab` | 聚焦到当前选中项 |
| `←` `↑` | 切换到上一个可用选项 |
| `→` `↓` | 切换到下一个可用选项 |
| `Home` | 跳转到第一个可用选项 |
| `End` | 跳转到最后一个可用选项 |
| `Space` / `Enter` | 选中当前聚焦的选项 |
