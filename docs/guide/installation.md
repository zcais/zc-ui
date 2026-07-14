# 安装

## npm 安装

```bash
# 使用 npm
npm install @zc-ui/components

# 使用 yarn
yarn add @zc-ui/components

# 使用 pnpm
pnpm add @zc-ui/components
```

## 子包独立安装

ZC UI 的每个子包都可以独立安装使用：

```bash
# 工具函数
pnpm add @zc-ui/utils

# Composables / Hooks
pnpm add @zc-ui/hooks

# 国际化
pnpm add @zc-ui/locale

# 主题与设计变量
pnpm add @zc-ui/theme
```

## CDN 引入

你可以通过 unpkg 或 jsdelivr 引入 ZC UI：

```html
<link rel="stylesheet" href="//unpkg.com/@zc-ui/components/dist/style.css" />
<script src="//unpkg.com/vue@3"></script>
<script src="//unpkg.com/@zc-ui/components"></script>
```

::: warning 注意
通过 CDN 引入时，组件库会挂载到 `window.ZcUI` 全局变量上。
:::

## 从源码构建

如果你想获取最新的开发版本，可以从源码构建：

```bash
git clone https://github.com/zc-ui/zc-ui.git
cd zc-ui
pnpm install
pnpm build
```

构建产物位于各子包的 `dist/` 目录中。
