# Input 输入框

通过鼠标或键盘输入内容，支持多种类型和尺寸。

## 基础用法

使用 `v-model` 绑定数据，通过 `type` 属性切换输入框类型。

<DemoBlock>

```vue
<template>
  <ZcInput v-model="input1" placeholder="请输入内容" />
  <ZcInput v-model="input2" type="password" placeholder="密码输入" />
  <ZcInput v-model="input3" type="textarea" placeholder="多行文本输入" :rows="4" />
</template>
```

</DemoBlock>

## 可清空与密码切换

通过 `clearable` 属性可一键清空内容，`showPassword` 属性可切换密码显隐。

<DemoBlock>

```vue
<template>
  <ZcInput v-model="input1" clearable placeholder="可清空的输入框" />
  <ZcInput v-model="input2" type="password" showPassword placeholder="密码显隐切换" />
</template>
```

</DemoBlock>

## 尺寸与字数限制

通过 `size` 属性调整输入框尺寸，`maxlength` 和 `showWordLimit` 显示字数统计。

<DemoBlock>

```vue
<template>
  <ZcInput v-model="input1" size="large" placeholder="大尺寸" />
  <ZcInput v-model="input2" size="medium" placeholder="中等尺寸" />
  <ZcInput v-model="input3" size="small" placeholder="小尺寸" />
  <ZcInput v-model="input4" maxlength="10" showWordLimit placeholder="最多10字符" />
</template>
```

</DemoBlock>

## 禁用与只读

通过 `disabled` 和 `readonly` 属性控制输入交互。

<DemoBlock>

```vue
<template>
  <ZcInput v-model="input1" disabled placeholder="禁用状态" />
  <ZcInput v-model="input2" readonly placeholder="只读状态" />
</template>
```

</DemoBlock>

## Input API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值', type: 'string | number', default: '' },
  { name: 'type', description: '输入框类型', type: 'text | password | textarea | number | email | tel | url', default: 'text' },
  { name: 'size', description: '输入框尺寸', type: 'large | medium | small', default: 'medium' },
  { name: 'placeholder', description: '占位文本', type: 'string', default: '' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
  { name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
  { name: 'showPassword', description: '是否可切换密码显隐', type: 'boolean', default: 'false' },
  { name: 'maxlength', description: '最大输入长度', type: 'number', default: '—' },
  { name: 'showWordLimit', description: '是否显示字数统计', type: 'boolean', default: 'false' },
  { name: 'rows', description: '文本域行数（textarea 类型）', type: 'number', default: '3' },
  { name: 'resize', description: '文本域缩放策略', type: 'none | both | horizontal | vertical', default: 'vertical' },
  { name: 'autocomplete', description: '原生 autocomplete 属性', type: 'string', default: 'off' },
  { name: 'name', description: '原生 name 属性', type: 'string', default: '—' },
  { name: 'id', description: '原生 id 属性', type: 'string', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '输入值更新时触发', parameters: '(value: string | number)' },
  { name: 'input', description: '输入时触发', parameters: '(value: string)' },
  { name: 'change', description: '值变更时触发', parameters: '(value: string)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'clear', description: '点击清空按钮时触发', parameters: '()' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'prepend', description: '输入框前置内容' },
  { name: 'append', description: '输入框后置内容' },
  { name: 'prefix', description: '输入框头部图标' },
  { name: 'suffix', description: '输入框尾部图标或内容' }
]" />
