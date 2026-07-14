# 更新日志

所有版本的变更记录由 [Changesets](https://github.com/changesets/changesets) 自动生成并维护。

完整的 CHANGELOG 文件请查阅：

- [GitHub Releases](https://github.com/zhichang2022/zc-ui/releases)
- [CHANGELOG.md（仓库根目录）](https://github.com/zhichang2022/zc-ui/blob/main/CHANGELOG.md)

## 版本规范

ZC UI 遵循 [Semantic Versioning (语义化版本)](https://semver.org/lang/zh-CN/) 规范：

| 版本号变更 | 含义 | 示例 |
| --- | --- | --- |
| **Major** (X.0.0) | 不兼容的 API 变更（Breaking Change） | `1.0.0` → `2.0.0` |
| **Minor** (0.X.0) | 向下兼容的新功能 | `1.0.0` → `1.1.0` |
| **Patch** (0.0.X) | 向下兼容的 Bug 修复 | `1.0.0` → `1.0.1` |

## 如何追踪变更

### 在 GitHub 上

1. 访问 [Releases 页面](https://github.com/zhichang2022/zc-ui/releases) 查看每个版本的详细变更
2. 每个 Release 包含：版本号、发布日期、变更摘要、变更详情

### 通过 npm

```bash
# 查看所有已发布版本
npm view @zc-ui/components versions

# 查看最新版本
npm view @zc-ui/components version

# 查看某个版本的发布时间
npm view @zc-ui/components time
```

### 在项目中

```bash
# 检查当前使用的版本
pnpm list @zc-ui/components

# 升级到最新版本
pnpm update @zc-ui/components

# 升级到指定版本
pnpm add @zc-ui/components@^1.2.0
```

## 变更分类

每个版本的变更按以下类别分类：

| 类别 | 标签 | 说明 |
| --- | --- | --- |
| ✨ 新功能 | `feat` | 新增的组件或功能 |
| 🐛 Bug 修复 | `fix` | 问题修复 |
| 💄 样式优化 | `style` | 视觉样式调整 |
| 📝 文档 | `docs` | 文档更新 |
| ♻️ 重构 | `refactor` | 代码重构（无功能变化） |
| ⚡ 性能 | `perf` | 性能优化 |
| ✅ 测试 | `test` | 测试相关变更 |
| 🔧 构建 | `build` | 构建系统变更 |
| 🤖 CI | `ci` | CI/CD 配置变更 |

## Breaking Changes 升级指南

当主版本号变更时（如 1.x → 2.0），会包含 Breaking Changes。请仔细阅读 Release Notes 中的迁移指南。

### 升级步骤

1. 阅读 Release Notes 中的 **Breaking Changes** 章节
2. 使用 codemod 工具自动迁移（如提供）
3. 更新依赖版本：`pnpm add @zc-ui/components@latest`
4. 运行类型检查：`pnpm typecheck`
5. 修复类型错误和编译错误
6. 运行完整测试：`pnpm test`
7. 手动测试关键功能

::: warning 注意
主版本升级时，建议在独立分支上进行，充分测试后再合并到主分支。
:::

## 变更日志生成机制

### 开发者添加 Changeset

```bash
pnpm changeset
```

这会在 `.changeset/` 目录下生成一个 Markdown 文件，描述本次变更。

### CI 自动处理

1. PR 合并到 main 后，CI 自动运行 `changeset version`
2. 生成一个新的 "Version Packages" PR
3. 该 PR 包含版本号更新和 CHANGELOG 生成
4. 合并 Version PR 后，CI 自动发布到 npm

::: tip
你可以通过查看 [`.changeset/` 目录](https://github.com/zhichang2022/zc-ui/tree/main/.changeset) 了解未发布的变更。
:::
