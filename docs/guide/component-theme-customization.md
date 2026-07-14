# 组件级主题定制

ZC UI 提供了灵活的主题定制能力，不仅支持全局主题变量，还支持**按组件粒度**的自定义主题。

## 使用 CSS 变量自定义组件主题

每个组件都定义了一组专属的 CSS 变量，命名规范为 `--zc-{component}-{property}`。

### 示例：自定义 Button 组件

```css
/* 在特定作用域内自定义 Button 样式 */
.my-section {
  --zc-button-bg-color: #ff6b6b;
  --zc-button-text-color: #fff;
  --zc-button-border-radius: 8px;
}
```

```vue
<template>
  <div class="my-section">
    <ZcButton>自定义按钮</ZcButton>
  </div>
</template>
```

### 常用组件变量示例

#### Button

```css
--zc-button-bg-color          /* 背景色 */
--zc-button-text-color        /* 文字颜色 */
--zc-button-border-color      /* 边框颜色 */
--zc-button-hover-bg-color    /* 悬停背景色 */
--zc-button-border-radius     /* 圆角 */
--zc-button-font-size         /* 字号 */
```

#### Input

```css
--zc-input-bg-color              /* 背景色 */
--zc-input-text-color            /* 文字颜色 */
--zc-input-border-color          /* 边框颜色 */
--zc-input-placeholder-color     /* 占位符颜色 */
--zc-input-focus-border-color    /* 聚焦边框颜色 */
--zc-input-border-radius         /* 圆角 */
```

#### Table

```css
--zc-table-bg-color              /* 表格背景色 */
--zc-table-header-bg-color       /* 表头背景色 */
--zc-table-row-hover-bg-color    /* 行悬停背景色 */
--zc-table-border-color          /* 边框颜色 */
--zc-table-font-size             /* 字号 */
```

#### Dialog

```css
--zc-dialog-bg-color             /* 对话框背景色 */
--zc-dialog-title-color          /* 标题颜色 */
--zc-dialog-border-radius        /* 圆角 */
--zc-dialog-title-font-size      /* 标题字号 */
--zc-dialog-overlay-bg-color     /* 遮罩背景色 */
```

更多组件的 CSS 变量请查看各组件的源码文件。

## 使用 createTheme 批量配置组件主题

`@zc-ui/theme` 包的 `createTheme` 函数支持通过 `components` 参数批量配置组件主题。

### 示例：为多个组件自定义主题

```typescript
import { createTheme, applyTheme } from '@zc-ui/theme'

const customTheme = createTheme({
  name: 'custom-brand',
  // 全局变量
  brandColors: {
    primary: '#722ed1',
  },
  // 组件级覆盖
  components: {
    button: {
      bgColor: '#722ed1',
      borderRadius: '8px',
    },
    input: {
      borderColor: '#722ed1',
      focusBorderColor: '#531dab',
    },
    dialog: {
      titleFontSize: '20px',
      borderRadius: '12px',
    },
  },
})

// 应用主题
applyTheme(customTheme)
```

### 变量命名转换规则

`components` 参数使用 camelCase 命名，会自动转换为 CSS 变量名：

```typescript
{
  button: {
    bgColor: 'red',              // → --zc-button-bg-color
    textColor: '#fff',          // → --zc-button-text-color
    borderRadius: '8px',        // → --zc-button-border-radius
  }
}
```

## 类型修饰符和状态

许多组件支持类型修饰符（如 `primary`, `success` 等）和状态（如 `disabled`, `hover`）。这些可以通过覆盖对应的 CSS 变量来自定义。

### 示例：自定义 Button 的类型样式

```css
/* 自定义 primary 类型按钮 */
.zc-button--primary {
  --zc-button-bg-color: #ff6b6b;
  --zc-button-text-color: #fff;
  --zc-button-border-color: #ff6b6b;
}

/* 自定义禁用状态 */
.zc-button.is-disabled {
  --zc-button-bg-color: #f5f5f5;
  --zc-button-text-color: #c0c4cc;
}
```

## 全局变量默认值

所有组件级 CSS 变量都引用全局 Token 作为默认值，确保暗色模式自动适配：

```css
.zc-button {
  /* 组件级变量引用全局 Token */
  --zc-button-bg-color: var(--color-zc-info-50, #f4f4f5);
  --zc-button-text-color: var(--color-zc-text-regular, #606266);
  --zc-button-border-radius: var(--radius-zc-base, 4px);
}
```

这意味着：

1. **自动适配暗色模式**：全局 Token 在暗色模式下会自动调整
2. **一致性**：使用统一的设计 token 确保视觉一致性
3. **可覆盖**：可以在任何层级覆盖这些变量

## 实际应用场景

### 场景 1：营销页面定制按钮样式

```vue
<template>
  <div class="marketing-page">
    <ZcButton type="primary">立即购买</ZcButton>
  </div>
</template>

<style scoped>
.marketing-page {
  --zc-button-bg-color: #ff6b6b;
  --zc-button-text-color: #fff;
  --zc-button-border-radius: 24px;
  --zc-button-font-weight: 600;
  --zc-button-padding: 12px 32px;
}
</style>
```

### 场景 2：管理后台统一表格样式

```typescript
// 主题配置
const adminTheme = createTheme({
  name: 'admin',
  components: {
    table: {
      headerBgColor: '#f0f2f5',
      rowHoverBgColor: '#e6f7ff',
      borderColor: '#e8e8e8',
    },
  },
})
```

### 场景 3：深色模式下的组件优化

```css
html.dark {
  --zc-dialog-bg-color: #1f1f1f;
  --zc-dialog-title-color: #e5eaf3;
  --zc-table-bg-color: #141414;
  --zc-table-header-bg-color: #1f1f1f;
}
```

## 注意事项

1. **变量作用域**：CSS 变量可以在任何作用域中定义和覆盖
2. **性能**：CSS 变量是原生的，性能优于运行时的样式计算
3. **优先级**：内联样式 > scoped style > 全局样式
4. **向后兼容**：所有变量都有 fallback 值，确保在旧浏览器中正常工作

## 相关链接

- [全局主题定制](./theming.md)
- [Design Tokens](./design-tokens.md)
- [ConfigProvider](../components/config-provider.md)
