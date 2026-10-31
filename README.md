<div align="center">

# ZC UI

Vue 3 企业级 UI 组件库

[![CI](https://github.com/zcais/zc-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/zcais/zc-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@zc-ui/components.svg)](https://www.npmjs.com/package/@zc-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5+-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178c6.svg)](https://www.typescriptlang.org/)

</div>

## ✨ 特性

- 🎯 **Vue 3 Composition API** — 全面拥抱 Vue 3，更好的类型推导和逻辑复用
- 🔒 **TypeScript** — 源码使用 TypeScript 编写，提供完整的类型定义
- 🧱 **90+ 组件** — 覆盖布局、表单、数据展示、反馈、导航等常见场景
- 🌈 **主题定制** — 基于 CSS 变量 + Cascade Layers 的主题系统，支持暗色模式和运行时换肤
- 📦 **按需引入** — ESM Tree Shaking + `unplugin-vue-components` 自动导入
- 🌍 **国际化** — 内置 zh-CN / en-US 多语言，支持 ConfigProvider 注入
- ♿ **无障碍** — 关键组件符合 WAI-ARIA，axe-core 持续扫描
- 🧪 **质量保障** — 2500+ 单元测试、E2E（Playwright）、覆盖率门禁
- 📖 **完善的文档** — VitePress 交互式文档站，全部示例可在线运行

## 📦 安装

```bash
# npm
npm install @zc-ui/components

# yarn
yarn add @zc-ui/components

# pnpm
pnpm add @zc-ui/components
```

> 需要 Vue ≥ 3.5（组件内部使用了 `useId` 等 3.5 API）。

## 🚀 快速开始

### 完整引入

```ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'

const app = createApp(App)
app.use(ZcUI)
app.mount('#app')
```

### 按需引入

```vue
<script setup lang="ts">
import { ZcButton } from '@zc-ui/components'
import '@zc-ui/components/styles'
</script>

<template>
  <ZcButton type="primary">Hello ZC UI</ZcButton>
</template>
```

也可以配合 `unplugin-vue-components` 自动导入：

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ZcUiResolver } from '@zc-ui/resolver'

export default {
  plugins: [
    Components({
      resolvers: [ZcUiResolver()],
    }),
  ],
}
```

## 🎨 可用包

| 包名                | 说明                               |
| ------------------- | ---------------------------------- |
| `@zc-ui/components` | 组件库（90+ Vue 3 组件）           |
| `@zc-ui/utils`      | 通用工具函数                       |
| `@zc-ui/hooks`      | Vue 3 Composables                  |
| `@zc-ui/locale`     | 国际化 (i18n)                      |
| `@zc-ui/theme`      | 主题与设计变量                     |
| `@zc-ui/icons`      | 5000+ Tabler 风格 SVG 图标         |
| `@zc-ui/resolver`   | unplugin-vue-components 解析器     |
| `@zc-ui/nuxt`       | Nuxt 3 模块（自动导入 + 主题注入） |

## 🧩 组件总览

完整清单见[组件总览页](https://zcais.github.io/zc-ui/components/overview)。

**基础**：Button / Icon / Typography（Text、Title、Paragraph、Link）/ Card / Divider / Flex / Space / Grid

**布局**：Container / Row / Col / Splitter / Masonry

**表单**：Input / Select / DatePicker / TimePicker / Cascader / TreeSelect / AutoComplete / Mention / InputNumber / InputTag / InputOTP / Checkbox / Radio / Switch / Rate / Slider / ColorPicker / Upload / Transfer / Editable / Form

**数据展示**：Table / Tree / Tag / Badge / Avatar / Descriptions / Timeline / Statistic / StatisticCard / Calendar / Carousel / Image / ImageViewer / QRCode / Comment / CodeBlock / List / Collapse / TextEllipsis / Empty / Skeleton

**反馈 & 导航**：Dialog / Drawer / Message / MessageBox / Notification / Popover / Tooltip / Popconfirm / Alert / Tour / ActionSheet / ContextMenu / Menu / Tabs / Dropdown / Breadcrumb / Pagination / Steps / Anchor / Backtop / Affix / PageHeader / Segmented / Progress / Result / Spin / Loading / Watermark / FloatButton / ErrorBoundary / ConfigProvider

## 🛠️ 技术栈

- **Monorepo**: pnpm workspace
- **框架**: Vue 3 + TypeScript
- **构建**: Vite / Rollup
- **文档**: VitePress
- **测试**: Vitest + Vue Test Utils + Playwright
- **代码规范**: ESLint 9 (Flat Config) + Prettier
- **Git 规范**: Husky + lint-staged + commitlint
- **发布**: Changesets（8 包锁定同版本）
- **CI/CD**: GitHub Actions（lint / typecheck / test / build / bundle-size / E2E / 自动发布）

## 📖 文档

- 🏠 [在线文档](https://zcais.github.io/zc-ui/)
- 📦 [npm 包](https://www.npmjs.com/package/@zc-ui/components)

## 💻 开发

```bash
# 克隆项目
git clone https://github.com/zcais/zc-ui.git
cd zc-ui

# 安装依赖
pnpm install

# 启动文档开发服务器
pnpm dev

# 构建所有子包
pnpm build

# 运行测试
pnpm test

# E2E 测试
pnpm e2e
```

## 📜 License

[MIT](./LICENSE)
