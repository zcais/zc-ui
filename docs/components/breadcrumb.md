# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

## 基础用法

在 `ZcBreadcrumb` 中使用 `ZcBreadcrumbItem` 标签表示从首页开始的每一级路径。

<DemoBlock>

```vue
<template>
  <ZcBreadcrumb separator="/">
    <ZcBreadcrumbItem to="/">首页</ZcBreadcrumbItem>
    <ZcBreadcrumbItem to="/components">组件</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>面包屑</ZcBreadcrumbItem>
  </ZcBreadcrumb>
</template>
```

</DemoBlock>

## 自定义分隔符

通过 `separator` 属性自定义分隔符，也可以使用 `separator-icon` 设置图标分隔符。

<DemoBlock>

```vue
<template>
  <ZcBreadcrumb separator=">">
    <ZcBreadcrumbItem>首页</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>活动管理</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>活动详情</ZcBreadcrumbItem>
  </ZcBreadcrumb>

  <ZcBreadcrumb separator="-" style="margin-top: 12px;">
    <ZcBreadcrumbItem>首页</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>事件管理</ZcBreadcrumbItem>
    <ZcBreadcrumbItem>事件列表</ZcBreadcrumbItem>
  </ZcBreadcrumb>
</template>
```

</DemoBlock>

## Breadcrumb API

### Props

<ApiTable type="props" :data="[
{ name: 'separator', description: '分隔符', type: 'string', default: `'/'` },
{ name: 'separatorIcon', description: '分隔符图标类名', type: 'string', default: `''` },
]" />

### BreadcrumbItem Props

<ApiTable type="props" :data="[
{ name: 'to', description: '跳转链接（路由路径或 URL）', type: 'string', default: `''` },
{ name: 'replace', description: '是否替换当前历史记录', type: 'boolean', default: 'false' },
]" />
