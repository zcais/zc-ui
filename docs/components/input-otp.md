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

| 属性名      | 说明               | 类型                             | 默认值     |
| ----------- | ------------------ | -------------------------------- | ---------- |
| modelValue  | 绑定值             | `string`                         | `''`       |
| length      | 输入框数量         | `number`                         | `6`        |
| size        | 尺寸               | `'large' \| 'medium' \| 'small'` | `'medium'` |
| masked      | 是否密码模式       | `boolean`                        | `false`    |
| placeholder | 占位文本           | `string`                         | `''`       |
| disabled    | 是否禁用           | `boolean`                        | `false`    |
| readonly    | 是否只读           | `boolean`                        | `false`    |
| numericOnly | 是否仅允许数字     | `boolean`                        | `false`    |
| autofocus   | 是否自动聚焦       | `boolean`                        | `false`    |
| separator   | 输入框之间的分隔符 | `string`                         | `''`       |

### InputOTP Events

| 事件名            | 说明             | 回调参数          |
| ----------------- | ---------------- | ----------------- |
| update:modelValue | 值变化时触发     | `(value: string)` |
| change            | 值变化时触发     | `(value: string)` |
| complete          | 所有格填满时触发 | `(value: string)` |

### InputOTP Methods

| 方法名 | 说明             | 参数 |
| ------ | ---------------- | ---- |
| focus  | 聚焦第一个空格   | -    |
| clear  | 清空所有格并聚焦 | -    |
