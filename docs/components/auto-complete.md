# AutoComplete 自动补全

输入框自动补全组件，根据输入内容提供匹配的建议选项。

## 基础用法

通过 `fetch-suggestions` 属性传入获取建议的函数。

<DemoBlock>

```vue
<template>
  <ZcAutoComplete v-model="value" :fetch-suggestions="querySearch" placeholder="请输入" />
</template>
<script setup>
import { ref } from 'vue'

const value = ref('')
const querySearch = (query) => {
  const results = [
    { value: 'Vue.js' },
    { value: 'React' },
    { value: 'Angular' },
    { value: 'Svelte' },
  ]
  return query
    ? results.filter((item) => item.value.toLowerCase().includes(query.toLowerCase()))
    : results
}
</script>
```

</DemoBlock>

## 自定义建议项

通过作用域插槽自定义建议列表的渲染方式。

<DemoBlock>

```vue
<template>
  <ZcAutoComplete v-model="value" :fetch-suggestions="querySearch" placeholder="请输入">
    <template #default="{ item }">
      <span style="font-weight: bold">{{ item.value }}</span>
    </template>
  </ZcAutoComplete>
</template>
<script setup>
import { ref } from 'vue'

const value = ref('')
const querySearch = (query) => {
  const results = [
    { value: 'Vue.js', label: '渐进式框架' },
    { value: 'React', label: 'UI 库' },
  ]
  return query
    ? results.filter((item) => item.value.toLowerCase().includes(query.toLowerCase()))
    : results
}
</script>
```

</DemoBlock>

## AutoComplete API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string', default: `''` },
{ name: 'fetchSuggestions', description: '获取建议列表的函数', type: '(query: string) => Option[] | Promise<Option[]>', default: 'undefined' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: `'请输入'` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
{ name: 'size', description: '尺寸', type: `'large' | 'medium' | 'small'`, default: `'medium'` },
{ name: 'debounce', description: '防抖延迟(ms)', type: 'number', default: '300' },
{ name: 'highlightFirstItem', description: '是否高亮第一个建议项', type: 'boolean', default: 'true' },
{ name: 'noDataText', description: '无数据提示文本', type: 'string', default: `'暂无数据'` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'select', description: '选中建议项时触发', parameters: '(item: AutoCompleteOption)' },
  { name: 'change', description: '输入值变化时触发', parameters: '(value: string)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义建议项内容', sub: '作用域参数: { item, index }' },
  { name: 'prefix', description: '输入框前缀内容' },
  { name: 'suffix', description: '输入框后缀内容' },
]" />

### Expose

<ApiTable type="methods" :data="[
  { name: 'focus', description: '使输入框获取焦点' },
  { name: 'blur', description: '使输入框失去焦点' },
]" />
