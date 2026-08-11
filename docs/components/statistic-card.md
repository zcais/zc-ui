# StatisticCard 统计卡片

统计数值卡片组件，展示标题、数值、趋势箭头和趋势百分比，支持加载骨架、边框和悬停效果，适用于数据看板和仪表盘。

## 基础用法

通过 `title` 和 `value` 属性快速渲染统计卡片。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <ZcStatisticCard title="总销售额" :value="126560" prefix="¥" />
    <ZcStatisticCard title="访问量" :value="8846" suffix="次" />
    <ZcStatisticCard title="支付订单" :value="6560" />
  </div>
</template>
```

</DemoBlock>

## 趋势展示

通过 `trend` 设置上升/下降趋势，`trend-value` 设置趋势百分比。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <ZcStatisticCard title="本月营收" :value="89300" prefix="¥" trend="up" :trend-value="12.5" />
    <ZcStatisticCard
      title="上月退款"
      :value="2340"
      prefix="¥"
      trend="down"
      :trend-value="8.3"
      trend-label="环比上月"
    />
  </div>
</template>
```

</DemoBlock>

## 加载状态

设置 `loading` 显示骨架屏。

<DemoBlock>

```vue
<template>
  <ZcStatisticCard title="加载中数据" :value="12345" loading />
</template>
```

</DemoBlock>

## 小数和千分位

通过 `decimals` 设置小数位数，`separator` 控制是否显示千分位分隔符。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 16px; flex-wrap: wrap">
    <ZcStatisticCard title="转化率" :value="68.59" :decimals="2" suffix="%" :separator="false" />
    <ZcStatisticCard title="客单价" :value="156.8" :decimals="1" prefix="¥" />
  </div>
</template>
```

</DemoBlock>

## 自定义内容

通过插槽自定义标题、数值、趋势、头部和底部内容。

<DemoBlock>

```vue
<template>
  <ZcStatisticCard title="自定义卡片" :value="9999">
    <template #avatar>
      <div
        style="
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #409eff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        "
      >
        📊
      </div>
    </template>
    <template #footer>
      <div style="font-size: 12px; color: #909399">数据更新时间：2025-01-15</div>
    </template>
  </ZcStatisticCard>
</template>
```

</DemoBlock>

## API

### StatisticCard Props

| 属性名     | 说明                                | 类型                       | 默认值             |
| ---------- | ----------------------------------- | -------------------------- | ------------------ |
| title      | 卡片标题                            | `string`                   | `''`               |
| value      | 数值                                | `number \| string`         | `''`               |
| prefix     | 前缀（如货币符号）                  | `string`                   | `''`               |
| suffix     | 后缀（如单位）                      | `string`                   | `''`               |
| trend      | 趋势方向                            | `'up' \| 'down' \| 'none'` | `'none'`           |
| trendValue | 趋势百分比（如 `12.5` 表示 +12.5%） | `number`                   | -                  |
| trendLabel | 趋势标签文字                        | `string`                   | `'vs last period'` |
| decimals   | 小数位数                            | `number`                   | `0`                |
| separator  | 是否显示千分位分隔符                | `boolean`                  | `true`             |
| loading    | 是否加载中                          | `boolean`                  | `false`            |
| bordered   | 是否显示边框                        | `boolean`                  | `true`             |
| padding    | 卡片内边距（px）                    | `number`                   | `20`               |

### StatisticCard Events

| 事件名 | 说明           | 回调参数 |
| ------ | -------------- | -------- |
| click  | 点击卡片时触发 | -        |

### Slots

| 插槽名  | 说明                                         |
| ------- | -------------------------------------------- |
| default | 自定义数值内容                               |
| title   | 自定义标题                                   |
| prefix  | 自定义前缀                                   |
| suffix  | 自定义后缀                                   |
| trend   | 自定义趋势区域，提供 `trend` 和 `trendValue` |
| avatar  | 标题右侧自定义图标/头像                      |
| footer  | 卡片底部内容                                 |
