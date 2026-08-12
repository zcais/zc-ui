# 低代码页面市场（Page Marketplace）设计文档

- **日期**：2026-08-12
- **状态**：已批准（用户确认）
- **需求记录**：req-1786503635556（低代码页面市场独立项目，P1）
- **关联任务**：task-28（头脑风暴设计）

---

## 1. 背景与目标

zc-ui 已成长为 90+ 组件的企业级组件库。低代码「页面市场」属于业务应用层能力，继续放在组件库仓库内会污染 npm 产物与 CI，因此**剥离为独立项目**：独立 Git 仓库、独立 pnpm monorepo，通过 npm 包依赖 zc-ui。

### 目标

1. 模板市场：联网拉取模板，支持浏览 / 搜索 / 分类 / 详情预览
2. 页面搭建：模板实例化为「我的页面」，在设计页修改可变属性，预览页查看成品
3. 版本演进：模板携带版本号；设计页可检测模板更新并执行**智能合并升级**，用户配置不丢失
4. 数据持久化：自建后端 API，页面数据后端为主 + 浏览器离线缓存
5. AI 上下文传承：新项目通过设计文档、CLAUDE.md、TS 类型契约、pnpm link 四重保障不失忆

### 非目标（v1 明确不做）

- 拖拽式布局编辑（结构不可变，天然不需要）
- 多人实时协同编辑
- 可视化逻辑编排 / 事件系统
- 多租户权限体系（v1 仅单管理员发布模板 + 简单 JWT 账户）

## 2. 产品主链路

```
浏览市场 → 选模板（预览页看效果）→ 实例化为"我的页面"
  → 设计页修改可变属性（实时画布 + 属性面板）→ 保存 → 预览 / 发布
                    ↑
    模板发新版 → 设计页检测到升级徽标 → 变更报告 → 确认智能合并
```

## 3. 核心设计哲学：结构归模板，配置归用户

模板显式划分两类属性：

| 类别           | 内容                                              | 归属                     |
| -------------- | ------------------------------------------------- | ------------------------ |
| **不可变属性** | 内置 Vue 组件、样式、布局、嵌套结构、全局主题样式 | 模板独占，随版本整体演进 |
| **可变属性**   | 动态表单字段、表格列、文字内容、数据源等          | 用户所有，跨版本保留     |

**推论**：页面实例不存结构副本，只存「模板引用 + 可变属性值」。升级因此从三向 diff 退化为**确定性的配置迁移纯函数**——这是整个系统可维护性的基石。

## 4. 总体架构

| 部分     | 技术选型                                | 职责                                 |
| -------- | --------------------------------------- | ------------------------------------ |
| 前端应用 | Vite + Vue 3 + TS + `@zc-ui/components` | 市场浏览 / 设计器 / 预览             |
| 后端 API | Node + Fastify + SQLite（Drizzle ORM）  | 模板注册表、页面实例存储、快照       |
| 模板格式 | JSON Schema DSL + 发布 CLI              | 不可变结构 + 可变属性声明 + 迁移规则 |

- **SQLite 选型理由**：v1 零运维、单文件备份、事务满足需求；Drizzle 层日后可平滑迁 PostgreSQL。
- **模板分发**：模板源文件放在仓库 `templates/` 目录，通过 CLI 发布进后端注册表；前端一律从后端 API 联网拉取（本地仅做缓存）。

## 5. 模板 Schema 格式（pm-template/v1）

```jsonc
{
  "$schema": "pm-template/v1",
  "id": "order-list",
  "version": "1.2.0",
  "meta": {
    "name": "订单列表页",
    "category": "admin",
    "thumbnail": "preview.png",
    "tags": ["表格"],
  },
  "zcUiRange": ">=1.0.0", // 依赖的组件库版本范围

  "structure": {
    // 【不可变】组件树：布局/嵌套/样式/主题
    "type": "ZcContainer",
    "props": { "direction": "vertical" },
    "children": [
      {
        "type": "ZcCard",
        "slots": {
          "header": [{ "type": "ZcTitle", "props": { "content": "$pageTitle" } }],
        },
      },
      { "type": "ZcTable", "props": { "columns": "$tableColumns", "data": "$dataSource" } },
    ],
  },

  "editable": {
    // 【可变】属性声明 = 编辑器表单的元数据
    "pageTitle": { "label": "页面标题", "editor": "text", "default": "订单列表" },
    "tableColumns": { "label": "表格列", "editor": "columnList", "default": [] },
    "dataSource": { "label": "数据源", "editor": "dataUrl", "default": "" },
  },

  "migrations": [
    // 可选：跨版本配置迁移规则
    { "from": "<1.2.0", "ops": [{ "op": "rename", "from": "title", "to": "pageTitle" }] },
  ],
}
```

规则：

- `structure` 内用 `$editableKey` 占位符引用可变值，渲染时注入实际值。
- **组件白名单注册表**：渲染器只接受显式 import 并注册的 ZC 组件；发布时 CI 校验（JSON Schema 校验 + 白名单检查 + editable 引用完整性检查）。
- 一个模板一个目录：`manifest/schema + preview.png + 可选示例数据`。

## 6. 智能合并升级机制

### 数据模型

页面实例 = `{ id, name, templateId, templateVersion, values: Record<editableKey, any>, rev, owner, timestamps }`

### 合并算法（纯函数，客户端执行）

输入：旧 schema、新 schema、用户 values。规则按优先级：

1. 先应用 `migrations.ops`（rename / set / transform，按 `from` 版本区间匹配）
2. 新旧版本都有的 editable key → 保留用户值
3. 新增 key → 采用新版默认值
4. 删除 key → 丢弃，记入变更报告
5. 不可变部分（布局/样式/组件树）→ 整体换新，无需合并

输出：新 values + 变更报告（新增/删除/改名清单）。

### 升级流程

1. 设计页加载时比对 `templateVersion` 与后端 `latest_version`，有更新显示徽标
2. 点开查看变更报告 + 合并后预览（dry-run）
3. 确认升级 → **自动保存升级前快照** → 应用（更新 templateVersion + values）
4. 不满意 → 从快照一键回滚

## 7. 存储策略：后端为主 + 离线缓存（方案 C）

| 层       | 介质        | 内容                                                                           |
| -------- | ----------- | ------------------------------------------------------------------------------ |
| 主存储   | 后端 SQLite | 模板注册表、页面实例、快照                                                     |
| 离线缓存 | IndexedDB   | 已拉取模板 schema（键 = templateId@version）；设计器编辑草稿（每 5s 自动落盘） |

- **同步**：联网后按时间戳补推本地草稿。
- **并发冲突**：乐观锁。页面带 `rev` 号，PUT 携带基准 rev；不一致返回 409，前端弹「本地 vs 服务器」对比选择。
- **离线体验**：顶部 banner 提示「离线模式，更改将在联网后同步」；已缓存页面可离线打开编辑。

## 8. 后端 API（REST）

```
模板侧（读多写少，管理员发布）
GET  /api/templates?q=&category=&page=              列表
GET  /api/templates/:slug                           详情（meta + 最新版本信息）
GET  /api/templates/:slug/versions                  版本列表
GET  /api/templates/:slug/versions/:v               拉取完整 schema
POST /api/templates                                 发布新版（管理员 JWT）

页面实例侧
GET/POST        /api/pages                          列表 / 实例化 { templateId, version, name }
GET/PUT/DELETE  /api/pages/:id                      详情 / 保存(values + 基准 rev) / 删除
GET             /api/pages/:id/snapshots            历史快照
POST            /api/pages/:id/snapshots/:sid/restore  回滚
```

**升级计算在客户端**（本地有新旧 schema，纯函数算完再 PUT），后端只校验版本单调性与 rev。服务端保持无状态薄层。

## 9. 前端模块划分

```
apps/web/src/
├── views/market/      市场：列表/搜索/分类/模板详情（内嵌预览）
├── views/designer/    设计页：画布(SchemaRenderer) + 右侧属性面板（按 editable 声明动态生成表单）
├── views/preview/     预览页：纯渲染，市场预览与终端用户共用
packages/
├── schema/    Schema TS 类型 + merge/migrate 纯函数（前后端共享的单一类型来源）
├── renderer/  SchemaRenderer 递归引擎 + 组件白名单注册表
└── editor/    editable → 动态表单的编辑器控件集（text / columnList / dataUrl …）
```

- **双模式复用同一渲染引擎**，仅外壳不同。
- 设计器 v1 = 实时画布 + 表单面板，不做拖拽。
- 节点级渲染失败用 zc-ui 的 `ZcErrorBoundary` 兜底降级。

## 10. 新仓库结构与 zc-ui 衔接

```
zc-page-marketplace/            （独立 Git 仓库，pnpm monorepo）
├── CLAUDE.md                   ← AI 上下文传承入口
├── docs/                       本设计文档 + 模板开发指南
├── packages/{schema,renderer,editor}
├── apps/{web,server}
└── templates/                  官方模板源 + 发布 CLI
```

- 依赖 `@zc-ui/components` npm 正式版；**开发期 `pnpm link`（或 `file:` 协议）本地联调**：改 zc-ui → build → 即时消费。
- 组件 Props 契约 = npm 包自带 `.d.ts`，最精确的 AI 可读契约。

### AI 上下文传承四重保障

1. 本设计文档随新仓库落盘
2. 根目录 `CLAUDE.md`：架构总览、命令、关键决策（属性二分、合并规则、存储策略）
3. TS 类型契约（zc-ui 组件 `.d.ts` + `@pm/schema` 共享类型包）
4. `pnpm link` 联调通道文档化

## 11. 错误处理

| 场景            | 策略                                                 |
| --------------- | ---------------------------------------------------- |
| 网络失败        | 降级 IndexedDB 缓存 + banner 提示                    |
| 保存冲突（409） | 「本地 vs 服务器」对比对话框，用户择一               |
| 升级失败        | dry-run 先行，失败不落盘；成功也保留升级前快照可回滚 |
| 节点渲染异常    | ZcErrorBoundary 捕获，局部降级不炸整页               |
| 非法模板        | 发布时 CI 校验拦截（schema + 白名单 + 引用完整性）   |

## 12. 测试策略

- `@pm/schema` merge/migrate 纯函数：**最高优先级单元测试**（系统正确性心脏），覆盖 rename/新增/删除/多版本链式迁移
- renderer：Vitest + @vue/test-utils 组件测试
- server：内存 SQLite 的 API 集成测试
- web：Playwright E2E 主链路（实例化 → 编辑 → 保存 → 升级 → 回滚）

## 13. 分期交付

| 期  | 内容                                                            | 产出           |
| --- | --------------------------------------------------------------- | -------------- |
| P0  | 新仓库脚手架 + @pm/schema 格式 + merge/migrate 纯函数（含测试） | 合并能力可验证 |
| P1  | SchemaRenderer + 组件注册表 + 静态预览页                        | 模板能渲染     |
| P2  | 后端 API + 模板发布 CLI + 市场页 + 实例化                       | 市场跑通       |
| P3  | 设计器（动态表单面板）+ 保存 + 乐观锁                           | 搭建闭环       |
| P4  | 升级流程 + 快照回滚                                             | 版本演进闭环   |
| P5  | 离线缓存 + E2E + CLAUDE.md 打磨                                 | 交付           |

## 14. 已确认决策清单（对话沉淀）

1. 页面市场从 zc-ui 剥离 → 独立 Git 仓库 + 独立 Vite 应用（zc-ui 仓库零存量代码，纯新建）
2. 模板联网拉取，设计页 / 预览页双模式
3. 模板带版本号，属性显式分类（不可变 vs 可变）
4. 升级策略 → 智能合并升级（按 editable key 迁移配置）
5. 后端 → 自建 API（Node + Fastify + SQLite）
6. 页面实例存储 → 方案 C：后端为主 + IndexedDB 离线缓存 + 乐观锁
7. 联调 → npm 包依赖 + pnpm link

## 15. 后续待定（不阻塞 v1）

- 页面「发布」后的访问形态（静态托管 / 运行时渲染服务）
- 模板市场化运营：评分、评论、第三方投稿审核流
- SQLite → PostgreSQL 的迁移触发点（多实例部署时）
