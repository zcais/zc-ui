# @zc-ui/icons

5000+ Tabler 风格的 SVG 图标，作为 Vue 3 函数式组件。

## 安装

```bash
npm install @zc-ui/icons
# 或
pnpm add @zc-ui/icons
```

## 使用

### 按需引入（推荐，Tree-Shaking 友好）

```ts
import { ZcIconAB, ZcIconHome, ZcIconUser } from '@zc-ui/icons'
```

### 全量引入

```ts
import * as ZcIcons from '@zc-ui/icons'
```

### 模板中使用

```vue
<script setup lang="ts">
import { ZcIconHome } from '@zc-ui/icons'
</script>

<template>
  <ZcIconHome :size="32" color="red" :spin="true" />
</template>
```

## Props

| Prop                  | Type               | Default          | 说明                 |
| --------------------- | ------------------ | ---------------- | -------------------- |
| `size`                | `number \| string` | `24`             | SVG 宽高             |
| `color`               | `string`           | `'currentColor'` | 描边颜色             |
| `strokeWidth`         | `number \| string` | `2`              | 描边宽度             |
| `absoluteStrokeWidth` | `boolean`          | `false`          | 是否使用绝对像素描边 |
| `spin`                | `boolean`          | `false`          | 是否旋转动画         |
| `class`               | `string \| object` | `''`             | 额外的 CSS 类        |

## 动态查找（高级）

每个图标在加载时会调用 `registerIcon()`，将其 SVG 数据注册到全局注册表。
你可以按字符串名动态渲染图标，无需 import 每个组件：

```ts
import { getIcon, getAllIconNames } from '@zc-ui/icons'

const def = getIcon('home') // { path, viewBox, strokeWidth, fill }
console.log(getAllIconNames().length) // 5000+
```

## 来源

图标自动生成自 [@tabler/icons](https://github.com/tabler/tabler-icons)，
所有图标遵循 MIT 协议。

## License

MIT
