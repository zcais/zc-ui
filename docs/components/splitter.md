# Splitter 分栏面板

用于将页面或容器分割为多个可调整大小的面板，支持水平/垂直方向拖拽调整。

## 基础用法

通过默认插槽放置面板内容，使用 `direction` 控制分割方向。

<DemoBlock>

```vue
<template>
  <ZcSplitter style="height: 200px">
    <div style="padding: 16px">左侧面板</div>
    <div style="padding: 16px">右侧面板</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 垂直分割

设置 `direction="vertical"` 实现上下分割。

<DemoBlock>

```vue
<template>
  <ZcSplitter direction="vertical" style="height: 300px">
    <div style="padding: 16px">上面板</div>
    <div style="padding: 16px">下面板</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 自定义初始比例

通过 `sizes` 设置各面板的初始比例（百分比）。

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[30, 70]" style="height: 200px">
    <div style="padding: 16px; background: #f5f7fa">30%</div>
    <div style="padding: 16px">70%</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 限制最小/最大尺寸

通过 `minSizes` 和 `maxSizes` 限制拖拽范围。

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[50, 50]" :min-sizes="[20, 20]" :max-sizes="[80, 80]" style="height: 200px">
    <div style="padding: 16px">最小20%</div>
    <div style="padding: 16px">最小20%</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 可折叠面板

设置 `collapsible` 后，双击分隔条可折叠前一个面板。

<DemoBlock>

```vue
<template>
  <ZcSplitter collapsible :sizes="[40, 60]" style="height: 200px">
    <div style="padding: 16px">双击分隔条折叠此面板</div>
    <div style="padding: 16px">面板 B</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 三面板嵌套

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[25, 50, 25]" style="height: 200px">
    <div style="padding: 16px; background: #f5f7fa">面板 A</div>
    <div style="padding: 16px">面板 B</div>
    <div style="padding: 16px; background: #f5f7fa">面板 C</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## API

### Splitter Props

<ApiTable type="props" :data="[
{ name: 'direction', description: '分割方向', type: '\'horizontal\' | \'vertical\'', default: '\'horizontal\'' },
{ name: 'sizes', description: '各面板初始尺寸（百分比）', type: 'number[]', default: '[50, 50]' },
{ name: 'minSizes', description: '各面板最小尺寸（百分比）', type: 'number[]', default: '[]' },
{ name: 'maxSizes', description: '各面板最大尺寸（百分比）', type: 'number[]', default: '[]' },
{ name: 'gutterSize', description: '分隔条宽度（px）', type: 'number', default: '6' },
{ name: 'collapsible', description: '是否支持双击折叠', type: 'boolean', default: 'false' },
{ name: 'disabled', description: '是否禁用拖拽', type: 'boolean', default: 'false' },
{ name: 'showGutterHandle', description: '是否显示分隔条指示器', type: 'boolean', default: 'true' },
]" />

### Splitter Events

<ApiTable type="events" :data="[
{ name: '(sizes: number[])', description: '面板尺寸变化时触发' },
{ name: '(sizes: number[])', description: '拖拽过程中持续触发' },
{ name: '(index: number, collapsed: boolean)', description: '面板折叠/展开时触发' }
]" />

### Slots

<ApiTable type="slots" :data="[
{ name: 'default', description: '面板内容，多个子元素对应多个面板' }
]" />
