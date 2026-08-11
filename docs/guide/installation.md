# 安装

本文档介绍如何安装和引入 ZC UI 组件库。

## 环境要求

在安装 ZC UI 之前，请确保你的项目满足以下条件：

| 依赖     | 最低版本                         | 说明                             |
| -------- | -------------------------------- | -------------------------------- |
| Node.js  | >= 18                            | 构建工具链和开发环境需要         |
| Vue      | >= 3.4                           | ZC UI 基于 Vue 3 Composition API |
| 包管理器 | pnpm >= 9 / npm >= 9 / yarn >= 3 | 推荐使用 pnpm                    |

::: tip 推荐使用 pnpm
ZC UI 使用 pnpm workspace 管理 monorepo，推荐使用 pnpm 以获得最佳开发体验。
:::

## 安装组件库

### 使用包管理器安装

```bash
# 使用 pnpm（推荐）
pnpm add @zc-ui/components

# 使用 npm
npm install @zc-ui/components

# 使用 yarn
yarn add @zc-ui/components
```

安装完成后，`@zc-ui/components` 会自动安装以下内部依赖：

| 依赖包          | 说明                      |
| --------------- | ------------------------- |
| `@zc-ui/utils`  | 通用工具函数              |
| `@zc-ui/hooks`  | Vue 3 Composables         |
| `@zc-ui/locale` | 国际化（i18n）系统        |
| `@zc-ui/theme`  | 设计令牌与 CSS 自定义属性 |

无需手动安装这些子包，它们会作为 `@zc-ui/components` 的依赖自动拉取。

### 验证安装

在你的 `main.ts` 中引入并注册：

```ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'

// 引入样式（必须）
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'

import App from './App.vue'

const app = createApp(App)
app.use(ZcUI)
app.mount('#app')
```

::: warning 样式必须单独引入
ZC UI 的 JS 和 CSS 是分离的，样式文件不会随 JS 自动导入。请确保引入了以下两个样式文件：

- `@zc-ui/components/styles` — 组件样式
- `@zc-ui/theme/styles` — 设计令牌（CSS 变量）

缺少任一文件会导致组件显示异常。
:::

更多使用方式请参考 [快速上手](./getting-started)。

## 包导出说明

`@zc-ui/components` 的 `package.json` 导出配置如下：

```json
{
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./styles": "./dist/style.css"
  }
}
```

| 导入路径                   | 说明          | 格式      |
| -------------------------- | ------------- | --------- |
| `@zc-ui/components`        | 组件 JS 代码  | ESM / CJS |
| `@zc-ui/components/styles` | 组件 CSS 样式 | CSS       |

所有导出均包含 TypeScript 类型定义（`.d.ts`），支持完整的类型推导。

## 按需引入

ZC UI 完全支持 Tree Shaking，直接按需导入组件即可：

```ts
import { ZcButton, ZcInput } from '@zc-ui/components'
import '@zc-ui/components/styles'
```

如需进一步实现自动导入（无需手动 `import`），请配合 [`@zc-ui/resolver`](#自动导入-resolver) 使用。详见 [自动导入指南](./auto-import)。

## 子包独立安装

虽然子包会随 `@zc-ui/components` 自动安装，但你也可以独立安装使用：

```bash
# 工具函数 — withInstall、DOM helpers 等
pnpm add @zc-ui/utils

# Composables / Hooks — useNamespace、useEventListener 等
pnpm add @zc-ui/hooks

# 国际化 — 内置中英文，支持自定义语言包
pnpm add @zc-ui/locale

# 主题与设计变量 — Design Tokens、CSS 自定义属性
pnpm add @zc-ui/theme
```

### 自动导入 Resolver

```bash
# Resolver — 配合 unplugin-vue-components 实现按需自动导入
pnpm add -D @zc-ui/resolver
```

`@zc-ui/resolver` 是开发依赖，仅在构建时使用，不会增加运行时体积。

### 子包导出一览

| 包名                | 主要导出       | 说明                             |
| ------------------- | -------------- | -------------------------------- |
| `@zc-ui/components` | `.` `./styles` | 组件库主包（JS + CSS）           |
| `@zc-ui/resolver`   | `.`            | unplugin-vue-components resolver |
| `@zc-ui/hooks`      | `.`            | Vue 3 Composables                |
| `@zc-ui/locale`     | `.`            | 国际化系统                       |
| `@zc-ui/theme`      | `.` `./styles` | 设计令牌 + CSS 变量              |
| `@zc-ui/utils`      | `.`            | 通用工具函数                     |

## CDN 引入

你可以通过 CDN 直接在 HTML 中引入 ZC UI，无需构建工具。

### unpkg

```html
<link rel="stylesheet" href="https://unpkg.com/@zc-ui/theme/styles" />
<link rel="stylesheet" href="https://unpkg.com/@zc-ui/components/dist/style.css" />
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/@zc-ui/components"></script>
```

### jsdelivr

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@zc-ui/theme/styles" />
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@zc-ui/components/dist/style.css" />
<script src="https://cdn.jsdelivr.net/npm/vue@3"></script>
<script src="https://cdn.jsdelivr.net/npm/@zc-ui/components"></script>
```

::: warning 注意

- CDN 引入时需要**同时引入** `@zc-ui/theme/styles`（设计令牌）和 `@zc-ui/components/dist/style.css`（组件样式）。
- 组件库会挂载到 `window.ZcUI` 全局变量上。
- CDN 方式适合快速原型开发，生产环境推荐使用包管理器 + 构建工具。
  :::

## 框架集成

### Vite

Vite 项目无需额外配置，安装后直接导入即可：

```ts
// main.ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
import App from './App.vue'

createApp(App).use(ZcUI).mount('#app')
```

### Nuxt 3

在 Nuxt 3 中使用 ZC UI，需要创建插件并配置样式：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  css: ['@zc-ui/components/styles', '@zc-ui/theme/styles'],
  build: {
    transpile: ['@zc-ui/components'],
  },
})
```

```ts
// plugins/zc-ui.ts
import { defineNuxtPlugin } from '#app'
import ZcUI from '@zc-ui/components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ZcUI)
})
```

更多 SSR 相关注意事项请参考 [SSR / Nuxt 兼容指南](./ssr)。

### Webpack

Webpack 项目同样直接导入即可，无需特殊配置：

```ts
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
```

如果遇到样式加载问题，请确保 `css-loader` 和 `style-loader` 已正确配置。

## TypeScript 支持

ZC UI 提供完整的 TypeScript 类型定义，无需额外安装 `@types` 包。

### 组件类型

```ts
import type { ButtonType, ButtonSize } from '@zc-ui/components'

const buttonType: ButtonType = 'primary'
const buttonSize: ButtonSize = 'medium'
```

### 组件实例类型

```ts
import type { ZcFormInstance } from '@zc-ui/components'

const formRef = ref<ZcFormInstance>()
formRef.value?.validate()
```

### tsconfig.json 配置

确保你的 `tsconfig.json` 中已配置正确的模块解析策略：

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "types": ["vue"]
  }
}
```

## 从源码构建

如果你想获取最新的开发版本或参与贡献，可以从源码构建：

```bash
git clone https://github.com/zcais/zc-ui.git
cd zc-ui
pnpm install
pnpm build
```

构建产物位于各子包的 `dist/` 目录中：

```
packages/
├── components/dist/   # @zc-ui/components 产物（.mjs / .cjs / .d.ts / style.css）
├── hooks/dist/        # @zc-ui/hooks 产物
├── locale/dist/       # @zc-ui/locale 产物
├── theme/dist/        # @zc-ui/theme 产物
├── utils/dist/        # @zc-ui/utils 产物
└── resolver/dist/     # @zc-ui/resolver 产物
```

::: tip 本地开发
使用 `pnpm dev` 启动 VitePress 文档站点，支持热更新和交互式示例，方便调试组件。
:::

## 下一步

- [快速上手](./getting-started) — 了解基本使用方式
- [自动导入](./auto-import) — 配置 unplugin-vue-components 自动导入
- [SSR / Nuxt 兼容](./ssr) — 在服务端渲染环境中使用
- [组件总览](/components/overview) — 浏览所有可用组件
- [主题定制](./theming) — 自定义设计令牌和样式
- [常见问题](./faq) — 查看安装和使用中的常见问题
