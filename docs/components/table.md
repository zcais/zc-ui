# Table 表格

功能强大的表格组件，支持排序、筛选、分页、固定列、行选中、合并单元格、展开行、树形表格、拖拽排序、可编辑单元格、总结行、列设置、列宽拖拽和虚拟滚动。

## 基础用法

通过 `data` 传入数据，`columns` 定义列配置。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'email', label: '邮箱' },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com' },
  { name: '李四', age: 32, city: '上海', email: 'lisi@example.com' },
  { name: '王五', age: 25, city: '广州', email: 'wangwu@example.com' },
]
</script>
```

</DemoBlock>

## 斑马纹与边框

通过 `stripe` 属性实现斑马纹交替行，`border` 显示表格边框。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" stripe border />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市', align: 'center' },
]
const tableData = [
  { name: '张三', age: 28, city: '北京' },
  { name: '李四', age: 32, city: '上海' },
  { name: '王五', age: 25, city: '广州' },
]
</script>
```

</DemoBlock>

## 排序与筛选

设置 `sortable` 启用排序，`filterable` 和 `filters` 启用筛选。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    border
    @sort-change="handleSortChange"
    @filter-change="handleFilterChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', sortable: true },
  { prop: 'age', label: '年龄', sortable: true },
  {
    prop: 'city',
    label: '城市',
    filterable: true,
    filters: [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
      { text: '广州', value: '广州' },
    ],
  },
]
const tableData = [
  { name: '张三', age: 28, city: '北京' },
  { name: '李四', age: 32, city: '上海' },
  { name: '王五', age: 25, city: '广州' },
]

function handleSortChange(sort) {
  console.log('排序变化:', sort)
}
function handleFilterChange(filters) {
  console.log('筛选变化:', filters)
}
</script>
```

</DemoBlock>

## 自定义排序（后端排序）

设置 `sortable: 'custom'` 时，表格组件不会在前端排序数据，而是通过 `sort-change` 事件通知父组件，由父组件自行请求后端接口获取排序后的数据。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border @sort-change="handleSortChange" />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: 'custom' },
]

const tableData = ref([
  { name: '张三', age: 28 },
  { name: '李四', age: 32 },
])

async function handleSortChange({ prop, order }) {
  console.log(`后端排序: 字段=${prop}, 方向=${order}`)
  // order 为 'ascending' | 'descending' | null
  // 在此处调用后端 API 获取排序后的数据
  // const res = await api.getList({ sortField: prop, sortOrder: order })
  // tableData.value = res.data
}
</script>
```

</DemoBlock>

## 分页

设置 `pagination` 启用分页，通过 `currentPage` 和 `pageSize` 控制。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    pagination
    :page-size="5"
    border
    @current-change="handlePageChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'date', label: '日期', width: 120 },
  { prop: 'name', label: '姓名', width: 100 },
  { prop: 'amount', label: '金额', align: 'right' },
]
const tableData = Array.from({ length: 20 }, (_, i) => ({
  date: `2024-01-${String(i + 1).padStart(2, '0')}`,
  name: `用户${i + 1}`,
  amount: Math.floor(Math.random() * 10000),
}))

function handlePageChange(page) {
  console.log('当前页:', page)
}
</script>
```

</DemoBlock>

## 行选中

设置 `selectable` 启用复选框行选择。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    selectable
    border
    @selection-change="handleSelectionChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄' },
  { prop: 'city', label: '城市' },
]
const tableData = [
  { name: '张三', age: 28, city: '北京' },
  { name: '李四', age: 32, city: '上海' },
  { name: '王五', age: 25, city: '广州' },
]

function handleSelectionChange(selection) {
  console.log('选中行:', selection)
}
</script>
```

</DemoBlock>

## 固定列

通过 `column.fixed` 设置列固定方向。支持 `'left'`、`'right'` 和 `true`（等同 `'left'`）。固定列使用 CSS sticky 定位，横向滚动时保持可见。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 100, fixed: 'left' },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'address', label: '地址', width: 300 },
  { prop: 'phone', label: '电话', width: 150 },
  { prop: 'company', label: '公司', width: 180 },
  { prop: 'salary', label: '薪资', width: 100, fixed: 'right' },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com', address: '朝阳区xx路', phone: '13800001111', company: '科技公司A', salary: 15000 },
  { name: '李四', age: 32, city: '上海', email: 'lisi@example.com', address: '浦东新区xx路', phone: '13800002222', company: '互联网公司B', salary: 25000 },
  { name: '王五', age: 25, city: '广州', email: 'wangwu@example.com', address: '天河区xx路', phone: '13800003333', company: '金融公司C', salary: 18000 },
]
</script>
```

</DemoBlock>

## 合并行/列

通过 `spanMethod` 属性自定义单元格合并逻辑。函数接收 `{ row, column, rowIndex, columnIndex }`，返回 `{ rowspan, colspan }` 对象、`[rowspan, colspan]` 数组或 `undefined`（表示不合并）。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border :span-method="spanMethod" />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'email', label: '邮箱' },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com' },
  { name: '张三', age: 30, city: '上海', email: 'zhangsan2@example.com' },
  { name: '李四', age: 32, city: '广州', email: 'lisi@example.com' },
  { name: '王五', age: 25, city: '深圳', email: 'wangwu@example.com' },
]

// 合并第一列中相同姓名的行
function spanMethod({ rowIndex, columnIndex }) {
  if (columnIndex === 0) {
    if (rowIndex === 0) return { rowspan: 2, colspan: 1 }
    if (rowIndex === 1) return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}
</script>
```

</DemoBlock>

## 展开行

设置 `expandable` 启用展开行功能，通过 `#expand` 插槽自定义展开内容。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border expandable @expand-change="handleExpandChange">
    <template #expand="{ row }">
      <div style="padding: 16px; background: #f9f9f9;">
        <h4>{{ row.name }} 的详细信息</h4>
        <p>年龄：{{ row.age }}</p>
        <p>城市：{{ row.city }}</p>
        <p>邮箱：{{ row.email }}</p>
      </div>
    </template>
  </ZcTable>
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com' },
  { name: '李四', age: 32, city: '上海', email: 'lisi@example.com' },
  { name: '王五', age: 25, city: '广州', email: 'wangwu@example.com' },
]

function handleExpandChange(row, expanded) {
  console.log('展开/收起:', row.name, expanded)
}
</script>
```

</DemoBlock>

## 树形表格

通过 `treeProps` 配置树形数据的子节点字段名和缩进。设置 `defaultExpandAll` 默认展开所有节点。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="treeData"
    :columns="columns"
    border
    :tree-props="{ children: 'children', indent: 20 }"
    @tree-toggle="handleTreeToggle"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '名称' },
  { prop: 'count', label: '数量', width: 100 },
]
const treeData = [
  {
    id: 1,
    name: '部门 A',
    count: 50,
    children: [
      { id: 11, name: '小组 A-1', count: 20 },
      { id: 12, name: '小组 A-2', count: 30 },
    ],
  },
  {
    id: 2,
    name: '部门 B',
    count: 40,
    children: [
      { id: 21, name: '小组 B-1', count: 15 },
      { id: 22, name: '小组 B-2', count: 25 },
    ],
  },
]

function handleTreeToggle(row, expanded) {
  console.log('树节点切换:', row.name, expanded)
}
</script>
```

</DemoBlock>

## 自定义列渲染

通过具名插槽 `#cell-[prop]` 自定义单元格内容，通过 `#header-[prop]` 自定义表头内容。也可以通过 `formatter` 函数格式化单元格内容。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border>
    <template #header-name>
      <span style="color: #409eff;">⭐ 姓名</span>
    </template>
    <template #cell-name="{ row }">
      <strong style="color: #409eff;">{{ row.name }}</strong>
    </template>
    <template #cell-status="{ row }">
      <span :style="{ color: row.status === 'active' ? '#67c23a' : '#f56c6c' }">
        {{ row.status === 'active' ? '● 在线' : '● 离线' }}
      </span>
    </template>
  </ZcTable>
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'status', label: '状态', width: 100 },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', status: 'active' },
  { name: '李四', age: 32, city: '上海', status: 'inactive' },
  { name: '王五', age: 25, city: '广州', status: 'active' },
]
</script>
```

</DemoBlock>

## 拖拽排序

设置 `draggable` 启用行拖拽排序。拖拽完成后触发 `row-drag-end` 事件，返回 `{ oldIndex, newIndex, data }`。

> ⚠️ 注意：拖拽排序基于扁平行索引，不建议与树形表格（`treeProps`）同时使用。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border draggable @row-drag-end="handleDragEnd" />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
]
const tableData = ref([
  { id: 1, name: '张三', age: 28, city: '北京' },
  { id: 2, name: '李四', age: 32, city: '上海' },
  { id: 3, name: '王五', age: 25, city: '广州' },
  { id: 4, name: '赵六', age: 30, city: '深圳' },
])

function handleDragEnd({ oldIndex, newIndex, data }) {
  console.log(`从 ${oldIndex} 移动到 ${newIndex}`)
  tableData.value = data
}
</script>
```

</DemoBlock>

## 可编辑表格

设置 `editable` 启用单元格编辑。点击单元格进入编辑模式，回车确认，ESC 取消。通过 `column.editable` 可以单独控制某列是否可编辑。也可以通过 `column.editComponent` 指定自定义编辑组件。

<DemoBlock>

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border editable @cell-edit="handleCellEdit" />
</template>

<script setup>
import { ref } from 'vue'

const columns = [
  { prop: 'name', label: '姓名', width: 120, editable: true },
  { prop: 'age', label: '年龄', width: 80, editable: true },
  { prop: 'city', label: '城市', editable: false },
]
const tableData = ref([
  { id: 1, name: '张三', age: 28, city: '北京' },
  { id: 2, name: '李四', age: 32, city: '上海' },
  { id: 3, name: '王五', age: 25, city: '广州' },
])

function handleCellEdit({ row, column, value, oldValue }) {
  console.log(`编辑: ${column.label} 从 "${oldValue}" 改为 "${value}"`)
}
</script>
```

</DemoBlock>

## 总结行

设置 `showSummary` 在表格底部显示合计行。默认对数值列求和。通过 `summaryMethod` 自定义合计逻辑，`summaryText` 自定义首列标签。

> ℹ️ 当同时使用分页时，合计行基于全量数据计算（排序和过滤后），而非当前页。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    border
    show-summary
    summary-text="总计"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '商品名称', width: 150 },
  { prop: 'price', label: '单价', width: 100, align: 'right' },
  { prop: 'quantity', label: '数量', width: 100, align: 'right' },
  { prop: 'total', label: '小计', align: 'right' },
]
const tableData = [
  { name: '商品 A', price: 100, quantity: 3, total: 300 },
  { name: '商品 B', price: 200, quantity: 2, total: 400 },
  { name: '商品 C', price: 50, quantity: 10, total: 500 },
]
</script>
```

</DemoBlock>

## 列设置

设置 `showColumnSettings` 显示列设置面板。用户可以切换列的显示/隐藏和排序。列设置变更时触发 `column-settings-change` 事件。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    border
    show-column-settings
    @column-settings-change="handleSettingsChange"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
  { prop: 'city', label: '城市', width: 120 },
  { prop: 'email', label: '邮箱', width: 200 },
  { prop: 'phone', label: '电话', width: 150 },
]
const tableData = [
  { name: '张三', age: 28, city: '北京', email: 'zhangsan@example.com', phone: '13800001111' },
  { name: '李四', age: 32, city: '上海', email: 'lisi@example.com', phone: '13800002222' },
  { name: '王五', age: 25, city: '广州', email: 'wangwu@example.com', phone: '13800003333' },
]

function handleSettingsChange(settings) {
  console.log('列设置变更:', settings)
}
</script>
```

</DemoBlock>

## 列宽拖拽

设置 `resizable` 启用列宽拖拽功能。拖拽表头右侧边缘调整列宽，最小宽度为 40px。通过 `column.resizable` 可以禁用特定列的拖拽。拖拽结束时触发 `column-resize` 事件。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    border
    resizable
    @column-resize="handleColumnResize"
  />
</template>

<script setup>
const columns = [
  { prop: 'name', label: '姓名（可拖拽）', width: 150 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'city', label: '城市（禁用拖拽）', width: 150, resizable: false },
]
const tableData = [
  { name: '张三', age: 28, city: '北京' },
  { name: '李四', age: 32, city: '上海' },
  { name: '王五', age: 25, city: '广州' },
]

function handleColumnResize({ prop, oldWidth, newWidth }) {
  console.log(`列 ${prop}: ${oldWidth}px → ${newWidth}px`)
}
</script>
```

</DemoBlock>

## 虚拟滚动

设置 `virtual` 启用虚拟滚动以优化大数据量渲染性能。需要同时设置 `height` 属性。`estimatedRowHeight` 控制预估行高（默认 48px）。

> ⚠️ 虚拟滚动不兼容分页（`pagination`）和树形表格（`treeProps`）。

### 基础用法

最简单的虚拟滚动用法，只需添加 `virtual` 和 `height` 属性即可。

  <DemoBlock>
    
    ```vue
    <template>
    <ZcTable
    :data="bigData"
    :columns="columns"
  border
virtual
:height="300"
:estimated-row-height="48"
/>
  </template>
  
  <script setup>
const columns = [
{ prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'value', label: '数值' },
  ]
const bigData = Array.from({ length: 1000 }, (_, i) => ({
id: i + 1,
name: `用户 ${i + 1}`,
value: Math.floor(Math.random() * 10000),
}))
</script>
```

</DemoBlock>

### 虚拟滚动 + 排序

虚拟模式下支持所有排序功能。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    virtual
    :height="300"
    border
    @sort-change="handleSortChange"
  />
  <div style="margin-top: 10px;">
    当前排序: {{ currentSort }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentSort = ref('无')

const columns = [
  { prop: 'id', label: 'ID', width: 80, sortable: true },
  { prop: 'name', label: '姓名', width: 120, sortable: true },
  { prop: 'age', label: '年龄', width: 80, sortable: true },
  { prop: 'city', label: '城市' },
]

const tableData = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 50),
  city: ['北京', '上海', '广州', '深圳'][i % 4],
}))

function handleSortChange(sort) {
  currentSort.value = sort.order === null ? '无' : `${sort.prop} ${sort.order === 'ascending' ? '升序' : '降序'}`
}
</script>
```

</DemoBlock>

### 虚拟滚动 + 筛选

虚拟模式下支持列筛选功能。

<DemoBlock>

```vue
<template>
  <ZcTable
    :data="tableData"
    :columns="columns"
    virtual
    :height="300"
    border
    @filter-change="handleFilterChange"
  />
  <div style="margin-top: 10px;">
    当前筛选: {{ currentFilter }}
  </div>
</template>

<script setup>
import { ref } from 'vue'

const currentFilter = ref('无')

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  {
    prop: 'city',
    label: '城市',
    filterable: true,
    filters: [
      { text: '北京', value: '北京' },
      { text: '上海', value: '上海' },
      { text: '广州', value: '广州' },
      { text: '深圳', value: '深圳' },
    ],
  },
]

const tableData = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  city: ['北京', '上海', '广州', '深圳'][i % 4],
}))

function handleFilterChange(filters) {
  const cityFilter = filters.city || []
  currentFilter.value = cityFilter.length > 0 ? `城市: ${cityFilter.join(', ')}` : '无'
}
</script>
```

</DemoBlock>

### 虚拟滚动 + 选择

虚拟模式下支持行选择功能。

<DemoBlock>

```vue
<template>
  <ZcTable
    ref="tableRef"
    :data="tableData"
    :columns="columns"
    virtual
    :height="300"
    border
    selectable
    @selection-change="handleSelectionChange"
  />
  <div style="margin-top: 10px;">
    已选择: {{ selectedCount }} 条数据
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const tableRef = ref()
const selectedRows = ref([])

const selectedCount = computed(() => selectedRows.value.length)

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'age', label: '年龄', width: 80 },
]

const tableData = Array.from({ length: 500 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  age: 20 + (i % 50),
}))

function handleSelectionChange(selection) {
  selectedRows.value = selection
  console.log('选中行:', selection)
}
</script>
```

</DemoBlock>

### virtualScrollTo 方法

使用 `virtualScrollTo` 方法滚动到指定行。

<DemoBlock>

```vue
<template>
  <div>
    <ZcTable
      ref="tableRef"
      :data="tableData"
      :columns="columns"
      virtual
      :height="300"
      border
    />
    <div style="margin-top: 10px; display: flex; gap: 10px; align-items: center;">
      <span>跳转到行:</span>
      <input
        v-model.number="targetRow"
        type="number"
        :min="1"
        :max="tableData.length"
        style="width: 80px; padding: 4px;"
      />
      <button @click="scrollToRow">跳转</button>
      <button @click="scrollToRowSmooth">平滑跳转</button>
      <button @click="scrollToTop">回到顶部</button>
      <button @click="scrollToBottom">跳转到底部</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tableRef = ref()
const targetRow = ref(1)

const columns = [
  { prop: 'id', label: 'ID', width: 80 },
  { prop: 'name', label: '姓名', width: 120 },
  { prop: 'value', label: '数值' },
]

const tableData = Array.from({ length: 1000 }, (_, i) => ({
  id: i + 1,
  name: `用户 ${i + 1}`,
  value: Math.floor(Math.random() * 10000),
}))

function scrollToRow() {
  tableRef.value?.virtualScrollTo(targetRow.value - 1, 'auto')
}

function scrollToRowSmooth() {
  tableRef.value?.virtualScrollTo(targetRow.value - 1, 'smooth')
}

function scrollToTop() {
  tableRef.value?.virtualScrollTo(0, 'smooth')
  targetRow.value = 1
}

function scrollToBottom() {
  tableRef.value?.virtualScrollTo(tableData.length - 1, 'smooth')
  targetRow.value = tableData.length
}
</script>
```

</DemoBlock>

### 大数据量性能说明

虚拟滚动适用于处理大数据量场景，以下是性能对比：

| 数据量 | 普通渲染 DOM 节点数 | 虚拟滚动 DOM 节点数 | 渲染时间（普通） | 渲染时间（虚拟） |
|--------|---------------------|---------------------|------------------|------------------|
| 100 行  | ~100                | ~20                 | ~50ms           | ~30ms           |
| 1,000 行 | ~1,000              | ~20                 | ~300ms          | ~50ms           |
| 10,000 行 | ~10,000            | ~20                 | ~3000ms         | ~80ms           |
| 100,000 行 | OOM               | ~20                 | 浏览器崩溃      | ~150ms          |

**虚拟滚动优势：**
- ✅ 大幅减少 DOM 节点数量，提高渲染性能
- ✅ 滚动流畅，不随数据量增加而卡顿
- ✅ 内存占用稳定，不会因数据量增加而增长
- ✅ 支持所有常规功能（排序、筛选、选择等）

**注意事项：**
- ⚠️ 需要设置固定的表格高度
- ⚠️ 当前仅支持固定行高模式（`estimatedRowHeight`）
- ⚠️ 不兼容分页、树形表格、合并单元格功能
- ⚠️ 需要合理设置 `estimatedRowHeight` 以获得最佳体验

## Table API

### Props

<ApiTable type="props" :data="[
  { name: 'data', description: '表格数据', type: 'Record<string, any>[]', default: '—' },
  { name: 'columns', description: '列配置数组', type: 'TableColumn[]', default: '[]' },
  { name: 'rowKey', description: '行数据的唯一键（字符串或函数）', type: 'string | Function', default: 'id' },
  { name: 'border', description: '是否显示边框', type: 'boolean', default: 'false' },
  { name: 'stripe', description: '是否显示斑马纹', type: 'boolean', default: 'false' },
  { name: 'height', description: '表格高度（设置后表头固定）', type: 'number | string', default: '—' },
  { name: 'highlightCurrentRow', description: '是否高亮当前行', type: 'boolean', default: 'false' },
  { name: 'defaultSort', description: '默认排序状态', type: 'SortState', default: '{ prop: &quot;&quot;, order: null }' },
  { name: 'selectable', description: '是否启用行选择（复选框）', type: 'boolean', default: 'false' },
  { name: 'pagination', description: '是否启用分页', type: 'boolean', default: 'false' },
  { name: 'currentPage', description: '当前页码', type: 'number', default: '1' },
  { name: 'pageSize', description: '每页条数', type: 'number', default: '10' },
  { name: 'emptyText', description: '空数据时显示的文本', type: 'string', default: '暂无数据' },
  { name: 'showHeader', description: '是否显示表头', type: 'boolean', default: 'true' },
  { name: 'size', description: '表格尺寸', type: 'large | medium | small', default: 'medium' },
  { name: 'virtual', description: '是否启用虚拟滚动（需设置 height）', type: 'boolean', default: 'false' },
  { name: 'estimatedRowHeight', description: '虚拟滚动预估行高（px）', type: 'number', default: '48' },
  { name: 'spanMethod', description: '合并单元格方法', type: 'SpanMethod', default: '—' },
  { name: 'expandable', description: '是否启用展开行', type: 'boolean', default: 'false' },
  { name: 'treeProps', description: '树形表格配置', type: 'TableTreePropsConfig', default: '—' },
  { name: 'defaultExpandAll', description: '是否默认展开所有树节点', type: 'boolean', default: 'false' },
  { name: 'draggable', description: '是否启用行拖拽排序', type: 'boolean', default: 'false' },
  { name: 'editable', description: '是否启用可编辑单元格', type: 'boolean', default: 'false' },
  { name: 'showSummary', description: '是否显示总结行', type: 'boolean', default: 'false' },
  { name: 'summaryMethod', description: '自定义合计方法', type: 'SummaryMethod', default: '—' },
  { name: 'summaryText', description: '总结行首列标签文字', type: 'string', default: '合计' },
  { name: 'showColumnSettings', description: '是否显示列设置面板', type: 'boolean', default: 'false' },
  { name: 'resizable', description: '是否启用列宽拖拽', type: 'boolean', default: 'false' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'sort-change', description: '排序变化时触发', parameters: '(sort: SortState)' },
  { name: 'filter-change', description: '筛选变化时触发', parameters: '(filters: FilterState)' },
  { name: 'selection-change', description: '选中项变化时触发', parameters: '(selection: Record<string, any>[])' },
  { name: 'current-change', description: '页码变化时触发', parameters: '(currentPage: number)' },
  { name: 'row-click', description: '点击行时触发', parameters: '(row, column, event)' },
  { name: 'cell-click', description: '点击单元格时触发', parameters: '(row, column, cell, event)' },
  { name: 'expand-change', description: '展开/收起行时触发', parameters: '(row, expanded: boolean)' },
  { name: 'tree-toggle', description: '树节点展开/收起时触发', parameters: '(row, expanded: boolean)' },
  { name: 'row-drag-end', description: '行拖拽排序完成时触发', parameters: '(event: DragSortEvent)' },
  { name: 'cell-edit', description: '单元格编辑确认时触发', parameters: '(payload: { row, column, value, oldValue })' },
  { name: 'column-resize', description: '列宽拖拽结束时触发', parameters: '(event: ColumnResizeEvent)' },
  { name: 'column-settings-change', description: '列设置变化时触发', parameters: '(settings: ColumnSettingItem[])' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'header-[prop]', description: '自定义表头内容，作用域参数：{ column }' },
  { name: 'cell-[prop]', description: '自定义单元格内容，作用域参数：{ row, column, value, index }' },
  { name: 'expand', description: '展开行内容，作用域参数：{ row, index }' }
]" />

### TableColumn 配置

<ApiTable type="props" :data="[
  { name: 'prop', description: '列字段名', type: 'string', default: '—' },
  { name: 'label', description: '列标题显示文字', type: 'string', default: '—' },
  { name: 'width', description: '列宽（px）', type: 'number | string', default: '—' },
  { name: 'minWidth', description: '最小列宽', type: 'number | string', default: '—' },
  { name: 'fixed', description: '固定列位置', type: 'left | right | boolean', default: '—' },
  { name: 'sortable', description: '是否可排序（custom 表示由父组件处理后端排序）', type: 'boolean | &quot;custom&quot;', default: '—' },
  { name: 'filterable', description: '是否可筛选', type: 'boolean', default: '—' },
  { name: 'filters', description: '筛选选项', type: 'TableFilterOption[]', default: '—' },
  { name: 'align', description: '对齐方式', type: 'left | center | right', default: 'left' },
  { name: 'headerAlign', description: '表头对齐方式（优先于 align）', type: 'left | center | right', default: '—' },
  { name: 'formatter', description: '自定义格式化函数', type: '(row, column, cellValue, index) => string', default: '—' },
  { name: 'className', description: '自定义列类名', type: 'string', default: '—' },
  { name: 'visible', description: '是否可见（设为 false 隐藏列）', type: 'boolean', default: 'true' },
  { name: 'resizable', description: '该列是否可拖拽调整宽度（需配合 resizable 属性）', type: 'boolean', default: 'true' },
  { name: 'editable', description: '该列单元格是否可编辑（需配合 editable 属性）', type: 'boolean', default: 'true' },
  { name: 'editComponent', description: '自定义编辑组件（替代默认 input）', type: 'Component', default: '—' },
  { name: 'editPlaceholder', description: '编辑输入框的占位文字', type: 'string', default: '—' }
]" />

### 类型定义

#### SpanMethod

```ts
type SpanMethod = (data: {
  row: Record<string, any>
  column: TableColumn
  rowIndex: number
  columnIndex: number
}) => SpanValue | [number, number] | undefined

interface SpanValue {
  rowspan: number
  colspan: number
}
```

#### TableTreePropsConfig

```ts
interface TableTreePropsConfig {
  children?: string    // 子节点字段名，默认 'children'
  hasChildren?: string // 是否有子节点的字段名（用于懒加载）
  indent?: number      // 每层缩进宽度（px），默认 16
}
```

#### SummaryMethod

```ts
type SummaryMethod = (data: {
  columns: TableColumn[]
  data: Record<string, any>[]
}) => (string | VNode)[]
```

#### ColumnSettingItem

```ts
interface ColumnSettingItem {
  prop: string
  label: string
  visible: boolean
  order: number
}
```

#### DragSortEvent

```ts
interface DragSortEvent {
  oldIndex: number
  newIndex: number
  data: Record<string, any>[]
}
```

#### ColumnResizeEvent

```ts
interface ColumnResizeEvent {
  prop: string
  oldWidth: number
  newWidth: number
}
```

### 兼容性说明

| 功能组合 | 兼容性 | 说明 |
|---------|--------|------|
| virtual + treeProps | ❌ 不兼容 | 虚拟模式忽略树形结构 |
| virtual + spanMethod | ❌ 不兼容 | 虚拟模式下合并结果可能错位 |
| virtual + pagination | ❌ 不兼容 | 虚拟模式仅在非分页时生效 |
| virtual + sortable | ✅ 兼容 | 排序功能正常工作 |
| virtual + filterable | ✅ 兼容 | 筛选功能正常工作 |
| virtual + selectable | ✅ 兼容 | 选择功能正常工作 |
| virtual + fixed | ✅ 兼容 | 固定列功能正常工作 |
| spanMethod + fixed | ⚠️ 注意 | 合并单元格可能影响固定列偏移计算 |
| draggable + treeProps | ⚠️ 注意 | 拖拽基于扁平行索引，非树形层级 |
| showSummary + pagination | ✅ 兼容 | 合计基于全量数据，非当前页 |
| editable + treeProps | ✅ 兼容 | 正常工作 |
| resizable + showColumnSettings | ✅ 兼容 | 正常工作 |

### 暴露的方法 (Exposed Methods)

| 方法名 | 参数 | 说明 |
|--------|------|------|
| virtualScrollTo | (index: number, behavior?: ScrollBehavior) | 滚动到指定行索引（从 0 开始），behavior 可选 'auto' 或 'smooth' |
| startEdit | (row, column) | 开始编辑单元格 |
| confirmEdit | (row, column) | 确认编辑 |
| cancelEdit | () | 取消编辑 |
