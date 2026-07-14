# Transfer 穿梭框

用于在两栏之间移动元素，完成选择操作。

## 基础用法

通过 `data` 属性传入数据源，`v-model` 绑定已选中的值。

<DemoBlock>

```vue
<template>
  <ZcTransfer v-model="value" :data="transferData" />
</template>
<script setup>
import { ref } from 'vue'

const value = ref([])
const generateData = () => {
  const data = []
  for (let i = 1; i <= 15; i++) {
    data.push({
      key: i,
      label: `选项 ${i}`,
    })
  }
  return data
}
const transferData = generateData()
</script>
```

</DemoBlock>

## 可搜索

设置 `filterable` 属性可开启搜索过滤功能。

<DemoBlock>

```vue
<template>
  <ZcTransfer v-model="value" :data="transferData" filterable filter-placeholder="请输入搜索内容" />
</template>
<script setup>
import { ref } from 'vue'

const value = ref([1, 4])
const transferData = Array.from({ length: 15 }).map((_, i) => ({
  key: i + 1,
  label: `选项 ${i + 1}`,
}))
</script>
```

</DemoBlock>

## Transfer API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值 (v-model)', type: '(string | number)[]', default: '[]' },
{ name: 'data', description: '数据源', type: 'TransferOption[]', default: '[]' },
{ name: 'titles', description: '自定义列表标题', type: 'string[]', default: `['列表 1', '列表 2']` },
{ name: 'filterable', description: '是否可搜索', type: 'boolean', default: 'false' },
{ name: 'filterPlaceholder', description: '搜索框占位文本', type: 'string', default: `'请输入搜索内容'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '右侧列表元素变化时触发', parameters: '(value: (string | number)[])' },
  { name: 'left-check-change', description: '左侧列表元素被选中时触发', parameters: '(checked: (string | number)[])' },
  { name: 'right-check-change', description: '右侧列表元素被选中时触发', parameters: '(checked: (string | number)[])' },
]" />
