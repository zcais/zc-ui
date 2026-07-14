# 快速上手

本指南将帮助你快速开始使用 ZC UI 组件库。

## 环境要求

- Node.js >= 18
- Vue >= 3.4

## 完整引入

在你的 `main.ts` 中添加如下代码：

```ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'

import App from './App.vue'

const app = createApp(App)
app.use(ZcUI)
app.mount('#app')
```

以上代码便完成了 ZC UI 的引入。需要注意的是，样式文件需要单独引入。

## 按需引入

ZC UI 支持基于 ES Module 的按需引入，所有组件均支持 Tree Shaking：

```ts
import { ZcButton, ZcInput } from '@zc-ui/components'
import '@zc-ui/components/styles'

// 在组件中使用
export default {
  components: { ZcButton, ZcInput },
}
```

如果你使用 `<script setup>`，可以直接导入使用：

```vue
<script setup lang="ts">
import { ZcButton } from '@zc-ui/components'
import '@zc-ui/components/styles'
</script>

<template>
  <ZcButton type="primary">点击我</ZcButton>
</template>
```

## 全局类型

ZC UI 提供了完善的 TypeScript 类型定义。你可以直接使用组件的类型：

```ts
import type { ButtonType, ButtonSize } from '@zc-ui/components'

const buttonType: ButtonType = 'primary'
const buttonSize: ButtonSize = 'medium'
```

## 浏览器支持

| 浏览器  | 版本  |
| ------- | ----- |
| Chrome  | >= 80 |
| Firefox | >= 80 |
| Safari  | >= 14 |
| Edge    | >= 80 |

## 下一步

- 查看 [安装](./installation) 了解更多安装方式
- 浏览 [组件总览](/components/button) 了解所有可用组件
