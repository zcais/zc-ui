# Collapse 折叠面板

折叠面板组件，支持手风琴模式、自定义标题和内容。常用于 FAQ、设置面板等场景。

## 基础用法

通过 `v-model` 控制展开的面板，`ZcCollapseItem` 的 `name` 属性标识面板。

<DemoBlock>

```vue
<template>
  <ZcCollapse v-model="activeNames">
    <ZcCollapseItem name="1" title="一致性 Consistency">
      <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="反馈 Feedback">
      <div>控制反馈：通过界面样式和交互动效让用户可以清晰的感知自己的操作。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="3" title="效率 Efficiency">
      <div>简化流程：设计简洁直观的操作流程。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const activeNames = ref(['1'])
</script>
```

</DemoBlock>

## 手风琴模式

通过 `accordion` 属性开启手风琴模式，每次只展开一个面板。

<DemoBlock>

```vue
<template>
  <ZcCollapse v-model="activeName" accordion>
    <ZcCollapseItem name="1" title="面板一">
      <div>手风琴模式下面板一的内容。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="面板二">
      <div>手风琴模式下面板二的内容。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="3" title="面板三">
      <div>手风琴模式下面板三的内容。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const activeName = ref('1')
</script>
```

</DemoBlock>

## 自定义标题

通过 `title` 插槽自定义面板标题内容。

<DemoBlock>

```vue
<template>
  <ZcCollapse>
    <ZcCollapseItem name="1">
      <template #title>
        <span style="color: var(--color-zc-primary-500);">自定义标题</span>
      </template>
      <div>面板内容</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="禁用面板" disabled>
      <div>这个面板被禁用了</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>
```

</DemoBlock>

## Collapse API

### ZcCollapse Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '当前展开的面板名称（v-model）', type: 'string | number | Array<string | number>', default: '[]' },
  { name: 'accordion', description: '是否手风琴模式', type: 'boolean', default: 'false' },
]" />

### ZcCollapse Events

<ApiTable type="events" :data="[
  { name: 'change', description: '展开状态变化时触发', parameters: '(value: CollapseModelValue)' },
]" />

### ZcCollapseItem Props

<ApiTable type="props" :data="[
  { name: 'name', description: '面板标识（与 v-model 对应）', type: 'string | number', default: '—' },
  { name: 'title', description: '面板标题文本', type: 'string', default: '—' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
]" />

### ZcCollapseItem Events

<ApiTable type="events" :data="[
  { name: 'item-click', description: '点击面板标题时触发', parameters: '(name: string | number | undefined)' },
]" />

### ZcCollapseItem Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '面板内容' },
  { name: 'title', description: '自定义面板标题（覆盖 title 属性）' },
]" />
