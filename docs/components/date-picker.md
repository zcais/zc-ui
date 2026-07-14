# DatePicker 日期选择器

用于选择或输入日期，支持日期、日期范围等模式。

## 基础用法

使用 `v-model` 绑定日期值，通过 `type` 属性切换选择模式。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date1" placeholder="选择日期" />
  <ZcDatePicker v-model="date2" type="daterange" />
</template>
```

</DemoBlock>

## 快捷选项

通过 `shortcuts` 属性配置快捷选择项。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date" type="daterange" :shortcuts="shortcuts" />
</template>

<script setup>
const shortcuts = [
  { text: '最近一周', value: () => [new Date(Date.now() - 7 * 24 * 3600 * 1000), new Date()] },
  { text: '最近一个月', value: () => [new Date(Date.now() - 30 * 24 * 3600 * 1000), new Date()] },
  { text: '最近三个月', value: () => [new Date(Date.now() - 90 * 24 * 3600 * 1000), new Date()] },
]
</script>
```

</DemoBlock>

## 日期格式与禁用

通过 `format` 自定义显示格式，`disabled` 禁用选择器。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date1" format="YYYY/MM/DD" placeholder="自定义格式" />
  <ZcDatePicker v-model="date2" disabled placeholder="禁用状态" />
</template>
```

</DemoBlock>

## DatePicker API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值', type: 'Date | [Date, Date] | string', default: '' },
  { name: 'type', description: '选择器类型', type: 'date | daterange', default: 'date' },
  { name: 'placeholder', description: '占位文本', type: 'string', default: '请选择日期' },
  { name: 'startPlaceholder', description: '范围选择时开始日期的占位文本', type: 'string', default: '开始日期' },
  { name: 'endPlaceholder', description: '范围选择时结束日期的占位文本', type: 'string', default: '结束日期' },
  { name: 'size', description: '选择器尺寸', type: 'large | medium | small', default: 'medium' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
  { name: 'format', description: '日期显示格式', type: 'string', default: 'YYYY-MM-DD' },
  { name: 'shortcuts', description: '快捷选项列表', type: 'DatePickerShortcut[]', default: '—' },
  { name: 'disabledDate', description: '禁用日期判断函数', type: '(date: Date) => boolean', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: Date | [Date, Date] | string)' },
  { name: 'change', description: '日期选择变化时触发', parameters: '(value: Date | [Date, Date])' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' }
]" />

### DatePickerShortcut 类型

```ts
interface DatePickerShortcut {
  text: string
  value: (() => Date | [Date, Date]) | Date | [Date, Date]
}
```
