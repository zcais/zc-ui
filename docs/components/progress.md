# Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

## 线形进度条

最基础的线形进度条。

<DemoBlock>

```vue
<template>
  <ZcProgress :percentage="50" />
  <ZcProgress :percentage="100" status="success" />
  <ZcProgress :percentage="70" status="warning" />
  <ZcProgress :percentage="30" status="exception" />
</template>
```

</DemoBlock>

## 百分比内显

设置 `text-inside` 属性将百分比显示在进度条内部。

<DemoBlock>

```vue
<template>
  <ZcProgress :percentage="80" text-inside />
  <ZcProgress :percentage="100" status="success" text-inside />
  <ZcProgress :percentage="50" status="warning" text-inside stroke-width="22" />
</template>
```

</DemoBlock>

## 环形进度条

通过设置 `type` 属性为 `circle` 或 `dashboard` 使用环形进度条。

<DemoBlock>

```vue
<template>
  <ZcProgress type="circle" :percentage="75" :width="120" />
  <ZcProgress type="circle" :percentage="100" status="success" :width="120" />
  <ZcProgress type="dashboard" :percentage="60" :width="120" />
</template>
```

</DemoBlock>

## 条纹动画

通过 `striped` 和 `striped-flow` 属性启用条纹动画效果。

<DemoBlock>

```vue
<template>
  <ZcProgress :percentage="30" striped />
  <ZcProgress :percentage="60" striped striped-flow />
  <ZcProgress :percentage="100" status="success" striped striped-flow />
</template>
```

</DemoBlock>

## Progress API

### Props

<ApiTable type="props" :data="[
{ name: 'type', description: '进度条类型', type: `'line' | 'circle' | 'dashboard'`, default: `'line'` },
{ name: 'percentage', description: '百分比（0-100）', type: 'number', default: '0' },
{ name: 'status', description: '进度条状态', type: `'primary' | 'success' | 'warning' | 'exception' | 'info'`, default: `'primary'` },
{ name: 'strokeWidth', description: '进度条宽度(px)', type: 'number', default: '6' },
{ name: 'textInside', description: '进度条显示文字内置', type: 'boolean', default: 'false' },
{ name: 'showText', description: '是否显示进度文字', type: 'boolean', default: 'true' },
{ name: 'width', description: '环形进度条画布宽度', type: 'number', default: '126' },
{ name: 'color', description: '自定义颜色（覆盖 status 颜色）', type: 'string', default: `''` },
{ name: 'striped', description: '是否启用条纹', type: 'boolean', default: 'false' },
{ name: 'stripedFlow', description: '是否启用条纹动画', type: 'boolean', default: 'false' },
{ name: 'duration', description: '动画时长(秒)', type: 'number', default: '3' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义内容（仅 circle/dashboard），作用域参数: { percentage }' },
]" />
