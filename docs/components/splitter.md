# Splitter 分栏面板

用于将页面或容器分割为多个可调整大小的面板，支持水平/垂直方向拖拽调整。

## 基础用法

通过默认插槽放置面板内容，使用 `direction` 控制分割方向。

<DemoBlock>

```vue
<template>
  <ZcSplitter style="height: 200px">
    <div style="padding: 16px">左侧面板</div>
    <div style="padding: 16px">右侧面板</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 垂直分割

设置 `direction="vertical"` 实现上下分割。

<DemoBlock>

```vue
<template>
  <ZcSplitter direction="vertical" style="height: 300px">
    <div style="padding: 16px">上面板</div>
    <div style="padding: 16px">下面板</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 自定义初始比例

通过 `sizes` 设置各面板的初始比例（百分比）。

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[30, 70]" style="height: 200px">
    <div style="padding: 16px; background: #f5f7fa">30%</div>
    <div style="padding: 16px">70%</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 限制最小/最大尺寸

通过 `minSizes` 和 `maxSizes` 限制拖拽范围。

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[50, 50]" :min-sizes="[20, 20]" :max-sizes="[80, 80]" style="height: 200px">
    <div style="padding: 16px">最小20%</div>
    <div style="padding: 16px">最小20%</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 可折叠面板

设置 `collapsible` 后，双击分隔条可折叠前一个面板。

<DemoBlock>

```vue
<template>
  <ZcSplitter collapsible :sizes="[40, 60]" style="height: 200px">
    <div style="padding: 16px">双击分隔条折叠此面板</div>
    <div style="padding: 16px">面板 B</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## 三面板嵌套

<DemoBlock>

```vue
<template>
  <ZcSplitter :sizes="[25, 50, 25]" style="height: 200px">
    <div style="padding: 16px; background: #f5f7fa">面板 A</div>
    <div style="padding: 16px">面板 B</div>
    <div style="padding: 16px; background: #f5f7fa">面板 C</div>
  </ZcSplitter>
</template>
```

</DemoBlock>

## API

### Splitter Props

| 属性名           | 说明                     | 类型                         | 默认值         |
| ---------------- | ------------------------ | ---------------------------- | -------------- |
| direction        | 分割方向                 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| sizes            | 各面板初始尺寸（百分比） | `number[]`                   | `[50, 50]`     |
| minSizes         | 各面板最小尺寸（百分比） | `number[]`                   | `[]`           |
| maxSizes         | 各面板最大尺寸（百分比） | `number[]`                   | `[]`           |
| gutterSize       | 分隔条宽度（px）         | `number`                     | `6`            |
| collapsible      | 是否支持双击折叠         | `boolean`                    | `false`        |
| disabled         | 是否禁用拖拽             | `boolean`                    | `false`        |
| showGutterHandle | 是否显示分隔条指示器     | `boolean`                    | `true`         |

### Splitter Events

| 事件名       | 说明                | 回调参数                              |
| ------------ | ------------------- | ------------------------------------- |
| update:sizes | 面板尺寸变化时触发  | `(sizes: number[])`                   |
| resize       | 拖拽过程中持续触发  | `(sizes: number[])`                   |
| collapsed    | 面板折叠/展开时触发 | `(index: number, collapsed: boolean)` |

### Slots

| 插槽名  | 说明                             |
| ------- | -------------------------------- |
| default | 面板内容，多个子元素对应多个面板 |
