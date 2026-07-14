# Icon 图标

SVG 图标组件，支持自定义路径、尺寸和颜色。

## 基础用法

通过 `name` 属性传入内置图标库中的图标名称即可渲染图标。图标名称可在下方「图标集合」中查找（点击图标可复制名称）。

<DemoBlock>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 28px; flex-wrap: wrap">
    <ZcIconName name="heart" :size="28" />
    <ZcIconName name="star" :size="28" />
    <ZcIconName name="home" :size="28" />
    <ZcIconName name="circle-check" :size="28" />
    <ZcIconName name="bell" :size="28" />
    <ZcIconName name="brand-github" :size="28" />
  </div>
</template>
```

</DemoBlock>

## 尺寸与颜色

通过 `size` 属性控制图标尺寸（数字会自动转为 `px`，也支持 `'2em'`、`'1rem'` 等字符串），通过 `color` 属性自定义颜色。

<DemoBlock>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 28px; flex-wrap: wrap">
    <ZcIconName name="heart" :size="40" color="#3c6ee0" />
    <ZcIconName name="heart" :size="28" color="#67c23a" />
    <ZcIconName name="heart" :size="20" color="#e6a23c" />
    <ZcIconName name="heart" :size="14" color="#f56c6c" />
  </div>
</template>
```

</DemoBlock>

## 图标集合

ZC UI 内置 **5093** 个矢量图标（源自 [@tabler/icons](https://tabler.io/icons)），按语义分为 16 个类别。点击任意图标可复制其名称，用于搜索或交流。

> 上方示例使用 `<ZcIconName>` 按名称渲染图标库中的矢量图标；基础 `ZcIcon` 组件则通过 `name`/`path` 属性接受原始 SVG path 数据，用于自定义场景，详见下方 API。

<IconGallery />

## Icon API

### Props

<ApiTable type="props" :data="[
  { name: 'name', description: 'SVG path data（d 属性值）', type: 'string', default: '' },
  { name: 'size', description: '图标尺寸（px 或 CSS 字符串）', type: 'number | string', default: '16' },
  { name: 'color', description: '图标颜色', type: 'string', default: '' },
  { name: 'path', description: 'SVG path d 属性（name 的替代方案）', type: 'string', default: '' },
  { name: 'viewBox', description: 'SVG viewBox 值', type: 'string', default: '0 0 24 24' },
  { name: 'label', description: '无障碍标签（传入则 role 为 img）', type: 'string', default: '' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义 SVG 内容（当未提供 name 或 path 时显示）' }
]" />

### Events

| 名称 | 描述         |
| ---- | ------------ |
| —    | 无自定义事件 |

## 注意事项

- **两种用法**：`<ZcIconName name="heart" />` 按名称渲染内置图标库的矢量图标；`<ZcIcon name="..." />` 则通过原始 SVG path 数据（`d` 属性值）渲染自定义图标。
- **查找图标名称**：内置图标的名称可在上方「图标集合」中浏览并复制。
- **渲染方式**：`ZcIcon` 以 `fill="currentColor"` 填充渲染，颜色会跟随 `color` 属性或父级文字颜色。
- **无障碍**：传入 `label` 属性时，Icon 会自动设置 `role="img"` 和 `aria-label`。未传入时设置 `aria-hidden="true"` 对屏幕阅读器隐藏装饰性图标。
- **尺寸单位**：`size` 属性支持数字（自动转 px）或 CSS 字符串（如 `'2em'`、`'1rem'`）。
- **性能建议**：对于大量图标场景，推荐使用 SVG sprite 或图标字体方案以减少 DOM 节点数量。
