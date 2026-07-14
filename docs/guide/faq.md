# 常见问题 (FAQ)

## 安装与使用

### Q: 安装后样式不生效怎么办？

确保你已经正确引入样式文件：

```ts
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
```

::: tip
样式文件必须在组件库 JS 导入之后引入。如果使用 Vite/Webpack 的 CSS 提取功能，请确保 CSS 文件被正确打包。
:::

### Q: 如何按需引入组件？

ZC UI 完全支持 Tree Shaking。直接从 `@zc-ui/components` 导入需要的组件即可：

```ts
// 按需导入（自动 Tree Shaking）
import { ZcButton, ZcInput } from '@zc-ui/components'
```

配合 `unplugin-vue-components` 可实现自动导入，详见[自动导入指南](./auto-import)。

### Q: 支持 Vue 2 吗？

不支持。ZC UI 基于 Vue 3 Composition API 构建，仅在 Vue 3.4+ 上运行。

### Q: 支持哪些浏览器？

| 浏览器 | 最低版本 |
| --- | --- |
| Chrome / Edge | 80+ |
| Firefox | 80+ |
| Safari | 14+ |

### Q: 如何使用 CDN 引入？

```html
<link rel="stylesheet" href="https://unpkg.com/@zc-ui/components/dist/index.css" />
<script src="https://unpkg.com/vue@3"></script>
<script src="https://unpkg.com/@zc-ui/components"></script>
```

## 样式与主题

### Q: 如何覆盖组件的默认样式？

推荐使用 CSS 变量覆盖，而非直接修改组件类名：

```css
:root {
  --color-zc-primary-500: #722ed1;
  --radius-zc-base: 8px;
}
```

详见[主题定制指南](./theming)。

### Q: 如何实现暗色模式？

方式一：使用 `useDark` 组合式函数：

```vue
<script setup lang="ts">
import { useDark } from '@zc-ui/hooks'

const { isDark, toggle } = useDark()
</script>
```

方式二：手动切换 CSS 类和变量：

```ts
import { applyDarkMode } from '@zc-ui/theme'
applyDarkMode(true) // 开启暗色模式
```

### Q: CSS 变量和 SCSS 变量可以混用吗？

可以。详见 [SCSS / CSS 变量混用指南](./scss-css-variables)。

### Q: 如何修改组件的圆角大小？

通过 CSS 变量全局修改：

```css
:root {
  --radius-zc-base: 8px;  /* 默认圆角 */
  --radius-zc-lg: 12px;   /* 大圆角 */
}
```

或通过 ConfigProvider 组件级覆盖：

```vue
<ZcConfigProvider :theme-overrides="{
  Button: { '--zc-button-border-radius': '20px' },
}">
  <App />
</ZcConfigProvider>
```

## 组件使用

### Q: Dialog / Drawer 在移动端显示异常？

确保你的 `<ZcDialog>` 或 `<ZcDrawer>` 内容有合理的响应式布局。组件本身已适配移动端，但内容布局需要自行处理。

### Q: Form 表单校验不触发？

检查以下几点：
1. `ZcFormItem` 必须设置 `prop` 属性，且值与 `model` 对象中的字段名对应
2. `ZcForm` 需要绑定 `:model` 和 `:rules`
3. 校验规则中的 `trigger` 需与实际事件匹配（如 `blur`、`change`）

```vue
<ZcForm :model="form" :rules="rules" ref="formRef">
  <ZcFormItem label="名称" prop="name">
    <ZcInput v-model="form.name" />
  </ZcFormItem>
</ZcForm>
```

### Q: Table 表格如何自定义单元格内容？

使用 `columns` 配置中的 `render` 或 `slot` 属性：

```ts
const columns = [
  {
    prop: 'status',
    label: '状态',
    slot: 'status', // 通过具名插槽自定义
  },
]
```

```vue
<ZcTable :columns="columns" :data="data">
  <template #status="{ row }">
    <ZcTag :type="row.status === 'active' ? 'success' : 'danger'">
      {{ row.status === 'active' ? '启用' : '禁用' }}
    </ZcTag>
  </template>
</ZcTable>
```

### Q: Select 选择器如何支持远程搜索？

```vue
<ZcSelect
  v-model="value"
  filterable
  remote
  :remote-method="handleSearch"
  :loading="loading"
>
  <ZcOption v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
</ZcSelect>
```

### Q: Message / Notification 如何自定义关闭时间？

```ts
// 全局配置（通过 ConfigProvider）
<ZcConfigProvider :message="{ duration: 5000 }">

// 单次调用
ZcMessage.success('操作成功', { duration: 3000 })
```

### Q: 如何在 TypeScript 中获取组件实例的类型？

```ts
import type { ZcFormInstance } from '@zc-ui/components'

const formRef = ref<ZcFormInstance>()
formRef.value?.validate()
```

## 构建与部署

### Q: 构建后组件不显示，但开发环境正常？

通常是 CSS 没有被正确打包。检查：
1. `vite.config.ts` 或 `webpack.config.js` 中是否有 CSS 提取配置
2. 确保在生产构建中导入了 `@zc-ui/components/styles`

### Q: 打包体积太大怎么办？

1. 使用按需导入（Tree Shaking 自动生效）
2. 配合 `unplugin-vue-components` 自动导入
3. 检查是否意外导入了完整样式（应只导入需要的样式）

### Q: SSR / Nuxt 中样式闪烁怎么办？

ZC UI 支持 SSR。详见 [SSR / Nuxt 兼容指南](./auto-import#ssr-模式)。

## 兼容性

### Q: ZC UI 支持微前端架构吗？

支持。ZC UI 使用 CSS 变量命名空间隔离，可通过 `createNamespace()` 为不同微前端应用创建独立的样式命名空间。

### Q: 可以和 Element Plus / Ant Design Vue 混用吗？

可以，但不推荐。混用会导致样式冲突和打包体积增大。建议使用[迁移指南](./migration)完成全量迁移。

如果必须混用，请确保 CSS 优先级正确，并使用 CSS 命名空间隔离。

## 性能

### Q: Table 表格数据量大时卡顿怎么办？

1. 使用虚拟滚动（`virtual` 属性）
2. 使用分页（`pagination` 属性）
3. 避免在模板中执行复杂计算

### Q: 首屏加载慢怎么优化？

1. 使用路由级别的按需加载
2. 使用 `unplugin-vue-components` 自动导入组件
3. 启用 Gzip / Brotli 压缩
4. 考虑使用 `defineAsyncComponent` 延迟加载非首屏组件

## 报告问题

如果你遇到了文档中未覆盖的问题：

- [提交 GitHub Issue](https://github.com/zc-ui/zc-ui/issues) — Bug 报告
- [GitHub Discussions](https://github.com/zc-ui/zc-ui/discussions) — 使用问题讨论
