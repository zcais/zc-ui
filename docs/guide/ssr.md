# SSR / Nuxt 兼容

ZC UI 全面支持服务端渲染（SSR），包括 Nuxt 3、Vite SSR 等场景。本文档介绍在 SSR 环境中使用 ZC UI 的注意事项和最佳实践。

## SSR 兼容性

### 已兼容的特性

- ✅ 所有组件均可在服务端正常渲染 HTML
- ✅ CSS 变量在服务端正确内联
- ✅ 函数式 API（Message、Notification、Loading）支持 SSR
- ✅ 主题系统（暗色模式、品牌色切换）兼容 SSR
- ✅ 国际化（i18n）支持 SSR

### 需要注意的组件

以下组件涉及浏览器 API（如 `window`、`document`），在 SSR 中需要特殊处理：

| 组件         | 说明                                    | SSR 处理             |
| ------------ | --------------------------------------- | -------------------- |
| Dialog       | 使用 ` teleport` 挂载到 `document.body` | 客户端激活后正常工作 |
| Drawer       | 同 Dialog                               | 客户端激活后正常工作 |
| Message      | 动态创建 DOM                            | 仅在客户端调用       |
| Notification | 动态创建 DOM                            | 仅在客户端调用       |
| Loading      | 操作 DOM                                | 指令形式在客户端激活 |
| Tooltip      | 依赖 Popper.js                          | 客户端激活后正常工作 |
| Popover      | 依赖 Popper.js                          | 客户端激活后正常工作 |
| Popconfirm   | 依赖 Popper.js                          | 客户端激活后正常工作 |
| Scrollbar    | 监听滚动事件                            | 客户端激活后正常工作 |
| Backtop      | 监听 `window.scroll`                    | 客户端激活后正常工作 |
| Affix        | 监听 `window.scroll`                    | 客户端激活后正常工作 |
| Carousel     | 使用 `requestAnimationFrame`            | 客户端激活后正常工作 |

## Nuxt 3 集成

### 安装

```bash
pnpm add @zc-ui/components
```

### 配置

在 `nuxt.config.ts` 中配置：

```ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  // 注册 ZC UI 组件
  build: {
    transpile: ['@zc-ui/components'],
  },
  // 引入全局样式
  css: ['@zc-ui/components/styles', '@zc-ui/theme/styles'],
  // Vite 别名（开发模式可选）
  vite: {
    resolve: {
      alias: {
        '@zc-ui/components': resolve(__dirname, '../packages/components/src/index.ts'),
      },
    },
  },
})
```

### 创建插件

在 `plugins/zc-ui.ts` 中注册：

```ts
import { defineNuxtPlugin } from '#app'
import ZcUI from '@zc-ui/components'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ZcUI)
})
```

### 使用组件

配置完成后，直接在模板中使用即可：

```vue
<template>
  <div>
    <ZcButton type="primary">按钮</ZcButton>
  </div>
</template>
```

## Vite SSR 集成

如果你使用 Vite 原生 SSR，需要确保样式被正确处理：

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  ssr: {
    noExternal: ['@zc-ui/components'],
  },
})
```

## 自动导入 + SSR

配合 `unplugin-vue-components` 实现自动导入时，使用 SSR 模式：

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
      resolvers: [ZcUiResolver({ ssr: true })],
    }),
  ],
})
```

详见[自动导入指南](./auto-import#ssr-模式)。

## 处理 hydration 不匹配

SSR 中可能出现 hydration mismatch 警告，常见原因和解决方案：

### 1. 条件渲染依赖客户端状态

```vue
<!-- ❌ 服务端和客户端渲染不一致 -->
<template>
  <ZcDialog v-model="visible" />
</template>

<script setup>
const visible = ref(true) // 服务端无 window，可能渲染不一致
</script>
```

```vue
<!-- ✅ 使用 onMounted 确保客户端激活后再操作 -->
<template>
  <ZcDialog v-model="visible" />
</template>

<script setup>
const visible = ref(false)

onMounted(() => {
  visible.value = true
})
</script>
```

### 2. 使用 ClientOnly 包裹

对于纯客户端组件，使用 `<ClientOnly>` 包裹：

```vue
<template>
  <ClientOnly>
    <ZcTooltip content="提示内容">
      <span>hover me</span>
    </ZcTooltip>
  </ClientOnly>
</template>
```

### 3. 函数式 API 的 SSR 安全调用

Message、Notification 等函数式 API 应仅在客户端调用：

```ts
import { ZcMessage } from '@zc-ui/components'

// ✅ 安全：检查是否在客户端
if (import.meta.client) {
  ZcMessage.success('操作成功')
}

// 或在事件回调中调用（事件回调仅在客户端触发）
const handleClick = () => {
  ZcMessage.success('操作成功')
}
```

## 主题与暗色模式的 SSR 处理

### 避免闪烁（FOUC）

在 SSR 中切换暗色模式时，可能出现样式闪烁。推荐在 `index.html` 中添加内联脚本：

```html
<script>
  // 在页面渲染前同步设置主题
  ;(function () {
    var theme = localStorage.getItem('zc-theme') || 'light'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  })()
</script>
```

### ConfigProvider 的 SSR 支持

`<ZcConfigProvider>` 在 SSR 中可以正常传递配置：

```vue
<template>
  <ZcConfigProvider :locale="zhCN" :size="'default'">
    <NuxtPage />
  </ZcConfigProvider>
</template>
```

## 常见问题

### Q: SSR 报错 `window is not defined`?

确保没有在组件的 `setup` 顶层直接访问 `window`。使用 `onMounted` 或 `import.meta.client` 进行客户端检查。

### Q: 样式在 SSR 中丢失?

确保在 `nuxt.config.ts` 或 Vite 配置中正确引入了 CSS：

```ts
css: ['@zc-ui/components/styles', '@zc-ui/theme/styles']
```

### Q: Dialog/Drawer 在 SSR 中不显示?

这是正常的。Dialog 和 Drawer 使用 Teleport 挂载到 `document.body`，在客户端激活后即可正常工作。使用 `<ClientOnly>` 包裹或确保 `v-model` 初始值为 `false`。
