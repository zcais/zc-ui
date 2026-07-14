# 性能与体积监控

ZC UI 致力于保持轻量的包体积。本文档介绍库的体积监控机制、各产物体积数据，以及如何在开发过程中进行体积分析。

## 产物体积概览

| Package           | 格式               | 原始体积 | Gzip    | Brotli |
| ----------------- | ------------------ | -------- | ------- | ------ |
| @zc-ui/components | ESM (index.mjs)    | ~379 KB  | ~89 KB  | ~71 KB |
| @zc-ui/components | CJS (index.cjs)    | ~364 KB  | ~81 KB  | ~65 KB |
| @zc-ui/components | UMD (index.umd.js) | ~578 KB  | ~109 KB | ~88 KB |
| @zc-ui/components | CSS (index.css)    | ~214 KB  | ~28 KB  | ~23 KB |
| @zc-ui/hooks      | ESM                | ~16 KB   | ~5 KB   | ~5 KB  |
| @zc-ui/locale     | ESM                | ~8 KB    | ~3 KB   | ~2 KB  |
| @zc-ui/theme      | ESM                | ~17 KB   | ~6 KB   | ~5 KB  |
| @zc-ui/utils      | ESM                | ~3 KB    | ~1 KB   | ~1 KB  |
| @zc-ui/resolver   | ESM                | ~4 KB    | ~2 KB   | ~1 KB  |

> 以上数据基于最近一次构建。运行 `pnpm bundle-size` 可获取实时数据。

## Tree-shaking 支持

ZC UI 的 `@zc-ui/components` 使用 `sideEffects` 配置，支持完整的 tree-shaking：

```json
{
  "sideEffects": ["**/*.css", "**/*.vue"]
}
```

这意味着当你只引入个别组件时，打包工具会自动剔除未使用的代码：

```ts
// ✅ 只打包 Button 组件相关代码
import { ZcButton } from '@zc-ui/components'
```

## 体积分析工具

### 1. Bundle Visualizer（可视化分析）

使用 `rollup-plugin-visualizer` 在构建时生成交互式的 treemap 报告：

```bash
# 本地分析：生成 reports/stats.html
pnpm build:analyze

# 打开报告
# macOS: open reports/stats.html
# Windows: start reports/stats.html
```

报告文件 `reports/stats.html` 以可视化方式展示每个模块在最终产物中的占比，帮助你快速定位体积热点。

> CI 环境下 `stats.html` 会自动生成，无需额外设置。

### 2. Bundle Size 检查脚本

`pnpm bundle-size` 命令会扫描所有包的 `dist/` 产物，检查：

- **阈值违规**：每个产物文件是否超过预设体积上限
- **基线回归**：当前体积是否比基线（baseline）增长超过 10%

```bash
# 检查体积（CI 默认行为）
pnpm bundle-size

# 更新基线（体积优化后使用）
pnpm bundle-size:update

# 生成 JSON 报告
pnpm bundle-size:report
```

### 体积阈值

| 产物类型             | 上限阈值 | 说明                    |
| -------------------- | -------- | ----------------------- |
| UMD bundle (.umd.js) | 800 KB   | 全量包（含 CSS inline） |
| ESM bundle (.mjs)    | 600 KB   | Tree-shakeable 入口     |
| CJS bundle (.cjs)    | 600 KB   | Node.js 兼容格式        |
| CSS (.css)           | 350 KB   | 全量样式表              |

超过阈值时脚本以非零退出码退出，CI 会阻断 PR 合并。

### 基线管理

基线文件位于 `scripts/bundle-size-baseline.json`，记录了每个产物文件的体积快照。

**何时更新基线：**

- 新增组件后，体积自然增长
- 重构后体积有所变化
- 大型功能迭代完成后

```bash
# 更新基线（需 code review）
pnpm bundle-size:update

# 提交更新的基线
git add scripts/bundle-size-baseline.json
git commit -m "chore: update bundle size baseline"
```

## CI 集成

CI 流水线中新增了 `bundle-size-analyze` job，在每次 PR 时自动：

1. 构建所有 packages（含 visualizer 报告）
2. 运行 bundle-size 检查
3. 上传 `reports/` 目录为 artifact（保留 14 天）
4. 在 PR 中评论体积报告摘要

**体积超限时，CI 会阻断 PR 合并。**

## 体积优化建议

### 对开发者

1. **避免引入整个图标库**：按需导入图标组件
2. **使用按需导入**：配合 `@zc-ui/resolver` 实现组件级别的 tree-shaking
3. **CSS 优化**：组件样式使用 CSS 变量，避免重复定义
4. **依赖最小化**：新增第三方依赖前评估其体积影响

### 对标参考

| 框架           | 全量体积 (gzip) | 说明                     |
| -------------- | --------------- | ------------------------ |
| Element Plus   | ~280 KB         | 70+ 组件                 |
| Ant Design Vue | ~350 KB         | 60+ 组件                 |
| Naive UI       | ~150 KB         | 80+ 组件                 |
| **ZC UI**      | **~92 KB**      | **50+ 组件（ESM gzip）** |

> ZC UI 通过精简实现和 tree-shaking 支持，保持了优秀的体积表现。
