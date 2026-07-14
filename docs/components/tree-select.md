# TreeSelect 树选择

在树形结构中选择一项或多项，常用于组织架构、地区选择等场景。

## 基础用法

通过 `data` 属性传入树形数据。

<DemoBlock>

```vue
<template>
  <ZcTreeSelect v-model="value" :data="treeData" placeholder="请选择" />
</template>
<script setup>
import { ref } from 'vue'

const value = ref(undefined)
const treeData = [
  {
    value: '1',
    label: '北京市',
    children: [
      { value: '1-1', label: '海淀区' },
      { value: '1-2', label: '朝阳区' },
    ],
  },
  {
    value: '2',
    label: '上海市',
    children: [
      { value: '2-1', label: '浦东新区' },
      { value: '2-2', label: '黄浦区' },
    ],
  },
]
</script>
```

</DemoBlock>

## 多选

设置 `multiple` 属性开启多选模式。

<DemoBlock>

```vue
<template>
  <ZcTreeSelect v-model="value" :data="treeData" multiple placeholder="多选模式" clearable />
</template>
<script setup>
import { ref } from 'vue'

const value = ref([])
const treeData = [
  {
    value: '1',
    label: '前端开发',
    children: [
      { value: '1-1', label: 'Vue' },
      { value: '1-2', label: 'React' },
    ],
  },
  {
    value: '2',
    label: '后端开发',
    children: [
      { value: '2-1', label: 'Java' },
      { value: '2-2', label: 'Go' },
    ],
  },
]
</script>
```

</DemoBlock>

## TreeSelect API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string | number | (string | number)[]', default: 'undefined' },
{ name: 'data', description: '树形数据', type: 'TreeSelectOption[]', default: '[]' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: `'请选择'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
{ name: 'multiple', description: '是否多选', type: 'boolean', default: 'false' },
{ name: 'filterable', description: '是否可搜索', type: 'boolean', default: 'false' },
{ name: 'checkStrictly', description: '父子节点不关联', type: 'boolean', default: 'false' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '值变化时触发', parameters: '(value)' },
  { name: 'node-click', description: '节点被点击时触发', parameters: '(option: TreeSelectOption)' },
  { name: 'expand', description: '展开/收起时触发', parameters: '()' },
]" />
