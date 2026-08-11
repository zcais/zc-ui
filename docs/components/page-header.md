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

| 属性     | 说明                     | 类型      | 默认值  |
| -------- | ------------------------ | --------- | ------- |
| title    | 主标题                   | `string`  | —       |
| subtitle | 副标题                   | `string`  | —       |
| showBack | 是否显示返回按钮         | `boolean` | `true`  |
| backIcon | 返回图标                 | `string`  | —       |
| ghost    | 幽灵模式（无背景无边框） | `boolean` | `false` |

## 事件

| 事件名 | 说明               | 回调参数 |
| ------ | ------------------ | -------- |
| back   | 点击返回按钮时触发 | —        |

## 插槽

| 插槽名     | 说明                 |
| ---------- | -------------------- |
| default    | 默认插槽（不使用）   |
| title      | 自定义标题           |
| subtitle   | 自定义副标题         |
| breadcrumb | 面包屑区域           |
| extra      | 右侧操作区域         |
| footer     | 底部区域（如标签页） |
