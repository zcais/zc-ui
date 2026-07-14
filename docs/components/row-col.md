# Row / Col 栅格

通过基础的 24 分栏，迅速简便地创建布局。

::: tip
组件默认使用 Flex 布局，不需要手动设置 `type="flex"`。请注意父容器避免使用 inline 相关样式，会导致组件宽度不能撑满。列的基本单位为 1，最多 24 个，最少 0 个。
:::

## 基础布局

使用列创建基础网格布局。通过 Row 和 Col 组件，并通过 Col 组件的 `span` 属性我们可以自由地组合布局。

<DemoBlock>

```vue
<template>
  <ZcRow>
    <ZcCol :span="24"><div class="grid-content ep-bg-purple-dark" /></ZcCol>
  </ZcRow>
  <ZcRow>
    <ZcCol :span="12"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="12"><div class="grid-content ep-bg-purple-light" /></ZcCol>
  </ZcRow>
  <ZcRow>
    <ZcCol :span="8"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="8"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="8"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
  </ZcRow>
  <ZcRow>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple-light" /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple-dark {
  background: #5b8def;
}
.ep-bg-purple {
  background: #a0c3ff;
}
.ep-bg-purple-light {
  background: #d6e4ff;
}
</style>
```

</DemoBlock>

## 分栏间隔

支持列间距。Row 提供 `gutter` 属性来指定列之间的间距，其默认值为 0。

<DemoBlock>

```vue
<template>
  <ZcRow :gutter="20">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
</style>
```

</DemoBlock>

## 混合布局

通过基础的 1/24 分栏任意扩展组合形成较为复杂的混合布局。

<DemoBlock>

```vue
<template>
  <ZcRow :gutter="20">
    <ZcCol :span="16"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="8"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow :gutter="20">
    <ZcCol :span="8"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="8"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow :gutter="20">
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="16"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="4"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
</style>
```

</DemoBlock>

## 列偏移

通过制定 Col 组件的 `offset` 属性可以指定分栏偏移的栏数。

<DemoBlock>

```vue
<template>
  <ZcRow :gutter="20">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6" :offset="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow :gutter="20">
    <ZcCol :span="6" :offset="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6" :offset="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow :gutter="20">
    <ZcCol :span="12" :offset="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
</style>
```

</DemoBlock>

## 对齐方式

默认使用 flex 布局来对分栏进行灵活的对齐。通过 `justify` 属性来定义子元素的排版方式，其取值为 `start`、`center`、`end`、`space-between`、`space-around` 或 `space-evenly`。

<DemoBlock>

```vue
<template>
  <ZcRow>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow justify="center">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow justify="end">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow justify="space-between">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow justify="space-around">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
  <ZcRow justify="space-evenly">
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple-light" /></ZcCol>
    <ZcCol :span="6"><div class="grid-content ep-bg-purple" /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
.ep-bg-purple-light {
  background: #d6e4ff;
}
</style>
```

</DemoBlock>

## 响应式布局

参照了 Bootstrap 的响应式设计，预设了五个响应尺寸：`xs`、`sm`、`md`、`lg` 和 `xl`。

<DemoBlock>

```vue
<template>
  <ZcRow :gutter="10">
    <ZcCol :xs="8" :sm="6" :md="4" :lg="3" :xl="1"><div class="grid-content ep-bg-purple" /></ZcCol>
    <ZcCol :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
      ><div class="grid-content ep-bg-purple-light"
    /></ZcCol>
    <ZcCol :xs="4" :sm="6" :md="8" :lg="9" :xl="11"
      ><div class="grid-content ep-bg-purple"
    /></ZcCol>
    <ZcCol :xs="8" :sm="6" :md="4" :lg="3" :xl="1"
      ><div class="grid-content ep-bg-purple-light"
    /></ZcCol>
  </ZcRow>
</template>

<style>
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
.ep-bg-purple-light {
  background: #d6e4ff;
}
</style>
```

</DemoBlock>

## 列推拉

通过 `push` 和 `pull` 属性调整列的排列顺序。

<DemoBlock>

```vue
<template>
  <ZcRow :gutter="20">
    <ZcCol :span="8" :push="16"><div class="grid-content ep-bg-purple">push 16</div></ZcCol>
    <ZcCol :span="8" :pull="8"><div class="grid-content ep-bg-purple-light">pull 8</div></ZcCol>
  </ZcRow>
</template>

<style>
.zc-row {
  margin-bottom: 20px;
}
.zc-row:last-child {
  margin-bottom: 0;
}
.zc-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 14px;
}
.ep-bg-purple {
  background: #a0c3ff;
}
.ep-bg-purple-light {
  background: #d6e4ff;
}
</style>
```

</DemoBlock>

## Row API

<ApiTable type="props" :data="[
  { name: 'gutter', description: '栅格间隔', type: 'number', default: '0' },
  { name: 'justify', description: 'flex 布局下的水平排列方式', type: 'start | end | center | space-around | space-between | space-evenly', default: 'start' },
  { name: 'align', description: 'flex 布局下的垂直排列方式', type: 'top | middle | bottom', default: 'top' },
  { name: 'wrap', description: '是否允许换行', type: 'boolean', default: 'false' },
  { name: 'tag', description: '自定义元素标签', type: 'string', default: 'div' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义默认内容', childTags: 'Col' }
]" />

## Col API

<ApiTable type="props" :data="[
  { name: 'span', description: '栅格占据的列数', type: 'number', default: '24' },
  { name: 'offset', description: '栅格左侧的间隔格数', type: 'number', default: '0' },
  { name: 'push', description: '栅格向右移动格数', type: 'number', default: '0' },
  { name: 'pull', description: '栅格向左移动格数', type: 'number', default: '0' },
  { name: 'xs', description: '< 640px 响应式栅格数或者栅格属性对象', type: 'number | { span?, offset? }', default: '—' },
  { name: 'sm', description: '≥ 640px 响应式栅格数或者栅格属性对象', type: 'number | { span?, offset? }', default: '—' },
  { name: 'md', description: '≥ 768px 响应式栅格数或者栅格属性对象', type: 'number | { span?, offset? }', default: '—' },
  { name: 'lg', description: '≥ 1024px 响应式栅格数或者栅格属性对象', type: 'number | { span?, offset? }', default: '—' },
  { name: 'xl', description: '≥ 1280px 响应式栅格数或者栅格属性对象', type: 'number | { span?, offset? }', default: '—' },
  { name: 'tag', description: '自定义元素标签', type: 'string', default: 'div' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义默认内容' }
]" />
