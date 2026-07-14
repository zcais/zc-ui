# Cascader 级联选择器

用于从多级数据中选择其中一项，适用于省市区、组织架构等场景。

## 基础用法

通过 `options` 属性传入级联数据。

<DemoBlock>

```vue
<template>
  <ZcCascader v-model="value" :options="options" placeholder="请选择" />
</template>
<script setup>
import { ref } from 'vue'

const value = ref([])
const options = [
  {
    value: 'guide',
    label: '开发指南',
    children: [
      { value: 'discipline', label: '开发规范' },
      { value: 'navigation', label: '导航' },
    ],
  },
  {
    value: 'component',
    label: '组件',
    children: [
      {
        value: 'basic',
        label: 'Basic',
        children: [
          { value: 'button', label: 'Button' },
          { value: 'icon', label: 'Icon' },
        ],
      },
    ],
  },
]
</script>
```

</DemoBlock>

## 可搜索

设置 `filterable` 属性可开启搜索功能。

<DemoBlock>

```vue
<template>
  <ZcCascader v-model="value" :options="options" filterable placeholder="可搜索" />
</template>
```

</DemoBlock>

## 多选

设置 `multiple` 属性可开启多选模式。

<DemoBlock>

```vue
<template>
  <ZcCascader v-model="value" :options="options" multiple placeholder="多选模式" />
</template>
```

</DemoBlock>

## Cascader API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '选中值', type: '(string | number)[][]', default: '[]' },
{ name: 'options', description: '选项数据', type: 'CascaderOption[]', default: '[]' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: `'请选择'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'filterable', description: '是否可搜索', type: 'boolean', default: 'false' },
{ name: 'expandTrigger', description: '次级菜单展开方式', type: `'click' | 'hover'`, default: `'click'` },
{ name: 'multiple', description: '是否多选', type: 'boolean', default: 'false' },
{ name: 'checkStrictly', description: '父子节点不关联', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '选中值变化时触发', parameters: '(value: (string | number)[][])' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'expand-change', description: '展开节点时触发', parameters: '(value: (string | number)[])' },
]" />
