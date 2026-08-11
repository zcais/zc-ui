# Divider 分割线

用于分隔内容的分割线组件，支持水平/垂直方向、文字对齐、多种线条样式、自定义间距和图标插槽。

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

## 自定义线宽

通过 `border-width` 属性自定义线条粗细，适用于强调分隔场景。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider border-width="1px">标准线宽</ZcDivider>
    <ZcDivider border-width="2px">加粗线宽</ZcDivider>
    <ZcDivider border-width="3px" border-style="dashed">粗虚线</ZcDivider>
    <div style="display: flex; align-items: center;">
      <span>垂直加粗</span>
      <ZcDivider direction="vertical" border-width="2px" />
      <span>分隔</span>
    </div>
  </div>
</template>
```

</DemoBlock>

## 自定义间距

通过 `margin` 属性控制水平分割线上下间距，通过 `height` 属性控制垂直分割线高度。

<DemoBlock>

```vue
<template>
  <div>
    <p>紧凑间距</p>
    <ZcDivider margin="8px 0" />
    <p>小间距</p>
    <ZcDivider margin="12px 0" />
    <p>大间距</p>
    <ZcDivider margin="40px 0" />

    <div style="display: flex; align-items: center; margin-top: 16px;">
      <span>短</span>
      <ZcDivider direction="vertical" height="16px" />
      <span>中</span>
      <ZcDivider direction="vertical" height="24px" />
      <span>高</span>
      <ZcDivider direction="vertical" height="32px" />
    </div>
  </div>
</template>
```

</DemoBlock>

## 带图标的分割线

通过 `icon` 插槽在文字前添加图标，适用于带标识的分区标题。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider content-position="left">
      <template #icon>
        <span style="font-size: 16px;">⚙</span>
      </template>
      系统设置
    </ZcDivider>
    <ZcDivider content-position="left">
      <template #icon>
        <span style="font-size: 16px;">📋</span>
      </template>
      数据报表
    </ZcDivider>
    <ZcDivider content-position="center">
      <template #icon>
        <span style="color: #409eff;">★</span>
      </template>
      收藏内容
    </ZcDivider>
  </div>
</template>
```

</DemoBlock>

## 自定义内容占比

通过 `content-width` 属性控制左对齐 / 右对齐时内容侧线条的比例。

<DemoBlock>

```vue
<template>
  <div>
    <ZcDivider content-position="left" content-width="20%">左侧 20%</ZcDivider>
    <ZcDivider content-position="left" content-width="100px">左侧 100px</ZcDivider>
    <ZcDivider content-position="right" content-width="20%">右侧 20%</ZcDivider>
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
  { name: 'dashed', description: '是否为虚线（快捷设置，优先于 borderStyle）', type: 'boolean', default: 'false' },
  { name: 'plain', description: '简洁模式，文字使用更轻的样式', type: 'boolean', default: 'false' },
  { name: 'color', description: '自定义分割线颜色', type: 'string', default: '—' },
  { name: 'borderWidth', description: '自定义线条粗细（如 \'2px\'）', type: 'string', default: '—' },
  { name: 'margin', description: '水平分割线上下间距（如 \'16px 0\'）', type: 'string', default: '24px 0' },
  { name: 'height', description: '垂直分割线高度（如 \'24px\'、\'2em\'）', type: 'string', default: '1em' },
  { name: 'contentWidth', description: '左/右对齐时内容侧线条宽度（如 \'20%\'、\'100px\'），仅对非居中对齐生效', type: 'string', default: '5%' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '分割线上的文字内容（仅水平方向）' },
  { name: 'icon', description: '文字前的图标内容（仅水平方向）' },
]" />
