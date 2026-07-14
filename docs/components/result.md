# Result 结果

用于对用户的操作结果或异常状态进行反馈。

## 基础用法

根据不同的操作状态展示不同颜色的结果图标。

<DemoBlock>

```vue
<template>
  <ZcResult status="success" title="操作成功" sub-title="您的表单已提交。" />
  <ZcResult status="warning" title="操作警告" sub-title="请检查您的输入内容。" />
  <ZcResult status="info" title="信息提示" sub-title="请等待管理员审核。" />
  <ZcResult status="error" title="操作失败" sub-title="请稍后重试。" />
</template>
```

</DemoBlock>

## 自定义内容

通过插槽自定义图标、标题及额外操作区域。

<DemoBlock>

```vue
<template>
  <ZcResult
    status="success"
    title="提交成功"
    sub-title="提交结果页用于反馈一系列操作任务的处理结果。"
  >
    <template #extra>
      <ZcButton type="primary" style="margin-right: 12px;">返回首页</ZcButton>
      <ZcButton>查看详情</ZcButton>
    </template>
  </ZcResult>
</template>
```

</DemoBlock>

## Result API

### Props

<ApiTable type="props" :data="[
{ name: 'status', description: '结果状态', type: `'success' | 'warning' | 'info' | 'error'`, default: `'info'` },
{ name: 'title', description: '标题', type: 'string', default: `''` },
{ name: 'subTitle', description: '副标题', type: 'string', default: `''` },
{ name: 'icon', description: '自定义图标类名', type: 'string', default: `''` },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义内容区' },
  { name: 'icon', description: '自定义图标' },
  { name: 'title', description: '自定义标题' },
  { name: 'subTitle', description: '自定义副标题' },
  { name: 'extra', description: '自定义额外操作区' },
]" />
