# Menu 导航菜单

为网站提供导航功能的菜单，支持水平/垂直模式、子菜单展开、折叠、手风琴等特性。

## 基础用法

通过 `mode` 属性设置水平或垂直菜单，`default-active` 设置当前激活项（支持外部响应式更新）。

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

垂直模式下通过 `ZcSubmenu` 创建子菜单，点击标题展开/收起。选中子项后，父级子菜单标题会高亮。

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

## 水平子菜单

水平模式下子菜单以弹层形式展开，支持鼠标悬停（`show-timeout` / `hide-timeout` 控制延迟）与点击两种触发方式。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="horizontal">
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>组件</template>
      <ZcMenuItem index="2-1">基础组件</ZcMenuItem>
      <ZcMenuItem index="2-2">表单组件</ZcMenuItem>
      <ZcMenuItem index="2-3" disabled>数据展示</ZcMenuItem>
    </ZcSubmenu>
    <ZcSubmenu index="3" :show-timeout="100" :hide-timeout="100">
      <template #title>文档</template>
      <ZcMenuItem index="3-1">快速上手</ZcMenuItem>
      <ZcMenuItem index="3-2">主题定制</ZcMenuItem>
    </ZcSubmenu>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

</DemoBlock>

## 折叠菜单

通过 `collapse` 属性将垂直菜单折叠为图标模式。折叠后子菜单以右侧弹层打开（悬停或点击均可）。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="vertical" :collapse="isCollapsed">
    <ZcMenuItem index="1">
      <ZcIconName name="home" :size="18" />
      <span style="margin-left: 8px">首页</span>
    </ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>
        <ZcIconName name="star" :size="18" />
        <span style="margin-left: 8px">管理</span>
      </template>
      <ZcMenuItem index="2-1">用户</ZcMenuItem>
      <ZcMenuItem index="2-2">设置</ZcMenuItem>
    </ZcSubmenu>
    <ZcMenuItem index="3">
      <ZcIconName name="bell" :size="18" />
      <span style="margin-left: 8px">日志</span>
    </ZcMenuItem>
  </ZcMenu>
  <ZcButton @click="isCollapsed = !isCollapsed" style="margin-top: 12px">
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

## 手风琴效果

`unique-opened` 属性让同一时刻只保持一个子菜单展开。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="vertical" unique-opened>
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>系统管理</template>
      <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
      <ZcMenuItem index="2-2">角色管理</ZcMenuItem>
    </ZcSubmenu>
    <ZcSubmenu index="3">
      <template #title>数据分析</template>
      <ZcMenuItem index="3-1">概览</ZcMenuItem>
      <ZcMenuItem index="3-2">报表</ZcMenuItem>
    </ZcSubmenu>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

</DemoBlock>

## 自定义颜色

通过 `background-color`、`text-color`、`active-text-color` 定制菜单配色，常用于深色侧边栏。

<DemoBlock>

```vue
<template>
  <ZcMenu
    :default-active="active"
    mode="vertical"
    background-color="#1f2d3d"
    text-color="#bfcbd9"
    active-text-color="#409eff"
  >
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>系统管理</template>
      <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
      <ZcMenuItem index="2-2">角色管理</ZcMenuItem>
    </ZcSubmenu>
    <ZcMenuItem index="3">日志</ZcMenuItem>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('2-1')
</script>
```

</DemoBlock>

## 事件用法

监听 `select`、`open`、`close` 事件，`indexPath` 参数返回完整的菜单路径。

<DemoBlock>

```vue
<template>
  <ZcMenu
    :default-active="active"
    mode="vertical"
    @select="handleSelect"
    @open="(i, p) => log('open', i, p)"
    @close="(i, p) => log('close', i, p)"
  >
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>系统管理</template>
      <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
      <ZcSubmenu index="2-2">
        <template #title>安全设置</template>
        <ZcMenuItem index="2-2-1">登录日志</ZcMenuItem>
        <ZcMenuItem index="2-2-2">操作日志</ZcMenuItem>
      </ZcSubmenu>
    </ZcSubmenu>
  </ZcMenu>
  <p style="margin-top: 12px; font-size: 13px; color: #909399">
    {{ message }}
  </p>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
const message = ref('点击菜单项查看事件')
function handleSelect(index, indexPath) {
  message.value = `select: ${index}，路径: ${indexPath.join(' → ')}`
}
function log(type, index, indexPath) {
  message.value = `${type}: ${index}，路径: ${indexPath.join(' → ')}`
}
</script>
```

</DemoBlock>

## 菜单分组

`ZcMenuItemGroup` 为菜单项添加分组标题，常用于功能模块划分。支持 `title` 属性或同名插槽。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="vertical">
    <ZcMenuItemGroup title="常用功能">
      <ZcMenuItem index="1-1">首页</ZcMenuItem>
      <ZcMenuItem index="1-2">消息中心</ZcMenuItem>
    </ZcMenuItemGroup>
    <ZcMenuItemGroup title="系统管理">
      <ZcMenuItem index="2-1">用户管理</ZcMenuItem>
      <ZcMenuItem index="2-2" disabled>角色管理</ZcMenuItem>
      <ZcMenuItem index="2-3">权限配置</ZcMenuItem>
    </ZcMenuItemGroup>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1-1')
</script>
```

</DemoBlock>

## 点击触发弹层

水平模式默认悬停展开子菜单；设置 `menu-trigger="click"` 改为点击触发（悬停不再展开），适配触控设备。弹层互斥：打开一个子菜单会自动收起前一个，弹层不会重叠。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="horizontal" menu-trigger="click">
    <ZcMenuItem index="1">首页</ZcMenuItem>
    <ZcSubmenu index="2">
      <template #title>组件</template>
      <ZcMenuItem index="2-1">基础组件</ZcMenuItem>
      <ZcMenuItem index="2-2">表单组件</ZcMenuItem>
    </ZcSubmenu>
    <ZcSubmenu index="3">
      <template #title>文档</template>
      <ZcMenuItem index="3-1">快速上手</ZcMenuItem>
      <ZcMenuItem index="3-2">主题定制</ZcMenuItem>
    </ZcSubmenu>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

</DemoBlock>

## 路由模式

设置 `router` 后选中菜单项将调用 `vue-router` 进行跳转：优先使用 `ZcMenuItem` 的 `route` 属性，未设置时回退到 `index`。未安装 vue-router 时静默忽略。

<DemoBlock>

```vue
<template>
  <ZcMenu :default-active="active" mode="horizontal" router>
    <ZcMenuItem index="/home">首页</ZcMenuItem>
    <ZcMenuItem index="/components" route="/guide/quickstart">组件</ZcMenuItem>
    <ZcMenuItem index="/about">关于</ZcMenuItem>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('/home')
</script>
```

</DemoBlock>

## Menu API

### Props

<ApiTable type="props" :data="[
{ name: 'mode', description: '菜单模式', type: `'horizontal' | 'vertical'`, default: `'vertical'` },
{ name: 'defaultActive', description: '当前激活项索引（Element Plus 兼容名，支持外部响应式更新）', type: 'string', default: `''` },
{ name: 'activeIndex', description: '当前激活项索引（已废弃，等价 default-active）', type: 'string', default: `''` },
{ name: 'collapse', description: '是否折叠（垂直模式）', type: 'boolean', default: 'false' },
{ name: 'collapseTransition', description: '折叠动画', type: 'boolean', default: 'true' },
{ name: 'menuTrigger', description: '水平模式子菜单触发方式', type: `'hover' | 'click'`, default: `'hover'` },
{ name: 'ellipsis', description: '水平模式溢出项收纳进「⋯」弹出菜单（实验性）', type: 'boolean', default: 'false' },
{ name: 'backgroundColor', description: '菜单背景色', type: 'string', default: `''` },
{ name: 'textColor', description: '菜单文字颜色', type: 'string', default: `''` },
{ name: 'activeTextColor', description: '激活项文字颜色', type: 'string', default: `''` },
{ name: 'uniqueOpened', description: '是否只保持一个子菜单展开', type: 'boolean', default: 'false' },
{ name: 'popperEffect', description: '弹层主题（弹层模式子菜单）', type: `'light' | 'dark'`, default: `'light'` },
{ name: 'popperOffset', description: '弹层与触发器的间距（px）', type: 'number', default: '6' },
{ name: 'router', description: '选中项经 vue-router 跳转', type: 'boolean', default: 'false' },
]" />

### Menu Methods（通过组件 ref 调用）

<ApiTable type="methods" :data="[
  { name: 'open', description: '展开指定子菜单', parameters: '(index: string)' },
  { name: 'close', description: '收起指定子菜单', parameters: '(index: string)' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'select', description: '菜单项选中', parameters: '(index: string, indexPath: string[])' },
  { name: 'open', description: '子菜单展开', parameters: '(index: string, indexPath: string[])' },
  { name: 'close', description: '子菜单收起', parameters: '(index: string, indexPath: string[])' },
]" />

### Menu Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '菜单内容（ZcMenuItem / ZcSubmenu）' },
]" />

## MenuItem API

### Props

<ApiTable type="props" :data="[
{ name: 'index', description: '唯一标识', type: 'string', default: `''` },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'route', description: '路由模式下跳转的目标（string 或 RouteLocationRaw），优先于 index', type: 'string | object', default: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '菜单项内容' },
]" />

## Submenu API

### Props

<ApiTable type="props" :data="[
{ name: 'index', description: '唯一标识', type: 'string', default: `''` },
{ name: 'popperClass', description: '弹出层自定义类名', type: 'string', default: `''` },
{ name: 'showTimeout', description: '展开延迟（ms，弹层模式悬停触发）', type: 'number', default: '300' },
{ name: 'hideTimeout', description: '收起延迟（ms，弹层模式悬停触发）', type: 'number', default: '300' },
{ name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
{ name: 'teleported', description: '弹层是否传送至 body（默认原位渲染）', type: 'boolean', default: 'false' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'title', description: '子菜单标题' },
  { name: 'default', description: '子菜单内容' },
]" />

## MenuItemGroup API

### Props

<ApiTable type="props" :data="[
{ name: 'title', description: '分组标题', type: 'string', default: `''` },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'title', description: '分组标题内容' },
  { name: 'default', description: '分组内菜单项' },
]" />
