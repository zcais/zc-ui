# Anchor 锚点

用于跳转到页面指定位置，支持滚动监听自动高亮当前锚点。

## 基础用法

通过 `ZcAnchorLink` 定义锚点链接，点击可平滑滚动到对应位置。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <ZcAnchor :offset-top="20">
      <ZcAnchorLink href="#basic" title="基础用法" />
      <ZcAnchorLink href="#advanced" title="高级用法" />
      <ZcAnchorLink href="#api" title="API" />
    </ZcAnchor>
    <div style="flex: 1;">
      <div id="basic" style="height: 400px; padding: 20px; background: #f5f7fa;">
        <h3>基础用法</h3>
        <p>锚点组件的基础用法示例内容</p>
      </div>
      <div id="advanced" style="height: 400px; padding: 20px; background: #ecf5ff;">
        <h3>高级用法</h3>
        <p>锚点组件的高级用法示例内容</p>
      </div>
      <div id="api" style="height: 400px; padding: 20px; background: #f5f7fa;">
        <h3>API</h3>
        <p>锚点组件的 API 文档内容</p>
      </div>
    </div>
  </div>
</template>
```

</DemoBlock>

## 水平锚点

通过 `direction="horizontal"` 设置水平方向的锚点。

<DemoBlock>

```vue
<template>
  <ZcAnchor direction="horizontal" :offset-top="0">
    <ZcAnchorLink href="#part-1" title="章节一" />
    <ZcAnchorLink href="#part-2" title="章节二" />
    <ZcAnchorLink href="#part-3" title="章节三" />
  </ZcAnchor>
</template>
```

</DemoBlock>

## Anchor API

### Props

<ApiTable type="props" :data="[
{ name: 'container', description: '滚动容器选择器（默认 window）', type: 'string', default: `''` },
{ name: 'current (v-model)', description: '当前锚点', type: 'string', default: `''` },
{ name: 'offsetTop', description: '距顶部偏移量（px）', type: 'number', default: '0' },
{ name: 'direction', description: '方向', type: `'vertical' | 'horizontal'`, default: `'vertical'` },
{ name: 'bound', description: '高亮触发边界（px）', type: 'number', default: '80' },
{ name: 'smooth', description: '是否平滑滚动', type: 'boolean', default: 'true' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:current', description: '锚点变化', parameters: '(href: string)' },
  { name: 'click', description: '点击链接', parameters: '(event: MouseEvent, href: string)' },
  { name: 'change', description: '锚点变化', parameters: '(href: string)' },
]" />

### AnchorLink Props

<ApiTable type="props" :data="[
{ name: 'href', description: '目标锚点（如 #section-1）', type: 'string', default: `''` },
{ name: 'title', description: '链接标题', type: 'string', default: `''` },
{ name: 'level', description: '缩进层级', type: 'number', default: '0' },
]" />
