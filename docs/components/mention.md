# Mention 提及

用于在输入文本时，通过触发字符（如 `@`、`#`）弹出建议列表，选择后插入到文本中。支持多触发字符、input/textarea 模式、自定义渲染、异步搜索、选项分组、Split 标签模式等高级功能。

## 基础用法

默认触发字符为 `@`，输入 @ 后会弹出建议列表。

<DemoBlock>

```vue
<template>
  <ZcMention v-model="value" :options="options" placeholder="输入 @ 提及用户" />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'afc163', label: '张三' },
  { value: 'benjycui', label: '李四' },
  { value: 'yiminghe', label: '王五' },
  { value: 'Roxnnn', label: '赵六' },
]
</script>
```

</DemoBlock>

## 多触发字符

通过 `trigger` 属性传入数组，可同时支持多个触发字符（如 `@` 提及用户、`#` 提及话题）。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    :trigger="['@', '#']"
    placeholder="输入 @ 提及用户，# 提及话题"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'vue', label: 'Vue.js' },
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
]
</script>
```

</DemoBlock>

## Input 模式

通过 `type="input"` 可使用单行输入框替代默认的多行文本域。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    type="input"
    placeholder="输入 @ 提及用户"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'afc163', label: '张三' },
  { value: 'benjycui', label: '李四' },
]
</script>
```

</DemoBlock>

## 自定义选项渲染

通过 `#option` 插槽完全自定义下拉项的内容和样式。

<DemoBlock>

```vue
<template>
  <ZcMention v-model="value" :options="options" placeholder="输入 @ 提及用户">
    <template #option="{ option }">
      <div style="display: flex; align-items: center; gap: 8px; width: 100%;">
        <div
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: option.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '14px',
          }"
        >
          {{ option.value.charAt(0).toUpperCase() }}
        </div>
        <div>
          <div style="font-weight: 500;">{{ option.value }}</div>
          <div style="font-size: 12px; color: #909399;">{{ option.email }}</div>
        </div>
      </div>
    </template>
  </ZcMention>
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'alice', label: 'Alice', email: 'alice@example.com', color: '#409eff' },
  { value: 'bob', label: 'Bob', email: 'bob@example.com', color: '#67c23a' },
]
</script>
```

</DemoBlock>

## 自定义过滤函数

通过 `filter` 属性传入自定义匹配函数，替代内置的 `includes` 匹配。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    :filter="customFilter"
    placeholder="输入 @ 前缀匹配用户名"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'alex', label: 'Alex' },
  { value: 'ben', label: 'Ben' },
]
// 自定义：仅匹配 value 前缀
const customFilter = (option, keyword) => option.value.startsWith(keyword)
</script>
```

</DemoBlock>

## 异步远程搜索

通过 `loading` 显示加载状态，结合 `@search` 事件调用远程 API。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    :loading="loading"
    loading-text="正在搜索用户..."
    placeholder="输入 @ 搜索用户"
    @search="handleSearch"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = ref([])
const loading = ref(false)

async function handleSearch(query) {
  if (!query) return
  loading.value = true
  // 模拟远程 API 调用
  const allUsers = [
    { value: 'alice', label: 'Alice Johnson' },
    { value: 'bob', label: 'Bob Smith' },
    { value: 'charlie', label: 'Charlie Brown' },
  ]
  setTimeout(() => {
    options.value = allUsers.filter((u) =>
      u.value.toLowerCase().includes(query.toLowerCase()),
    )
    loading.value = false
  }, 800)
}
</script>
```

</DemoBlock>

## 选项分组

通过 `optionGroups` 按部门或类别分组展示选项。选项通过 `group` 字段关联到对应的分组。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    :option-groups="groups"
    placeholder="输入 @ 提及成员"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const groups = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
]
const options = [
  { value: 'alice', label: 'Alice', group: 'engineering' },
  { value: 'bob', label: 'Bob', group: 'engineering' },
  { value: 'charlie', label: 'Charlie', group: 'design' },
  { value: 'diana', label: 'Diana', group: 'design' },
]
</script>
```

</DemoBlock>

## 空状态自定义

通过 `#empty` 插槽自定义无匹配结果时的展示内容。

<DemoBlock>

```vue
<template>
  <ZcMention v-model="value" :options="options" placeholder="输入 @ 提及用户">
    <template #empty>
      <div style="text-align: center; padding: 16px;">
        <div style="font-size: 24px; margin-bottom: 4px;">🔍</div>
        <div style="color: #909399;">未找到匹配的用户</div>
      </div>
    </template>
  </ZcMention>
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
]
</script>
```

</DemoBlock>

## Teleport 弹层定位

通过 `teleport` 属性将下拉面板 Teleport 到 `body`，避免在 `overflow: hidden` 容器中被裁剪。

<DemoBlock>

```vue
<template>
  <div style="height: 100px; overflow: hidden; border: 1px dashed #ddd; padding: 12px;">
    <p style="margin-bottom: 8px; color: #909399; font-size: 12px;">
      overflow: hidden 容器内 — Teleport 确保下拉不被裁剪
    </p>
    <ZcMention
      v-model="value"
      :options="options"
      teleport
      type="input"
      placeholder="输入 @ 提及用户"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'alice', label: 'Alice' },
  { value: 'bob', label: 'Bob' },
  { value: 'charlie', label: 'Charlie' },
]
</script>
```

</DemoBlock>

## Split 标签模式

通过 `split` 启用标签渲染模式，选中的提及会显示为带样式的标签（contenteditable）。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    split
    placeholder="输入 @ 提及用户，提及将显示为标签"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = [
  { value: 'alice', label: 'alice' },
  { value: 'bob', label: 'bob' },
  { value: 'charlie', label: 'charlie' },
]
</script>
```

</DemoBlock>

## Blur 行为配置

通过 `blurBehavior` 配置输入框失去焦点时的行为：

- `'clear'`（默认）：清空搜索，关闭下拉
- `'select-first'`：自动选中第一个匹配项
- `'keep-open'`：保持下拉打开

## maxHeight 配置

通过 `maxHeight` 自定义下拉面板的最大高度，支持数值（px）或 CSS 字符串。

<DemoBlock>

```vue
<template>
  <ZcMention
    v-model="value"
    :options="options"
    :max-height="120"
    placeholder="输入 @ 提及用户（maxHeight: 120px）"
  />
</template>

<script setup>
import { ref } from 'vue'
const value = ref('')
const options = Array.from({ length: 10 }, (_, i) => ({
  value: `user${i + 1}`,
  label: `User ${i + 1}`,
}))
</script>
```

</DemoBlock>

## Mention API

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值 (v-model)', type: 'string', default: `''` },
  { name: 'options', description: '建议选项列表', type: 'MentionOption[]', default: '[]' },
  { name: 'trigger', description: '触发字符，支持单个字符或数组', type: 'string | string[]', default: `'@'` },
  { name: 'type', description: '输入元素类型', type: `'textarea' | 'input'`, default: `'textarea'` },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'placeholder', description: '占位文本', type: 'string', default: `'请输入内容'` },
  { name: 'placement', description: '下拉弹出位置', type: `'bottom' | 'top'`, default: `'bottom'` },
  { name: 'filterable', description: '是否启用内置过滤', type: 'boolean', default: 'true' },
  { name: 'filter', description: '自定义过滤函数，替代内置 includes 匹配', type: '(option, keyword, trigger) => boolean', default: '-' },
  { name: 'loading', description: '是否显示加载状态', type: 'boolean', default: 'false' },
  { name: 'loadingText', description: '加载状态文案', type: 'string', default: `'加载中…'` },
  { name: 'optionGroups', description: '选项分组配置', type: 'MentionOptionGroup[]', default: '[]' },
  { name: 'blurBehavior', description: '失焦时行为', type: `'clear' | 'select-first' | 'keep-open'`, default: `'clear'` },
  { name: 'split', description: '是否启用 Split 标签模式', type: 'boolean', default: 'false' },
  { name: 'maxHeight', description: '下拉面板最大高度', type: 'number | string', default: '240' },
  { name: 'teleport', description: '是否将下拉面板 Teleport 到 body', type: 'boolean | string', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '值变化时触发 (v-model)', parameters: '(value: string)' },
  { name: 'change', description: '值变化时触发', parameters: '(value: string)' },
  { name: 'select', description: '选中建议项时触发', parameters: '(option: MentionOption)' },
  { name: 'search', description: '搜索时触发，携带搜索词和触发字符', parameters: '(query: string, trigger: string)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'option', description: '自定义下拉项渲染', parameters: '{ option: MentionOption }' },
  { name: 'empty', description: '自定义无匹配结果时的内容', parameters: '-' },
  { name: 'loading', description: '自定义加载状态内容', parameters: '-' },
]" />

### Exposed Methods

<ApiTable type="methods" :data="[
  { name: 'closeSuggestions', description: '关闭建议下拉', parameters: '()' },
  { name: 'visible', description: '下拉是否可见 (Ref<boolean>)', parameters: '-' },
  { name: 'searchText', description: '当前搜索文本 (Ref<string>)', parameters: '-' },
  { name: 'filteredOptions', description: '过滤后的选项列表', parameters: '-' },
]" />

### Types

```ts
interface MentionOption {
  value: string
  label?: string
  avatar?: string
  disabled?: boolean
  group?: string
}

interface MentionOptionGroup {
  value: string
  label: string
  options?: MentionOption[]
}

type MentionPlacement = 'top' | 'bottom'
type MentionType = 'textarea' | 'input'
type MentionBlurBehavior = 'clear' | 'select-first' | 'keep-open'
type MentionFilterFunc = (option: MentionOption, keyword: string, trigger: string) => boolean
```
