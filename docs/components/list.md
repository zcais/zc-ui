# List 列表

基础列表，用于展示多条结构类似的数据。

## 基础用法

最基础的列表展示。

<DemoBlock>

```vue
<template>
  <ZcList bordered>
    <ZcListItem>
      <div style="flex: 1;">列表内容 1</div>
      <div style="color: #909399;">额外信息</div>
    </ZcListItem>
    <ZcListItem>
      <div style="flex: 1;">列表内容 2</div>
      <div style="color: #909399;">额外信息</div>
    </ZcListItem>
    <ZcListItem>
      <div style="flex: 1;">列表内容 3</div>
      <div style="color: #909399;">额外信息</div>
    </ZcListItem>
  </ZcList>
</template>
```

</DemoBlock>

## 带标题与加载

使用 `header`、`footer` 插槽添加头部和底部，`loading` 属性显示加载状态。

<DemoBlock>

```vue
<template>
  <ZcList header="列表标题" bordered :loading="loading" footer="共 3 条数据">
    <ZcListItem>列表内容 1</ZcListItem>
    <ZcListItem>列表内容 2</ZcListItem>
    <ZcListItem>列表内容 3</ZcListItem>
  </ZcList>
</template>
<script setup>
import { ref } from 'vue'
const loading = ref(false)
</script>
```

</DemoBlock>

## List API

### ZcList Props

<ApiTable type="props" :data="[
{ name: 'bordered', description: '是否显示边框', type: 'boolean', default: 'false' },
{ name: 'split', description: '是否显示分割线', type: 'boolean', default: 'true' },
{ name: 'splitPosition', description: '分割线位置', type: `'inside' | 'outside'`, default: `'outside'` },
{ name: 'size', description: '列表尺寸', type: `'large' | 'default' | 'small'`, default: `'default'` },
{ name: 'layout', description: '布局', type: `'vertical' | 'horizontal'`, default: `'vertical'` },
{ name: 'loading', description: '是否加载中', type: 'boolean', default: 'false' },
{ name: 'header', description: '头部文本', type: 'string', default: `''` },
{ name: 'footer', description: '底部文本', type: 'string', default: `''` },
{ name: 'emptyText', description: '空数据文本', type: 'string', default: `'No data'` },
]" />

### ZcList Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '列表内容' },
  { name: 'header', description: '自定义头部' },
  { name: 'footer', description: '自定义底部' },
  { name: 'loading', description: '自定义加载内容' },
  { name: 'empty', description: '自定义空状态内容' },
]" />
