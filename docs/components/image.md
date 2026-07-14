# Image 图片

增强的 img 标签，提供懒加载、自定义占位、图片预览等功能。

## 基础用法

可通过 `fit` 属性决定图片在容器内的填充方式。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px;">
    <ZcImage src="https://example.com/photo.jpg" fit="cover" width="200px" height="120px" />
    <ZcImage src="https://example.com/photo.jpg" fit="contain" width="200px" height="120px" />
    <ZcImage src="https://example.com/photo.jpg" fit="fill" width="200px" height="120px" />
  </div>
</template>
```

</DemoBlock>

## 图片预览

设置 `preview` 属性可开启点击图片预览大图功能。

<DemoBlock>

```vue
<template>
  <ZcImage src="https://example.com/photo.jpg" fit="cover" width="200px" height="120px" preview />
</template>
```

</DemoBlock>

## 圆角与懒加载

通过 `round` 设置圆角，`lazy` 开启懒加载。

<DemoBlock>

```vue
<template>
  <ZcImage
    src="https://example.com/photo.jpg"
    fit="cover"
    width="100px"
    height="100px"
    round
    lazy
  />
</template>
```

</DemoBlock>

## Image API

### Props

<ApiTable type="props" :data="[
{ name: 'src', description: '图片地址', type: 'string', default: `''` },
{ name: 'alt', description: '原生 alt 属性', type: 'string', default: `''` },
{ name: 'fit', description: '填充模式', type: `'fill' | 'contain' | 'cover' | 'none' | 'scale-down'`, default: `'fill'` },
{ name: 'width', description: '图片宽度', type: 'string | number', default: `''` },
{ name: 'height', description: '图片高度', type: 'string | number', default: `''` },
{ name: 'lazy', description: '是否开启懒加载', type: 'boolean', default: 'false' },
{ name: 'placeholder', description: '加载时占位图', type: 'string', default: `''` },
{ name: 'error', description: '加载失败时显示的图片', type: 'string', default: `''` },
{ name: 'preview', description: '是否开启预览', type: 'boolean', default: 'false' },
{ name: 'previewSrc', description: '预览图地址', type: 'string', default: `''` },
{ name: 'hideOnClickModal', description: '点击遮罩层是否关闭预览', type: 'boolean', default: 'true' },
{ name: 'zIndex', description: '预览遮罩层 z-index', type: 'number', default: '2000' },
{ name: 'round', description: '是否为圆形图片', type: 'boolean', default: 'false' },
{ name: 'loading', description: '原生加载策略', type: `'eager' | 'lazy'`, default: `'eager'` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'load', description: '图片加载成功时触发', parameters: '(event: Event)' },
  { name: 'error', description: '图片加载失败时触发', parameters: '(event: Event)' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'placeholder', description: '自定义加载时的占位内容' },
  { name: 'error', description: '自定义加载失败时的内容' },
]" />
