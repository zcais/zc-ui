# @zc-ui/icons

## 1.0.2

### Patch Changes

- # 1.0.2 (patch 发布)

  ## 变更摘要

  优化提升版本，包含以下改进：

  - ⚡ 性能优化：减少不必要的响应式计算与重渲染
  - 🛠 优化组件内部逻辑，提升运行效率
  - 📝 持续完善文档与类型定义

## 1.0.1

### Patch Changes

- # 1.0.1 (patch 发布)

  ## 变更摘要

  首个公开稳定版本 1.0.0 之后的补丁更新，包含以下改进与修复：

  - 📦 优化构建产物：统一各包 ESM/CJS/UMD 输出与 `.d.ts` 类型文件
  - 🐛 修复若干已知问题，提升整体稳定性
  - 📝 完善组件文档（VitePress 站点：https://zcais.github.io/zc-ui）
  - 🔧 更新源码仓库地址为 `github.com/zcais/zc-ui`
  - ⚡️ 改进打包体积与 Tree-shaking 表现

  ## 包列表

  | 包名                | 当前  | 升级后 |
  | ------------------- | ----- | ------ |
  | `@zc-ui/components` | 1.0.0 | 1.0.1  |
  | `@zc-ui/hooks`      | 1.0.0 | 1.0.1  |
  | `@zc-ui/icons`      | 1.0.0 | 1.0.1  |
  | `@zc-ui/locale`     | 1.0.0 | 1.0.1  |
  | `@zc-ui/nuxt`       | 1.0.0 | 1.0.1  |
  | `@zc-ui/resolver`   | 1.0.0 | 1.0.1  |
  | `@zc-ui/theme`      | 1.0.0 | 1.0.1  |
  | `@zc-ui/utils`      | 1.0.0 | 1.0.1  |

- Updated dependencies
  - @zc-ui/utils@1.0.1

## 2.0.0

### Major Changes

- # 🎉 首次发布：@zc-ui/icons 1.0.0

  `@zc-ui/icons` 是一个独立的 npm 包，包含 **5093 个** Tabler 风格 SVG 图标，全部以 Vue 3 函数式组件形式提供。

  ## ✨ 特性
  - 🖼️ **5093 个图标**（自动生成自 [@tabler/icons](https://github.com/tabler/tabler-icons)）
  - 🌳 **完全 Tree-Shaking**——每个图标是独立 named export
  - 🎨 **统一 props API**：`size`、`color`、`strokeWidth`、`absoluteStrokeWidth`、`spin`
  - 🧩 **SSR 友好**——纯函数式组件
  - 📚 **TypeScript 完备类型**
  - 🔌 **全局注册表** `registerIcon()` / `getIcon()` 支持动态按名查找
  - 📦 **ESM + CJS** 双格式输出
  - 🪶 **轻量**——7.3 MB ESM，gzip 后 521 KB（按需引入基本零成本）

  ## 📦 安装

  ```bash
  npm install @zc-ui/icons
  # 或
  pnpm add @zc-ui/icons
  ```

  ## 🚀 用法

  ### 按需引入（推荐）

  ```ts
  import { ZcIconHome, ZcIconUser } from '@zc-ui/icons'
  ```

  ```vue
  <template>
    <ZcIconHome :size="32" color="tomato" />
  </template>
  ```

  ### 动态查找

  ```ts
  import { getIcon, getAllIconNames } from '@zc-ui/icons'

  const def = getIcon('home')
  console.log(getAllIconNames().length) // 5093
  ```

  ## 📐 Props

  | Prop                  | Type               | Default          |
  | --------------------- | ------------------ | ---------------- |
  | `size`                | `number \| string` | `24`             |
  | `color`               | `string`           | `'currentColor'` |
  | `strokeWidth`         | `number \| string` | `2`              |
  | `absoluteStrokeWidth` | `boolean`          | `false`          |
  | `spin`                | `boolean`          | `false`          |
  | `class`               | `string \| object` | `''`             |

  ## 🏷️ License

  MIT
