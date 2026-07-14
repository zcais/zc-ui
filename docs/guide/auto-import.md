# 自动导入 Resolver

ZC UI 提供了 `@zc-ui/resolver` 包，用于配合 [`unplugin-vue-components`](https://github.com/unplugin/unplugin-vue-components) 和 [`unplugin-auto-import`](https://github.com/unplugin/unplugin-auto-import) 实现组件按需自动导入。

## 特性

- ✅ 组件自动按需导入（无需手动 `import`）
- ✅ CSS 样式自动导入（全量或按组件）
- ✅ SSR 模式支持
- ✅ 自定义包名和样式路径
- ✅ 支持排除/包含指定组件

## 安装

::: warning 前置条件
请先安装 `unplugin-vue-components` 和 `unplugin-auto-import`。
:::

```bash
# npm
npm install -D unplugin-vue-components unplugin-auto-import @zc-ui/resolver

# pnpm
pnpm add -D unplugin-vue-components unplugin-auto-import @zc-ui/resolver

# yarn
yarn add -D unplugin-vue-components unplugin-auto-import @zc-ui/resolver
```

## 快速开始

### Vite 配置

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ZcUiResolver } from '@zc-ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [ZcUiResolver()],
    }),
  ],
})
```

### 在模板中使用

配置完成后，你可以在 `<template>` 中直接使用 ZC UI 组件，无需手动导入：

```vue
<template>
  <ZcButton type="primary">按钮</ZcButton>
  <ZcInput v-model="value" placeholder="请输入" />
  <ZcSelect v-model="selected">
    <ZcSelectOption value="1">选项一</ZcSelectOption>
  </ZcSelect>
</template>

<script setup lang="ts">
// 无需 import { ZcButton, ZcInput, ZcSelect } from '@zc-ui/components'
</script>
```

## 配置选项

`ZcUiResolver()` 接受以下选项：

```ts
interface ZcUiResolverOptions {
  /** CSS 样式导入方式 */
  importStyle?: 'full' | 'component' | false
  /** 是否为 SSR 模式 */
  ssr?: boolean
  /** 自定义组件包名 */
  packageName?: string
  /** 自定义 CSS 导入路径 */
  stylePath?: string
  /** 排除的组件列表 */
  exclude?: string[]
  /** 仅包含的组件列表 */
  include?: string[]
  /** 组件名前缀 */
  prefix?: string
}
```

### importStyle

| 值 | 说明 |
| --- | --- |
| `'full'` (默认) | 导入完整样式文件 `@zc-ui/components/styles` |
| `'component'` | 按组件导入各自 CSS，如 `@zc-ui/components/styles/button.css` |
| `false` | 不自动导入 CSS（需手动引入） |

```ts
// 按组件导入 CSS
Components({
  resolvers: [ZcUiResolver({ importStyle: 'component' })],
})

// 完全不导入 CSS（比如你使用了 Tailwind CSS 等方案）
Components({
  resolvers: [ZcUiResolver({ importStyle: false })],
})
```

### SSR 模式

如果你的项目使用 Nuxt 或其他 SSR 框架，使用 SSR 模式：

```ts
import { ZcUiResolver } from '@zc-ui/resolver'

Components({
  resolvers: [ZcUiResolver({ ssr: true })],
})
```

或直接使用 `ZcUiResolverSSR` 快捷函数：

```ts
import { ZcUiResolverSSR } from '@zc-ui/resolver'

Components({
  resolvers: [ZcUiResolverSSR()],
})
```

### exclude / include

```ts
// 排除某些组件（比如你手动导入的）
Components({
  resolvers: [
    ZcUiResolver({
      exclude: ['ZcMessage', 'ZcNotification'],
    }),
  ],
})

// 只自动导入部分组件
Components({
  resolvers: [
    ZcUiResolver({
      include: ['ZcButton', 'ZcInput', 'ZcSelect'],
    }),
  ],
})
```

### 自定义包名

如果你使用了 fork 版本或自定义发布名称：

```ts
Components({
  resolvers: [
    ZcUiResolver({
      packageName: '@my-org/zc-ui',
      stylePath: '@my-org/zc-ui/dist/styles',
    }),
  ],
})
```

## 配合 unplugin-auto-import

除了组件自动导入，你还可以配合 `unplugin-auto-import` 自动导入 ZC UI 的函数式 API：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ZcUiResolver } from '@zc-ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      imports: [
        // 自动导入 ZcMessage、ZcNotification 等
        {
          '@zc-ui/components': [
            'ZcMessage',
            'ZcMessageCloseAll',
            'ZcNotification',
            'ZcNotificationCloseAll',
            'ZcLoadingService',
            'ZcLoadingDirective',
          ],
        },
      ],
    }),
    Components({
      resolvers: [ZcUiResolver()],
    }),
  ],
})
```

## 框架集成

### Nuxt 3

```ts
// nuxt.config.ts
import Components from 'unplugin-vue-components/nuxt'
import { ZcUiResolver } from '@zc-ui/resolver'

export default defineNuxtConfig({
  modules: [
    // 注册 unplugin
  ],
  vite: {
    plugins: [
      Components({
        resolvers: [ZcUiResolver({ ssr: true })],
      }),
    ],
  },
})
```

### Webpack

```ts
// vue.config.js / webpack.config.js
const Components = require('unplugin-vue-components/webpack')
const { ZcUiResolver } = require('@zc-ui/resolver')

module.exports = {
  configureWebpack: {
    plugins: [
      Components({
        resolvers: [ZcUiResolver()],
      }),
    ],
  },
}
```

### Rspack

```ts
// rspack.config.ts
import Components from 'unplugin-vue-components/rspack'
import { ZcUiResolver } from '@zc-ui/resolver'

export default {
  plugins: [
    Components({
      resolvers: [ZcUiResolver()],
    }),
  ],
}
```

## 完整示例

```ts
// vite.config.ts — 完整配置示例
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ZcUiResolver } from '@zc-ui/resolver'

export default defineConfig({
  plugins: [
    vue(),
    // 自动导入函数式 API
    AutoImport({
      imports: [
        {
          '@zc-ui/components': [
            'ZcMessage',
            'ZcNotification',
            'ZcLoadingService',
          ],
        },
      ],
    }),
    // 自动导入组件
    Components({
      resolvers: [
        ZcUiResolver({
          importStyle: 'full', // 全量 CSS
          // importStyle: 'component', // 按组件 CSS
        }),
      ],
    }),
  ],
})
```

## API

### ZcUiResolver(options?)

创建 ZC UI 组件 resolver。

- **options** `ZcUiResolverOptions`
- **返回** `ComponentResolver`

### ZcUiResolverSSR(options?)

创建 SSR 模式的 ZC UI 组件 resolver，等价于 `ZcUiResolver({ ssr: true, ...options })`。

- **options** `Omit<ZcUiResolverOptions, 'ssr'>`
- **返回** `ComponentResolver`

### resolveZcComponent(name, options?)

独立解析函数，返回组件解析信息。

- **name** `string` — 组件名称，如 `'ZcButton'`
- **options** `ZcUiResolverOptions`
- **返回** `ResolvedComponent | null | undefined`

```ts
import { resolveZcComponent } from '@zc-ui/resolver'

const result = resolveZcComponent('ZcButton')
// { name: 'ZcButton', from: '@zc-ui/components', sideEffects: ['@zc-ui/components/styles'] }
```

## 支持的组件

Resolver 自动支持所有 `@zc-ui/components` 中导出的组件，包括：

| 类别 | 组件 |
| --- | --- |
| 基础 | Button, Icon |
| 布局 | Row, Col, Container, Header, Aside, Main, Footer, Space, Grid, GridItem |
| 表单 | Input, Select, Switch, Checkbox, Radio, Form, DatePicker, InputNumber, Slider, Rate, Upload, Cascader 等 |
| 数据展示 | Table, Tag, Badge, Avatar, Tree, Image, Descriptions, Timeline, List, Carousel 等 |
| 反馈导航 | Tooltip, Dialog, Drawer, Message, Notification, Loading, Alert, Progress, Steps 等 |
| 导航 | Menu, Tabs, Breadcrumb, Dropdown, Pagination, Anchor, Backtop, Affix 等 |
