# Avatar 头像

用户头像组件，支持图片、图标或文字展示。

## 基础用法

通过 `src` 属性设置图片地址，`size` 设置尺寸。

<DemoBlock>

```vue
<template>
  <ZcAvatar src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
  <ZcAvatar
    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    size="large"
  />
  <ZcAvatar
    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    size="small"
  />
</template>
```

</DemoBlock>

## 形状与图标

通过 `shape` 设置圆形或方形，`icon` 显示图标占位。

<DemoBlock>

```vue
<template>
  <ZcAvatar shape="circle" size="large" icon="el-icon-user" />
  <ZcAvatar shape="square" size="large" icon="el-icon-user" />
  <ZcAvatar shape="circle" size="medium" icon="el-icon-user" />
  <ZcAvatar shape="square" size="medium" icon="el-icon-user" />
</template>
```

</DemoBlock>

## 自定义尺寸与图片填充

`size` 支持数字自定义像素尺寸，`fit` 控制图片填充方式。

<DemoBlock>

```vue
<template>
  <ZcAvatar
    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    :size="60"
    shape="square"
    fit="cover"
  />
  <ZcAvatar
    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    :size="60"
    shape="square"
    fit="contain"
  />
</template>
```

</DemoBlock>

## 备用内容

图片加载失败时显示备用插槽内容。

<DemoBlock>

```vue
<template>
  <ZcAvatar src="invalid-url.jpg" size="large">
    <template #fallback>
      <span style="font-size: 20px; color: #909399;">U</span>
    </template>
  </ZcAvatar>
</template>
```

</DemoBlock>

## Avatar API

### Props

<ApiTable type="props" :data="[
  { name: 'src', description: '图片地址', type: 'string', default: '' },
  { name: 'size', description: '头像尺寸', type: 'large | medium | small | number', default: 'medium' },
  { name: 'shape', description: '头像形状', type: 'circle | square', default: 'circle' },
  { name: 'icon', description: '图标类名（图片加载失败或未提供 src 时显示）', type: 'string', default: '' },
  { name: 'alt', description: '图片 alt 文本', type: 'string', default: '' },
  { name: 'fit', description: '图片填充方式', type: 'fill | contain | cover | none | scale-down', default: 'cover' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义内容（当未提供 src、icon 且非加载失败时显示）' },
  { name: 'fallback', description: '图片加载失败或未提供 src 时的备用内容' }
]" />
