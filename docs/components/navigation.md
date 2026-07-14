# 导航组件

ZC UI 提供完整的导航类组件，包括 Menu、Tabs、Breadcrumb、Dropdown、Anchor、Backtop 和 Affix，覆盖页面导航的各类场景。

---

## Menu 导航菜单

为网站提供导航功能的菜单，支持水平/垂直模式、子菜单展开、折叠等特性。

### 基础用法

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

### 垂直菜单 + 子菜单

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
    <ZcMenuItem index="3">日志</ZcMenuItem>
  </ZcMenu>
</template>

<script setup>
import { ref } from 'vue'
const active = ref('1')
</script>
```

### Menu Props

| 参数               | 说明                     | 类型                         | 默认值       |
| ------------------ | ------------------------ | ---------------------------- | ------------ |
| mode               | 模式                     | `'horizontal' \| 'vertical'` | `'vertical'` |
| activeIndex        | 当前激活项索引           | string                       | ''           |
| collapse           | 是否折叠（垂直）         | boolean                      | `false`      |
| backgroundColor    | 菜单背景色               | string                       | ''           |
| textColor          | 菜单文字颜色             | string                       | ''           |
| activeTextColor    | 激活项文字颜色           | string                       | ''           |
| uniqueOpened       | 是否只保持一个子菜单展开 | boolean                      | `false`      |
| collapseTransition | 折叠动画                 | boolean                      | `true`       |
| router             | 是否启用路由模式         | boolean                      | `false`      |

### Menu Events

| 事件   | 说明       | 回调参数             |
| ------ | ---------- | -------------------- |
| select | 菜单项选中 | `(index, indexPath)` |
| open   | 子菜单展开 | `(index, indexPath)` |
| close  | 子菜单收起 | `(index, indexPath)` |

### MenuItem Props

| 参数     | 说明     | 类型    | 默认值  |
| -------- | -------- | ------- | ------- |
| index    | 唯一标识 | string  | ''      |
| route    | 路由路径 | string  | ''      |
| disabled | 是否禁用 | boolean | `false` |

### Submenu Props

| 参数        | 说明                     | 类型    | 默认值  |
| ----------- | ------------------------ | ------- | ------- |
| index       | 唯一标识                 | string  | ''      |
| popperClass | 弹出层自定义类名         | string  | ''      |
| showTimeout | 显示延迟（ms，水平模式） | number  | `300`   |
| hideTimeout | 隐藏延迟（ms，水平模式） | number  | `300`   |
| disabled    | 是否禁用                 | boolean | `false` |

### Submenu Slots

| 插槽    | 说明       |
| ------- | ---------- |
| title   | 子菜单标题 |
| default | 子菜单内容 |

---

## Tabs 标签页

分隔内容上有关联但属于不同类别的数据集合，支持卡片、边框卡片等多种风格。

### 基础用法

```vue
<template>
  <ZcTabs v-model="activeTab">
    <ZcTabPane label="用户管理" name="first">用户管理内容</ZcTabPane>
    <ZcTabPane label="配置管理" name="second">配置管理内容</ZcTabPane>
    <ZcTabPane label="角色管理" name="third">角色管理内容</ZcTabPane>
  </ZcTabs>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('first')
</script>
```

### 卡片风格 + 可编辑

```vue
<template>
  <ZcTabs v-model="activeTab" type="card" editable>
    <ZcTabPane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name">
      {{ tab.content }}
    </ZcTabPane>
  </ZcTabs>
</template>

<script setup>
import { ref } from 'vue'
const activeTab = ref('1')
const tabs = ref([
  { name: '1', label: 'Tab 1', content: '内容 1' },
  { name: '2', label: 'Tab 2', content: '内容 2' },
])
</script>
```

### Tabs Props

| 参数                 | 说明           | 类型                                                 | 默认值  |
| -------------------- | -------------- | ---------------------------------------------------- | ------- |
| modelValue (v-model) | 当前激活标签   | `string \| number`                                   | ''      |
| type                 | 风格类型       | `'' \| 'card' \| 'border-card'`                      | ''      |
| position             | 标签位置       | `'top' \| 'right' \| 'bottom' \| 'left'`             | `'top'` |
| closable             | 标签是否可关闭 | boolean                                              | `false` |
| addable              | 标签是否可新增 | boolean                                              | `false` |
| editable             | 标签是否可编辑 | boolean                                              | `false` |
| beforeLeave          | 切换前钩子     | `(active, oldActive) => boolean \| Promise<boolean>` | —       |

### Tabs Events

| 事件              | 说明         | 回调参数                            |
| ----------------- | ------------ | ----------------------------------- |
| update:modelValue | 激活标签变化 | `(name: string \| number)`          |
| tab-click         | 点击标签     | `(name, event)`                     |
| tab-remove        | 关闭标签     | `(name: string \| number)`          |
| tab-add           | 新增标签     | —                                   |
| edit              | 编辑操作     | `(name, action: 'remove' \| 'add')` |

### TabPane Props

| 参数     | 说明       | 类型               | 默认值  |
| -------- | ---------- | ------------------ | ------- |
| name     | 标签标识   | `string \| number` | ''      |
| label    | 标签标题   | string             | ''      |
| lazy     | 是否懒加载 | boolean            | `false` |
| closable | 是否可关闭 | boolean            | `false` |
| disabled | 是否禁用   | boolean            | `false` |

---

## Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

### 基础用法

```vue
<template>
  <ZcBreadcrumb separator="/">
    <ZcBreadcrumbItem :to="'/'">首页</ZcBreadcrumbItem>
    <ZcBreadcrumbItem :to="'/components'">组件</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>导航组件</ZcBreadcrumbItem>
  </ZcBreadcrumb>
</template>
```

### 自定义分隔符

```vue
<template>
  <ZcBreadcrumb separator=">">
    <ZcBreadcrumbItem>首页</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>活动管理</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>活动详情</ZcBreadcrumbItem>
  </ZcBreadcrumb>
</template>
```

### Breadcrumb Props

| 参数          | 说明       | 类型   | 默认值 |
| ------------- | ---------- | ------ | ------ |
| separator     | 分隔符     | string | `'/'`  |
| separatorIcon | 分隔符图标 | string | ''     |

### BreadcrumbItem Props

| 参数    | 说明                       | 类型    | 默认值  |
| ------- | -------------------------- | ------- | ------- |
| to      | 跳转链接（路由路径或 URL） | string  | ''      |
| replace | 是否替换当前历史记录       | boolean | `false` |

---

## Dropdown 下拉菜单

将动作或菜单折叠到下拉菜单中，支持 hover、click、contextmenu 三种触发方式。

### 基础用法

```vue
<template>
  <ZcDropdown @command="handleCommand">
    <ZcButton>下拉菜单</ZcButton>
    <template #dropdown>
      <ZcDropdownMenu>
        <ZcDropdownItem command="a">选项一</ZcDropdownItem>
        <ZcDropdownItem command="b">选项二</ZcDropdownItem>
        <ZcDropdownItem command="c" disabled>选项三</ZcDropdownItem>
        <ZcDropdownItem command="d" divided>选项四</ZcDropdownItem>
      </ZcDropdownMenu>
    </template>
  </ZcDropdown>
</template>

<script setup>
function handleCommand(cmd) {
  console.log('选中:', cmd)
}
</script>
```

### 点击触发 + 右对齐

```vue
<template>
  <ZcDropdown trigger="click" placement="bottom-end">
    <ZcButton>点击展开</ZcButton>
    <template #dropdown>
      <ZcDropdownMenu>
        <ZcDropdownItem>编辑</ZcDropdownItem>
        <ZcDropdownItem>复制</ZcDropdownItem>
        <ZcDropdownItem divided>删除</ZcDropdownItem>
      </ZcDropdownMenu>
    </template>
  </ZcDropdown>
</template>
```

### Dropdown Props

| 参数              | 说明             | 类型                                                                              | 默认值     |
| ----------------- | ---------------- | --------------------------------------------------------------------------------- | ---------- |
| trigger           | 触发方式         | `'hover' \| 'click' \| 'contextmenu'`                                             | `'hover'`  |
| visible (v-model) | 可见性           | boolean                                                                           | `false`    |
| placement         | 弹出位置         | `'top' \| 'top-start' \| 'top-end' \| 'bottom' \| 'bottom-start' \| 'bottom-end'` | `'bottom'` |
| disabled          | 是否禁用         | boolean                                                                           | `false`    |
| showTimeout       | 显示延迟（ms）   | number                                                                            | `250`      |
| hideTimeout       | 隐藏延迟（ms）   | number                                                                            | `150`      |
| popperClass       | 弹出层自定义类名 | string                                                                            | ''         |
| hideOnClick       | 点击外部是否关闭 | boolean                                                                           | `true`     |
| maxHeight         | 菜单最大高度     | string                                                                            | ''         |

### Dropdown Events

| 事件           | 说明       | 回调参数                                |
| -------------- | ---------- | --------------------------------------- |
| update:visible | 可见性变化 | `(val: boolean)`                        |
| show           | 显示时     | —                                       |
| hide           | 隐藏时     | —                                       |
| command        | 菜单项选中 | `(command: string \| number \| object)` |
| click          | 点击触发器 | `(event: MouseEvent)`                   |

### DropdownItem Props

| 参数     | 说明           | 类型                         | 默认值  |
| -------- | -------------- | ---------------------------- | ------- |
| command  | 命令值         | `string \| number \| object` | ''      |
| disabled | 是否禁用       | boolean                      | `false` |
| divided  | 是否显示分隔线 | boolean                      | `false` |
| icon     | 图标           | string                       | ''      |

### DropdownItem Slots

| 插槽    | 说明     |
| ------- | -------- |
| icon    | 图标内容 |
| default | 文本内容 |

---

## Anchor 锚点

用于跳转到页面指定位置，支持滚动监听自动高亮当前锚点。

### 基础用法

```vue
<template>
  <ZcAnchor container=".scroll-container" :offset-top="20">
    <ZcAnchorLink href="#section-1" title="基础用法" />
    <ZcAnchorLink href="#section-2" title="高级用法" />
    <ZcAnchorLink href="#section-3" title="API" />
  </ZcAnchor>
</template>
```

### Anchor Props

| 参数              | 说明                          | 类型                         | 默认值       |
| ----------------- | ----------------------------- | ---------------------------- | ------------ |
| container         | 滚动容器选择器（默认 window） | string                       | ''           |
| current (v-model) | 当前锚点                      | string                       | ''           |
| offsetTop         | 距顶部偏移量（px）            | number                       | `0`          |
| direction         | 方向                          | `'vertical' \| 'horizontal'` | `'vertical'` |
| bound             | 高亮触发边界（px）            | number                       | `80`         |
| smooth            | 是否平滑滚动                  | boolean                      | `true`       |

### Anchor Events

| 事件           | 说明     | 回调参数         |
| -------------- | -------- | ---------------- |
| update:current | 锚点变化 | `(href: string)` |
| click          | 点击链接 | `(event, href)`  |
| change         | 锚点变化 | `(href: string)` |

### AnchorLink Props

| 参数  | 说明               | 类型   | 默认值 |
| ----- | ------------------ | ------ | ------ |
| href  | 目标锚点（如 #id） | string | ''     |
| title | 链接标题           | string | ''     |
| level | 缩进层级           | number | `0`    |

---

## Backtop 返回顶部

返回页面顶部的操作按钮，当页面滚动到一定高度时自动显示。

### 基础用法

```vue
<template>
  <!-- 滚动页面后右下角出现按钮 -->
  <ZcBacktop :visibility-height="200" :right="40" :bottom="40" />
</template>
```

### 自定义内容 + 位置

```vue
<template>
  <ZcBacktop :right="80" :bottom="100" position="bottom-left">
    <span style="font-size: 12px;">顶部</span>
  </ZcBacktop>
</template>
```

### Backtop Props

| 参数             | 说明               | 类型                                                           | 默认值           |
| ---------------- | ------------------ | -------------------------------------------------------------- | ---------------- |
| target           | 滚动目标元素选择器 | string                                                         | ''（window）     |
| visibilityHeight | 显示阈值（px）     | number                                                         | `200`            |
| position         | 按钮位置           | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'bottom-right'` |
| right            | 右侧偏移（px）     | number                                                         | `40`             |
| bottom           | 底部偏移（px）     | number                                                         | `40`             |

### Backtop Events

| 事件  | 说明       | 回调参数  |
| ----- | ---------- | --------- |
| click | 点击时     | `(event)` |
| show  | 按钮显示时 | —         |
| hide  | 按钮隐藏时 | —         |

### Backtop Slots

| 插槽    | 说明                               |
| ------- | ---------------------------------- |
| default | 自定义按钮内容（默认显示箭头图标） |

---

## Affix 固钉

将页面元素固定在可视范围内，常用于侧边栏或顶部导航栏的固定。

### 基础用法

```vue
<template>
  <!-- 固定在距顶部 0px 的位置 -->
  <ZcAffix :offset="0">
    <div style="background: #409eff; color: #fff; padding: 10px 20px;">固定的内容</div>
  </ZcAffix>
</template>
```

### 固定在底部 + 指定容器

```vue
<template>
  <div ref="container" style="height: 500px; overflow: auto;">
    <!-- 长内容... -->
    <ZcAffix :offset="50" position="bottom" target=".container">
      <ZcButton type="primary">底部固定按钮</ZcButton>
    </ZcAffix>
  </div>
</template>
```

### Affix Props

| 参数     | 说明             | 类型                | 默认值  |
| -------- | ---------------- | ------------------- | ------- |
| offset   | 偏移量（px）     | number              | `0`     |
| position | 固定位置         | `'top' \| 'bottom'` | `'top'` |
| target   | 容器元素选择器   | string              | ''      |
| zIndex   | 固定时的 z-index | number              | `100`   |

### Affix Events

| 事件   | 说明         | 回调参数              |
| ------ | ------------ | --------------------- |
| change | 固定状态变化 | `(fixed: boolean)`    |
| scroll | 滚动事件     | `(scrollTop: number)` |
