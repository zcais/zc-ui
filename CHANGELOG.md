# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Engineering & Quality

- **CI/CD Pipeline**: Added GitHub Actions CI workflow (`.github/workflows/ci.yml`) running `lint → typecheck → test → build` on every push and PR, with Node.js 18.x and 20.x matrix testing.
- **SSR-Safe Locale**: `createLocale()` now creates per-app isolated locale context via `createLocaleContext()`, preventing cross-request state contamination in SSR scenarios. Backward compatible — module-level singleton still works for SPA.
- **CHANGELOG.md**: This file, for tracking all notable changes.
- **Migration Guide**: Added `docs/migration/from-element-plus.md` for smooth migration from Element Plus.

#### Component Enhancements

- **Dialog**: Added `defineExpose({ show, hide, isVisible })` for imperative API access.
- **Select**: Added `focus()` and `blur()` methods to `defineExpose`.
- **Form Validation**: Enhanced with new rule types:
  - `type`: Built-in type checking (`string`, `number`, `boolean`, `array`, `object`, `email`, `url`)
  - `enum`: Enum value validation
  - `transform`: Pre-validation value transformation
  - `message` can now be a function for dynamic error messages
  - Custom `validator` can now return a `string` as an error message (in addition to `boolean | Promise<boolean>`)
  - Empty values skip non-required rules (standard behavior)

### Changed

#### Build & Bundle

- **Tree-Shaking**: Removed `"**/*.vue"` from `sideEffects` in `package.json`. Only CSS files are now marked as side-effects, enabling better tree-shaking of unused component JS.
- **CSS Output**: Updated Vite `assetFileNames` to use hashed names for better caching and per-chunk CSS extraction.

### Fixed

- **Locale SSR**: Module-level singleton no longer causes cross-request locale contamination in SSR. `createLocale()` now creates isolated per-app state.
- **Garbage Directories**: Removed empty `done/` and `echo/` directories from `packages/components/src/`.

---

## [1.0.2] - 2026-07-14

### Changed

- ⚡ 性能优化：减少不必要的响应式计算与重渲染。
- 🛠 优化组件内部逻辑，提升运行效率。
- 📝 持续完善文档与类型定义。

---

## [1.1.0] (unreleased work-in-progress)

> 以下为本轮对标 Element Plus 的全面优化内容。

### Added

#### 表单上下文体系（对标 Element Plus 的 form 生态）

- **`useFormSize` / `useFormDisabled` / `useFormItem`**（`form/use-form.ts`）：表单控件的 size/disabled 解析优先级统一为「控件 prop > ZcFormItem > ZcForm > ConfigProvider 全局」。
- **Form 新增 `size` prop**，FormItem 新增 `size` prop；所有表单控件（input、select、date-picker、checkbox、radio、switch、rate、slider、input-number、cascader、color-picker、tree-select、auto-complete、mention、input-tag、input-otp、time-picker）消费注入的 disabled/size。
- **blur/change 校验桥接**：控件失焦触发 `trigger: 'blur'` 规则、值变化触发 `trigger: 'change'` 规则（此前 `trigger: 'blur'` 规则永远不会自动执行）。
- **错误样式扩展**：form-item 的红框错误态从仅 input 扩展到 select/date-picker/time-picker/input-number/tree-select/cascader/color-picker/input-otp 等全部控件。
- **Form.validate()** 对齐 Element Plus 语义：成功 resolve `true`，失败 reject `{ [field]: Array<{ message, field }> }`（**BREAKING**：原来 resolve `false`）。
- **Form.scrollToField(prop)**：平滑滚动到指定字段。
- **resetFields 修复**：初始值快照改用保留 Date/Map/Set 的克隆（此前 Date 字段重置后会变成 ISO 字符串）。

#### Table / Tree 实例方法（对标 Element Plus 命令式 API）

- **Table**：新增 `getSelectionRows / clearSelection / toggleRowSelection / toggleAllSelection / toggleRowExpansion / toggleRowExpand / sort / clearSort / clearFilter / setScrollTop / scrollToRow`。
- **Tree**：新增 `getCheckedKeys / getCheckedNodes / getHalfCheckedKeys / getHalfCheckedNodes / setCheckedKeys / setChecked / getExpandedKeys / setExpandedKeys / getNode / append / insertBefore / insertAfter / remove`。

#### Select 增强

- 新增 `filterMethod`（自定义过滤函数）、`multipleLimit`（多选上限）、`#option` 作用域插槽（自定义选项渲染）。

#### 浮层基础设施

- **popper**：`preventOverflow` 增加主轴钳制（flip 无法解决时沿轴滑动避让）；`usePopper` 增加 ResizeObserver 跟踪 reference/popper 尺寸变化（SSR 安全）。
- **z-index 统一**：tooltip / popover / select 下拉接入共享 `useZIndex` 管理器，每次打开动态分配，多层浮层叠放顺序确定。
- **滚动锁引用计数**：新增 `@zc-ui/hooks` 的 `lockBodyScroll / unlockBodyScroll`，dialog / drawer / message-box / image-viewer / action-sheet 接入——多个浮层同开时，关闭其中一个不再意外解锁滚动。

#### 发布工程

- 新增 `.github/workflows/release.yml`（changesets 自动发布，NPM_TOKEN + provenance）；changesets 配置 `fixed` 锁定 8 包同版本。
- CI 增加 E2E job（chromium，`@visual` 截图测试仅在本地比对）与 bundle-size / 暗色选择器约定门禁；Node 矩阵升级至 20.x/22.x。
- commitlint 正式接线（`commitlint.config.mjs` + commit-msg 钩子）；lint-staged 增加 eslint。
- 视觉回归测试打上 `@visual` 标签并修复 `fullPage` 断言、playwright 配置中 `expect` 位置错误。

### Changed

#### 发布产物修复（此前为损坏状态）

- **`@zc-ui/components/styles` 出口修复**：构建产出稳定的 `dist/style.css`（此前 exports 指向不存在的文件，按需/全量样式两条路均不可用）。
- **UMD 产物可用**：UMD 构建内联 workspace 依赖与 qrcode（此前 external 到私有全局变量，产物不可用）。
- **`qrcode` 改为 external**：不再打进 ESM/CJS 产物，避免与用户依赖重复。
- 所有包增加 sourcemap；dist 不再混入 tsc 中间产物与编译后的测试文件（tsconfig 全面 noEmit 化，typecheck 与构建产物彻底分离）。
- **peerDependencies**: `vue` 从 `^3.4.0` 修正为 `^3.5.0`（collapse/mention 使用了 Vue 3.5 的 `useId`）。
- **resolver**：组件映射补全全部 118 个导出（此前缺 24 个，含 ConfigProvider/Calendar/Flex/Spin 等，自动导入会静默失败）；`ZcQrCode` 修正为实际导出名 `ZcQRCode`；`importStyle: 'component'` 降级为全量样式（按组件 CSS 拆分前）。
- **@zc-ui/nuxt**：补齐 `dist/types` 类型生成；默认样式注入指向真实存在的 `@zc-ui/theme/styles`；`prefix` 选项从死代码变为可用。
- **ConfigProvider**：修复 SSR 下设置 `brandColors/themeVariables/themeOverrides` 时因访问 `document` 导致的崩溃。

#### 质量与文档

- 新增 6 个组件/指令的单元测试（action-sheet、code-block、masonry、comment、statistic-card、v-copy/v-debounce、infinite-scroll）。
- 组件硬编码中文文案全部接入 `@zc-ui/locale`（input/message-box/table/tour/code-block/text-ellipsis/typography/switch/editable/input-tag/dialog 等）。
- 文档修复：form.md 代码围栏错误与 API 表格（新增 Form/FormItem 方法表、size prop）；迁移指南 `ZcUIResolver` 大小写错误、`@zc-ui/theme` 导入路径错误；auto-import 指南 `importStyle` 说明与实际产物对齐。
- README 中英文重写：组件数口径统一为 90+，包表补全 resolver/nuxt/icons，新增英文版 README。

### Fixed

- **v-copy**：点击处理器改为读取实时存储值（此前重渲染后仍复制挂载时的旧值）。
- **v-debounce**：待触发的定时器移入元素存储，卸载时正确取消；卸载时移除实际绑定事件的监听器（此前只移除 click，`.input` 修饰符的监听器会泄漏）。
- **date-picker 月份导航**：修复月末（如 10-31）切换月份时因日期溢出导致的「月份不动/跳两月」问题（改为按年/月分量构造日期）。
- **checkbox / radio 可访问性**：移除包裹 label 上的 `role`/`tabindex`，语义收敛到原生 input，消除嵌套交互元素（axe `nested-interactive` 违例）。
- **E2E**：修复 fixture 与测试中的臆造选择器（`.zc-dialog` → `.zc-dialog__panel` 等）、`h('span', () => …)` 不渲染文本的问题；chromium 全量 E2E 20/20 通过。

---

## [1.0.1] - 2025-06-17

### Added

- 100+ Vue 3 components covering layout, form, data display, feedback, and navigation categories.
- Monorepo architecture with `packages/components`, `hooks`, `locale`, `theme`, `utils`, `resolver`, `nuxt-module`.
- Runtime theming system with `createTheme()`, `applyTheme()`, CSS Layers, and namespace support.
- Comprehensive design token system in `@zc-ui/theme`.
- Virtual scrolling for Table and Select components.
- Select with remote search, filterable, multiple, and allow-create support.
- Table with editable cells, drag-to-sort, column resize, and summary rows.
- Form validation with cross-field support and async validators.
- Internationalization (i18n) with `zh-CN` and `en-US` built-in.
- `useNamespace()` BEM-style composable for class name generation.
- `useFocusTrap()`, `useVirtualList()`, `useClickOutside()`, `useZIndex()` composables.
- `unplugin-resolver` for auto-import support.
- Nuxt module for seamless Nuxt 3 integration.
- 88 unit test files covering props, events, slots, and edge cases.
- Playwright E2E tests with axe-core accessibility auditing.
- VitePress documentation with interactive `<DemoBlock>` examples.
- ConfigProvider for global size and locale configuration.
