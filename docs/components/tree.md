# Tree 树形控件

用清晰的层级结构展示信息，可展开或折叠。

## 基础用法

通过 `data` 属性传入树形数据。

<DemoBlock>

```vue
<template>
  <ZcTree :data="treeData" />
</template>
<script setup>
const treeData = [
  {
    label: '一级 1',
    children: [{ label: '二级 1-1', children: [{ label: '三级 1-1-1' }] }, { label: '二级 1-2' }],
  },
  {
    label: '一级 2',
    children: [{ label: '二级 2-1' }, { label: '二级 2-2' }],
  },
  {
    label: '一级 3',
    children: [{ label: '二级 3-1' }],
  },
]
</script>
```

</DemoBlock>

## 可选择与勾选

设置 `show-checkbox` 属性开启复选框功能。

<DemoBlock>

```vue
<template>
  <ZcTree :data="treeData" show-checkbox default-expand-all :default-expanded-keys="[1, 2]" />
</template>
<script setup>
const treeData = [
  {
    label: '一级 1',
    children: [{ label: '二级 1-1' }, { label: '二级 1-2' }],
  },
  {
    label: '一级 2',
    children: [{ label: '二级 2-1' }],
  },
]
</script>
```

</DemoBlock>

## 自定义节点内容

通过默认插槽自定义节点内容。

<DemoBlock>

```vue
<template>
  <ZcTree :data="treeData">
    <template #default="{ node }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span style="color: #909399; font-size: 12px;">Level: {{ node.level }}</span>
      </span>
    </template>
  </ZcTree>
</template>
<script setup>
const treeData = [{ label: '节点一', children: [{ label: '子节点' }] }, { label: '节点二' }]
</script>
```

</DemoBlock>

## 虚拟滚动

通过 `virtual` 属性启用虚拟滚动，适合大数据量树形结构（1000+ 节点），大幅减少 DOM 节点数量，提升渲染性能。

> ⚠️ 虚拟滚动模式下，树节点高度固定为 32px，请确保节点内容不会超出此高度。

<DemoBlock>
```vue
<template>
  <ZcTree :data="bigTreeData" virtual />
</template>
<script setup>
// 生成 2000 个节点的测试数据
const bigTreeData = Array.from({ length: 2000 }, (_, i) => ({
  id: i,
  label: `Node ${i}`,
}))
</script>
```

</DemoBlock>

## Tree API

### Props

<ApiTable type="props" :data="[
{ name: 'data', description: '树形数据', type: 'TreeNodeData[]', default: '[]' },
{ name: 'checkedKeys', description: '勾选节点的 key 数组 (v-model:checkedKeys)', type: '(string | number)[]', default: '[]' },
{ name: 'expandedKeys', description: '展开节点的 key 数组 (v-model:expandedKeys)', type: '(string | number)[]', default: '[]' },
{ name: 'modelValue', description: '当前选中节点 key (v-model)', type: 'string | number', default: 'undefined' },
{ name: 'showCheckbox', description: '是否显示复选框', type: 'boolean', default: 'false' },
{ name: 'checkStrictly', description: '是否取消父子关联', type: 'boolean', default: 'false' },
{ name: 'defaultExpandAll', description: '是否默认展开所有节点', type: 'boolean', default: 'false' },
{ name: 'defaultExpandedKeys', description: '默认展开的节点 key 数组', type: '(string | number)[]', default: '[]' },
{ name: 'accordion', description: '是否每次只展开一个同级节点', type: 'boolean', default: 'false' },
{ name: 'expandOnClickNode', description: '是否在点击节点时展开/收缩', type: 'boolean', default: 'true' },
{ name: 'lazy', description: '是否懒加载子节点', type: 'boolean', default: 'false' },
{ name: 'load', description: '加载子树的函数', type: '(node: TreeNodeData, callback: Function) => void', default: 'undefined' },
{ name: 'filterValue', description: '过滤关键词', type: 'string', default: `''` },
{ name: 'highlightCurrent', description: '是否高亮当前节点', type: 'boolean', default: 'true' },
{ name: 'showLine', description: '是否显示连接线', type: 'boolean', default: 'false' },
{ name: 'indent', description: '相邻级节点间的水平缩进(px)', type: 'number', default: '16' },
{ name: 'props', description: '字段映射配置', type: 'object', default: '{}' },
{ name: 'emptyText', description: '内容为空时展示的文本', type: 'string', default: `'No data'` },
{ name: 'draggable', description: '是否开启拖拽', type: 'boolean', default: 'false' },
{ name: 'nodeClass', description: '自定义节点类名', type: 'string | Function', default: `''` },
{ name: 'virtual', description: '是否启用虚拟滚动（适合 1000+ 节点）', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'node-click', description: '节点被点击时触发', parameters: '(data: TreeNodeData)' },
  { name: 'check', description: '勾选状态变化时触发', parameters: '(data: TreeNodeData, checked: boolean)' },
  { name: 'node-expand', description: '节点展开/收缩时触发', parameters: '(data: TreeNodeData, expanded: boolean)' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义节点内容', sub: '作用域参数: { node, data }' },
]" />
