# 组件级主题定制

ZC UI 为每个组件提供了专属的 CSS 变量集合，使您可以按组件粒度自定义主题，无需修改全局设计 Token。

## 基本概念

每个组件都定义了一组 `--zc-{component}-{property}` 格式的 CSS 变量。这些变量默认引用全局设计 Token，因此修改全局 Token 时所有组件自动适配。您也可以单独覆盖某个组件的变量。

```
全局 Token → 组件级 CSS 变量 → 组件样式
   ↑                                    ↑
   可全局定制                      可按组件定制
```

## 方式一：CSS 变量覆盖

直接在父元素上设置组件级 CSS 变量，所有子组件会自动继承：

```css
/* 覆盖 Button 组件样式 */
.my-section {
  --zc-button-bg-color: #722ed1;
  --zc-button-text-color: #fff;
  --zc-button-border-color: #722ed1;
  --zc-button-hover-bg-color: #531dab;
  --zc-button-border-radius: 8px;
}
```

```html
<div class="my-section">
  <ZcButton type="primary">自定义按钮</ZcButton>
</div>
```

## 方式二：createTheme 组件级简写

使用 `createTheme()` 的 `components` 选项，支持 camelCase 简写：

```ts
import { createTheme, applyTheme } from '@zc-ui/theme'

const brandTheme = createTheme({
  name: 'brand',
  brandColors: { primary: '#722ed1' },
  components: {
    button: {
      bgColor: 'red',
      textColor: '#fff',
      borderRadius: '8px',
    },
    input: {
      borderColor: '#d9d9d9',
      focusBorderColor: '#722ed1',
      placeholderColor: '#bfbfbf',
    },
    dialog: {
      borderRadius: '12px',
      titleFontSize: '18px',
    },
  },
})

applyTheme(brandTheme)
```

camelCase 键会自动转换为 CSS 变量名：
- `bgColor` → `--zc-button-bg-color`
- `focusBorderColor` → `--zc-input-focus-border-color`
- `titleFontSize` → `--zc-dialog-title-font-size`

## 方式三：componentOverrides 完整变量名

如果您更喜欢使用完整的 CSS 变量名：

```ts
const theme = createTheme({
  componentOverrides: {
    Button: {
      '--zc-button-bg-color': 'red',
      '--zc-button-text-color': '#fff',
      '--zc-button-border-radius': '8px',
    },
    Input: {
      '--zc-input-border-color': '#d9d9d9',
    },
  },
})
```

## 方式四：ConfigProvider

使用 `<ZcConfigProvider>` 进行局部主题覆盖：

```vue
<template>
  <ZcConfigProvider :theme-overrides="themeOverrides">
    <App />
  </ZcConfigProvider>
</template>

<script setup>
const themeOverrides = {
  Button: {
    '--zc-button-bg-color': '#722ed1',
    '--zc-button-text-color': '#fff',
  },
}
</script>
```

## 常用组件变量参考

### Button

| CSS 变量 | 说明 | 默认值引用 |
|----------|------|-----------|
| `--zc-button-bg-color` | 背景色 | `--color-zc-info-50` |
| `--zc-button-text-color` | 文字颜色 | `--color-zc-text-regular` |
| `--zc-button-border-color` | 边框颜色 | `--color-zc-border-base` |
| `--zc-button-hover-bg-color` | 悬停背景色 | `--color-zc-primary-50` |
| `--zc-button-hover-text-color` | 悬停文字色 | `--color-zc-primary-500` |
| `--zc-button-hover-border-color` | 悬停边框色 | `--color-zc-primary-300` |
| `--zc-button-border-radius` | 圆角 | `--radius-zc-base` |
| `--zc-button-font-size` | 字体大小 | `--text-zc-base` |
| `--zc-button-disabled-bg-color` | 禁用背景色 | `--color-zc-fill-light` |

### Input

| CSS 变量 | 说明 | 默认值引用 |
|----------|------|-----------|
| `--zc-input-bg-color` | 背景色 | `--color-zc-bg-base` |
| `--zc-input-text-color` | 文字颜色 | `--color-zc-text-primary` |
| `--zc-input-border-color` | 边框颜色 | `--color-zc-border-base` |
| `--zc-input-placeholder-color` | 占位符颜色 | `--color-zc-text-placeholder` |
| `--zc-input-focus-border-color` | 聚焦边框色 | `--color-zc-primary-500` |
| `--zc-input-hover-border-color` | 悬停边框色 | `--color-zc-text-placeholder` |
| `--zc-input-border-radius` | 圆角 | `--radius-zc-base` |
| `--zc-input-font-size` | 字体大小 | `--text-zc-base` |

### Dialog

| CSS 变量 | 说明 | 默认值引用 |
|----------|------|-----------|
| `--zc-dialog-bg-color` | 对话框背景色 | `--color-zc-bg-base` |
| `--zc-dialog-title-color` | 标题颜色 | `--color-zc-text-primary` |
| `--zc-dialog-title-font-size` | 标题字号 | `--text-zc-lg` |
| `--zc-dialog-border-radius` | 圆角 | `--radius-zc-lg` |
| `--zc-dialog-box-shadow` | 阴影 | `--shadow-zc-xl` |

### Tag

| CSS 变量 | 说明 | 默认值引用 |
|----------|------|-----------|
| `--zc-tag-bg-color` | 背景色 | `--color-zc-primary-50` |
| `--zc-tag-text-color` | 文字颜色 | `--color-zc-primary-500` |
| `--zc-tag-border-color` | 边框颜色 | `--color-zc-primary-200` |
| `--zc-tag-border-radius` | 圆角 | `--radius-zc-base` |
| `--zc-tag-font-size` | 字体大小 | `--text-zc-xs` |

## 暗色模式适配

组件级 CSS 变量默认引用全局 Token，而全局 Token 在暗色模式下会自动切换。因此，**只需切换暗色模式，所有组件级变量会自动适配**：

```ts
import { toggleDark } from '@zc-ui/theme'

toggleDark(true) // 所有组件自动切换到暗色主题
```

如果您为某个组件设置了硬编码的颜色值（如 `--zc-button-bg-color: red`），需要手动处理暗色模式：

```css
.my-section {
  --zc-button-bg-color: #722ed1;
}
.dark .my-section {
  --zc-button-bg-color: #531dab;
}
```

## 最佳实践

1. **优先使用全局 Token**：如果只是想修改品牌色，使用 `setBrandColor()` 而非逐组件覆盖
2. **按需覆盖**：只覆盖您需要修改的变量，其他变量保持引用全局 Token
3. **作用域隔离**：在特定容器上设置变量，避免影响全局
4. **暗色模式**：覆盖变量时使用全局 Token 引用而非硬编码值
