# Select 选择器

当选项较多时，使用下拉菜单展示并选择内容。

## 基础用法

通过 `options` 数组配置选项，使用 `v-model` 绑定选中值。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value1" :options="options" placeholder="请选择" />
</template>

<script setup>
const options = [
  { label: '选项一', value: 1 },
  { label: '选项二', value: 2 },
  { label: '选项三', value: 3 },
]
</script>
```

</DemoBlock>

## 可多选

通过 `multiple` 属性启用多选，选中项以标签形式展示。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value2" :options="options" multiple placeholder="请选择" />
</template>
```

</DemoBlock>

## 多选标签折叠

通过 `collapseTags` 折叠多选标签，`collapseTagsLimit` 控制折叠前最多显示的标签数。

<DemoBlock>

```vue
<template>
  <ZcSelect
    v-model="value3"
    :options="manyOptions"
    multiple
    collapseTags
    :collapseTagsLimit="1"
    placeholder="请选择"
  />
</template>

<script setup>
const manyOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
  { label: '葡萄', value: 'grape' },
  { label: '西瓜', value: 'watermelon' },
]
</script>
```

</DemoBlock>

## 可搜索

通过 `filterable` 属性启用搜索过滤，快速定位选项。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value1" :options="options" filterable placeholder="搜索选择" />
</template>
```

</DemoBlock>

## 分组选项

通过 `optionGroups` 属性传入分组数据，按类别展示选项。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value4" :optionGroups="groupedOptions" placeholder="请选择城市" />
</template>

<script setup>
const groupedOptions = [
  {
    label: '热门城市',
    options: [
      { label: '北京', value: 'beijing' },
      { label: '上海', value: 'shanghai' },
    ],
  },
  {
    label: '其他城市',
    options: [
      { label: '成都', value: 'chengdu' },
      { label: '广州', value: 'guangzhou' },
    ],
  },
]
</script>
```

</DemoBlock>

## 创建新选项

通过 `allowCreate` 属性允许用户在搜索不到匹配项时创建新选项。需配合 `filterable` 使用。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value5" :options="options" filterable allowCreate placeholder="输入新选项" />
</template>
```

</DemoBlock>

## 远程搜索

通过 `remote` 和 `remoteMethod` 启用远程搜索，适合大数据量场景。

<DemoBlock>

```vue
<template>
  <ZcSelect
    v-model="value6"
    filterable
    remote
    :remoteMethod="searchMethod"
    placeholder="输入关键词搜索"
  />
</template>

<script setup>
const searchMethod = async (query) => {
  // 模拟远程请求
  await new Promise((r) => setTimeout(r, 300))
  return [
    { label: `${query} 结果 1`, value: `${query}-1` },
    { label: `${query} 结果 2`, value: `${query}-2` },
  ]
}
</script>
```

</DemoBlock>

## 全选与反选

在多选模式下，下拉菜单顶部自动显示全选/反选栏，支持一键全选或取消全选。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value7" :options="options" multiple placeholder="多选" />
</template>
```

</DemoBlock>

## 虚拟滚动

通过 `virtualScroll` 属性启用虚拟滚动，适合 1000+ 选项的大数据量场景，大幅减少 DOM 节点数量。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value8" :options="bigOptions" virtualScroll placeholder="选择一项" />
</template>

<script setup>
// 生成 1000 条数据
const bigOptions = Array.from({ length: 1000 }, (_, i) => ({
  label: `选项 ${i + 1}`,
  value: i + 1,
}))
</script>
```

</DemoBlock>

## 大数据量示例

当选项数量达到 **10,000+** 时，虚拟滚动可将 DOM 节点数从上万减少到几十个。以下示例展示 10,000 条数据的单选 + 搜索、以及多选 + 搜索场景。通过 `estimatedOptionHeight` 可自定义选项高度。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <p style="color: #909399; font-size: 13px; margin: 0;">
      以下两个选择器均加载了 10,000 条选项，开启虚拟滚动后性能依然流畅。
    </p>

    <ZcSelect
      v-model="singleValue"
      :options="hugeOptions"
      virtualScroll
      filterable
      placeholder="单选 + 搜索（10,000 条）"
    />

    <ZcSelect
      v-model="multiValue"
      :options="hugeOptions"
      virtualScroll
      multiple
      filterable
      collapseTags
      :collapseTagsLimit="2"
      placeholder="多选 + 搜索（10,000 条）"
    />
  </div>
</template>

<script setup>
// 生成 10,000 条数据
const hugeOptions = Array.from({ length: 10000 }, (_, i) => ({
  label: `数据项 ${i + 1}`,
  value: `data-${i + 1}`,
}))
</script>
```

</DemoBlock>

## 可清空与尺寸

通过 `clearable` 属性显示清空按钮，`size` 属性调整选择器尺寸。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value1" :options="options" clearable placeholder="可清空" />
  <ZcSelect v-model="value2" :options="options" size="small" placeholder="小尺寸" />
</template>
```

</DemoBlock>

## 前缀图标与空状态

通过 `prefix` 插槽添加前缀内容，通过 `empty` 插槽自定义无数据时的展示。

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value9" :options="options" filterable placeholder="搜索">
    <template #prefix>
      <span>🔍</span>
    </template>
  </ZcSelect>

  <ZcSelect v-model="value10" :options="[]" placeholder="空列表">
    <template #empty>
      <span style="color: #999">暂无数据，请稍后再试</span>
    </template>
  </ZcSelect>
</template>
```

</DemoBlock>

## 禁用与加载状态

<DemoBlock>

```vue
<template>
  <ZcSelect v-model="value1" :options="options" disabled placeholder="禁用" />
  <ZcSelect v-model="value2" :options="options" loading placeholder="加载中" />
</template>
```

</DemoBlock>

## Select API

### SelectOption 类型

```ts
interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}
```

### SelectOptionGroup 类型

```ts
interface SelectOptionGroup {
  label: string
  options: SelectOption[]
  disabled?: boolean
}
```

### Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '绑定值', type: 'string | number | (string | number)[]', default: '—' },
  { name: 'options', description: '选项数据源（扁平）', type: 'SelectOption[]', default: '[]' },
  { name: 'optionGroups', description: '分组选项数据源', type: 'SelectOptionGroup[]', default: '[]' },
  { name: 'multiple', description: '是否多选', type: 'boolean', default: 'false' },
  { name: 'filterable', description: '是否可搜索过滤', type: 'boolean', default: 'false' },
  { name: 'allowCreate', description: '是否允许创建新选项（需配合 filterable）', type: 'boolean', default: 'false' },
  { name: 'clearable', description: '是否可清空', type: 'boolean', default: 'false' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'loading', description: '是否显示加载中', type: 'boolean', default: 'false' },
  { name: 'loadingText', description: '加载中显示的文案', type: 'string', default: '加载中...' },
  { name: 'remote', description: '是否远程搜索', type: 'boolean', default: 'false' },
  { name: 'remoteMethod', description: '远程搜索方法', type: '(query: string) => Promise<SelectOption[]>', default: '—' },
  { name: 'collapseTags', description: '多选时是否折叠标签', type: 'boolean', default: 'false' },
  { name: 'collapseTagsLimit', description: '折叠前最多显示的标签数', type: 'number', default: '1' },
  { name: 'virtualScroll', description: '是否启用虚拟滚动（推荐 1000+ 选项时开启）', type: 'boolean', default: 'false' },
  { name: 'estimatedOptionHeight', description: '虚拟滚动选项的预估行高（px）', type: 'number', default: '36' },
  { name: 'placeholder', description: '占位文本', type: 'string', default: '请选择' },
  { name: 'size', description: '选择器尺寸', type: 'large | medium | small', default: 'medium' },
  { name: 'noDataText', description: '无数据时显示的文本', type: 'string', default: '暂无数据' },
  { name: 'noMatchText', description: '无匹配时显示的文本', type: 'string', default: '无匹配数据' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'update:modelValue', description: '绑定值更新时触发', parameters: '(value: SelectValue)' },
  { name: 'change', description: '选中值变化时触发', parameters: '(value: SelectValue)' },
  { name: 'focus', description: '获取焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'blur', description: '失去焦点时触发', parameters: '(event: FocusEvent)' },
  { name: 'clear', description: '点击清空按钮时触发', parameters: '()' },
  { name: 'visible-change', description: '下拉菜单显隐变化时触发', parameters: '(visible: boolean)' },
  { name: 'remove-tag', description: '多选移除标签时触发', parameters: '(tag: string | number)' },
  { name: 'search', description: '搜索输入时触发', parameters: '(query: string)' },
  { name: 'create-tag', description: '创建新选项时触发', parameters: '(value: string)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'prefix', description: '选择器前置内容（如前缀图标）' },
  { name: 'empty', description: '无选项时的自定义内容' }
]" />
