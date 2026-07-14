# Menu 导航菜单

为网站提供导航功能的菜单，支持水平/垂直模式、子菜单展开、折叠等特性。

## 基础用法

通过 `mode` 属性设置水平或垂直菜单，`default-active` 设置当前激活项。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="horizontal">
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcMenuItem index="2">组件</ZcMenuItem>
    <ZcMenuItem index="3" disabled>文档</ZcMenuItem>
    <ZcMenuItem index="4">关于</ZcMenuItem>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

</DemoBlock>

## 垂直菜单 + 子菜单

垂直模式下通过 `ZcSubmenu` 创建子菜单。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="vertical">
    <ZcMenuItem index="1">仪表盘</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>系统管理</template>
      <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
      <ZcMenuItem index="2-2">角色管理</ZcMenuItem>
      <ZcMenuItem index="2-3">权限配置</ZcMenuItem>
    </ZcSubmenu>
    <ZcSubmenu index="3">
      <template #title>数据分析</template>
      <ZcMenuItem index="3-1">概览</ZcMenuItem>
      <ZcMenuItem index="3-2">报表</ZcMenuItem>
    </ZcSubmenu>
    <ZcMenuItem index="4">日志</ZcMenuItem>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

</DemoBlock>

## 折叠菜单

通过 `collapse` 属性将垂直菜单折叠为图标模式。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="vertical" :collapse="isCollapsed">
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>管理</template>
      <ZcMenuItem index="2-1">用户</ZcMenuItem>
      <ZcMenuItem index="2-2">设置</ZcMenuItem>
    </ZcSubmenu>
    <ZcMenuItem index="3">日志</ZcMenuItem>
  </ZcMenu>
  <ZcButton @click="isCollapsed = !isCollapsed" style="margin-top: 12px;">
    {{ isCollapsed ? '展开' : '折叠' }}
  </ZcButton>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
const isCollapsed = ref(true)
</script>
```

</DemoBlock>

## Menu API

### Props

<ApiTable type="props" :data="[
{ name: 'mode', description: '菜单模式', type: `'horizontal' | 'vertical'`, default: `'vertical'` },
{ name: 'defaultActive', description: '当前激活项索引', type: 'string', default: `''` },
{ name: 'collapse', description: '是否折叠（垂直模式）', type: 'boolean', default: 'false' },
{ name: 'backgroundColor', description: '菜单背景色', type: 'string', default: `''` },
{ name: 'textColor', description: '菜单文字颜色', type: 'string', default: `''` },
{ name: 'activeTextColor', description: '激活项文字颜色', type: 'string', default: `''` },
{ name: 'uniqueOpened', description: '是否只保持一个子菜单展开', type: 'boolean', default: 'false' },
{ name: 'collapseTransition', description: '折叠动画', type: 'boolean', default: 'true' },
{ name: 'router', description: '是否启用路由模式', type: 'boolean', default: 'false' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'select', description: '菜单项选中', parameters: '(index: string, indexPath: string[])' },
  { name: 'open', description: '子菜单展开', parameters: '(index: string, indexPath: string[])' },
  { name: 'close', description: '子菜单收起', parameters: '(index: string, indexPath: string[])' },
]" />

### MenuItem Props

<ApiTable type="props" :data="[
{ name: 'index', description: '唯一标识', type: 'string', default: `''` },
{ name: 'route', description: '路由路径', type: 'string', default: `''` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
]" />

### Submenu Props

<ApiTable type="props" :data="[
{ name: 'index', description: '唯一标识', type: 'string', default: `''` },
{ name: 'popperClass', description: '弹出层自定义类名', type: 'string', default: `''` },
{ name: 'showTimeout', description: '显示延迟（ms，水平模式）', type: 'number', default: '300' },
{ name: 'hideTimeout', description: '隐藏延迟（ms，水平模式）', type: 'number', default: '300' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
]" />

### Submenu Slots

<ApiTable type="slots" :data="[
  { name: 'title', description: '子菜单标题' },
  { name: 'default', description: '子菜单内容' },
]" />
