# SCSS / CSS 变量混用指南

ZC UI 使用 CSS 自定义属性（CSS Variables）作为主题系统的核心。
本文档介绍如何在项目中混用 SCSS 变量与 ZC UI 的 CSS 变量。

## 何时使用哪种变量

| 场景 | 推荐方案 |
| --- | --- |
| 需要运行时动态切换主题 | CSS 变量 (`var(--color-zc-*)`) |
| 需要编译时计算（函数、混入） | SCSS 变量 (`$color`) |
| 同时需要两者 | SCSS 变量引用 CSS 变量 |

## 方案一：纯 CSS 变量（推荐）

最灵活的方案，支持运行时主题切换：

```css
.my-component {
  /* 直接使用 ZC UI 的 CSS 变量 */
  color: var(--color-zc-text-primary);
  background: var(--color-zc-primary-500);
  border: 1px solid var(--color-zc-border-base);
  border-radius: var(--radius-zc-base);
  padding: var(--spacing-zc-md);
  font-size: var(--text-zc-base);
}
```

### 优点

- ✅ 支持运行时主题切换
- ✅ 无需构建工具处理
- ✅ 浏览器原生支持

### 在 SCSS 中使用

```scss
.my-component {
  color: var(--color-zc-text-primary);

  &:hover {
    color: var(--color-zc-primary-500);
  }

  @media (max-width: 768px) {
    font-size: var(--text-zc-sm);
  }
}
```

## 方案二：SCSS 变量映射 CSS 变量

在 SCSS 中定义变量并映射到 CSS 变量，兼顾编译时和运行时：

```scss
// _variables.scss

// 定义 SCSS 变量（指向 CSS 变量）
$color-primary: var(--color-zc-primary-500);
$color-success: var(--color-zc-success-500);
$color-danger: var(--color-zc-danger-500);
$color-text-primary: var(--color-zc-text-primary);
$color-border: var(--color-zc-border-base);

$radius-base: var(--radius-zc-base);
$radius-md: var(--radius-zc-md);
$radius-lg: var(--radius-zc-lg);

$spacing-xs: var(--spacing-zc-xs);
$spacing-sm: var(--spacing-zc-sm);
$spacing-md: var(--spacing-zc-md);
$spacing-lg: var(--spacing-zc-lg);

$font-xs: var(--text-zc-xs);
$font-sm: var(--text-zc-sm);
$font-base: var(--text-zc-base);
$font-md: var(--text-zc-md);
$font-lg: var(--text-zc-lg);

$shadow-base: var(--shadow-zc-base);
$shadow-md: var(--shadow-zc-md);
$shadow-lg: var(--shadow-zc-lg);

// 使用
// _component.scss
@use 'variables' as *;

.my-card {
  padding: $spacing-md;
  border-radius: $radius-md;
  border: 1px solid $color-border;
  box-shadow: $shadow-base;
  color: $color-text-primary;
  font-size: $font-base;
}
```

### 优点

- ✅ SCSS 函数（`darken()`, `lighten()` 不能用，但可用 `color-mix()`）
- ✅ 支持 SCSS 循环、条件
- ✅ 变量命名统一管理

### 注意

⚠️ **`darken()` / `lighten()` 不适用于 CSS 变量**，因为 SCSS 函数需要编译时确定颜色值。
如果需要调整颜色亮度，请使用 CSS 原生的 `color-mix()`：

```scss
// ❌ 不工作 — darken 需要 SCSS 颜色值
$primary: var(--color-zc-primary-500);
$primary-dark: darken($primary, 10%); // 错误！

// ✅ 正确 — 使用 color-mix
.primary-hover {
  background: color-mix(in srgb, var(--color-zc-primary-500) 90%, black);
}
```

## 方案三：ZC UI 设计令牌桥接

使用 `@zc-ui/theme` 包导出的令牌常量在 SCSS 和 CSS 之间建立桥梁：

```scss
// 使用 @zc-ui/theme 的 design token 常量
// 在 vite.config.ts 中注入 SCSS 全局变量

// _tokens.scss
// 这些值与 @zc-ui/theme 包中的 JS 常量保持同步

// ---- 固定值 SCSS 变量（编译时使用） ----
$zc-primary-500: #409eff;
$zc-success-500: #67c23a;
$zc-warning-500: #e6a23c;
$zc-danger-500: #f56c6c;
$zc-info-500: #909399;

$zc-font-base: 14px;
$zc-radius-base: 4px;
$zc-spacing-md: 16px;

// ---- 运行时 CSS 变量引用 ----
$zc-primary: var(--color-zc-primary-500);
$zc-success: var(--color-zc-success-500);
$zc-text: var(--color-zc-text-primary);
$zc-border: var(--color-zc-border-base);
$zc-radius: var(--radius-zc-base);

// ---- 混合使用 ----
.my-button {
  // 使用编译时值做计算
  $hover-bg: color-mix(in srgb, #{$zc-primary-500} 90%, white);

  // 运行时变量用于实际渲染
  background: $zc-primary;

  &:hover {
    background: $hover-bg;
  }
}
```

## Vite 配置全局 SCSS 变量

```ts
// vite.config.ts
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/zc-tokens.scss" as *;`,
      },
    },
  },
})
```

## 暗色模式适配

### 使用 CSS 变量（推荐）

```css
/* CSS 变量自动响应暗色模式 */
.my-card {
  background: var(--color-zc-bg-base); /* 白天 #fff, 暗色 #1d1d1d */
  color: var(--color-zc-text-primary); /* 自动切换 */
}
```

### 使用 SCSS 变量 + CSS 变量

```scss
.my-card {
  background: var(--color-zc-bg-base);
  color: var(--color-zc-text-primary);
  border: 1px solid var(--color-zc-border-base);

  // 暗色模式微调
  :root.dark & {
    box-shadow: var(--shadow-zc-md);
  }
}
```

## Tailwind CSS 集成

ZC UI 的 CSS 变量已映射到 Tailwind CSS v4 的 `@theme` 配置中：

```html
<!-- 使用 Tailwind 类名引用 ZC UI 颜色 -->
<div class="bg-zc-primary-500 text-zc-text-primary border border-zc-border-base">
  内容
</div>

<!-- 暗色模式 -->
<div class="dark:bg-zc-primary-600 dark:text-zc-text-primary">
  自适应内容
</div>
```

## 最佳实践

1. **优先使用 CSS 变量** — 除非需要 SCSS 编译时计算
2. **避免 `darken()` / `lighten()`** — 使用 `color-mix(in srgb, var(...), black/white)`
3. **建立映射文件** — 创建 `_zc-tokens.scss` 统一管理变量名
4. **固定值用于计算** — 需要颜色函数时使用 hex 固定值
5. **CSS 变量用于渲染** — 实际样式始终通过 CSS 变量输出
