# Divider 分割线

用于分隔内容的分割线组件，支持水平/垂直方向、文字对齐和多种线条样式。

## 基础用法

默认渲染为水平分割线。

<DemoBlock>

```vue
<template>
  <div>
    <p>青春是一个短暂的美梦，当你醒来时，它早已消失无踪。</p>
    <ZcDivider />
    <p>少量的邪恶足以抵消全部高贵的品质。</p>
  </div>
</template>
```

</DemoBlock>

## 带文字的分割线

使用默认插槽添加文字，通过 `content-position` 控制对齐位置。

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
  <div style="display: flex; align-items: center; gap: 4px;">
    <span>文本一</span>
    <ZcDivider direction="vertical" />
    <a href="#">链接</a>
    <ZcDivider direction="vertical" />
    <span>文本二</span>
  </div>
</template>
```

</DemoBlock>

## 线条样式

通过 `dashed` 属性快捷设置虚线，或通过 `border-style` 属性使用更多样式（`solid` / `dashed` / `dotted` / `double`）。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider border-style="solid">实线</ZcDivider>
    <ZcDivider border-style="dashed">虚线</ZcDivider>
    <ZcDivider border-style="dotted">点线</ZcDivider>
    <ZcDivider border-style="double">双线</ZcDivider>
  </div>
</template>
```

</DemoBlock>

## 简洁模式

通过 `plain` 属性使用更轻量的文字样式，适合次要分隔场景。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider>普通文字</ZcDivider>
    <ZcDivider plain>简洁文字</ZcDivider>
  </div>
</template>
```

</DemoBlock>

## 自定义颜色

通过 `color` 属性自定义分割线颜色。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider color="#409eff">蓝色分割线</ZcDivider>
    <ZcDivider color="#67c23a">绿色分割线</ZcDivider>
    <div style="display: flex; align-items: center;">
      <span>彩色</span>
      <ZcDivider direction="vertical" color="#e6a23c" />
      <span>垂直线</span>
    </div>
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
  { name: 'plain', description: '简洁模式，文字使用更轻的样式', type: 'boolean', default: 'false' },
  { name: 'color', description: '自定义分割线颜色', type: 'string', default: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '分割线上的文字内容（仅水平方向）' },
]" />
