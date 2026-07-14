# 发布流程（RELEASE.md）

> **读者**：ZC UI 项目维护者（zhichangwang 及后续接手者）
> **目的**：保证 8 个 npm 包的版本号、CHANGELOG、npm dist-tag 始终一致
> **工具链**：Changesets + pnpm + npm 2FA
> **最后更新**：2026-07-14

---

## 0. 维护者快速参考（TL;DR）

```bash
# 1. 开发完成
git add .
git commit -m "feat: 修复 Tooltip 在 Dialog 内的层级问题"

# 2. 描述本次变更（交互式）
pnpm changeset

# 3. 一键构建 + 发布到 npm latest
pnpm changeset:publish:otp
#  → 启动 npm，自动要求 OTP，发布到 latest
```

就这么简单，下面是完整细节。

---

## 1. 当前包状态（截至 2026-07-14）

| 包名                | 当前版本 | 角色                    | 状态             |
| ------------------- | -------- | ----------------------- | ---------------- |
| `@zc-ui/components` | 1.0.0    | 80+ Vue 3 组件          | ✅ 已发布 latest |
| `@zc-ui/hooks`      | 1.0.0    | 16 个 composables       | ✅ 已发布 latest |
| `@zc-ui/utils`      | 1.0.0    | 通用工具                | ✅ 已发布 latest |
| `@zc-ui/theme`      | 1.0.0    | CSS 变量 + 主题         | ✅ 已发布 latest |
| `@zc-ui/locale`     | 1.0.0    | i18n 字典               | ✅ 已发布 latest |
| `@zc-ui/resolver`   | 1.0.0    | unplugin-vue-components | ✅ 已发布 latest |
| `@zc-ui/nuxt`       | 1.0.0    | Nuxt 3 模块             | ✅ 已发布 latest |
| `@zc-ui/icons`      | 1.0.0    | 5093 个 Tabler 图标     | ⏳ 待发布        |

**8 个包统一以 `1.0.0` 作为 latest tag**。从今天起任何发布都将基于此基线。

---

## 2. 标准发布流程（5 步）

### 2.1 步骤 1：开发并提交代码

按正常流程开发（branch → commit → PR → merge），遵循仓库的
[Conventional Commits 规范](./CONTRIBUTING.md)。代码合并到 `master` 之后才能发布。

```bash
# 1. 拉最新 master
git checkout master && git pull

# 2. 创建分支开发
git checkout -b feat/tooltip-zindex

# 3. ... 开发 ...

# 4. 提交（commitlint 会校验）
git add .
git commit -m "fix(tooltip): 修复嵌套在 Dialog 中时 z-index 错误"
git push -u origin feat/tooltip-zindex
# → 创建 PR → review → merge
```

### 2.2 步骤 2：创建 Changeset（描述本次变更）

每次合 PR 后，给该 PR 创建 changeset。Changeset 是"这次改动动了哪些包、bump 多少版本"的元数据。

```bash
pnpm changeset
```

弹出交互界面：

1. **选择哪些包受影响**（空格多选，回车确认）
2. **每个包选 bump 类型**：
   - `major` - 破坏性变更（如删 API、改 props 必传）
   - `minor` - 新功能（向后兼容）
   - `patch` - bug 修复
3. **写变更摘要**（用户能看到的 CHANGELOG 内容）

生成的文件形如 `.changeset/curly-trees-laugh.md`：

```md
---
'@zc-ui/components': patch
---

fix(Tooltip): 修复嵌套在 Dialog 内的 z-index 错误
```

> **关键规则**：
>
> - 一个 PR 可创建多个 changeset
> - 同一个包可被多个 changeset 引用（取最高 bump 等级）
> - **PR 标题 ≠ Changeset 摘要**：PR 给 reviewer 看，Changeset 给最终用户看

#### 2.2.1 自动化：用 `pnpm changeset` 替代品

如果想脚本化：

```bash
# 直接创建 patch changeset
pnpm changeset add --patch "@zc-ui/components"
# 加上摘要（多行用 \n）
pnpm changeset add --patch "@zc-ui/components" --summary "fix(Tooltip): ..."
```

#### 2.2.2 ⚠️ 跨包变更的特殊处理

如果一个变更同时影响 `components` 和 `hooks`（如 Tooltip 内部用了新 hook）：

- 两者**都要**在 changeset 里列出来
- changeset 自动处理依赖顺序（`hooks` 会先 bump，因为 components 依赖它）

### 2.3 步骤 3：本地校验 + 预览

```bash
# 看哪些包要 bump 哪些版本
pnpm changeset status
```

输出示例：

```
🦋  info Packages to be bumped at patch:
🦋  - @zc-ui/components
🦋  ---
🦋  info NO packages to be bumped at minor
🦋  ---
🦋  info NO packages to be bumped at major
```

确认无误后，**实际 bump 版本**（会改 package.json + 生成 CHANGELOG）：

```bash
pnpm changeset version
```

输出：

```
🦋  All files have been updated. Review them and commit at your leisure
```

会修改的文件：

- `packages/<name>/package.json` - `version` 字段
- `packages/<name>/CHANGELOG.md` - 新增本次条目
- 删除 `.changeset/<name>.md`（消费掉）

> ⚠️ **必须在 master 分支跑 `changeset version`**，不能在新分支。
> 否则该 PR 会把版本号改动带进去，污染代码 review。

**正确流程**：

1. 多个 PR 都合并到 master
2. master 上一次跑 `pnpm changeset version`（把所有 changeset 一起处理）
3. master 上 commit "chore: version packages"
4. 一次 publish 处理所有变更

### 2.4 步骤 4：发布到 npm

#### 2.4.1 准备 OTP（2FA）

发布需要 2FA 验证码（30 秒有效）。发布前**先打开 authenticator app**。

#### 2.4.2 执行发布

```bash
# 推荐：带 OTP 的一次性发布
pnpm changeset:publish:otp
# 脚本等价于：pnpm build && changeset publish -- --otp
# 会在命令行 prompt 让你输入 6 位验证码
```

或者用环境变量：

```bash
# 把 OTP 放在环境变量里（适合 CI）
export NPM_CONFIG_OTP=123456
pnpm changeset:publish
```

**会发生的流程**：

1. 跑 `pnpm build`（构建所有 8 个包，约 1-2 分钟，icons 包单独 ~9 分钟）
2. 跑 `changeset publish`
3. 按依赖顺序逐个 publish
4. 已经发过当前版本的包**会被跳过**（不是错误）
5. **自动更新 `latest` tag**（默认行为）

#### 2.4.3 不想发到 `latest`？

试用 tag 发布的场景：

- `next` - 下一个版本预览
- `rc` - 候选发布
- `beta` - 公开测试

```bash
# 发布到 next tag（不更新 latest）
pnpm changeset publish --tag next
# 用户装：npm install @zc-ui/components@next

# 之后想 promote 到 latest
npm dist-tag add @zc-ui/components@1.2.0-rc.0 latest
```

### 2.5 步骤 5：发布后验证

```bash
# 1. 检查所有包的 dist-tags
for p in components hooks utils theme locale resolver nuxt icons; do
  echo "--- @zc-ui/$p ---"
  npm view "@zc-ui/$p" dist-tags
done

# 期望全部显示：{ latest: 'x.y.z' }
```

```bash
# 2. 试装一个包
mkdir /tmp/zc-test && cd /tmp/zc-test
npm init -y
npm install @zc-ui/components
# 检查 node_modules/@zc-ui/components/package.json 的 version
```

```bash
# 3. 提交变更
git add .
git commit -m "chore: version packages"
git push
```

---

## 3. 关键脚本速查（`package.json`）

| 脚本                         | 作用                                       | 何时跑                |
| ---------------------------- | ------------------------------------------ | --------------------- |
| `pnpm changeset`             | 交互式创建 changeset                       | 每次合 PR 后          |
| `pnpm changeset:add`         | 脚本化创建（见 2.2.1）                     | CI 或自动化           |
| `pnpm changeset status`      | 看哪些包要 bump 哪些版本                   | 任何时候（只读）      |
| `pnpm changeset version`     | 实际改 version + 生成 CHANGELOG            | 准备发布前，master    |
| `pnpm changeset:publish`     | `pnpm build && changeset publish`          | 发到 latest           |
| `pnpm changeset:publish:otp` | `pnpm build && changeset publish -- --otp` | 发到 latest（带 2FA） |

---

## 4. 故障排查（Troubleshooting）

### 4.1 "Some packages have been changed but no changesets were found"

**触发**：你改了 `packages/<x>/package.json` 的 version 但没创建 changeset。

**解决**：

```bash
# 选项 A：撤销 version 改动
git checkout packages/<x>/package.json
# 改用 changeset 流程

# 选项 B：创建空 changeset
pnpm changeset add --empty
```

### 4.2 "ALREADY PUBLISHED" 警告

**输出**：

```
🦋  warn @zc-ui/components is not being published because version 1.0.0 is already published on npm
```

**原因**：本地 `package.json` 的 version 和 npm 上已存在的 version 相同。

**正常情况**：版本号对、npm 上已发，跳过即可（不是错误）。

**异常情况**：如果应该是新版本（如 1.2.0），但显示 1.0.0：

- 检查 `pnpm changeset version` 是否真的跑了
- 检查 `.changeset/*.md` 是否还有未消费的

### 4.3 OTP 失败 `EOTP`

**原因**：6 位验证码过期（30 秒）或输错。

**解决**：

- 看 authenticator **当前**显示的 6 位数字
- 命令中带 `--otp=xxxxxx`（不要让命令在执行前等太久）

```bash
# 把 OTP 提早输入到环境变量
read -p "Enter OTP: " otp
# 30 秒内跑：
pnpm changeset publish -- --otp="$otp"
```

### 4.4 icons 包构建慢（~9 分钟）

`@zc-ui/icons` 包含 5093 个图标，vite-plugin-dts 生成 `.d.ts` 很慢（~60 秒）。

**加速选项**（暂未启用）：

- 用 `rollup-plugin-dts` 替代 `vite-plugin-dts`（可加速约 50%）
- icons 包 d.ts 加 `"declaration": false`（牺牲类型完整性）

目前保持现状，icons 包 build 不会影响 components 包的开发体验。

### 4.5 icons 包发不到 2.0.0

**触发场景**：icons 本地是 1.0.0，changeset 标 major，跑 `changeset version` 后变 2.0.0。

**原因**：`changeset version` 把 1.0.0 + major 算成 2.0.0（不知道这是"首次"）。

**解决**：

```bash
# 跑完 version 后手动改回 1.0.0
sed -i 's/"version": "2.0.0"/"version": "1.0.0"/' packages/icons/package.json

# 然后跑 publish
pnpm --filter @zc-ui/icons publish --tag latest --no-git-checks
```

### 4.6 同时改多个包，依赖顺序错乱

**症状**：components 发到 1.1.0，但 hooks 还在 1.0.0，components 引用 `workspace:*` 解析失败。

**解决**：changeset 会自动按依赖顺序 publish，但 **version 是并行的**。
`updateInternalDependencies: patch` 配置（`.changeset/config.json`）会让 `components`
自动 patch bump 一次以同步 hooks 变化。

**确认**：

```bash
# 看内部依赖是否同步
pnpm changeset status
# 应看到 components 也会 bump
```

### 4.7 包未出现在 changeset status

**原因 A**：包没有 `package.json`（changesets 只看有 package.json 的目录）。

**原因 B**：包在 `.changeset/config.json` 的 `ignore` 列表里。

**解决**：

- 如果是新包，补上 `package.json`
- 如果是临时不发布的，确认是否在 `ignore`

---

## 5. 首次发布的历史（2026-07-14）

> 给未来的自己看：2026-07-14 当天一次性把 8 个包发到 1.0.0 的过程

### 5.1 一次性配置

1. 在 `packages/icons/` 下创建缺失的 `package.json`、`vite.config.ts`、`tsconfig.json`
2. 在 `packages/icons/src/` 下创建 `types.ts`、`icon-registry.ts`、自动生成 `index.ts`（5093 行 export）
3. 更新 `packages/icons/README.md`
4. 跑 `pnpm install` 让 pnpm 创建 symlinks

### 5.2 分两批发布

**第一批**（pnpm changeset:publish）：

- 实际发到 npm：theme / resolver / nuxt（3 个）
- 跳过：components / hooks / utils / locale（4 个，已存在 1.0.0）
- 原因：之前用 `--tag rc` 试发时已经把 4 个包发到 npm 了

**第二批**（npm dist-tag add）：

- 4 个包有 1.0.0 但 `latest` 指向 0.0.1
- 需要手动：`npm dist-tag add @zc-ui/<name>@1.0.0 latest`

**icons 包**：

- 单独发：`pnpm --filter @zc-ui/icons publish --tag latest --no-git-checks`
- 注意 OTP 验证

### 5.3 历史遗留

`@zc-ui/components` 等 4 个包在 npm 上**同时存在** `0.0.1` 和 `1.0.0` 两个版本。

- `0.0.1` 是 3 周前发布的初版
- `1.0.0` 是首次正式版
- 不要 unpublish `0.0.1`（会破坏现有用户）

---

## 6. 高级操作

### 6.1 取消发布（Unpublish）

**限制**：npm 只允许在 **发布后 72 小时内** unpublish。

```bash
# 取消 1.0.0（限 72h 内）
npm unpublish @zc-ui/components@1.0.0

# 推荐替代：deprecate（警告但不删除）
npm deprecate @zc-ui/components@0.0.1 "请升级到 1.0.0+：npm install @zc-ui/components@latest"
```

### 6.2 给老版本发补丁

如果 1.0.0 有 critical bug，要修 1.0.1：

```bash
git checkout -b fix/1.0.1-critical
# 修复 bug
git commit -m "fix: critical"
pnpm changeset  # 选 components: patch
# 改 package.json 让 components 是 1.0.1
# 或者用 changesets 的 snapshot 模式
```

更简单：用 `1.0.x` 分支维护（需要后续接入 release-please 等工具）。

### 6.3 添加新包

假设要加 `@zc-ui/directives`：

1. 创建 `packages/directives/`
2. 写 `package.json`（参考 utils 模板）
3. 写 `vite.config.ts` + `tsconfig.json` + 源码
4. 在根 README.md 加上 "可用包" 一行
5. 跑 `pnpm install` 创建 symlinks
6. 创建 changeset `directives-release.md`：`'@zc-ui/directives': major`
7. `pnpm changeset version` → 1.0.0
8. `pnpm changeset:publish:otp`

### 6.4 跨包改造（如重构 utils 改了 API）

```bash
# changeset 里 @zc-ui/utils: major（破坏性）
# changeset 里所有引用 utils 的下游包: patch（自动跟 major）
# 因为 .changeset/config.json 配了 updateInternalDependencies: "patch"
```

### 6.5 在 CI 中自动发布

在 GitHub Actions 中（参考 [release.yml](./.github/workflows/release.yml)）：

```yaml
- name: Publish to npm
  env:
    NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
    NPM_CONFIG_OTP: ${{ secrets.NPM_OTP }} # 注意：每次都需要新 OTP
  run: pnpm changeset:publish
```

⚠️ CI 用 OTP 麻烦，建议：

- 用 `npm login --registry=https://registry.npmjs.org/` 配 token
- 改用 `NPM_CONFIG_OTP_AUTHSECRET` 配 TOTP secret（CI 可以自动生成）

---

## 7. 关键配置文件

| 文件                        | 作用                                 |
| --------------------------- | ------------------------------------ |
| `.changeset/config.json`    | changesets 行为（access、ignore 等） |
| `.npmrc`                    | npm registry + 2FA 配置              |
| `pnpm-workspace.yaml`       | pnpm workspace 范围                  |
| `package.json`（根）        | 脚本命令、pnpm 字段                  |
| `packages/*/package.json`   | 单个包的 metadata + peer/dep 依赖    |
| `packages/*/vite.config.ts` | 单个包的构建配置                     |

---

## 8. 发布检查清单（Cheat Sheet）

### 发布前

- [ ] 所有 PR 已合到 master
- [ ] `pnpm install` 无错误
- [ ] `pnpm test` 全部通过
- [ ] `pnpm typecheck` 无错误
- [ ] `pnpm changeset status` 显示预期包和 bump 类型
- [ ] 已经创建或修改了 changeset
- [ ] authenticator app 准备好

### 发布中

- [ ] 在 master 分支
- [ ] 工作目录干净（`git status` 无改动）
- [ ] OTP 准备好（30 秒内有效）
- [ ] 跑 `pnpm changeset:publish:otp`

### 发布后

- [ ] `npm view @zc-ui/<name> dist-tags` 检查 8 个包都 `latest: x.y.z`
- [ ] 试装一个包并 import 验证
- [ ] `git add . && git commit -m "chore: version packages"`
- [ ] `git push`
- [ ] 通知团队（如有 Slack 频道）
- [ ] 在 GitHub Releases 写 Release Notes（可选）

---

## 9. 紧急联系

| 问题                | 谁负责       | 联系方式            |
| ------------------- | ------------ | ------------------- |
| npm token / 2FA     | zhichangwang | 15699192736@163.com |
| GitHub 仓库权限     | zhichangwang | 同上                |
| 域名 / CDN / 文档站 | zhichangwang | 同上                |

---

## 10. 参考资料

- [Changesets 官方文档](https://github.com/changesets/changesets)
- [npm dist-tag 文档](https://docs.npmjs.com/cli/v10/commands/dist-tag)
- [Semantic Versioning 2.0.0](https://semver.org/lang/zh-CN/)
- [Conventional Commits](https://www.conventionalcommits.org/zh-hans/)
- [pnpm workspace 文档](https://pnpm.io/workspaces)
