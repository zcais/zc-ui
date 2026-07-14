# Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合，支持卡片、边框卡片等多种风格。

## 基础用法

通过 `v-model` 绑定当前激活标签，使用 `ZcTabPane` 定义标签页。

<DemoBlock>

```vue
<template>
  <ZcTabs v-model="activeTab">
    <ZcTabPane label="用户管理" name="first">用户管理内容</ZcTabPane>
    <ZcTabPane label="配置管理" name="second">配置管理内容</ZcTabPane>
    <ZcTabPane label="角色管理" name="third">角色管理内容</ZcTabPane>
    <ZcTabPane label="定时任务" name="fourth">定时任务补偿</ZcTabPane>
  </ZcTabs>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('first')
</script>
```

</DemoBlock>

## 卡片风格

使用 `type="card"` 设置卡片风格标签页。

<DemoBlock>

```vue
<template>
  <ZcTabs v-model="activeTab" type="card">
    <ZcTabPane label="最新" name="latest">最新内容</ZcTabPane>
    <ZcTabPane label="热门" name="popular">热门内容</ZcTabPane>
    <ZcTabPane label="推荐" name="recommend">推荐内容</ZcTabPane>
  </ZcTabs>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('latest')
</script>
```

</DemoBlock>

## 位置选项卡

通过 `position` 属性设置标签页的位置：top、right、bottom、left。

<DemoBlock>

```vue
<template>
  <ZcTabs v-model="activeTab" position="left" style="height: 200px;">
    <ZcTabPane label="选项一" name="1">左侧选项卡内容一</ZcTabPane>
    <ZcTabPane label="选项二" name="2">左侧选项卡内容二</ZcTabPane>
    <ZcTabPane label="选项三" name="3">左侧选项卡内容三</ZcTabPane>
  </ZcTabs>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('1')
</script>
```

</DemoBlock>

## Tabs API

### Props

<ApiTable type="props" :data="[
{ name: 'modelValue (v-model)', description: '当前激活标签', type: 'string | number', default: `''` },
{ name: 'type', description: '风格类型', type: `'' | 'card' | 'border-card'`, default: `''` },
{ name: 'position', description: '标签位置', type: `'top' | 'right' | 'bottom' | 'left'`, default: `'top'` },
{ name: 'closable', description: '标签是否可关闭', type: 'boolean', default: 'false' },
{ name: 'addable', description: '标签是否可新增', type: 'boolean', default: 'false' },
{ name: 'editable', description: '标签是否可编辑（新增+关闭）', type: 'boolean', default: 'false' },
{ name: 'beforeLeave', description: '切换前钩子', type: '(active, oldActive) => boolean | Promise<boolean>', default: '—' },
]" />

### Events

<ApiTable type="events" :data="[
{ name: 'update:modelValue', description: '激活标签变化', parameters: '(name: string | number)' },
{ name: 'tab-click', description: '点击标签', parameters: '(name, event: MouseEvent)' },
{ name: 'tab-remove', description: '关闭标签', parameters: '(name: string | number)' },
{ name: 'tab-add', description: '新增标签', parameters: '—' },
{ name: 'edit', description: '编辑操作', parameters: '(name, action: &quot;remove&quot; | &quot;add&quot;)' },
]" />

### TabPane Props

<ApiTable type="props" :data="[
{ name: 'name', description: '标签标识', type: 'string | number', default: `''` },
{ name: 'label', description: '标签标题', type: 'string', default: `''` },
{ name: 'lazy', description: '是否懒加载', type: 'boolean', default: 'false' },
{ name: 'closable', description: '是否可关闭', type: 'boolean', default: 'false' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
]" />
