# CodeBlock 代码高亮

代码块组件，内置 JS/TS/HTML/CSS/JSON/Bash 语法高亮，支持行号、复制按钮、明暗主题。

## 基础用法

通过 `code` 属性或默认插槽传入代码内容，`language` 指定语言。

<DemoBlock>

```vue
<template>
  <ZcCodeBlock language="javascript" :code="code" />
</template>

<script setup>
const code = `const greet = (name) => {
  console.log(\`Hello, \${name}!\`)
}

greet('ZC UI')`
</script>
```

</DemoBlock>

## 行号显示

设置 `show-line-numbers` 显示行号，可通过 `start-line-number` 设置起始行号。

<DemoBlock>

```vue
<template>
  <ZcCodeBlock
    language="typescript"
    :show-line-numbers="true"
    :start-line-number="10"
    :code="code"
  />
</template>

<script setup>
const code = `interface User {
  name: string
  age: number
}

const user: User = {
  name: 'Alice',
  age: 30,
}`
</script>
```

</DemoBlock>

## 暗色主题

设置 `theme="dark"` 使用暗色主题，适合深色背景场景。

<DemoBlock>

```vue
<template>
  <div style="background: #1e1e1e; padding: 16px; border-radius: 8px; width: 100%">
    <ZcCodeBlock language="javascript" theme="dark" :code="code" />
  </div>
</template>

<script setup>
const code = `function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}`
</script>
```

</DemoBlock>

## 隐藏头部和复制按钮

设置 `show-header="false"` 隐藏头部栏，`show-copy="false"` 隐藏复制按钮。

<DemoBlock>

```vue
<template>
  <ZcCodeBlock language="json" :show-header="false" :show-copy="false" :code="code" />
</template>

<script setup>
const code = `{
  "name": "zc-ui",
  "version": "1.0.0",
  "type": "module"
}`
</script>
```

</DemoBlock>

## HTML 高亮

支持 HTML/XML 语法的标签高亮。

<DemoBlock>

```vue
<template>
  <ZcCodeBlock language="html" :code="code" />
</template>

<script setup>
const code = `<div class="card">
  <h3>标题</h3>
  <p>这是一段文字内容</p>
</div>`
</script>
```

</DemoBlock>

## API

### CodeBlock Props

<ApiTable type="props" :data="[
{ name: 'code', description: '代码内容', type: 'string', default: '\'\'' },
{ name: 'language', description: '编程语言', type: 'string', default: '\'text\'' },
{ name: 'theme', description: '主题', type: '\'light\' | \'dark\'', default: '\'light\'' },
{ name: 'showLineNumbers', description: '是否显示行号', type: 'boolean', default: 'false' },
{ name: 'showCopy', description: '是否显示复制按钮', type: 'boolean', default: 'true' },
{ name: 'showLanguage', description: '是否显示语言标签', type: 'boolean', default: 'true' },
{ name: 'showHeader', description: '是否显示头部栏', type: 'boolean', default: 'true' },
{ name: 'startLineNumber', description: '起始行号', type: 'number', default: '1' },
{ name: 'maxHeight', description: '最大高度（超出滚动）', type: 'string' },
{ name: 'fontSize', description: '字体大小（px）', type: 'number', default: '13' },
{ name: 'copyText', description: '复制按钮文字', type: 'string', default: '\'复制\'' },
{ name: 'copiedText', description: '复制成功提示文字', type: 'string', default: '\'已复制\'' },
]" />

### CodeBlock Events

<ApiTable type="events" :data="[
{ name: '(code: string)', description: '复制代码时触发' }
]" />

### Slots

<ApiTable type="slots" :data="[
{ name: 'default', description: '代码内容（与 code 属性二选一）' },
{ name: 'actions', description: '头部栏右侧额外操作区域' }
]" />
