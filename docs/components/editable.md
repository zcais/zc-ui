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

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '绑定值', type: 'string', default: '''' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: ''请输入'' },
{ name: 'mode', description: '编辑模式', type: '`'text' \', default: ''textarea'`' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'showAction', description: '是否显示操作按钮', type: 'boolean', default: 'true' },
{ name: 'maxLength', description: '最大输入长度', type: 'number', default: '0' },
{ name: 'autofocus', description: '编辑时是否自动聚焦', type: 'boolean', default: 'true' },
{ name: 'trigger', description: '触发编辑方式', type: '`'click' \', default: ''dblclick'`' },
{ name: 'confirmOnBlur', description: '失焦时是否确认', type: 'boolean', default: 'true' },
{ name: 'loading', description: '加载状态', type: 'boolean', default: 'false' }
]" />

### Editable Events

<ApiTable type="events" :data="[
{ name: '(value: string)', description: '值变化时触发' },
{ name: '(value: string, oldValue: string)', description: '确认后值变化时触发' },
{ name: '—', description: '进入编辑模式时触发' },
{ name: '(value: string)', description: '退出编辑模式时触发' },
{ name: '—', description: '取消编辑时触发' }
]" />

### Slots

<ApiTable type="slots" :data="[
{ name: 'default', description: '自定义显示内容' },
{ name: 'edit-icon', description: '自定义编辑图标' },
{ name: 'check-icon', description: '自定义确认图标' },
{ name: 'close-icon', description: '自定义取消图标' }
]" />
