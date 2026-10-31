# InputOTP 验证码输入

用于短信/邮箱验证码等场景的多格输入框，支持自动跳格、粘贴、密码模式等。

## 基础用法

<DemoBlock>

```vue
<template>
  <ZcInputOTP v-model="code" :length="6" @complete="onComplete" />
  <p>当前值：{{ code }}</p>
</template>

<script setup>
import { ref } from 'vue'
const code = ref('')
const onComplete = (val) => console.log('完成:', val)
</script>
```

</DemoBlock>

## 密码模式

设置 `masked` 隐藏输入内容。

<DemoBlock>

```vue
<template>
  <ZcInputOTP masked :length="6" />
</template>
```

</DemoBlock>

## 仅数字

设置 `numericOnly` 限制只允许数字输入。

<DemoBlock>

```vue
<template>
  <ZcInputOTP numeric-only :length="4" />
</template>
```

</DemoBlock>

## 分隔符

通过 `separator` 在输入框之间显示分隔符。

<DemoBlock>

```vue
<template>
  <ZcInputOTP separator="-" :length="6" />
</template>
```

</DemoBlock>

## 尺寸

提供 `large`、`medium`、`small` 三种尺寸。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start">
    <ZcInputOTP size="large" :length="4" />
    <ZcInputOTP size="medium" :length="4" />
    <ZcInputOTP size="small" :length="4" />
  </div>
</template>
```

</DemoBlock>

## 禁用

<DemoBlock>

```vue
<template>
  <ZcInputOTP disabled :length="6" model-value="123456" />
</template>
```

</DemoBlock>

## API

### InputOTP Props

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string', default: '''' },
{ name: 'length', description: '输入框数量', type: 'number', default: '6' },
{ name: 'size', description: '尺寸', type: '`'large' \', default: ''medium' \' },
{ name: 'masked', description: '是否密码模式', type: 'boolean', default: 'false' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: '''' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
{ name: 'numericOnly', description: '是否仅允许数字', type: 'boolean', default: 'false' },
{ name: 'autofocus', description: '是否自动聚焦', type: 'boolean', default: 'false' },
{ name: 'separator', description: '输入框之间的分隔符', type: 'string', default: '''' }
]" />

### InputOTP Events

<ApiTable type="events" :data="[
{ name: '(value: string)', description: '值变化时触发' },
{ name: '(value: string)', description: '值变化时触发' },
{ name: '(value: string)', description: '所有格填满时触发' }
]" />

### InputOTP Methods

<ApiTable type="methods" :data="[
{ name: '—', description: '聚焦第一个空格' },
{ name: '—', description: '清空所有格并聚焦' }
]" />
