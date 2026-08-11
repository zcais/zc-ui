# Editable 行内编辑

点击文字进入编辑模式，支持文本输入和文本域，常用于表格单元格、详情页等场景。

## 基础用法

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" placeholder="点击编辑" />
  <p>当前值：{{ text }}</p>
</template>

<script setup>
import { ref } from 'vue'
const text = ref('点击我编辑')
</script>
```

</DemoBlock>

## 文本域模式

设置 `mode="textarea"` 使用多行文本输入。

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" mode="textarea" placeholder="点击编辑" />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('多行文本编辑\n第二行内容')
</script>
```

</DemoBlock>

## 双击编辑

设置 `trigger="dblclick"` 防止误触。

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" trigger="dblclick" placeholder="双击编辑" />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('双击我编辑')
</script>
```

</DemoBlock>

## 隐藏操作按钮

设置 `show-action="false"` 隐藏确认/取消按钮，通过 Enter 确认、Esc 取消。

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" :show-action="false" placeholder="Enter确认 / Esc取消" />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('隐藏操作按钮')
</script>
```

</DemoBlock>

## 禁用

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" disabled />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('禁用状态')
</script>
```

</DemoBlock>

## 最大长度

通过 `max-length` 限制输入长度。

<DemoBlock>

```vue
<template>
  <ZcEditable v-model="text" :max-length="10" placeholder="最多10个字符" />
</template>

<script setup>
import { ref } from 'vue'
const text = ref('限制长度')
</script>
```

</DemoBlock>

## API

### Editable Props

| 属性名        | 说明               | 类型                    | 默认值     |
| ------------- | ------------------ | ----------------------- | ---------- |
| modelValue    | 绑定值             | `string`                | `''`       |
| placeholder   | 占位文本           | `string`                | `'请输入'` |
| mode          | 编辑模式           | `'text' \| 'textarea'`  | `'text'`   |
| disabled      | 是否禁用           | `boolean`               | `false`    |
| showAction    | 是否显示操作按钮   | `boolean`               | `true`     |
| maxLength     | 最大输入长度       | `number`                | `0`        |
| autofocus     | 编辑时是否自动聚焦 | `boolean`               | `true`     |
| trigger       | 触发编辑方式       | `'click' \| 'dblclick'` | `'click'`  |
| confirmOnBlur | 失焦时是否确认     | `boolean`               | `true`     |
| loading       | 加载状态           | `boolean`               | `false`    |

### Editable Events

| 事件名            | 说明               | 回调参数                            |
| ----------------- | ------------------ | ----------------------------------- |
| update:modelValue | 值变化时触发       | `(value: string)`                   |
| change            | 确认后值变化时触发 | `(value: string, oldValue: string)` |
| start             | 进入编辑模式时触发 | -                                   |
| end               | 退出编辑模式时触发 | `(value: string)`                   |
| cancel            | 取消编辑时触发     | -                                   |

### Slots

| 插槽名     | 说明           |
| ---------- | -------------- |
| default    | 自定义显示内容 |
| edit-icon  | 自定义编辑图标 |
| check-icon | 自定义确认图标 |
| close-icon | 自定义取消图标 |
