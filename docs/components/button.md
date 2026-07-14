# Button 按钮

常用的操作按钮，支持多种类型、尺寸和状态。

## 基础用法

使用 `type` 属性来定义按钮的样式。

<DemoBlock>

```vue
<template>
  <ZcButton>默认按钮</ZcButton>
  <ZcButton type="primary">主要按钮</ZcButton>
  <ZcButton type="success">成功按钮</ZcButton>
  <ZcButton type="warning">警告按钮</ZcButton>
  <ZcButton type="danger">危险按钮</ZcButton>
  <ZcButton type="info">信息按钮</ZcButton>
</template>
```

</DemoBlock>

## 按钮尺寸

通过 `size` 属性设置按钮大小。

<DemoBlock>

```vue
<template>
  <ZcButton size="large" type="primary">大型按钮</ZcButton>
  <ZcButton size="medium" type="primary">中等按钮</ZcButton>
  <ZcButton size="small" type="primary">小型按钮</ZcButton>
  <ZcButton size="mini" type="primary">迷你按钮</ZcButton>
</template>
```

</DemoBlock>

## 禁用状态

通过 `disabled` 属性设置按钮禁用状态。

<DemoBlock>

```vue
<template>
  <ZcButton disabled>禁用按钮</ZcButton>
  <ZcButton type="primary" disabled>禁用按钮</ZcButton>
  <ZcButton type="success" disabled>禁用按钮</ZcButton>
</template>
```

</DemoBlock>

## 加载状态

通过 `loading` 属性显示加载中状态。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" loading>加载中</ZcButton>
</template>
```

</DemoBlock>

## 圆角按钮

通过 `round` 属性设置圆角按钮。

<DemoBlock>

```vue
<template>
  <ZcButton round>圆角按钮</ZcButton>
  <ZcButton type="primary" round>主要按钮</ZcButton>
  <ZcButton type="success" round>成功按钮</ZcButton>
</template>
```

</DemoBlock>

## 朴素按钮

通过 `plain` 属性设置为朴素风格。

<DemoBlock>

```vue
<template>
  <ZcButton plain>朴素按钮</ZcButton>
  <ZcButton type="primary" plain>主要按钮</ZcButton>
  <ZcButton type="success" plain>成功按钮</ZcButton>
  <ZcButton type="danger" plain>危险按钮</ZcButton>
</template>
```

</DemoBlock>

## Button API

<ApiTable type="props" :data="[
  { name: 'type', description: '按钮类型', type: 'primary | success | warning | danger | info | default', default: 'default' },
  { name: 'size', description: '按钮尺寸', type: 'large | medium | small | mini', default: 'medium' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'loading', description: '是否加载中', type: 'boolean', default: 'false' },
  { name: 'round', description: '是否圆角', type: 'boolean', default: 'false' },
  { name: 'plain', description: '是否朴素', type: 'boolean', default: 'false' },
  { name: 'icon', description: '图标类名', type: 'string', default: '—' },
  { name: 'nativeType', description: '原生 type 属性', type: 'button | submit | reset', default: 'button' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'click', description: '点击按钮时触发', parameters: '(event: MouseEvent)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '按钮内容' }
]" />
