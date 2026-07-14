# Divider 分割线

用于分隔内容的分割线组件，支持水平/垂直方向、文字对齐和多种线条样式。

## 基础用法

默认渲染为水平分割线。

<DemoBlock>

```vue
<template>
  <div>
    <p>第一段内容</p>
    <ZcDivider />
    <p>第二段内容</p>
  </div>
</template>
```

</DemoBlock>

## 带文字的分割线

使用默认插槽添加文字，通过 `contentPosition` 控制对齐方式。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider content-position="left">左对齐文字</ZcDivider>
    <ZcDivider content-position="center">居中文字</ZcDivider>
    <ZcDivider content-position="right">右对齐文字</ZcDivider>
  </div>
</template>
```

</DemoBlock>

## 垂直分割线

通过 `direction` 属性设置为 `vertical`，在行内元素之间使用。

<DemoBlock>

```vue
<template>
  <div style="display: flex; align-items: center;">
    <span>文本一</span>
    <ZcDivider direction="vertical" />
    <a href="#">链接</a>
    <ZcDivider direction="vertical" />
    <span>文本二</span>
  </div>
</template>
```

</DemoBlock>

## 虚线样式

通过 `dashed` 属性或 `borderStyle` 属性设置线条样式。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider />
    <ZcDivider dashed>虚线带文字</ZcDivider>
    <ZcDivider border-style="dotted">点线样式</ZcDivider>
  </div>
</template>
```

</DemoBlock>

## Divider API

### Props

<ApiTable type="props" :data="[
  { name: 'direction', description: '分割线方向', type: '\'horizontal\' | \'vertical\'', default: '\'horizontal\'' },
  { name: 'contentPosition', description: '文字对齐（水平方向有效）', type: '\'left\' | \'center\' | \'right\'', default: '\'center\'' },
  { name: 'borderStyle', description: '线条样式', type: '\'solid\' | \'dashed\' | \'dotted\' | \'double\'', default: '\'solid\'' },
  { name: 'dashed', description: '是否为虚线（快捷设置）', type: 'boolean', default: 'false' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '分割线上的文字内容（仅水平方向）' },
]" />
