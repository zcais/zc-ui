# Watermark 水印

用于给页面或组件添加水印，防止信息被截图或复制。

## 文字水印

通过 `content` 属性设置水印文字内容。

<DemoBlock>

```vue
<template>
  <ZcWatermark content="ZC UI">
    <div
      style="width: 300px; height: 200px; background: #f5f7fa; border-radius: 4px; padding: 16px;"
    >
      <p>这里是需要保护的内容区域。</p>
    </div>
  </ZcWatermark>
</template>
```

</DemoBlock>

## 多行水印

`content` 属性支持数组，可以设置多行水印文字。

<DemoBlock>

```vue
<template>
  <ZcWatermark :content="['内部机密', '请勿外传']" :gap="[120, 80]">
    <div
      style="width: 300px; height: 200px; background: #f5f7fa; border-radius: 4px; padding: 16px;"
    >
      <p>这里是需要保护的内容区域。</p>
    </div>
  </ZcWatermark>
</template>
```

</DemoBlock>

## 自定义样式

通过属性自定义水印的字体、颜色、旋转角度等样式。

<DemoBlock>

```vue
<template>
  <ZcWatermark
    content="ZC UI"
    :font-size="16"
    :rotate="-30"
    color="rgba(64, 158, 255, 0.15)"
    :gap="[100, 100]"
  >
    <div
      style="width: 300px; height: 200px; background: #f5f7fa; border-radius: 4px; padding: 16px;"
    >
      <p>这里是需要保护的内容区域。</p>
    </div>
  </ZcWatermark>
</template>
```

</DemoBlock>

## Watermark API

### Props

<ApiTable type="props" :data="[
{ name: 'content', description: '水印内容', type: 'string | string[]', default: `''` },
{ name: 'image', description: '水印图片 URL（覆盖文字水印）', type: 'string', default: `''` },
{ name: 'fontSize', description: '字体大小(px)', type: 'number', default: '14' },
{ name: 'fontFamily', description: '字体', type: 'string', default: `'sans-serif'` },
{ name: 'color', description: '水印颜色', type: 'string', default: `'rgba(0, 0, 0, 0.12)'` },
{ name: 'fontWeight', description: '字体粗细', type: 'string | number', default: `'normal'` },
{ name: 'fontStyle', description: '字体样式', type: 'string', default: `'normal'` },
{ name: 'rotate', description: '旋转角度', type: 'number', default: '-22' },
{ name: 'opacity', description: '透明度', type: 'number', default: '1' },
{ name: 'gap', description: '水印之间的间距 [x, y](px)', type: '[number, number]', default: '[100, 100]' },
{ name: 'offset', description: '水印的偏移量 [x, y](px)', type: '[number, number]', default: '[0, 0]' },
{ name: 'zIndex', description: '水印层的 z-index', type: 'number', default: '9' },
{ name: 'disabled', description: '是否禁用水印', type: 'boolean', default: 'false' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '需要添加水印的内容' },
]" />
