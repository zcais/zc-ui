# Collapse 折叠面板

折叠面板组件，支持手风琴模式、自定义标题和内容、箭头位置控制、幽灵模式等。常用于 FAQ、设置面板等场景。

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

## 图标与额外内容

通过 `icon` 插槽在标题前添加图标，`extra` 插槽在标题右侧添加额外内容。

<DemoBlock>

```vue
<template>
  <ZcCollapse v-model="activeNames">
    <ZcCollapseItem name="1" title="个人信息">
      <template #icon>
        <span style="font-size: 18px;">👤</span>
      </template>
      <template #extra>
        <span style="font-size: 12px; color: var(--color-zc-text-placeholder);">必填</span>
      </template>
      <div>姓名：张三</div>
      <div>邮箱：zhangsan@example.com</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="系统设置">
      <template #icon>
        <span style="font-size: 18px;">⚙️</span>
      </template>
      <template #extra>
        <span style="font-size: 12px; color: var(--color-zc-primary-500);">推荐</span>
      </template>
      <div>主题：深色模式</div>
      <div>语言：简体中文</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="3" title="无图标面板">
      <div>没有图标和额外内容的面板，看起来和普通面板一样。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const activeNames = ref(['1'])
</script>
```

</DemoBlock>

## 箭头位置与隐藏

通过 `arrow-placement` 属性控制箭头位置，`show-arrow` 属性控制是否显示箭头。

<DemoBlock>

```vue
<template>
  <ZcCollapse v-model="activeNames">
    <ZcCollapseItem name="1" title="箭头在左侧" arrow-placement="left">
      <div>箭头在标题左侧的折叠面板。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="箭头在右侧" arrow-placement="right">
      <div>箭头在标题右侧的折叠面板（默认）。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="3" title="隐藏箭头" :show-arrow="false">
      <div>没有箭头的折叠面板。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const activeNames = ref(['1'])
</script>
```

</DemoBlock>

## 幽灵模式与无边框

`ghost` 属性启用幽灵模式，`border` 属性控制是否显示外边框。

<DemoBlock>

```vue
<template>
  <ZcCollapse ghost v-model="activeNames">
    <ZcCollapseItem name="1" title="幽灵面板一">
      <div>无边框无背景的幽灵模式，适合嵌入卡片等容器中使用。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="幽灵面板二">
      <div>视觉上更加轻盈，不占用过多视觉层次。</div>
    </ZcCollapseItem>
  </ZcCollapse>
  <ZcCollapse :border="false" v-model="activeNames2">
    <ZcCollapseItem name="1" title="无边框面板一">
      <div>隐藏了外层边框，但保留了分割线。</div>
    </ZcCollapseItem>
    <ZcCollapseItem name="2" title="无边框面板二">
      <div>适合不需要上下边框的场景。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const activeNames = ref(['1'])
const activeNames2 = ref([])
</script>
```

</DemoBlock>

## 尺寸

通过 `size` 属性设置尺寸：`large`、`default`、`small`。

<DemoBlock>

```vue
<template>
  <ZcCollapse size="large" v-model="active1">
    <ZcCollapseItem name="1" title="大尺寸面板">
      <div>更大高度和字号的折叠面板。</div>
    </ZcCollapseItem>
  </ZcCollapse>
  <ZcCollapse v-model="active2">
    <ZcCollapseItem name="1" title="默认尺寸面板">
      <div>标准高度的折叠面板。</div>
    </ZcCollapseItem>
  </ZcCollapse>
  <ZcCollapse size="small" v-model="active3">
    <ZcCollapseItem name="1" title="小尺寸面板">
      <div>更紧凑的折叠面板，适合信息密度高的界面。</div>
    </ZcCollapseItem>
  </ZcCollapse>
</template>

<script setup>
import { ref } from 'vue'
const active1 = ref(['1'])
const active2 = ref(['1'])
const active3 = ref(['1'])
</script>
```

</DemoBlock>

## Collapse API

### ZcCollapse Props

<ApiTable type="props" :data="[
  { name: 'modelValue', description: '当前展开的面板名称（v-model）', type: 'string | number | Array', default: '[]' },
  { name: 'accordion', description: '是否手风琴模式', type: 'boolean', default: 'false' },
  { name: 'border', description: '是否显示外边框', type: 'boolean', default: 'true' },
  { name: 'ghost', description: '幽灵模式：无边框无背景，适合嵌入容器', type: 'boolean', default: 'false' },
  { name: 'size', description: '尺寸变体', type: 'large | default | small', default: 'default' },
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
  { name: 'showArrow', description: '是否显示展开/收起箭头', type: 'boolean', default: 'true' },
  { name: 'arrowPlacement', description: '箭头位置', type: 'left | right', default: 'right' },
]" />

### ZcCollapseItem Events

<ApiTable type="events" :data="[
  { name: 'item-click', description: '点击面板标题时触发', parameters: '(name: string | number | undefined)' },
  { name: 'toggle', description: '面板展开/收起时触发', parameters: '(payload: { name, isActive })' },
]" />

### ZcCollapseItem Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '面板内容' },
  { name: 'title', description: '自定义面板标题（覆盖 title 属性）' },
  { name: 'icon', description: '标题前的图标（接收 active 插槽 prop）' },
  { name: 'extra', description: '标题右侧的额外内容（接收 active 插槽 prop）' },
]" />
