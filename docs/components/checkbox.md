# Checkbox 复选框

一组备选项中进行多选，支持单独使用和组合使用。

## 基础用法

单独使用 `v-model` 绑定布尔值，配合 `label` 显示文本标签。

<DemoBlock>

```vue
<template>
  <ZcCheckbox v-model="checked1">选项 A</ZcCheckbox>
  <ZcCheckbox v-model="checked2">选项 B</ZcCheckbox>
</template>
```

</DemoBlock>

## 复选框组

使用 `ZcCheckboxGroup` 配合多个 `ZcCheckbox` 实现多选组。

<DemoBlock>

```vue
<template>
  <ZcCheckboxGroup v-model="checkedList">
    <ZcCheckbox label="A">选项 A</ZcCheckbox>
    <ZcCheckbox label="B">选项 B</ZcCheckbox>
    <ZcCheckbox label="C">选项 C</ZcCheckbox>
  </ZcCheckboxGroup>
</template>
```

</DemoBlock>

## 禁用状态

通过 `disabled` 属性禁用复选框。

<DemoBlock>

```vue
<template>
  <ZcCheckbox v-model="checked1" disabled>禁用</ZcCheckbox>
  <ZcCheckboxGroup v-model="checkedList" disabled>
    <ZcCheckbox label="A">选项 A</ZcCheckbox>
    <ZcCheckbox label="B">选项 B</ZcCheckbox>
  </ZcCheckboxGroup>
</template>
```

</DemoBlock>

## 半选状态

通过 `indeterminate` 属性实现半选（全选/取消全选）状态。

<DemoBlock>

```vue
<template>
  <ZcCheckbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAll">
    全选
  </ZcCheckbox>
  <ZcCheckboxGroup v-model="checkedList">
    <ZcCheckbox label="A">选项 A</ZcCheckbox>
    <ZcCheckbox label="B">选项 B</ZcCheckbox>
    <ZcCheckbox label="C">选项 C</ZcCheckbox>
  </ZcCheckboxGroup>
</template>
```

</DemoBlock>

## Checkbox API

### Checkbox Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值（单独使用时为布尔值）', type: 'boolean | string | number', default: 'false' },
  { name: 'label', description: '复选框的标签值（组模式下作为选中标识）', type: 'string | number | boolean', default: '—' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'indeterminate', description: '是否半选状态', type: 'boolean', default: 'false' },
  { name: 'name', description: '原生 name 属性', type: 'string', default: '—' }
]" />

### Checkbox Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: boolean)' },
  { name: 'change', description: '值变更时触发', parameters: '(value: boolean)' }
]" />

### Checkbox Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '复选框标签内容（默认显示 label 文本）' }
]" />

### CheckboxGroup Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定的选中值数组', type: 'Array<string | number | boolean>', default: '[]' },
  { name: 'disabled', description: '是否禁用整个组', type: 'boolean', default: 'false' }
]" />

### CheckboxGroup Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: Array<string | number | boolean>)' },
  { name: 'change', description: '选中值变化时触发', parameters: '(value: Array<string | number | boolean>)' }
]" />
