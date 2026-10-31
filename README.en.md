<div align="center">

# ZC UI

Enterprise-grade UI component library for Vue 3

[![CI](https://github.com/zcais/zc-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/zcais/zc-ui/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@zc-ui/components.svg)](https://www.npmjs.com/package/@zc-ui/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue](https://img.shields.io/badge/Vue-3.5+-42b883.svg)](https://vuejs.org/)

[简体中文](./README.md) | English

</div>

## ✨ Features

- 🎯 **Vue 3 Composition API** — first-class TypeScript typing and composable reuse
- 🧱 **90+ components** — layout, forms, data display, feedback, navigation and more
- 🌈 **Theming** — CSS variable + cascade layers based theming with dark mode and runtime skinning
- 📦 **Tree-shakeable** — ESM with `unplugin-vue-components` auto-import via `@zc-ui/resolver`
- 🌍 **i18n** — zh-CN / en-US built in, injectable through ConfigProvider
- ♿ **Accessible** — WAI-ARIA compliant core components, continuous axe-core scanning
- 🧪 **Quality** — 2500+ unit tests, Playwright E2E, coverage gates, bundle-size gates
- 📖 **Docs** — interactive VitePress documentation with runnable examples

## 📦 Install

```bash
npm install @zc-ui/components
# or
pnpm add @zc-ui/components
```

> Requires Vue ≥ 3.5.

## 🚀 Quick Start

### Full import

```ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'

const app = createApp(App)
app.use(ZcUI)
app.mount('#app')
```

### On-demand import with auto-resolver

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

## 📚 Documentation

- 🏠 [Documentation (Chinese)](https://zcais.github.io/zc-ui/)
- 📦 [npm: @zc-ui/components](https://www.npmjs.com/package/@zc-ui/components)

## 📜 License

[MIT](./LICENSE)
