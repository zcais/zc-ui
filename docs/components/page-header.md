# PageHeader 页面头部

页面顶部导航组件，包含返回按钮、标题、副标题、操作区域。

## 基础用法

通过 `title` 和 `subtitle` 设置标题和副标题。

<DemoBlock>

```vue
<template>
  <ZcPageHeader title="用户管理" subtitle="管理系统中的所有用户">
    <template #extra>
      <ZcButton type="primary">新建用户</ZcButton>
    </template>
  </ZcPageHeader>
</template>
```

</DemoBlock>

## 隐藏返回按钮

通过 `show-back` 控制是否显示返回按钮。

<DemoBlock>

```vue
<template>
  <ZcPageHeader title="数据面板" :show-back="false" />
</template>
```

</DemoBlock>

## 幽灵模式

通过 `ghost` 属性去掉背景和边框。

<DemoBlock>

```vue
<template>
  <ZcPageHeader title="设置" subtitle="个人偏好设置" ghost />
</template>
```

</DemoBlock>

## 完整用法

组合面包屑、标题、操作区、底部标签页。

<DemoBlock>

```vue
<template>
  <ZcPageHeader title="订单详情" subtitle="订单号：#2024-001">
    <template #breadcrumb>
      <ZcBreadcrumb>
        <ZcBreadcrumbItem>首页</ZcBreadcrumbItem>
        <ZcBreadcrumbItem>订单管理</ZcBreadcrumbItem>
        <ZcBreadcrumbItem>订单详情</ZcBreadcrumbItem>
      </ZcBreadcrumb>
    </template>
    <template #extra>
      <ZcButton>编辑</ZcButton>
      <ZcButton type="primary">打印</ZcButton>
    </template>
  </ZcPageHeader>
</template>
```

</DemoBlock>

## 属性

<ApiTable type="props" :data="[
{ name: 'title', description: '主标题', type: 'string', default: '—' },
{ name: 'subtitle', description: '副标题', type: 'string', default: '—' },
{ name: 'showBack', description: '是否显示返回按钮', type: 'boolean', default: 'true' },
{ name: 'backIcon', description: '返回图标', type: 'string', default: '—' },
{ name: 'ghost', description: '幽灵模式（无背景无边框）', type: 'boolean', default: 'false' }
]" />

## 事件

<ApiTable type="events" :data="[
{ name: '—', description: '点击返回按钮时触发' }
]" />

## 插槽

<ApiTable type="slots" :data="[
{ name: 'default', description: '默认插槽（不使用）' },
{ name: 'title', description: '自定义标题' },
{ name: 'subtitle', description: '自定义副标题' },
{ name: 'breadcrumb', description: '面包屑区域' },
{ name: 'extra', description: '右侧操作区域' },
{ name: 'footer', description: '底部区域（如标签页）' }
]" />
