# Design Tokens 设计令牌

<DesignTokenPage />

## 使用指南

### CSS 变量

ZC UI 的所有设计令牌都以 CSS 自定义属性（CSS Custom Properties）的形式提供，可直接在样式中使用：

```css
.my-button {
  background-color: var(--color-zc-primary-500);
  border-radius: var(--radius-zc-base);
  padding: var(--spacing-zc-sm) var(--spacing-zc-md);
  font-size: var(--text-zc-base);
  box-shadow: var(--shadow-zc-base);
  transition: all var(--transition-duration-zc-base) var(--ease-zc-out);
}
```

### Tailwind CSS

如果项目集成了 Tailwind CSS v4，所有令牌已映射到 Tailwind 主题：

```html
<div class="bg-zc-primary-500 text-white rounded-zc-base p-zc-md">Hello ZC UI</div>
```

### 运行时主题切换

使用 `@zc-ui/theme` 提供的运行时 API 可以在运行时动态修改令牌：

```ts
import { setBrandColor, toggleDark, applyTheme, darkTheme, lightTheme } from '@zc-ui/theme'

// 修改品牌色（自动生成完整色阶）
setBrandColor('primary', '#722ed1')

// 切换暗色模式
toggleDark()

// 应用完整主题预设
applyTheme(darkTheme)
applyTheme(lightTheme)
```

### 暗色模式

暗色模式通过在 `<html>` 上添加 `.dark` 类触发。色阶会自动反转：

- **50–400**：深色背景上的微妙色调
- **500**：保持品牌色不变
- **600–950**：提亮以保证暗色背景上的可读性

```ts
import { toggleDark, setTheme, getTheme } from '@zc-ui/theme'

// 手动切换
toggleDark()

// 显式设置
setTheme('dark')
setTheme('light')

// 查询当前模式
console.log(getTheme()) // 'light' | 'dark'
```
