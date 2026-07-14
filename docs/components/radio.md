# Radio 单选框

一组备选项中进行单选，支持单独使用和组合使用。

## 基础用法

使用 `v-model` 绑定值，通过 `label` 标识每个选项。

<DemoBlock>

```vue
<template>
  <ZcRadio v-model="radio1" label="A">选项 A</ZcRadio>
  <ZcRadio v-model="radio1" label="B">选项 B</ZcRadio>
  <ZcRadio v-model="radio1" label="C">选项 C</ZcRadio>
</template>
```

</DemoBlock>

## 单选框组

使用 `ZcRadioGroup` 配合多个 `ZcRadio` 实现更简洁的用法。

<DemoBlock>

```vue
<template>
  <ZcRadioGroup v-model="radio2">
    <ZcRadio label="A">选项 A</ZcRadio>
    <ZcRadio label="B">选项 B</ZcRadio>
    <ZcRadio label="C">选项 C</ZcRadio>
  </ZcRadioGroup>
</template>
```

</DemoBlock>

## 禁用状态

通过 `disabled` 属性禁用单选项或整个选项组。

<DemoBlock>

```vue
<template>
  <ZcRadio v-model="radio1" label="A" disabled>禁用项</ZcRadio>
  <ZcRadioGroup v-model="radio2" disabled>
    <ZcRadio label="A">选项 A</ZcRadio>
    <ZcRadio label="B">选项 B</ZcRadio>
  </ZcRadioGroup>
</template>
```

</DemoBlock>

## Radio API

### Radio Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值', type: 'string | number | boolean', default: '' },
  { name: 'label', description: '单选框的值（选中时作为 emit 的值）', type: 'string | number | boolean', default: '—' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'name', description: '原生 name 属性', type: 'string', default: '—' }
]" />

### Radio Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: string | number | boolean)' },
  { name: 'change', description: '选中值变化时触发', parameters: '(value: string | number | boolean)' }
]" />

### Radio Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '单选框标签内容（默认显示 label 文本）' }
]" />

### RadioGroup Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定的选中值', type: 'string | number | boolean', default: '' },
  { name: 'disabled', description: '是否禁用整个组', type: 'boolean', default: 'false' },
  { name: 'name', description: '原生 name 属性，统一为所有子选项设置', type: 'string', default: '—' }
]" />

### RadioGroup Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: string | number | boolean)' },
  { name: 'change', description: '选中值变化时触发', parameters: '(value: string | number | boolean)' }
]" />
