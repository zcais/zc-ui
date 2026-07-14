# 贡献指南

感谢你对 ZC UI 项目的关注！本文档将帮助你了解如何参与项目贡献。

完整指南请参阅 [CONTRIBUTING.md](https://github.com/zc-ui/zc-ui/blob/main/CONTRIBUTING.md)，以下为核心要点摘要。

## 环境准备

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
git remote add upstream https://github.com/zc-ui/zc-ui.git

# 3. 安装依赖
pnpm install

# 4. 启动开发环境
pnpm dev
```

### 常用命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动文档站开发服务器 |
| `pnpm build` | 构建所有子包 |
| `pnpm lint` | 检查并自动修复代码规范 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm test` | 运行单元测试 |
| `pnpm test:coverage` | 生成测试覆盖率报告 |
| `pnpm e2e` | 运行 E2E + 视觉 + 可访问性测试 |

## 开发流程

### 1. 创建分支

```bash
git checkout -b feat/my-feature
# 或修复分支
git checkout -b fix/issue-123
```

**分支命名规范：**

| 前缀 | 用途 |
| --- | --- |
| `feat/` | 新功能 |
| `fix/` | Bug 修复 |
| `docs/` | 文档更新 |
| `refactor/` | 代码重构 |
| `chore/` | 构建/工具变更 |

### 2. 编写代码

- 遵循现有的代码风格和 ESLint + Prettier 规则
- 使用 TypeScript 编写，提供完整类型定义
- 为新增功能编写单元测试
- 更新相关文档

### 3. 提交代码

本项目使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
git commit -m "feat(components): add new component"
```

**支持的提交类型：** `feat`、`fix`、`docs`、`style`、`refactor`、`perf`、`test`、`build`、`ci`、`chore`、`revert`

### 4. 添加 Changeset

如果你的变更需要发布新版本：

```bash
pnpm changeset
```

按交互式提示选择影响的包、SemVer 类型和变更摘要，生成的文件请与代码一起提交。

### 5. 提交 Pull Request

- 确保所有测试通过：`pnpm test`
- 确保类型检查通过：`pnpm typecheck`
- 确保代码规范检查通过：`pnpm lint:check`
- 将分支推送到你的 Fork 并创建 PR

## 组件开发指南

### 目录结构

```
packages/components/src/my-component/
├── my-component.vue      # 组件实现
```

### 命名规范

- 组件名：PascalCase，`Zc` 前缀（`ZcButton`）
- 文件名：kebab-case（`button.vue`）
- CSS 类名：BEM（`zc-button zc-button--primary zc-button__inner`）

### 编写文档

为新组件创建 `docs/components/my-component.md`，包含：

1. 组件描述
2. 示例代码（使用 `<DemoBlock>` 包裹）
3. API 表格（使用 `<ApiTable>` 组件，覆盖 Props / Events / Slots）

```markdown
## ComponentName API

### Props

<ApiTable type="props" :data="[
  { name: 'propName', description: '说明', type: 'Type', default: 'defaultValue' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'eventName', description: '说明', parameters: '(params: type)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'slotName', description: '说明' }
]" />
```

## 测试规范

### 测试金字塔

```
        ╱  E2E + Visual + A11y  ← Playwright
       ╱    少量、慢、高信心
      ╱
     ╱  集成测试  ← Vitest + Vue Test Utils
    ╱    中等数量、中速
   ╱
  ╱  单元测试  ← Vitest
 ╱    大量、快、聚焦逻辑
```

### 覆盖率要求

| 指标 | 当前门槛 | 目标 |
| --- | --- | --- |
| Lines | 70% | 80% |
| Functions | 70% | 80% |
| Branches | 60% | 75% |
| Statements | 68% | 80% |

### 单元测试示例

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcButton from '../button/button.vue'

describe('ZcButton', () => {
  describe('Props', () => {
    it('should render primary type', () => {
      const wrapper = mount(ZcButton, { props: { type: 'primary' } })
      expect(wrapper.classes()).toContain('zc-button--primary')
    })
  })

  describe('Events', () => {
    it('should emit click event', async () => {
      const wrapper = mount(ZcButton)
      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })
})
```

## 发布流程

项目使用 [Changesets](https://github.com/changesets/changesets) 管理版本和发布：

1. 开发者添加 Changeset（`pnpm changeset`）
2. PR 合并到 main 后，CI 自动创建 "Version Packages" PR
3. Version PR 更新版本号和 CHANGELOG
4. Version PR 合并后，CI 自动发布到 npm

## 问题反馈

- [GitHub Issues](https://github.com/zc-ui/zc-ui/issues) — Bug 报告和功能请求
- [GitHub Discussions](https://github.com/zc-ui/zc-ui/discussions) — 问题讨论

## License

本项目基于 [MIT License](https://github.com/zc-ui/zc-ui/blob/main/LICENSE) 发布。提交的代码将同样基于该许可。
