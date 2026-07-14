# 设计原则

ZC UI 的设计理念受 Element Plus、Ant Design 和 Naive UI 的启发，遵循以下核心原则来构建一致、高效且令人愉悦的用户界面。

## 设计价值观

### 清晰 (Clarity)

界面应该一目了然。用户不应猜测操作的结果。

- **明确的视觉层级**：通过字号、颜色和间距传达信息重要性
- **一致的操作反馈**：每个交互都应有即时的视觉响应
- **语义化的色彩系统**：不同颜色传达明确的含义（成功、警告、危险、信息）

### 一致 (Consistency)

在整个组件库中保持一致的交互模式和视觉语言。

- **统一的 API 设计**：相似的组件拥有相似的属性和事件（如 `size`、`disabled`、`loading`）
- **一致的命名规范**：BEM CSS 类名、PascalCase 组件名、kebab-case 文件名
- **标准化的间距系统**：使用 4px 基准的间距网格

### 反馈 (Feedback)

通过界面变化让用户感知操作已被接受。

- **即时响应**：点击、输入等操作在 100ms 内给出反馈
- **加载状态**：异步操作展示加载动画或骨架屏
- **操作结果**：成功或失败的操作通过 Message / Notification 告知

### 效率 (Efficiency)

帮助用户更快地完成任务。

- **键盘导航**：所有可交互组件支持键盘操作
- **智能默认**：合理的默认值减少配置成本
- **按需加载**：Tree-shaking 友好，减小打包体积

## 色彩系统

### 品牌色阶

ZC UI 使用 50–950 共 10 级色阶系统，基于 HSL 色彩空间自动生成。

| 级别 | 用途 | 示例 |
| --- | --- | --- |
| 50 | 背景悬停（最浅） | `--color-zc-primary-50` |
| 100 | 背景选中 | `--color-zc-primary-100` |
| 200 | 边框浅色 | `--color-zc-primary-200` |
| 300 | 边框默认 | `--color-zc-primary-300` |
| 400 | 辅助文字 | `--color-zc-primary-400` |
| 500 | 主色（默认） | `--color-zc-primary-500` |
| 600 | 悬停加深 | `--color-zc-primary-600` |
| 700 | 按下加深 | `--color-zc-primary-700` |
| 800 | 深色变体 | `--color-zc-primary-800` |
| 900 | 深色强调 | `--color-zc-primary-900` |
| 950 | 最深（深色模式） | `--color-zc-primary-950` |

### 语义色

| 语义 | 变量 | 用途 |
| --- | --- | --- |
| Primary | `--color-zc-primary-*` | 品牌主色、主要操作 |
| Success | `--color-zc-success-*` | 成功状态、确认操作 |
| Warning | `--color-zc-warning-*` | 警告状态、提醒注意 |
| Danger | `--color-zc-danger-*` | 错误状态、危险操作 |
| Info | `--color-zc-info-*` | 信息提示、中性操作 |

### 中性色

| 语义 | 变量 | 用途 |
| --- | --- | --- |
| Text Base | `--color-zc-text-base` | 主要文字 |
| Text Secondary | `--color-zc-text-secondary` | 次要文字 |
| Border | `--color-zc-border` | 默认边框 |
| Background | `--color-zc-bg-base` | 页面背景 |
| Background Soft | `--color-zc-bg-soft` | 卡片背景 |

## 间距系统

所有间距基于 **4px 基准网格**：

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--spacing-zc-xs` | 4px | 图标与文字间距 |
| `--spacing-zc-sm` | 8px | 紧凑元素间距 |
| `--spacing-zc-md` | 12px | 默认间距 |
| `--spacing-zc-lg` | 16px | 卡片内边距 |
| `--spacing-zc-xl` | 24px | 区块间距 |
| `--spacing-zc-2xl` | 32px | 大区块间距 |

## 圆角系统

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--radius-zc-sm` | 2px | 小元素（Tag、Badge） |
| `--radius-zc-base` | 4px | 默认（按钮、输入框） |
| `--radius-zc-lg` | 8px | 卡片、对话框 |
| `--radius-zc-full` | 9999px | 圆形（头像、圆角按钮） |

## 字体系统

| 变量 | 大小 | 行高 | 用途 |
| --- | --- | --- | --- |
| `--font-size-zc-xs` | 12px | 20px | 辅助文字 |
| `--font-size-zc-sm` | 13px | 22px | 次要文字 |
| `--font-size-zc-base` | 14px | 24px | 正文（默认） |
| `--font-size-zc-lg` | 16px | 26px | 标题 |
| `--font-size-zc-xl` | 18px | 28px | 区块标题 |
| `--font-size-zc-2xl` | 20px | 30px | 页面标题 |

## 动效规范

### 时长

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--duration-zc-fast` | 100ms | 微交互（hover、focus） |
| `--duration-zc-base` | 200ms | 常规过渡（展开、收起） |
| `--duration-zc-slow` | 300ms | 大型动画（对话框、抽屉） |

### 缓动函数

| 变量 | 值 | 用途 |
| --- | --- | --- |
| `--ease-zc-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | 标准过渡 |
| `--ease-zc-in` | `cubic-bezier(0.4, 0, 1, 1)` | 进入动画 |
| `--ease-zc-out` | `cubic-bezier(0, 0, 0.2, 1)` | 离开动画 |

## 无障碍性 (Accessibility)

### WCAG 2.1 AA 标准

- **颜色对比度**：文字与背景对比度 ≥ 4.5:1
- **键盘可访问**：所有交互元素可通过 Tab 键到达
- **焦点可见**：焦点状态有明确的视觉指示
- **屏幕阅读器**：语义化 HTML + ARIA 属性
- **动画偏好**：尊重 `prefers-reduced-motion` 设置

### 语义化 HTML

```html
<!-- ✅ 推荐：语义化标签 -->
<nav>
  <ul>
    <li><a href="/home">首页</a></li>
  </ul>
</nav>

<!-- ❌ 避免：无语义 div -->
<div class="nav">
  <div class="item" onclick="goHome()">首页</div>
</div>
```

## 响应式设计

ZC UI 采用移动优先的响应式策略：

| 断点 | 宽度 | 用途 |
| --- | --- | --- |
| `xs` | < 576px | 手机竖屏 |
| `sm` | ≥ 576px | 手机横屏 |
| `md` | ≥ 768px | 平板 |
| `lg` | ≥ 992px | 小屏桌面 |
| `xl` | ≥ 1200px | 大屏桌面 |
| `xxl` | ≥ 1600px | 超大屏 |

## 组件分类原则

每个组件按功能和场景分类：

| 分类 | 职责 | 典型组件 |
| --- | --- | --- |
| **基础组件** | 最小可复用单元 | Button、Icon |
| **布局组件** | 页面结构组织 | Layout、Row、Col、Grid、Space |
| **表单组件** | 数据输入与校验 | Input、Select、Form、DatePicker |
| **数据展示** | 信息呈现 | Table、Tag、Badge、Skeleton |
| **反馈组件** | 操作结果通知 | Message、Notification、Loading |
| **导航组件** | 页面与功能引导 | Menu、Tabs、Pagination、Breadcrumb |
