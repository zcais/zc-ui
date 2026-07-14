# 在线演练 (Playground)

ZC UI 提供在线代码编辑环境，让你无需配置本地环境即可体验和学习所有组件。

## StackBlitz 演练场

在 StackBlitz 中打开预配置的 ZC UI 项目，直接修改代码查看效果：

<a href="https://stackblitz.com/edit/zc-ui-playground?file=src/App.vue" target="_blank" rel="noopener noreferrer">
  <img src="https://developer.stackblitz.com/img/open_in_stackblitz_small.svg" alt="在 StackBlitz 中打开" />
</a>

::: tip StackBlitz 优势
- **秒级启动**：无需安装依赖，基于 WebContainer 技术
- **完整 Node.js 环境**：支持 Vite + Vue 3 + TypeScript
- **实时预览**：代码修改后即时看到效果
- **可分享**：生成的 URL 可直接分享给他人
:::

## CodeSandbox 演练场

如果你更喜欢 CodeSandbox 的界面：

<a href="https://codesandbox.io/s/zc-ui-playground" target="_blank" rel="noopener noreferrer">
  <img src="https://assets.codesandbox.io/img/button-play.svg" alt="在 CodeSandbox 中打开" />
</a>

## 在 DemoBlock 中直接体验

文档站中每个组件示例都支持：

1. **查看源码**：点击「显示代码」查看完整示例代码
2. **复制代码**：点击「复制代码」一键复制到剪贴板
3. **在线编辑**：点击「在 StackBlitz 中打开」将示例代码发送到 StackBlitz 进行在线编辑

::: info
点击 DemoBlock 右下角的「在 StackBlitz 中打开」按钮，可以将当前示例代码自动发送到 StackBlitz 在线编辑器中运行。
:::

## 本地快速开始

如果你想本地开发，最快的开始方式：

```bash
# 使用 degit 下载模板
npx degit zc-ui/zc-ui-starter my-app

cd my-app
pnpm install
pnpm dev
```

## 创建你自己的演练场

### 最小示例

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ZcButton, ZcInput, ZcTag } from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'

const text = ref('Hello ZC UI!')
</script>

<template>
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 16px;">
    <h1>ZC UI Playground</h1>
    <ZcInput v-model="text" placeholder="请输入文字" />
    <ZcTag type="primary">{{ text }}</ZcTag>
    <ZcButton type="primary" @click="text = 'Clicked!'">点击我</ZcButton>
  </div>
</template>
```

### 完整应用模板

对于更复杂的场景，我们提供了多个起步模板：

| 模板 | 说明 | StackBlitz | CodeSandbox |
| --- | --- | --- | --- |
| 基础模板 | 最小化 Vue 3 + ZC UI | [打开](https://stackblitz.com/edit/zc-ui-basic) | [打开](https://codesandbox.io/s/zc-ui-basic) |
| 表单示例 | 完整表单组件演示 | [打开](https://stackblitz.com/edit/zc-ui-form) | [打开](https://codesandbox.io/s/zc-ui-form) |
| 数据表格 | Table + 分页 + 搜索 | [打开](https://stackblitz.com/edit/zc-ui-table) | [打开](https://codesandbox.io/s/zc-ui-table) |
| 后台管理 | Dashboard 布局示例 | [打开](https://stackblitz.com/edit/zc-ui-admin) | [打开](https://codesandbox.io/s/zc-ui-admin) |
| 主题定制 | 动态主题切换演示 | [打开](https://stackblitz.com/edit/zc-ui-theme) | [打开](https://codesandbox.io/s/zc-ui-theme) |

## 在线编辑器的局限性

在线编辑器适合快速原型和学习，但有以下限制：

- **文件系统**：无法访问本地文件系统
- **构建性能**：大型项目可能加载较慢
- **浏览器兼容性**：StackBlitz WebContainer 需要现代浏览器支持

对于正式项目开发，请使用本地开发环境。
