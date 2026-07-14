# 组件迁移指南

本文档帮助你从其他 Vue 3 UI 组件库迁移到 ZC UI。覆盖 Element Plus、Ant Design Vue 的常见差异和迁移要点。

## 快速对照表

### 组件名称对照

| Element Plus | Ant Design Vue | ZC UI | 备注 |
| --- | --- | --- | --- |
| `el-button` | `a-button` | `ZcButton` | API 基本一致 |
| `el-input` | `a-input` | `ZcInput` | 类型和事件名有差异 |
| `el-select` | `a-select` | `ZcSelect` | 选项格式不同 |
| `el-checkbox` | `a-checkbox` | `ZcCheckbox` | — |
| `el-radio` | `a-radio` | `ZcRadio` | — |
| `el-switch` | `a-switch` | `ZcSwitch` | 值绑定方式不同 |
| `el-table` | `a-table` | `ZcTable` | 列配置差异较大 |
| `el-tag` | `a-tag` | `ZcTag` | — |
| `el-badge` | `a-badge` | `ZcBadge` | — |
| `el-dialog` | `a-modal` | `ZcDialog` | 属性名不同 |
| `el-message` | `message` | `ZcMessage` | 函数式调用 |
| `el-notification` | `notification` | `ZcNotification` | 函数式调用 |
| `el-pagination` | `a-pagination` | `ZcPagination` | — |
| `el-tooltip` | `a-tooltip` | `ZcTooltip` | — |
| `el-form` / `el-form-item` | `a-form` / `a-form-item` | `ZcForm` / `ZcFormItem` | 校验规则格式不同 |
| `el-tabs` / `el-tab-pane` | `a-tabs` / `a-tab-pane` | `ZcTabs` / `ZcTabPane` | — |
| `el-tree` | `a-tree` | `ZcTree` | — |
| `el-upload` | `a-upload` | `ZcUpload` | — |
| `el-skeleton` | `a-skeleton` | `ZcSkeleton` | — |
| `el-date-picker` | `a-date-picker` | `ZcDatePicker` | — |
| `el-dropdown` | `a-dropdown` | `ZcDropdown` | — |
| `el-image` | `a-image` | `ZcImage` | — |
| `el-progress` | `a-progress` | `ZcProgress` | — |
| `el-steps` | `a-steps` | `ZcSteps` | — |
| `el-timeline` | `a-timeline` | `ZcTimeline` | — |
| `el-empty` | `a-empty` | `ZcEmpty` | — |
| `el-alert` | `a-alert` | `ZcAlert` | — |
| `el-cascader` | `a-cascader` | `ZcCascader` | — |

## 从 Element Plus 迁移

### 1. 包导入变更

```ts
// Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

// ZC UI
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
app.use(ZcUI)
```

### 2. 组件前缀

Element Plus 使用 `el-` 前缀，ZC UI 使用 `Zc` 前缀：

```vue
<!-- Element Plus -->
<el-button type="primary">按钮</el-button>
<el-input v-model="value" placeholder="请输入" />

<!-- ZC UI -->
<ZcButton type="primary">按钮</ZcButton>
<ZcInput v-model="value" placeholder="请输入" />
```

### 3. 按钮组件差异

| 特性 | Element Plus | ZC UI |
| --- | --- | --- |
| 按钮类型 | `type` | `type`（一致） |
| 按钮尺寸 | `size: large/default/small` | `size: large/medium/small/mini` |
| 图标 | `icon` 属性 + 独立组件 | `icon` 属性 |
| 文字按钮 | `text` 属性 | `plain` + 自定义样式 |
| 链接按钮 | `link` 属性 | 通过样式实现 |

```vue
<!-- Element Plus -->
<el-button type="primary" size="default" :icon="Edit">编辑</el-button>

<!-- ZC UI -->
<ZcButton type="primary" size="medium" icon="edit">编辑</ZcButton>
```

### 4. 表单校验差异

```ts
// Element Plus 校验规则
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}

// ZC UI 校验规则（格式兼容）
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}
```

### 5. 消息提示

```ts
// Element Plus
import { ElMessage, ElMessageBox } from 'element-plus'
ElMessage.success('操作成功')
ElMessageBox.confirm('确定删除？', '提示')

// ZC UI
import { ZcMessage } from '@zc-ui/components'
ZcMessage.success('操作成功')
// ZcDialog 使用组件方式，无函数式 API
```

### 6. 表格差异

```vue
<!-- Element Plus：slot 模式 -->
<el-table :data="tableData">
  <el-table-column prop="name" label="名称" />
  <el-table-column prop="age" label="年龄" />
</el-table>

<!-- ZC UI：columns 配置模式 -->
<ZcTable :data="tableData" :columns="columns" />

<script setup>
const columns = [
  { prop: 'name', label: '名称' },
  { prop: 'age', label: '年龄' },
]
</script>
```

## 从 Ant Design Vue 迁移

### 1. 包导入变更

```ts
// Ant Design Vue
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
app.use(Antd)

// ZC UI
import ZcUI from '@zc-ui/components'
import '@zc-ui/components/styles'
import '@zc-ui/theme/styles'
app.use(ZcUI)
```

### 2. 组件前缀

Ant Design Vue 使用 `a-` 前缀，ZC UI 使用 `Zc` 前缀：

```vue
<!-- Ant Design Vue -->
<a-button type="primary">按钮</a-button>
<a-input v-model:value="value" />

<!-- ZC UI -->
<ZcButton type="primary">按钮</ZcButton>
<ZcInput v-model="value" />
```

### 3. v-model 差异

Ant Design Vue 部分组件使用 `v-model:value`，ZC UI 统一使用 `v-model`：

```vue
<!-- Ant Design Vue -->
<a-input v-model:value="text" />
<a-checkbox v-model:checked="checked" />
<a-switch v-model:checked="enabled" />

<!-- ZC UI -->
<ZcInput v-model="text" />
<ZcCheckbox v-model="checked" />
<ZcSwitch v-model="enabled" />
```

### 4. Modal → Dialog

```vue
<!-- Ant Design Vue -->
<a-modal v-model:open="visible" title="标题" @ok="handleOk">
  <p>内容</p>
</a-modal>

<!-- ZC UI -->
<ZcDialog v-model="visible" title="标题">
  <p>内容</p>
  <template #footer>
    <ZcButton @click="visible = false">取消</ZcButton>
    <ZcButton type="primary" @click="handleOk">确定</ZcButton>
  </template>
</ZcDialog>
```

### 5. 表单校验差异

```ts
// Ant Design Vue 校验规则
const rules = {
  name: [{ required: true, message: '请输入名称' }],
}

// ZC UI 校验规则（格式兼容）
const rules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
}
```

### 6. Table 差异

```vue
<!-- Ant Design Vue -->
<a-table :columns="columns" :data-source="data" rowKey="id" />

<!-- ZC UI -->
<ZcTable :columns="columns" :data="data" row-key="id" />
```

## 自动迁移工具

我们提供了一个 **codemod 脚本** 帮助自动完成大部分机械替换：

```bash
# 从 Element Plus 迁移
npx @zc-ui/codemod --from element-plus --src ./src

# 从 Ant Design Vue 迁移
npx @zc-ui/codemod --from ant-design-vue --src ./src
```

::: tip 注意
自动迁移工具处理大部分机械替换（组件前缀、属性名等），但部分 API 差异需要手动调整。
请务必在迁移后进行全面测试。
:::

## 迁移检查清单

- [ ] 替换包导入和 CSS 引入
- [ ] 全局替换组件前缀（`el-` / `a-` → `Zc`）
- [ ] 检查 `v-model` 绑定语法
- [ ] 检查 `size` 属性值映射
- [ ] 检查 Table 列配置方式
- [ ] 检查 Form 校验规则格式
- [ ] 替换 Message / Notification 函数调用
- [ ] 检查图标引用方式
- [ ] 运行完整测试
- [ ] 检查样式覆盖是否需要调整（CSS 变量名不同）

## 常见问题

### Q: ZC UI 有对应 Element Plus 的 ConfigProvider 吗？

是的，ZC UI 提供了 `ZcConfigProvider` 组件，支持全局尺寸、国际化、主题等配置。详见 [ConfigProvider 文档](/components/config-provider)。

### Q: ZC UI 支持暗色模式吗？

支持。可以通过 `useDark()` 组合式函数、CSS 变量覆盖或主题预设系统实现暗色模式。详见[主题定制](/guide/theming)。

### Q: ZC UI 有内置图标库吗？

ZC UI 提供了 `ZcIcon` 组件和一套内置图标，详见 [Icon 文档](/components/icon)。你也可以使用任何第三方图标库（如 `@fortawesome`、`lucide-vue-next` 等）。

### Q: 迁移后样式不一致怎么办？

ZC UI 使用独立的 CSS 变量体系（`--color-zc-*`、`--spacing-zc-*`），不会与 Element Plus / Ant Design Vue 的变量冲突。如果之前通过覆盖 CSS 变量自定义样式，需要将变量名映射到 ZC UI 的命名空间。详见[主题定制](/guide/theming)。
