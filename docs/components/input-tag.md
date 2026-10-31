# InputTag 标签输入框

通过输入文本添加标签，支持键盘触发、去重、最大数量限制等。

## 基础用法

使用 `v-model` 绑定标签数组，默认按回车键添加标签。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const tags = ref(['Vue', 'TypeScript'])
</script>

<template>
  <ZcInputTag v-model="tags" placeholder="输入后按回车添加" />
  <p>当前标签：{{ tags }}</p>
</template>
```

</DemoBlock>

## 触发方式

通过 `trigger` 属性设置添加标签的触发键。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const tags1 = ref([])
const tags2 = ref([])
const tags3 = ref([])
</script>

<template>
  <p>回车触发</p>
  <ZcInputTag v-model="tags1" trigger="enter" />
  <p>空格触发</p>
  <ZcInputTag v-model="tags2" trigger="space" />
  <p>逗号触发</p>
  <ZcInputTag v-model="tags3" trigger="comma" />
</template>
```

</DemoBlock>

## 最大数量与去重

通过 `max` 限制标签数量，`allowDuplicate` 控制是否允许重复。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const tags = ref(['A', 'B'])
</script>

<template>
  <ZcInputTag v-model="tags" :max="5" placeholder="最多5个标签" />
</template>
```

</DemoBlock>

## 可清除

通过 `clearable` 显示清除全部按钮。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const tags = ref(['标签1', '标签2', '标签3'])
</script>

<template>
  <ZcInputTag v-model="tags" clearable placeholder="输入标签" />
</template>
```

</DemoBlock>

## 属性

<ApiTable type="props" :data="[
{ name: 'modelValue', description: '标签数组（v-model）', type: 'string[]', default: '[]' },
{ name: 'placeholder', description: '占位文本', type: 'string', default: ''请输入标签'' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'readonly', description: '是否只读', type: 'boolean', default: 'false' },
{ name: 'max', description: '最大标签数（0=不限）', type: 'number', default: '0' },
{ name: 'allowDuplicate', description: '是否允许重复', type: 'boolean', default: 'false' },
{ name: 'trigger', description: '添加触发键', type: '`'enter' \', default: ''space' \' },
{ name: 'clearable', description: '是否可清除', type: 'boolean', default: 'false' },
{ name: 'size', description: '输入框大小', type: '`'small' \', default: ''medium' \' },
{ name: 'closable', description: '标签是否可关闭', type: 'boolean', default: 'true' }
]" />

## 事件

<ApiTable type="events" :data="[
{ name: '(tags: string[])', description: '标签变化' },
{ name: '(tag: string)', description: '添加标签时触发' },
{ name: '(tag: string)', description: '移除标签时触发' },
{ name: '—', description: '清空时触发' },
{ name: '—', description: '聚焦时触发' },
{ name: '—', description: '失焦时触发' }
]" />

## 暴露方法

<ApiTable type="methods" :data="[
{ name: 'focus()', description: '聚焦输入框' }
]" />
