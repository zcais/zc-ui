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

通过 `format` 自定义显示格式（支持 `YYYY MM DD HH mm ss` 令牌），`disabled` 禁用选择器。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date1" format="YYYY/MM/DD" placeholder="自定义格式" />
  <ZcDatePicker v-model="date2" disabled placeholder="禁用状态" />
</template>
```

</DemoBlock>

## 值格式（value-format）

设置 `value-format` 后，`v-model` 交换格式化字符串而不是 Date 对象（与 Element Plus 一致）。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date" value-format="YYYY-MM-DD" />
  <span>当前值：{{ date }}</span>
</template>

<script setup>
import { ref } from 'vue'
const date = ref('2026-01-15')
</script>
```

</DemoBlock>

## 手动输入

默认允许在输入框中直接键入日期（按显示格式解析，回车提交），`editable` 为 `false` 时恢复只读。

<DemoBlock>

```vue
<template>
  <ZcDatePicker v-model="date" format="YYYY/MM/DD" placeholder="输入 2026/08/08" />
</template>

<script setup>
import { ref } from 'vue'
const date = ref('')
</script>
```

</DemoBlock>

## DatePicker API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值（value-format 设置时为格式化字符串）', type: 'Date | [Date, Date] | string | [string, string]', default: \"''\" },
{ name: 'type', description: '选择器类型', type: 'date | daterange | datetime | datetimerange | month | year | week', default: 'date' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: '请选择日期' },
{ name: 'startPlaceholder', description: '范围选择时开始日期的占位文本', type: 'string', default: '开始日期' },
{ name: 'endPlaceholder', description: '范围选择时结束日期的占位文本', type: 'string', default: '结束日期' },
{ name: 'size', description: '尺寸（默认继承 Form / ConfigProvider 的 size）', type: \"'large' | 'medium' | 'small'\", default: 'medium' },
{ name: 'disabled', description: '是否禁用（也可由 Form / FormItem 注入）', type: 'boolean', default: 'false' },
{ name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
{ name: 'format', description: '显示格式，支持令牌 YYYY / MM / DD / HH / mm / ss', type: 'string', default: 'YYYY-MM-DD' },
{ name: 'valueFormat', description: '绑定值的格式；设置后 v-model 交换格式化字符串', type: 'string', default: '—' },
{ name: 'editable', description: '是否允许在输入框直接键入日期（单值类型）', type: 'boolean', default: 'true' },
{ name: 'shortcuts', description: '快捷选项列表', type: 'DatePickerShortcut[]', default: '—' },
{ name: 'disabledDate', description: '禁用日期判断函数（手动输入同样受其约束）', type: '(date: Date) => boolean', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: Date | [Date, Date] | string)' },
  { name: 'change', description: '日期选择变化时触发', parameters: '(value: Date | [Date, Date] | string | null)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发（同时触发 FormItem 的 blur 校验）', parameters: '(event: FocusEvent)' }
]" />

### Exposes

<ApiTable type="methods" :data="[
  { name: 'openPicker', description: '打开选择面板', type: '() => void', default: '—' },
  { name: 'closePicker', description: '关闭选择面板', type: '() => void', default: '—' },
  { name: 'togglePicker', description: '切换选择面板', type: '() => void', default: '—' },
  { name: 'confirmDateTimeRange', description: '确认日期时间范围选择', type: '() => void', default: '—' },
  { name: 'focus', description: '聚焦输入框', type: '() => void', default: '—' },
  { name: 'blur', description: '失焦并关闭面板', type: '() => void', default: '—' },
  { name: 'visible', description: '当前面板可见状态', type: 'Ref<boolean>', default: '—' }
]" />

### DatePickerShortcut 类型

```ts
interface DatePickerShortcut {
  text: string
  value: (() => Date | [Date, Date]) | Date | [Date, Date]
}
```
