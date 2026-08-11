# 从 Element Plus 迁移到 ZC UI

本指南帮助你将现有项目从 Element Plus 平滑迁移到 ZC UI。

## 目录

- [快速开始](#快速开始)
- [组件命名对照](#组件命名对照)
- [全局注册](#全局注册)
- [国际化](#国际化)
- [主题定制](#主题定制)
- [表单验证](#表单验证)
- [常见差异](#常见差异)

---

## 快速开始

### 1. 安装

```bash
pnpm add @zc-ui/components
# 或
npm install @zc-ui/components
```

### 2. 全局注册

```ts
// main.ts
import { createApp } from 'vue'
import ZcUI from '@zc-ui/components'
import '@zc-ui/theme'
import '@zc-ui/components/styles' // 全量 CSS

const app = createApp(App)
app.use(ZcUI)
```

### 3. 按需引入（推荐）

```ts
// 无需手动引入——配合 @zc-ui/resolver + unplugin-vue-components
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { ZcUIResolver } from '@zc-ui/resolver'

export default defineConfig({
  plugins: [Components({ resolvers: [ZcUIResolver()] })],
})
```

---

## 组件命名对照

ZC UI 使用 `Zc` 前缀（Element Plus 使用 `El`）。大部分组件名一一对应：

| Element Plus     | ZC UI            | 备注                    |
| ---------------- | ---------------- | ----------------------- |
| `ElButton`       | `ZcButton`       | ✅ API 一致             |
| `ElInput`        | `ZcInput`        | ✅ API 一致             |
| `ElSelect`       | `ZcSelect`       | ✅ 支持 options prop    |
| `ElForm`         | `ZcForm`         | 增强的验证系统          |
| `ElTable`        | `ZcTable`        | 虚拟滚动 + 可编辑单元格 |
| `ElDialog`       | `ZcDialog`       | ✅                      |
| `ElCheckbox`     | `ZcCheckbox`     | ✅                      |
| `ElRadio`        | `ZcRadio`        | ✅                      |
| `ElSwitch`       | `ZcSwitch`       | ✅                      |
| `ElTag`          | `ZcTag`          | ✅                      |
| `ElPagination`   | `ZcPagination`   | ✅                      |
| `ElMessage`      | `ZcMessage`      | 命令式 API              |
| `ElNotification` | `ZcNotification` | 命令式 API              |
| `ElLoading`      | `ZcLoading`      | ✅                      |
| `ElTooltip`      | `ZcTooltip`      | ✅                      |
| `ElEmpty`        | `ZcEmpty`        | ✅                      |
| `ElSkeleton`     | `ZcSkeleton`     | ✅                      |
| `ElAlert`        | `ZcAlert`        | ✅                      |
| `ElBadge`        | `ZcBadge`        | ✅                      |
| `ElAvatar`       | `ZcAvatar`       | ✅                      |
| `ElDatePicker`   | `ZcDatePicker`   | ✅                      |
| `ElTabs`         | `ZcTabs`         | ✅                      |
| `ElBacktop`      | `ZcBacktop`      | ✅                      |

### 批量替换

在编辑器中使用全局搜索替换：

```
Find:    <el-
Replace: <zc-
Find:    </el-
Replace: </zc-
Find:    ElButton
Replace: ZcButton
```

---

## 全局注册

### Element Plus 方式

```ts
import ElementPlus from 'element-plus'
app.use(ElementPlus)
```

### ZC UI 方式

```ts
import ZcUI from '@zc-ui/components'
import '@zc-ui/theme'
import '@zc-ui/components/styles'

app.use(ZcUI)
```

---

## 国际化

### Element Plus 方式

```ts
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'

// 模板中使用
<el-config-provider :locale="zhCn">
```

### ZC UI 方式

```ts
import { createLocale } from '@zc-ui/locale'

// 方式 1：插件方式（推荐，SSR 安全）
app.use(createLocale({ locale: 'zh-CN' }))

// 方式 2：ConfigProvider
import { ZcConfigProvider } from '@zc-ui/components'

// 模板中使用
<zc-config-provider locale="zh-CN">
```

ZC UI 内置 `zh-CN` 和 `en-US` 两种语言，可通过 `createLocale({ messages })` 注册自定义语言包。

---

## 主题定制

### Element Plus 方式

```scss
// 覆盖 SCSS 变量
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    ...,
  )
);
```

### ZC UI 方式

```ts
// 方式 1：运行时主题 API
import { createTheme, applyTheme } from '@zc-ui/theme'

const theme = createTheme({
  colors: {
    primary: '#409eff',
    success: '#67c23a',
    // ...
  }
})
applyTheme(theme)

// 方式 2：CSS 变量覆盖
:root {
  --color-zc-primary-500: #409eff;
  --radius-zc-base: 4px;
}
```

---

## 表单验证

### Element Plus 方式

```ts
import type { FormRules } from 'element-plus'

const rules: FormRules = {
  name: [
    { required: true, message: '请输入名称' },
    { validator: async (rule, value) => checkApi(value) },
  ],
}
```

### ZC UI 方式

```ts
import type { FormRules } from '@zc-ui/components'

const rules: FormRules = {
  name: [
    { required: true, message: '请输入名称' },
    // ✅ 支持 type 类型检查
    { type: 'email', message: '请输入正确的邮箱' },
    // ✅ 支持 enum 枚举验证
    { enum: ['admin', 'user'], message: '角色必须是 admin 或 user' },
    // ✅ 支持 async validator
    { validator: async (rule, value) => checkApi(value) },
    // ✅ 支持动态错误消息
    {
      validator: (rule, value) => value.length > 0,
      message: (rule, value) => `当前长度: ${value.length}`,
    },
  ],
}
```

---

## 常见差异

### 1. CSS 引入方式

```ts
// Element Plus（按组件引入 CSS）
import 'element-plus/es/components/button/style/css'

// ZC UI（全量引入）
import '@zc-ui/components/styles'
```

### 2. Select 的 options

```vue
<!-- Element Plus -->
<el-select v-model="value">
  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
</el-select>

<!-- ZC UI：支持 options prop（更简洁） -->
<zc-select v-model="value" :options="options" />

<!-- 也支持 slot 方式 -->
<zc-select v-model="value">
  <zc-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
</zc-select>
```

### 3. Message / Notification

```ts
// Element Plus
import { ElMessage } from 'element-plus'
ElMessage.success('Hello')

// ZC UI
import { ZcMessage } from '@zc-ui/components'
ZcMessage.success('Hello')
```

### 4. 类名前缀

所有 CSS 类名从 `el-` 变为 `zc-`：

```css
/* Element Plus */
.el-button--primary {
}

/* ZC UI */
.zc-button--primary {
}
```

### 5. defineExpose 实例方法

ZC UI 核心组件都通过 `defineExpose` 暴露了命令式 API：

```ts
// Input
const inputRef = ref()
inputRef.value.focus()
inputRef.value.blur()

// Form
const formRef = ref()
await formRef.value.validate()
formRef.value.resetFields()
formRef.value.clearValidate()

// Dialog
const dialogRef = ref()
dialogRef.value.show()
dialogRef.value.hide()

// Select
const selectRef = ref()
selectRef.value.focus()
selectRef.value.blur()
selectRef.value.openDropdown()
```
