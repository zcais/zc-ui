<div align="center">

# ZC UI

Vue 3 企业级 UI 组件库

[![CI](https://github.com/zc-ui/zc-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/zc-ui/zc-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@zc-ui/components.svg)](https://www.npmjs.com/package/@zc-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.4+-42b883.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5+-3178c6.svg)](https://www.typescriptlang.org/)

</div>

## ✨ 特性

- 🎯 **Vue 3 Composition API** — 全面拥抱 Vue 3，更好的类型推导和逻辑复用
- 🔒 **TypeScript** — 源码使用 TypeScript 编写，提供完整的类型定义
- 🎨 **30+ 组件** — 覆盖布局、表单、数据展示、反馈等常见场景
- 🌈 **主题定制** — 基于 CSS 变量的主题系统，轻松实现暗色模式和自定义主题
- 📦 **按需引入** — 支持 ESM 按需引入，配合 Vite 实现极致的 Tree Shaking
- 🌍 **国际化** — 内置多语言支持
- 📖 **完善的文档** — VitePress 交互式文档站，在线预览每个组件

## 📦 安装

```bash
# npm
npm install @zc-ui/components

# yarn
yarn add @zc-ui/components

# pnpm
pnpm add @zc-ui/components
```

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

## 🎨 可用包

| 包名                | 说明                     |
| ------------------- | ------------------------ |
| `@zc-ui/components` | 组件库（30+ Vue 3 组件） |
| `@zc-ui/utils`      | 通用工具函数             |
| `@zc-ui/hooks`      | Vue 3 Composables        |
| `@zc-ui/locale`     | 国际化 (i18n)            |
| `@zc-ui/theme`      | 主题与设计变量           |

## 🧩 组件总览

### 基础组件

Button、Icon

### 布局组件

Container、Header、Aside、Main、Footer、Row、Col、Space、Grid、GridItem

### 表单组件

Input、Switch、Checkbox、CheckboxGroup、Radio、RadioGroup、Select、Form、FormItem、DatePicker

### 数据展示

Tag、Badge、Avatar、Empty、Skeleton、Table

### 反馈 & 导航

Tooltip、Dialog、Pagination、Message、Notification、Loading

## 🛠️ 技术栈

- **Monorepo**: pnpm workspace
- **框架**: Vue 3 + TypeScript
- **构建**: Vite / Rollup
- **文档**: VitePress
- **测试**: Vitest + Vue Test Utils
- **代码规范**: ESLint 9 (Flat Config) + Prettier
- **Git 规范**: Husky + lint-staged + commitlint
- **发布**: Changesets
- **CI/CD**: GitHub Actions

## 📖 文档

- 🏠 [在线文档](https://zc-ui.github.io/zc-ui/)
- 📦 [npm 包](https://www.npmjs.com/package/@zc-ui/components)

## 💻 开发

```bash
# 克隆项目
git clone https://github.com/zc-ui/zc-ui.git
cd zc-ui

# 安装依赖
pnpm install

# 启动文档开发服务器
pnpm dev

# 构建所有子包
pnpm build

# 运行测试
pnpm test
```

## 📜 License

[MIT](./LICENSE)
