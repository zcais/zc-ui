# Skeleton 骨架屏

在页面数据加载前，先显示占位骨架，提升用户感知体验。

## 基础用法

默认显示标题和段落骨架。

<DemoBlock>

```vue
<template>
  <ZcSkeleton />
</template>
```

</DemoBlock>

## 显示头像

通过 `avatar` 属性显示头像骨架，支持配置尺寸和形状。

<DemoBlock>

```vue
<template>
  <ZcSkeleton avatar />
  <ZcSkeleton :avatar="{ size: 'large', shape: 'circle' }" />
  <ZcSkeleton :avatar="{ size: 'small', shape: 'square' }" />
</template>
```

</DemoBlock>

## 自定义段落行数

通过 `rows` 属性控制骨架段落的行数。

<DemoBlock>

```vue
<template>
  <ZcSkeleton :rows="2" />
  <ZcSkeleton :rows="4" />
  <ZcSkeleton :rows="6" />
</template>
```

</DemoBlock>

## 加载状态切换

通过 `loading` 属性控制骨架屏显示与隐藏，内容通过默认插槽提供。

<DemoBlock>

```vue
<template>
  <ZcSkeleton :loading="loading">
    <div style="padding: 12px; border: 1px solid #dcdfe6; border-radius: 4px;">
      实际加载完成的内容区域
    </div>
  </ZcSkeleton>
  <button @click="loading = !loading">{{ loading ? '显示内容' : '显示骨架' }}</button>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
```

</DemoBlock>

## Skeleton API

### Props

<ApiTable type="props" :data="[
  { name: 'rows', description: '段落行数（覆盖 paragraph.rows）', type: 'number', default: '0' },
  { name: 'animated', description: '是否显示动画', type: 'boolean', default: 'true' },
  { name: 'loading', description: '是否显示骨架屏（false 时显示插槽内容）', type: 'boolean', default: 'true' },
  { name: 'avatar', description: '是否显示头像骨架，可传入配置对象', type: 'boolean | SkeletonAvatarProps', default: 'false' },
  { name: 'title', description: '是否显示标题骨架', type: 'boolean', default: 'true' },
  { name: 'paragraph', description: '是否显示段落骨架，可传入配置对象', type: 'boolean | SkeletonParagraphProps', default: 'true' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '加载完成后的实际内容（loading 为 false 时显示）' },
{ name: 'template', description: '自定义骨架模板（loading 为 true 时显示），通常放置 ZcSkeletonItem' }
]" />

## SkeletonItem 骨架项

`ZcSkeletonItem` 是可独立使用的骨架基础部件，支持多种形状、动画、尺寸自定义。

### 基础用法

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <ZcSkeletonItem variant="text" />
    <ZcSkeletonItem variant="text" />
    <ZcSkeletonItem variant="circle" />
    <ZcSkeletonItem variant="rect" height="60px" />
    <ZcSkeletonItem variant="button" />
  </div>
</template>
```

</DemoBlock>

### 变体形状

通过 `variant` 属性选择不同的形状：`text` / `circle` / `rect` / `image` / `button`。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; align-items: flex-start;">
    <ZcSkeletonItem variant="text" width="120px" />
    <ZcSkeletonItem variant="circle" width="48" height="48" />
    <ZcSkeletonItem variant="rect" width="100px" height="60px" />
    <ZcSkeletonItem variant="button" width="100" />
    <ZcSkeletonItem variant="image" width="120" height="90" />
  </div>
</template>
```

</DemoBlock>

### 动画

支持三种动画：`wave`（默认，波浪流动）/ `shimmer`（渐变闪烁）/ `none`（无动画）。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <ZcSkeletonItem variant="rect" height="40px" animation="wave" />
    <ZcSkeletonItem variant="rect" height="40px" animation="shimmer" />
    <ZcSkeletonItem variant="rect" height="40px" animation="none" />
  </div>
</template>
```

</DemoBlock>

### 自定义尺寸

`width` 和 `height` 支持数字（自动加 px）或 CSS 字符串。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <ZcSkeletonItem variant="rect" width="100%" height="80px" />
    <ZcSkeletonItem variant="rect" width={300} height={60} />
    <ZcSkeletonItem variant="rect" width="20rem" height="3rem" />
  </div>
</template>
```

</DemoBlock>

### 圆角配置

通过 `rounded` 属性自定义圆角：`true` 使用默认圆角，`false` 为直角，数字或字符串自定义。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 12px;">
    <ZcSkeletonItem variant="rect" width="80" height="80" :rounded="true" />
    <ZcSkeletonItem variant="rect" width="80" height="80" :rounded="16" />
    <ZcSkeletonItem variant="rect" width="80" height="80" :rounded="false" />
  </div>
</template>
```

</DemoBlock>

### count 重复渲染

通过 `count` 属性重复渲染多个骨架项。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 8px;">
    <ZcSkeletonItem variant="text" :count="4" />
  </div>
</template>
```

</DemoBlock>

### rows 多行文本

当 `variant` 为 `text` 时，可使用 `rows` 属性自动生成多行文本骨架，最后一行会自动变窄。

<DemoBlock>

```vue
<template>
  <ZcSkeletonItem variant="text" :rows="4" />
</template>
```

</DemoBlock>

### 与 Skeleton 组合使用

`ZcSkeletonItem` 可作为 `ZcSkeleton` 的 `template` 插槽使用，实现自定义骨架布局。

<DemoBlock>

```vue
<template>
  <ZcSkeleton :loading="loading" animated>
    <div style="padding: 16px; border: 1px solid #dcdfe6; border-radius: 8px;">
      <h3>实际内容标题</h3>
      <p>这里是实际加载完成的内容段落。</p>
    </div>

    <template #template>
      <div style="display: flex; gap: 16px; align-items: flex-start;">
        <ZcSkeletonItem variant="circle" width="48" height="48" animation="shimmer" />
        <div style="flex: 1;">
          <ZcSkeletonItem variant="text" width="40%" />
          <div style="height: 8px;" />
          <ZcSkeletonItem variant="text" :rows="3" />
        </div>
      </div>
    </template>
  </ZcSkeleton>

  <button @click="loading = !loading" style="margin-top: 12px;">
    {{ loading ? '显示内容' : '显示骨架' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
```

</DemoBlock>

## SkeletonItem API

### Props

<ApiTable type="props" :data="[
  { name: 'variant', description: '形状变体：text / circle / rect / image / button', type: 'SkeletonItemVariant', default: 'text' },
  { name: 'width', description: '宽度，数字自动转 px，或 CSS 字符串', type: 'string | number', default: '-' },
  { name: 'height', description: '高度，数字自动转 px，或 CSS 字符串', type: 'string | number', default: '-' },
  { name: 'animation', description: '动画类型：wave / shimmer / none', type: 'SkeletonItemAnimation', default: 'wave' },
  { name: 'count', description: '重复渲染次数', type: 'number', default: '1' },
  { name: 'rows', description: '文本行数（仅 text 变体有效），最后一行较窄', type: 'number', default: '0' },
  { name: 'rounded', description: '圆角配置：true 默认圆角 / false 直角 / 数字 px / CSS 字符串', type: 'boolean | string | number', default: '-' }
]" />
