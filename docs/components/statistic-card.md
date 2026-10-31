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

<ApiTable type="props" :data="[
{ name: 'title', description: '卡片标题', type: 'string', default: '''' },
{ name: 'value', description: '数值', type: '`number \', default: 'string`' },
{ name: 'prefix', description: '前缀（如货币符号）', type: 'string', default: '''' },
{ name: 'suffix', description: '后缀（如单位）', type: 'string', default: '''' },
{ name: 'trend', description: '趋势方向', type: '`'up' \', default: ''down' \' },
{ name: 'trendValue', description: '趋势百分比（如 12.5 表示 +12.5%）', type: 'number', default: '—' },
{ name: 'trendLabel', description: '趋势标签文字', type: 'string', default: ''vs last period'' },
{ name: 'decimals', description: '小数位数', type: 'number', default: '0' },
{ name: 'separator', description: '是否显示千分位分隔符', type: 'boolean', default: 'true' },
{ name: 'loading', description: '是否加载中', type: 'boolean', default: 'false' },
{ name: 'bordered', description: '是否显示边框', type: 'boolean', default: 'true' },
{ name: 'padding', description: '卡片内边距（px）', type: 'number', default: '20' }
]" />

### StatisticCard Events

<ApiTable type="events" :data="[
{ name: '—', description: '点击卡片时触发' }
]" />

### Slots

<ApiTable type="slots" :data="[
{ name: 'default', description: '自定义数值内容' },
{ name: 'title', description: '自定义标题' },
{ name: 'prefix', description: '自定义前缀' },
{ name: 'suffix', description: '自定义后缀' },
{ name: 'trend', description: '自定义趋势区域，提供 trend 和 trendValue' },
{ name: 'avatar', description: '标题右侧自定义图标/头像' },
{ name: 'footer', description: '卡片底部内容' }
]" />
