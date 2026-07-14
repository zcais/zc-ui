# Timeline 时间线

可视化地呈现时间流信息。

## 基础用法

基础的时间线展示。

<DemoBlock>

```vue
<template>
  <ZcTimeline>
    <ZcTimelineItem timestamp="2018/4/12" placement="top"> 活动按期开始 </ZcTimelineItem>
    <ZcTimelineItem timestamp="2018/4/3" placement="top"> 通过审核 </ZcTimelineItem>
    <ZcTimelineItem timestamp="2018/4/2" placement="top"> 创建成功 </ZcTimelineItem>
  </ZcTimeline>
</template>
```

</DemoBlock>

## 自定义节点颜色

通过 `type` 属性设置节点颜色。

<DemoBlock>

```vue
<template>
  <ZcTimeline>
    <ZcTimelineItem type="primary" timestamp="2018/4/12" placement="top"> 主要节点 </ZcTimelineItem>
    <ZcTimelineItem type="success" timestamp="2018/4/3" placement="top"> 成功节点 </ZcTimelineItem>
    <ZcTimelineItem type="warning" timestamp="2018/4/2" placement="top"> 警告节点 </ZcTimelineItem>
    <ZcTimelineItem type="danger" timestamp="2018/4/1" placement="top"> 危险节点 </ZcTimelineItem>
    <ZcTimelineItem type="info" timestamp="2018/3/30" placement="top"> 信息节点 </ZcTimelineItem>
  </ZcTimeline>
</template>
```

</DemoBlock>

## Timeline API

### ZcTimeline Props

<ApiTable type="props" :data="[
  { name: 'reverse', description: '是否反向排列', type: 'boolean', default: 'false' },
]" />

### ZcTimeline Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '放置 ZcTimelineItem 组件' },
]" />

### ZcTimelineItem Props

<ApiTable type="props" :data="[
{ name: 'timestamp', description: '时间戳', type: 'string', default: `''` },
{ name: 'hideTimestamp', description: '是否隐藏时间戳', type: 'boolean', default: 'false' },
{ name: 'type', description: '节点类型', type: `'primary' | 'success' | 'warning' | 'danger' | 'info'`, default: `'primary'` },
{ name: 'color', description: '节点自定义颜色', type: 'string', default: `''` },
{ name: 'size', description: '节点尺寸', type: `'normal' | 'large'`, default: `'normal'` },
{ name: 'placement', description: '时间戳位置', type: `'top' | 'bottom'`, default: `'top'` },
{ name: 'hollow', description: '是否空心节点', type: 'boolean', default: 'false' },
]" />

### ZcTimelineItem Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '内容' },
  { name: 'dot', description: '自定义节点' },
]" />
