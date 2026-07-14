# Pagination 分页

当数据量过多时，使用分页分解数据，方便用户浏览。

## 基础用法

通过 `total` 属性设置总数据条数，自动计算页数。

<DemoBlock>

```vue
<template>
  <ZcPagination :total="200" />
</template>
```

</DemoBlock>

## 自定义布局

通过 `layout` 属性控制显示的组件，支持 `total`、`prev`、`pager`、`next`、`jumper`。

<DemoBlock>

```vue
<template>
  <ZcPagination :total="200" layout="total, prev, pager, next, jumper" />
</template>
```

</DemoBlock>

## 页面大小

通过 `page-size` 设置每页条数，`current-page` 控制当前页。

<DemoBlock>

```vue
<template>
  <ZcPagination :total="500" :page-size="20" :current-page="3" />
</template>
```

</DemoBlock>

## 禁用状态

通过 `disabled` 属性禁用分页组件。

<DemoBlock>

```vue
<template>
  <ZcPagination :total="100" disabled />
</template>
```

</DemoBlock>

## 事件监听

监听分页变化事件，获取当前页和条数。

<DemoBlock>

```vue
<template>
  <ZcPagination
    :total="200"
    @change="handleChange"
    @prev-click="handlePrev"
    @next-click="handleNext"
  />
</template>

<script setup>
const handleChange = (page, pageSize) => {
  console.log('当前页:', page, '每页条数:', pageSize)
}
const handlePrev = (page) => {
  console.log('上一页:', page)
}
const handleNext = (page) => {
  console.log('下一页:', page)
}
</script>
```

</DemoBlock>

## Pagination API

### Props

<ApiTable type="props" :data="[
  { name: 'total', description: '总数据条数', type: 'number', default: '—' },
  { name: 'page-size', description: '每页条数', type: 'number', default: '10' },
  { name: 'current-page', description: '当前页码（v-model）', type: 'number', default: '1' },
  { name: 'layout', description: '布局组件，逗号分隔', type: 'string', default: 'prev, pager, next, jumper, total' },
  { name: 'pager-count', description: '页码按钮数量', type: 'number', default: '7' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:currentPage', description: '当前页变化时触发', parameters: '(page: number)' },
  { name: 'update:pageSize', description: '每页条数变化时触发', parameters: '(size: number)' },
  { name: 'change', description: '当前页或每页条数变化时触发', parameters: '(page: number, pageSize: number)' },
  { name: 'prev-click', description: '点击上一页按钮时触发', parameters: '(page: number)' },
  { name: 'next-click', description: '点击下一页按钮时触发', parameters: '(page: number)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '分页组件整体内容（极少使用）' }
]" />

## 注意事项

- **数据量提示**：当 `total` 很大（如 10000+）时，Pagination 仅渲染可视页码按钮，性能不受影响。
- **jumper 输入**：jumper 输入框支持 Enter 键确认跳转，输入超出范围的页码会自动钳制到有效范围。
- **布局自定义**：`layout` 属性支持逗号分隔的组件名称，可自由排列组合（如 `'total, prev, pager, next, jumper'`）。
- **无障碍**：页码按钮使用 `<li>` 元素，建议搭配 `aria-current="page"` 标识当前页（需手动添加）。
