# 贡献指南

感谢你对 ZC UI 项目的关注！本文档将帮助你了解如何参与项目贡献。

## 开发环境

### 环境要求

- **Node.js** >= 18
- **pnpm** >= 9
- **Git**

### 项目初始化

```bash
# 1. Fork 并克隆仓库
git clone https://github.com/your-username/zc-ui.git
cd zc-ui

# 2. 添加上游仓库
git remote add upstream https://github.com/zcais/zc-ui.git

# 3. 安装依赖
pnpm install

# 4. 启动开发环境
pnpm dev  # 启动 VitePress 文档开发服务器
```

### 常用命令

| 命令                 | 说明                     |
| -------------------- | ------------------------ |
| `pnpm dev`           | 启动文档站开发服务器     |
| `pnpm build`         | 构建所有子包             |
| `pnpm lint`          | 检查并自动修复代码规范   |
| `pnpm lint:check`    | 仅检查代码规范（不修改） |
| `pnpm format`        | 格式化所有文件           |
| `pnpm typecheck`     | TypeScript 类型检查      |
| `pnpm test`          | 运行单元测试             |
| `pnpm test:watch`    | 监听模式运行测试         |
| `pnpm test:coverage` | 运行测试并生成覆盖率报告 |
| `pnpm e2e`           | 运行 E2E + 视觉 + 可访问性测试 |
| `pnpm e2e:ui`        | E2E 交互式调试模式       |
| `pnpm e2e:update-snapshots` | 更新视觉回归基线截图 |

## 项目结构

```
zc-ui/
├── packages/
│   ├── components/     # 组件库（30+ Vue 3 组件）
│   ├── hooks/          # Vue 3 Composables
│   ├── utils/          # 通用工具函数
│   ├── locale/         # 国际化
│   └── theme/          # 主题与设计变量
├── docs/               # VitePress 文档站
├── .changeset/         # Changesets 配置
├── .github/workflows/  # CI/CD 工作流
└── package.json
```

## 开发流程

### 1. 创建分支

```bash
# 从 main 创建功能分支
git checkout -b feat/my-feature
# 或修复分支
git checkout -b fix/issue-123
```

分支命名规范：

- `feat/xxx` — 新功能
- `fix/xxx` — Bug 修复
- `docs/xxx` — 文档更新
- `refactor/xxx` — 代码重构
- `chore/xxx` — 构建/工具变更

### 2. 编写代码

- 遵循现有的代码风格和 ESLint + Prettier 规则
- 使用 TypeScript 编写，提供完整类型定义
- 为新增功能编写单元测试
- 更新相关文档

### 3. 提交代码

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范。提交时使用 husky + commitlint 自动检查：

```bash
git commit -m "feat(components): add new component"
```

**支持的提交类型：**

| Type       | 说明     |
| ---------- | -------- |
| `feat`     | 新功能   |
| `fix`      | Bug 修复 |
| `docs`     | 文档变更 |
| `style`    | 代码格式 |
| `refactor` | 重构     |
| `perf`     | 性能优化 |
| `test`     | 测试相关 |
| `build`    | 构建系统 |
| `ci`       | CI 配置  |
| `chore`    | 其他杂项 |
| `revert`   | 回滚     |

### 4. 添加 Changeset

在提交代码后，如果你的变更需要发布新版本，请添加 Changeset：

```bash
pnpm changeset
```

按照交互式提示选择：

1. **影响的包** — 选择你的变更涉及的包
2. **SemVer 类型** — `major`（破坏性变更）/ `minor`（新功能）/ `patch`（Bug 修复）
3. **变更摘要** — 简短描述变更内容

这会在 `.changeset/` 目录下生成一个 markdown 文件，请将它与你的代码一起提交。

### 5. 提交 Pull Request

- 确保所有测试通过：`pnpm test`
- 确保类型检查通过：`pnpm typecheck`
- 确保代码规范检查通过：`pnpm lint:check`
- 将分支推送到你的 Fork 并创建 PR

## 组件开发指南

### 组件目录结构

每个组件应包含以下文件：

```
packages/components/src/my-component/
├── my-component.vue      # 组件实现
├── my-component.test.ts  # 单元测试（可选，也可放在 __tests__/）
```

### 组件命名规范

- 组件名使用 PascalCase：`ZcButton`
- 文件名使用 kebab-case：`button.vue`
- CSS 类名使用 BEM：`zc-button zc-button--primary zc-button__inner`

### 编写文档

为新组件创建文档页面 `docs/components/my-component.md`，包含：

- 组件描述
- 示例代码（使用 `<DemoBlock>` 包裹）
- API 表格（使用 `<ApiTable>` 组件）

## 测试规范

本项目采用多层测试策略，参考 Element Plus 和 Vuetify 的最佳实践。

### 测试金字塔

```
        ╱  E2E + Visual + A11y  ← e2e/ 目录（Playwright）
       ╱    少量、慢、高信心
      ╱
     ╱  集成测试  ← packages/**/src/__tests__/（Vitest + Vue Test Utils）
    ╱    中等数量、中速、中信心
   ╱
  ╱  单元测试  ← packages/**/src/__tests__/（Vitest）
 ╱    大量、快、聚焦逻辑
```

### 测试工具栈

| 工具 | 用途 | 配置文件 |
| --- | --- | --- |
| Vitest | 单元测试 & 集成测试运行器 | `vitest.config.ts` |
| @vue/test-utils | Vue 组件挂载与交互测试 | — |
| jsdom | DOM 环境模拟 | — |
| @vitest/coverage-v8 | 覆盖率报告（V8 引擎） | `vitest.config.ts` |
| Playwright | E2E、视觉回归、跨浏览器测试 | `playwright.config.ts` |
| @axe-core/playwright | WCAG 可访问性自动化扫描 | `e2e/tests/accessibility.spec.ts` |

### 测试命令

```bash
# 单元 & 集成测试
pnpm test                        # 运行所有测试
pnpm test:watch                  # 监听模式
pnpm test:coverage               # 生成覆盖率报告

# E2E 测试（需要先安装浏览器: npx playwright install）
pnpm e2e                         # 运行所有 E2E 测试
pnpm e2e:ui                      # UI 模式（交互式调试）
pnpm e2e:chromium                # 仅 Chromium
pnpm e2e:firefox                 # 仅 Firefox
pnpm e2e:webkit                  # 仅 Safari (WebKit)
pnpm e2e:update-snapshots        # 更新视觉回归基线截图
pnpm e2e:report                  # 查看上次运行的 HTML 报告

# 性能基准测试
pnpm test -- performance          # 运行性能基准测试
```

### 单元测试编写规范

#### 文件位置

```
packages/
├── components/src/__tests__/
│   ├── button.spec.ts           # 组件单元测试
│   ├── table.spec.ts
│   ├── accessibility-form.spec.ts    # 可访问性单元测试
│   └── performance.spec.ts      # 性能基准测试
├── hooks/src/__tests__/
│   └── useEventListener.spec.ts
└── utils/src/__tests__/
    └── dom.spec.ts
```

#### 测试结构

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcButton from '../button/button.vue'

describe('ZcButton', () => {
  // 1. Props 测试
  describe('Props', () => {
    it('should render default type', () => {
      const wrapper = mount(ZcButton)
      expect(wrapper.classes()).toContain('zc-button')
    })

    it('should render primary type', () => {
      const wrapper = mount(ZcButton, { props: { type: 'primary' } })
      expect(wrapper.classes()).toContain('zc-button--primary')
    })
  })

  // 2. Events 测试
  describe('Events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(ZcButton)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  // 3. Slots 测试
  describe('Slots', () => {
    it('should render default slot', () => {
      const wrapper = mount(ZcButton, { slots: { default: 'Click Me' } })
      expect(wrapper.text()).toContain('Click Me')
    })
  })

  // 4. 边界情况
  describe('Edge Cases', () => {
    it('should not emit click when disabled', async () => {
      const wrapper = mount(ZcButton, { props: { disabled: true } })
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })
})
```

#### 测试命名规范

- 文件名：`{component-name}.spec.ts`（kebab-case）
- describe：使用组件名 `ZcButton` 或功能模块名 `Button Props`
- it：使用 `should` 开头，描述期望行为

#### 覆盖率要求

CI 中强制执行最低覆盖率要求（见 `vitest.config.ts`），采用**渐进式提升**策略：

| 指标 | 当前门槛 | 目标 |
| --- | --- | --- |
| Lines（行覆盖率） | 70% | 80% |
| Functions（函数覆盖率） | 70% | 80% |
| Branches（分支覆盖率） | 60% | 75% |
| Statements（语句覆盖率） | 68% | 80% |

门槛设为略低于当前覆盖率水平，防止覆盖率回退。随着测试覆盖提升，
逐步提高门槛直至达到目标值。未达标时 CI 构建将失败。
本地运行 `pnpm test:coverage` 查看详细报告。

### E2E 测试编写规范

#### 文件位置

```
e2e/
├── fixtures/              # 测试用 Vue 应用（组件演示页面）
│   ├── index.html
│   ├── main.ts            # 挂载各组件用于测试
│   └── vite.config.ts
└── tests/
    ├── button.spec.ts           # 组件交互 E2E
    ├── form.spec.ts
    ├── interactive.spec.ts      # Dialog/Table/Pagination
    ├── visual-regression.spec.ts # 视觉回归截图对比
    └── accessibility.spec.ts    # axe-core WCAG 扫描
```

#### 编写 E2E 测试

```typescript
import { test, expect } from '@playwright/test'

test.describe('Button E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')  // 导航到 fixtures 页面
  })

  test('should be clickable', async ({ page }) => {
    await page.locator('#btn-primary').click()
    // 断言交互结果
  })
})
```

#### 视觉回归测试

```typescript
test('button section screenshot', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#buttons')).toHaveScreenshot('buttons-section.png')
})
```

- 首次运行自动生成基线截图
- 后续运行对比基线，有像素差异则失败
- 更新基线：`pnpm e2e:update-snapshots`
- 截图存储在 `e2e/tests/*.spec.ts-snapshots/`

#### 可访问性测试

```typescript
import AxeBuilder from '@axe-core/playwright'

test('page should not have WCAG violations', async ({ page }) => {
  await page.goto('/')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
```

### 性能基准测试

性能测试位于 `packages/components/src/__tests__/performance.spec.ts`，覆盖：

- **Table 渲染**：100 行 / 1000 行渲染时间
- **批量组件**：1000 个 Button / Tag / Input 渲染时间
- **复杂表单**：50 行混合组件渲染时间
- **内存泄漏**：重复 mount/unmount 检查

阈值设为 5000ms（CI 运行机器上），本地开发时如遇超时可适当调整。

### 跨浏览器测试

Playwright 配置了三个浏览器项目：

| 项目 | 浏览器 | 引擎 |
| --- | --- | --- |
| chromium | Chrome | Chromium |
| firefox | Firefox | Gecko |
| webkit | Safari | WebKit |

CI 中所有浏览器并行运行。本地可单独运行：

```bash
pnpm e2e:chromium    # 仅测试 Chrome
pnpm e2e:firefox     # 仅测试 Firefox
pnpm e2e:webkit      # 仅测试 Safari
```

### 测试最佳实践

1. **先写测试再写代码**（TDD）：新功能开发时先写测试用例
2. **每个 PR 必须包含测试**：新组件、Bug 修复都需附带测试
3. **测试应独立**：每个 `it` 块不依赖其他 `it` 的执行顺序
4. **使用 `data-testid` 属性**：E2E 测试中优先使用 `data-testid` 而非 CSS 类名定位元素
5. **Mock 外部依赖**：使用 `vi.mock()` 或 `vi.fn()` 隔离被测代码
6. **快照测试谨慎使用**：仅用于输出稳定的场景，避免频繁更新
7. **性能测试不阻塞**：性能测试使用宽松阈值，防止 CI 环境波动导致误报

### CI 中的测试流程

```yaml
# .github/workflows/ci.yml
jobs:
  test:           # 单元测试 + 覆盖率检查（80%+ 门槛）
  e2e:            # E2E + 视觉回归 + 可访问性（跨浏览器）
  build:          # 构建验证（依赖测试通过）
```

## 发布流程

项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和发布：

1. 开发者添加 Changeset（`pnpm changeset`）
2. PR 合并到 main 后，CI 自动创建 "Version Packages" PR
3. Version PR 更新版本号和 CHANGELOG
4. Version PR 合并后，CI 自动发布到 npm

## 问题反馈

- [GitHub Issues](https://github.com/zcais/zc-ui/issues) — Bug 报告和功能请求
- [GitHub Discussions](https://github.com/zcais/zc-ui/discussions) — 问题讨论

## License

本项目基于 [MIT License](./LICENSE) 发布。提交的代码将同样基于该许可。
