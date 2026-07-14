# Descriptions 描述列表

列表形式展示多个字段的信息。

## 基础用法

通过 `ZcDescriptionsItem` 子组件定义每个描述项。

<DemoBlock>

```vue
<template>
  <ZcDescriptions title="用户信息">
    <ZcDescriptionsItem label="用户名">张三</ZcDescriptionsItem>
    <ZcDescriptionsItem label="手机号">18888888888</ZcDescriptionsItem>
    <ZcDescriptionsItem label="居住地">北京市朝阳区</ZcDescriptionsItem>
    <ZcDescriptionsItem label="备注">这是一段备注说明</ZcDescriptionsItem>
    <ZcDescriptionsItem label="联系地址">北京市海淀区</ZcDescriptionsItem>
    <ZcDescriptionsItem label="邮箱">zhangsan@example.com</ZcDescriptionsItem>
  </ZcDescriptions>
</template>
```

</DemoBlock>

## 带边框

设置 `border` 属性可添加边框样式。

<DemoBlock>

```vue
<template>
  <ZcDescriptions title="用户信息" border :column="3">
    <ZcDescriptionsItem label="用户名">张三</ZcDescriptionsItem>
    <ZcDescriptionsItem label="手机号">18888888888</ZcDescriptionsItem>
    <ZcDescriptionsItem label="居住地">北京市</ZcDescriptionsItem>
    <ZcDescriptionsItem label="备注" :span="3">这是一段很长的备注说明文字。</ZcDescriptionsItem>
  </ZcDescriptions>
</template>
```

</DemoBlock>

## Descriptions API

### ZcDescriptions Props

<ApiTable type="props" :data="[
{ name: 'border', description: '是否添加边框', type: 'boolean', default: 'false' },
{ name: 'column', description: '一行显示的数量', type: 'number', default: '3' },
{ name: 'direction', description: '排列方向', type: `'horizontal' | 'vertical'`, default: `'horizontal'` },
{ name: 'size', description: '尺寸', type: `'large' | 'default' | 'small'`, default: `'default'` },
{ name: 'title', description: '标题', type: 'string', default: `''` },
{ name: 'extra', description: '操作区文本', type: 'string', default: `''` },
{ name: 'colon', description: '是否显示冒号', type: 'boolean', default: 'true' },
{ name: 'labelStyle', description: '标签自定义样式', type: 'object', default: '{}' },
{ name: 'contentStyle', description: '内容自定义样式', type: 'object', default: '{}' },
]" />

### ZcDescriptions Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '描述项列表' },
  { name: 'title', description: '自定义标题' },
  { name: 'extra', description: '自定义操作区' },
]" />

### ZcDescriptionsItem Props

<ApiTable type="props" :data="[
  { name: 'label', description: '标签文本', type: 'string', default: '—' },
  { name: 'span', description: '跨列数', type: 'number', default: '1' },
]" />
