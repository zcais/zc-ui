# Spin 加载

独立的旋转加载指示器，支持独立显示、包裹内容和全屏覆盖三种模式。

## 基础用法

<DemoBlock>

```vue
<template>
  <ZcSpin />
</template>
```

</DemoBlock>

## 尺寸

提供 `large`、`medium`、`small` 三种尺寸。

<DemoBlock>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 24px">
    <ZcSpin size="large" />
    <ZcSpin size="medium" />
    <ZcSpin size="small" />
  </div>
</template>
```

</DemoBlock>

## 自定义颜色

通过 `color` 设置旋转器颜色。

<DemoBlock>

```vue
<template>
  <div style="display: flex; align-items: center; gap: 24px">
    <ZcSpin color="#52c41a" />
    <ZcSpin color="#ff4d4f" />
    <ZcSpin color="#722ed1" />
  </div>
</template>
```

</DemoBlock>

## 提示文字

通过 `tip` 设置加载提示文字。

<DemoBlock>

```vue
<template>
  <ZcSpin tip="加载中..." />
</template>
```

</DemoBlock>

## 包裹内容

使用默认插槽包裹内容，加载时自动遮罩。

<DemoBlock>

```vue
<template>
  <ZcSpin :spinning="loading" overlay>
    <div style="padding: 40px; border: 1px solid #eee; border-radius: 4px">
      <p>这是一段需要加载的内容。</p>
      <p>当 spinning 为 true 时，内容上方会显示加载遮罩。</p>
    </div>
  </ZcSpin>
</template>

<script setup>
import { ref } from 'vue'
const loading = ref(true)
</script>
```

</DemoBlock>

## 全屏加载

设置 `fullscreen` 全屏覆盖加载。

<DemoBlock>

```vue
<template>
  <ZcButton @click="showFull">显示全屏加载</ZcButton>
  <ZcSpin v-if="visible" fullscreen tip="请稍候..." />
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const showFull = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, 3000)
}
</script>
```

</DemoBlock>

## API

### Spin Props

| 属性名     | 说明                         | 类型                             | 默认值     |
| ---------- | ---------------------------- | -------------------------------- | ---------- |
| spinning   | 是否正在加载                 | `boolean`                        | `true`     |
| size       | 尺寸                         | `'large' \| 'medium' \| 'small'` | `'medium'` |
| tip        | 加载提示文字                 | `string`                         | `''`       |
| color      | 自定义旋转器颜色             | `string`                         | -          |
| fullscreen | 是否全屏覆盖                 | `boolean`                        | `false`    |
| delay      | 加载延迟（ms）               | `number`                         | `0`        |
| overlay    | 是否显示遮罩背景（包裹模式） | `boolean`                        | `false`    |

### Slots

| 插槽名  | 说明                           |
| ------- | ------------------------------ |
| default | 被包裹的内容（包裹模式下使用） |
