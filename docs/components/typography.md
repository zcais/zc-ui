# Typography 排版

文本是界面中最基础的视觉元素。ZC UI 提供了完整的排版组件体系，包括基础文本、标题、段落和超链接，对标 Element Plus 和 Ant Design Vue 的排版能力。

## Text 基础文本

用于通用文本展示，支持颜色类型、字号、省略、加粗、斜体、代码等样式。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <div>
      <ZcText type="primary">主要文本</ZcText>
      <ZcText type="success">成功文本</ZcText>
      <ZcText type="warning">警告文本</ZcText>
      <ZcText type="danger">危险文本</ZcText>
      <ZcText type="info">信息文本</ZcText>
      <ZcText>默认文本</ZcText>
    </div>
    <div>
      <ZcText size="sm">小号文本</ZcText>
      <ZcText size="base">基础文本</ZcText>
      <ZcText size="lg">大号文本</ZcText>
      <ZcText size="xl">超大文本</ZcText>
    </div>
    <div>
      <ZcText strong>加粗文本</ZcText>
      <ZcText italic>斜体文本</ZcText>
      <ZcText code>code 文本</ZcText>
    </div>
  </div>
</template>
```

</DemoBlock>

## Text 文本省略

通过 `truncated` 属性实现单行文本省略。

<DemoBlock>

```vue
<template>
  <div style="max-width: 200px;">
    <ZcText truncated>这是一段很长很长的文本，超出部分会被省略号截断显示</ZcText>
  </div>
</template>
```

</DemoBlock>

## Title 标题

用于标题展示，支持 level 1-5 对应 h1-h5，支持复制功能。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <ZcTitle :level="1">Level 1 标题</ZcTitle>
    <ZcTitle :level="2">Level 2 标题</ZcTitle>
    <ZcTitle :level="3">Level 3 标题</ZcTitle>
    <ZcTitle :level="4">Level 4 标题</ZcTitle>
    <ZcTitle :level="5">Level 5 标题</ZcTitle>
  </div>
</template>
```

</DemoBlock>

## Title 可复制

通过 `copyable` 属性添加复制按钮，点击后复制文本内容。

<DemoBlock>

```vue
<template>
  <ZcTitle :level="3" copyable @copy="handleCopy">可复制的标题</ZcTitle>
</template>

<script setup>
function handleCopy(text) {
  console.log('已复制:', text)
}
</script>
```

</DemoBlock>

## Paragraph 段落

用于段落文本展示，支持省略号展开/收起、复制、行内编辑。

### 省略与展开收起

<DemoBlock>

```vue
<template>
  <ZcParagraph
    :ellipsis="{ rows: 2, expandable: true }"
  >
    这是一段用于演示省略功能的段落文本。当文本内容超过指定行数时，
    会自动截断并显示省略号。用户可以点击「展开」按钮查看完整内容，
    也可以点击「收起」按钮折叠回省略状态。这种交互方式在卡片内容、
    商品描述、评论列表等场景中非常常见，能够有效控制页面布局，
    同时保留查看完整信息的入口。
  </ZcParagraph>
</template>
```

</DemoBlock>

### 可复制

<DemoBlock>

```vue
<template>
  <ZcParagraph copyable @copy="handleCopy">
    这是一段可复制的段落文本，点击右侧复制按钮即可将内容复制到剪贴板。
  </ZcParagraph>
</template>

<script setup>
function handleCopy(text) {
  console.log('已复制:', text)
}
</script>
```

</DemoBlock>

### 可编辑

<DemoBlock>

```vue
<template>
  <ZcParagraph
    editable
    @edit-start="handleStart"
    @edit-end="handleEnd"
  >
    这是一段可编辑的段落文本。点击编辑按钮进入编辑模式，按 Enter 确认，Esc 取消。
  </ZcParagraph>
</template>

<script setup>
function handleStart() {
  console.log('开始编辑')
}
function handleEnd(value) {
  console.log('编辑结束，新值:', value)
}
</script>
```

</DemoBlock>

## Link 超链接

用于超链接，支持颜色类型、下划线、禁用状态等。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <ZcLink type="primary" href="https://github.com" target="_blank">主要链接</ZcLink>
    <ZcLink type="success">成功链接</ZcLink>
    <ZcLink type="warning">警告链接</ZcLink>
    <ZcLink type="danger">危险链接</ZcLink>
    <ZcLink type="info">信息链接</ZcLink>
    <ZcLink>默认链接</ZcLink>
  </div>
</template>
```

</DemoBlock>

### 下划线与禁用

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <ZcLink type="primary" underline>悬停下划线</ZcLink>
    <ZcLink type="primary" disabled>禁用链接</ZcLink>
    <ZcLink type="primary" underline disabled>禁用带下划线</ZcLink>
  </div>
</template>
```

</DemoBlock>

## Text API

### Props

<ApiTable type="props" :data="[
  { name: 'type', description: '文本颜色类型', type: '&quot;primary&quot; | &quot;success&quot; | &quot;warning&quot; | &quot;danger&quot; | &quot;info&quot; | &quot;default&quot;', default: 'default' },
  { name: 'size', description: '文本大小', type: '&quot;sm&quot; | &quot;base&quot; | &quot;lg&quot; | &quot;xl&quot; | &quot;inherit&quot;', default: 'inherit' },
  { name: 'truncated', description: '是否单行省略', type: 'boolean', default: 'false' },
  { name: 'strong', description: '是否加粗', type: 'boolean', default: 'false' },
  { name: 'italic', description: '是否斜体', type: 'boolean', default: 'false' },
  { name: 'code', description: '是否代码样式（渲染为 &lt;code&gt; 标签）', type: 'boolean', default: 'false' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '文本内容' }
]" />

## Title API

### Props

<ApiTable type="props" :data="[
  { name: 'level', description: '标题级别（对应 h1-h5）', type: '1 | 2 | 3 | 4 | 5', default: '1' },
  { name: 'copyable', description: '是否可复制', type: 'boolean', default: 'false' },
  { name: 'copyText', description: '自定义复制文本（默认取 textContent）', type: 'string', default: '-' },
  { name: 'copyTooltip', description: '复制按钮提示', type: 'string', default: '-' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'copy', description: '复制成功时触发', parameters: '(text: string)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '标题内容' }
]" />

## Paragraph API

### Props

<ApiTable type="props" :data="[
  { name: 'ellipsis', description: '省略配置', type: 'boolean | { rows?: number; expandable?: boolean; expandText?: string; collapseText?: string; suffix?: string }', default: 'false' },
  { name: 'copyable', description: '是否可复制', type: 'boolean', default: 'false' },
  { name: 'copyText', description: '自定义复制文本', type: 'string', default: '-' },
  { name: 'editable', description: '是否可行内编辑', type: 'boolean', default: 'false' },
  { name: 'copyTooltip', description: '复制按钮提示', type: 'string', default: '-' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'copy', description: '复制成功时触发', parameters: '(text: string)' },
  { name: 'edit-start', description: '进入编辑模式时触发', parameters: '()' },
  { name: 'edit-end', description: '编辑结束时触发。第二个参数为 true 表示用户取消（此时 value 为原始值），为 false 表示确认（value 为编辑后的值）。由于段落内容通过 slot 渲染，消费者需自行根据此事件更新传入的 slot 内容以反映变更。', parameters: '(value: string, cancelled: boolean)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '段落内容' }
]" />

## Link API

### Props

<ApiTable type="props" :data="[
  { name: 'type', description: '链接颜色类型', type: '&quot;primary&quot; | &quot;success&quot; | &quot;warning&quot; | &quot;danger&quot; | &quot;info&quot; | &quot;default&quot;', default: 'default' },
  { name: 'underline', description: '鼠标悬停时是否显示下划线', type: 'boolean', default: 'false' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'href', description: '链接地址', type: 'string', default: '-' },
  { name: 'target', description: '链接打开方式', type: '&quot;_self&quot; | &quot;_blank&quot; | &quot;_parent&quot; | &quot;_top&quot;', default: '-' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'click', description: '点击链接时触发（禁用时不触发）', parameters: '(event: MouseEvent)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '链接内容' }
]" />

## CSS 变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `--zc-text-color` | 文本颜色 | `var(--color-zc-text-primary)` |
| `--zc-text-font-size` | 文本大小 | `inherit` |
| `--zc-title-color` | 标题颜色 | `var(--color-zc-text-primary)` |
| `--zc-paragraph-color` | 段落颜色 | `var(--color-zc-text-primary)` |
| `--zc-link-color` | 链接颜色 | `var(--color-zc-text-primary)` |
| `--zc-link-hover-color` | 链接悬停颜色 | `var(--color-zc-primary-600)` |
