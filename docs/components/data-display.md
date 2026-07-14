# 数据展示组件

ZC UI 数据展示组件文档。

## 目录

| 组件                      | 说明                              |
| ------------------------- | --------------------------------- |
| [ZcTag](#zctag)           | 标签 — type/effect/closable/round |
| [ZcBadge](#zcbadge)       | 徽标 — value/is-dot/type          |
| [ZcAvatar](#zcavatar)     | 头像 — size/shape/fallback        |
| [ZcEmpty](#zcempty)       | 空状态 — description/image        |
| [ZcSkeleton](#zcskeleton) | 骨架屏 — loading 动画             |
| [ZcTable](#zctable)       | 表格 — 排序/筛选/固定列/多选/分页 |

---

## ZcTag

用于标记和选择小标签。

### 基本用法

```vue
<template>
  <ZcTag>默认标签</ZcTag>
  <ZcTag type="primary">主要标签</ZcTag>
  <ZcTag type="success">成功标签</ZcTag>
  <ZcTag type="warning">警告标签</ZcTag>
  <ZcTag type="danger">危险标签</ZcTag>
</template>
```

### Props

| 属性                 | 说明             | 类型                                                        | 默认值    |
| -------------------- | ---------------- | ----------------------------------------------------------- | --------- |
| `type`               | 标签类型         | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'info'`  |
| `effect`             | 主题样式         | `'dark' \| 'light' \| 'plain'`                              | `'light'` |
| `closable`           | 是否可关闭       | `boolean`                                                   | `false`   |
| `round`              | 是否圆角         | `boolean`                                                   | `false`   |
| `hit`                | 是否有边框描边   | `boolean`                                                   | `false`   |
| `disableTransitions` | 是否禁用过渡动画 | `boolean`                                                   | `false`   |

### Events

| 事件    | 说明           | 回调参数              |
| ------- | -------------- | --------------------- |
| `close` | 关闭标签时触发 | `(event: MouseEvent)` |
| `click` | 点击标签时触发 | `(event: MouseEvent)` |

### Slots

| 插槽      | 说明     |
| --------- | -------- |
| `default` | 标签内容 |

---

## ZcBadge

出现在按钮、图标旁的数字或状态标记。

### 基本用法

```vue
<template>
  <ZcBadge :value="12">
    <ZcButton>消息</ZcButton>
  </ZcBadge>
  <ZcBadge :value="200" :max="99">
    <ZcButton>超出最大值</ZcButton>
  </ZcBadge>
  <ZcBadge is-dot>
    <ZcButton>小红点</ZcButton>
  </ZcBadge>
</template>
```

### Props

| 属性     | 说明                      | 类型                                                        | 默认值     |
| -------- | ------------------------- | ----------------------------------------------------------- | ---------- |
| `value`  | 显示值                    | `string \| number`                                          | `''`       |
| `max`    | 最大值，超过显示 `{max}+` | `number`                                                    | `99`       |
| `isDot`  | 是否显示为小圆点          | `boolean`                                                   | `false`    |
| `hidden` | 是否隐藏 badge            | `boolean`                                                   | `false`    |
| `type`   | 类型颜色                  | `'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'danger'` |

### Slots

| 插槽      | 说明         |
| --------- | ------------ |
| `default` | 被标记的内容 |

---

## ZcAvatar

用来代表用户或事物，支持图片、图标或字符展示。

### 基本用法

```vue
<template>
  <ZcAvatar src="https://example.com/avatar.png" />
  <ZcAvatar size="large" shape="circle" />
  <ZcAvatar :size="64" shape="square" />
  <ZcAvatar icon="icon-user" />
</template>
```

### Props

| 属性    | 说明           | 类型                                                       | 默认值     |
| ------- | -------------- | ---------------------------------------------------------- | ---------- |
| `src`   | 图片地址       | `string`                                                   | `''`       |
| `size`  | 尺寸           | `'large' \| 'medium' \| 'small' \| number`                 | `'medium'` |
| `shape` | 形状           | `'circle' \| 'square'`                                     | `'circle'` |
| `icon`  | 自定义图标类名 | `string`                                                   | `''`       |
| `alt`   | 图片 alt 文本  | `string`                                                   | `''`       |
| `fit`   | 图片填充模式   | `'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | `'cover'`  |

### Slots

| 插槽       | 说明                     |
| ---------- | ------------------------ |
| `default`  | 自定义头像内容           |
| `fallback` | 图片加载失败时的后备内容 |

---

## ZcEmpty

空状态占位符，用于无数据或完成提示。

### 基本用法

```vue
<template>
  <ZcEmpty description="暂无数据" />
  <ZcEmpty description="自定义文案">
    <ZcButton>刷新</ZcButton>
  </ZcEmpty>
</template>
```

### Props

| 属性          | 说明           | 类型     | 默认值       |
| ------------- | -------------- | -------- | ------------ |
| `description` | 文本描述       | `string` | `'暂无数据'` |
| `image`       | 自定义图片地址 | `string` | `''`         |
| `imageSize`   | 图片大小（px） | `number` | `0`          |

### Slots

| 插槽          | 说明         |
| ------------- | ------------ |
| `default`     | 底部额外内容 |
| `image`       | 自定义图片   |
| `description` | 自定义描述   |

---

## ZcSkeleton

在需要等待加载内容的位置提供一个占位图形组合。

### 基本用法

```vue
<template>
  <ZcSkeleton :loading="isLoading">
    <div>实际内容</div>
  </ZcSkeleton>

  <ZcSkeleton :avatar="true" :rows="4" animated />
</template>
```

### Props

| 属性        | 说明                                        | 类型                | 默认值  |
| ----------- | ------------------------------------------- | ------------------- | ------- |
| `rows`      | 段落行数                                    | `number`            | `0`     |
| `animated`  | 是否开启动画                                | `boolean`           | `true`  |
| `loading`   | 是否显示骨架屏（为 false 时显示 slot 内容） | `boolean`           | `true`  |
| `avatar`    | 是否显示头像占位符                          | `boolean \| object` | `false` |
| `title`     | 是否显示标题占位符                          | `boolean \| object` | `true`  |
| `paragraph` | 是否显示段落占位符                          | `boolean \| object` | `true`  |

### Avatar 选项

| 属性    | 类型                             | 默认值     |
| ------- | -------------------------------- | ---------- |
| `size`  | `'large' \| 'medium' \| 'small'` | `'medium'` |
| `shape` | `'circle' \| 'square'`           | `'square'` |

### Slots

| 插槽      | 说明                     |
| --------- | ------------------------ |
| `default` | 加载完成后显示的实际内容 |

---

## ZcTable

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比等操作。

### 基本用法

```vue
<template>
  <ZcTable :data="tableData" :columns="columns" border stripe />

  <ZcTable :data="tableData" :columns="columns" selectable pagination :page-size="5" />
</template>

<script setup lang="ts">
import type { TableColumn } from '@zc-ui/components'

const columns: TableColumn[] = [
  { prop: 'name', label: '姓名' },
  { prop: 'age', label: '年龄', sortable: true },
  {
    prop: 'city',
    label: '城市',
    filterable: true,
    filters: [
      { text: '北京', value: 'Beijing' },
      { text: '上海', value: 'Shanghai' },
    ],
  },
]

const tableData = [
  { id: 1, name: 'Alice', age: 30, city: 'Beijing' },
  { id: 2, name: 'Bob', age: 25, city: 'Shanghai' },
]
</script>
```

### 自定义列模板

通过 `cell-{prop}` 和 `header-{prop}` 插槽实现自定义渲染：

```vue
<template>
  <ZcTable :data="tableData" :columns="columns">
    <template #cell-name="{ row }">
      <strong>{{ row.name }}</strong>
    </template>
    <template #header-age>
      <span>Age (Sortable)</span>
    </template>
  </ZcTable>
</template>
```

### Props

| 属性                  | 说明                 | 类型                                                           | 默认值                      |
| --------------------- | -------------------- | -------------------------------------------------------------- | --------------------------- |
| `data`                | 表格数据数组         | `Record<string, any>[]`                                        | 必填                        |
| `columns`             | 列定义               | `TableColumn[]`                                                | `[]`                        |
| `rowKey`              | 行数据的 Key         | `string \| function`                                           | `'id'`                      |
| `border`              | 是否显示纵向边框     | `boolean`                                                      | `false`                     |
| `stripe`              | 是否为斑马纹         | `boolean`                                                      | `false`                     |
| `height`              | 表格高度（超出滚动） | `number \| string`                                             | —                           |
| `highlightCurrentRow` | 是否高亮当前行       | `boolean`                                                      | `false`                     |
| `selectable`          | 是否开启多选         | `boolean`                                                      | `false`                     |
| `pagination`          | 是否开启分页         | `boolean`                                                      | `false`                     |
| `pageSize`            | 每页条数             | `number`                                                       | `10`                        |
| `currentPage`         | 当前页               | `number`                                                       | `1`                         |
| `emptyText`           | 空数据提示文字       | `string`                                                       | `'暂无数据'`                |
| `size`                | 表格尺寸             | `'large' \| 'medium' \| 'small'`                               | `'medium'`                  |
| `defaultSort`         | 默认排序             | `{ prop: string; order: 'ascending' \| 'descending' \| null }` | `{ prop: '', order: null }` |

### TableColumn 定义

| 属性         | 说明       | 类型                                        |
| ------------ | ---------- | ------------------------------------------- |
| `prop`       | 字段名     | `string`                                    |
| `label`      | 列标题     | `string`                                    |
| `width`      | 列宽       | `number \| string`                          |
| `fixed`      | 固定列     | `'left' \| 'right' \| boolean`              |
| `sortable`   | 是否可排序 | `boolean \| 'custom'`                       |
| `filterable` | 是否可筛选 | `boolean`                                   |
| `filters`    | 筛选选项   | `TableFilterOption[]`                       |
| `align`      | 对齐方式   | `'left' \| 'center' \| 'right'`             |
| `formatter`  | 格式化函数 | `(row, column, cellValue, index) => string` |

### Events

| 事件               | 说明       | 回调参数                     |
| ------------------ | ---------- | ---------------------------- |
| `sort-change`      | 排序变化   | `(sort: SortState)`          |
| `filter-change`    | 筛选变化   | `(filters: FilterState)`     |
| `selection-change` | 选择变化   | `(selection: any[])`         |
| `current-change`   | 分页变化   | `(currentPage: number)`      |
| `row-click`        | 行点击     | `(row, column, event)`       |
| `cell-click`       | 单元格点击 | `(row, column, cell, event)` |

### Slots

| 插槽            | 说明             | 作用域参数                      |
| --------------- | ---------------- | ------------------------------- |
| `cell-{prop}`   | 自定义单元格内容 | `{ row, column, value, index }` |
| `header-{prop}` | 自定义表头内容   | `{ column }`                    |
