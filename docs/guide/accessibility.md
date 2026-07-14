# 无障碍设计指南

ZC UI 组件库致力于提供符合 **WAI-ARIA** 和 **WCAG 2.1 AA** 标准的无障碍组件。本文档介绍组件库的无障碍设计原则、各组件的 ARIA 实现规范以及键盘交互标准。

## 设计原则

### 1. 语义化 HTML 优先

所有交互元素优先使用原生 HTML 标签（如 `<button>`、`<input>`、`<nav>`），原生标签自带键盘交互和屏幕阅读器支持。仅在原生标签无法满足需求时，才使用 ARIA 属性补充语义。

### 2. 所有交互元素可键盘操作

- 所有交互元素可通过 `Tab` / `Shift+Tab` 获取焦点
- 使用 roving tabindex 模式管理组件内的焦点导航（如 Radio、Tabs）
- 弹出层（Dialog、Drawer）实现 Focus Trap，确保焦点不跳出边界

### 3. 屏幕阅读器可感知

- 状态变更通过 `aria-expanded`、`aria-selected`、`aria-checked` 等属性播报
- 消息通知使用 `aria-live` 区域实现自动播报
- 图标按钮必须提供 `aria-label`

---

## 组件 ARIA 规范

### 表单组件

| 组件         | role       | 关键 ARIA 属性                                                                       | 键盘支持                      |
| ------------ | ---------- | ------------------------------------------------------------------------------------ | ----------------------------- |
| **Input**    | `textbox`  | `aria-label`, `aria-disabled`                                                        | 原生 input 键盘               |
| **Select**   | `combobox` | `aria-expanded`, `aria-haspopup="listbox"`, `aria-controls`, `aria-activedescendant` | ↑↓ 导航, Enter 选择, Esc 关闭 |
| **Switch**   | `switch`   | `aria-checked`, `aria-disabled`                                                      | Enter/Space 切换              |
| **Checkbox** | `checkbox` | `aria-checked`, `aria-disabled`                                                      | Enter/Space 切换              |
| **Radio**    | `radio`    | `aria-checked`, `aria-disabled`, `tabindex` (roving)                                 | ↑↓←→ 导航                     |
| **Slider**   | `slider`   | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-disabled`                   | ←→↑↓ 增减, Home/End           |
| **Rate**     | `slider`   | `aria-valuenow`, `aria-valuemin`, `aria-valuemax`                                    | ←→↑↓, Home/End                |

### 导航组件

| 组件           | role                           | 关键 ARIA 属性                                                           | 键盘支持                         |
| -------------- | ------------------------------ | ------------------------------------------------------------------------ | -------------------------------- |
| **Tabs**       | `tablist` / `tab` / `tabpanel` | `aria-selected`, `aria-controls`, `aria-labelledby`, `tabindex` (roving) | ←→↑↓ 切换, Home/End, Delete 关闭 |
| **Menu**       | `menubar` / `menuitem`         | `aria-haspopup`, `aria-expanded`, `aria-disabled`                        | ←→ 菜单项导航, ↑↓ 子菜单         |
| **Pagination** | `navigation`                   | `aria-current="page"`, `aria-label`                                      | Tab 导航                         |
| **Breadcrumb** | `navigation`                   | `aria-label="Breadcrumb"`, `aria-current="page"`                         | Tab 导航                         |
| **Steps**      | `list` / `listitem`            | `aria-current="step"`                                                    | —                                |

### 数据展示

| 组件         | role                | 关键 ARIA 属性                                                             | 键盘支持                       |
| ------------ | ------------------- | -------------------------------------------------------------------------- | ------------------------------ |
| **Tree**     | `tree` / `treeitem` | `aria-expanded`, `aria-selected`, `aria-checked`, `aria-level`, `tabindex` | ←→ 展开/折叠, Enter/Space 选择 |
| **Cascader** | `combobox`          | `aria-expanded`, `aria-haspopup`, `aria-disabled`                          | Esc 关闭                       |
| **Collapse** | `tab` / `tabpanel`  | `aria-expanded`, `aria-controls`, `aria-labelledby`                        | Enter/Space 切换               |

### 反馈与覆盖层

| 组件             | role      | 关键 ARIA 属性                             | 键盘支持             |
| ---------------- | --------- | ------------------------------------------ | -------------------- |
| **Dialog**       | `dialog`  | `aria-modal="true"`, `aria-labelledby`     | Esc 关闭, Focus Trap |
| **Drawer**       | `dialog`  | `aria-modal="true"`, `aria-labelledby`     | Esc 关闭, Focus Trap |
| **Dropdown**     | `menu`    | `aria-haspopup="menu"`, `aria-expanded`    | Enter 激活           |
| **Message**      | `status`  | `aria-live="polite"`, `aria-atomic="true"` | —                    |
| **Notification** | `status`  | `aria-live="polite"`, `aria-atomic="true"` | —                    |
| **Tooltip**      | `tooltip` | `aria-describedby`                         | Focus 触发显示       |
| **Popconfirm**   | `dialog`  | `aria-modal`, `aria-labelledby`            | Esc 关闭             |
| **Alert**        | `alert`   | —                                          | —                    |

---

## 键盘交互模式

### 标准 WAI-ARIA 键盘模式

#### Roving Tabindex（漫游 Tabindex）

适用于 Tabs、Radio Group、Segmented 等组件：

- 整个组件只有一个元素 `tabindex="0"`（当前选中项）
- 其余元素 `tabindex="-1"`
- 使用方向键在元素间移动焦点
- `Home` / `End` 跳转到第一个 / 最后一个元素

```
Tab → 进入组件（聚焦到选中项）
←/↑ → 移动到前一项
→/↓ → 移动到后一项
Home → 跳到第一项
End → 跳到最后一项
Shift+Tab → 离开组件
```

#### Combobox 模式

适用于 Select、Cascader 等组件：

```
Tab → 聚焦到触发器
Enter / ↓ → 展开下拉
↓ → 高亮下一项
↑ → 高亮上一项
Enter → 选中高亮项
Esc → 关闭下拉
Tab → 选择并离开
```

#### Dialog 模式

适用于 Dialog、Drawer：

```
Tab → 打开时焦点自动移入 Dialog
Tab / Shift+Tab → 焦点在 Dialog 内循环（Focus Trap）
Esc → 关闭 Dialog
```

#### Tree 模式

适用于 Tree：

```
↑/↓ → 在可见节点间移动
→ → 展开节点 / 进入子节点
← → 折叠节点 / 返回父节点
Enter / Space → 选中节点
Home / End → 跳到第一个 / 最后一个节点
```

---

## aria-live 实时区域

### Message 与 Notification

使用 `role="status"` + `aria-live="polite"` 实现非侵入式的屏幕阅读器播报：

- `aria-live="polite"` — 在屏幕阅读器空闲时播报，不打断用户
- `aria-atomic="true"` — 确保整个消息内容被完整播报

### Alert

使用 `role="alert"` 实现紧急播报：

- 屏幕阅读器会立即中断并播报 `alert` 内容
- 适用于需要用户立即注意的错误提示

---

## 开发指南

### 图标按钮的无障碍处理

所有仅包含图标（无文本）的按钮，必须添加 `aria-label`：

```html
<!-- ✅ 正确 -->
<button aria-label="关闭" @click="close">
  <svg>...</svg>
</button>

<!-- ❌ 错误：屏幕阅读器无法识别 -->
<button @click="close">
  <svg>...</svg>
</button>
```

### 装饰性图标

纯装饰性的图标应添加 `aria-hidden="true"`，避免屏幕阅读器播报：

```html
<svg aria-hidden="true">...</svg>
```

### 焦点管理

弹出层打开时应将焦点移入，关闭时焦点返回触发元素：

```typescript
// 打开时
openDialog()
await nextTick()
dialogCloseButton.focus()

// 关闭时
closeDialog()
triggerElement.focus()
```

### aria-labelledby / aria-describedby

使用 ID 引用建立标题与内容的关联：

```html
<div role="dialog" aria-labelledby="dialog-title" aria-describedby="dialog-desc">
  <h2 id="dialog-title">对话框标题</h2>
  <p id="dialog-desc">对话框描述文本</p>
</div>
```

---

## 测试覆盖

ZC UI 的无障碍测试分为以下层级：

### 单元测试

| 测试文件                                | 覆盖范围                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `accessibility-display.spec.ts`         | Progress、Tag、Badge、Skeleton、Empty、Alert、Message                      |
| `accessibility-form.spec.ts`            | Checkbox、Radio、RadioGroup                                                |
| `accessibility-interactive.spec.ts`     | Rate、Carousel、Backtop、CollapseItem                                      |
| `accessibility-select-cascader.spec.ts` | Select、Cascader                                                           |
| `accessibility-tree.spec.ts`            | Tree、TreeNode                                                             |
| `accessibility-overlay.spec.ts`         | Dialog、Drawer、Dropdown、Popconfirm                                       |
| `accessibility-navigation.spec.ts`      | Steps、Pagination、Collapse、Breadcrumb、Tooltip                           |
| `accessibility-keyboard.spec.ts`        | Switch、Checkbox、Radio、Select、Collapse、Input、Segmented、Tabs 键盘交互 |

### WCAG 2.1 合规检查点

- ✅ 1.4.3 对比度（最低）— 组件使用设计令牌确保色彩对比度
- ✅ 2.1.1 键盘 — 所有交互元素可通过键盘操作
- ✅ 2.1.2 无键盘陷阱 — Focus Trap 提供退出机制（Escape 键）
- ✅ 2.4.3 焦点顺序 — Tab 顺序符合逻辑
- ✅ 2.4.7 焦点可见 — 所有可聚焦元素有焦点样式
- ✅ 3.3.2 标签或说明 — 表单元素提供标签
- ✅ 4.1.2 名称、角色、值 — 所有组件提供正确的 ARIA 角色

---

## 浏览器与辅助技术兼容性

| 辅助技术              | 支持状态    |
| --------------------- | ----------- |
| NVDA (Windows)        | ✅ 完全支持 |
| JAWS (Windows)        | ✅ 完全支持 |
| VoiceOver (macOS/iOS) | ✅ 完全支持 |
| TalkBack (Android)    | ✅ 完全支持 |

## 后续计划

- [ ] 集成 `@axe-core/playwright` 进行自动化 E2E 无障碍检测
- [ ] 颜色对比度自动化检测（WCAG 1.4.3 / 1.4.6）
- [ ] 高对比度模式支持
- [ ] 减少动画偏好支持（`prefers-reduced-motion`）
