# Statistic 统计数值

统计数值展示，支持数字动画和倒计时功能。

## 基础用法

通过 `title` 设置标题，`value` 设置数值。

<DemoBlock>

```vue
<template>
  <ZcStatistic title="总销售额" :value="268500" />
</template>
```

</DemoBlock>

## 前缀与后缀

通过 `prefix` 和 `suffix` 设置前缀和后缀。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 32px;">
    <ZcStatistic title="总销售额" :value="268500" prefix="¥" />
    <ZcStatistic title="增长率" :value="9.6" suffix="%" :precision="1" />
    <ZcStatistic title="活跃用户" :value="21893" />
  </div>
</template>
```

</DemoBlock>

## 数字动画

设置 `count-up` 开启数字增长动画。

<DemoBlock>

```vue
<template>
  <ZcStatistic title="活跃用户" :value="268500" count-up :count-from="0" :duration="2000" />
</template>
```

</DemoBlock>

## 倒计时

设置 `countdown` 开启倒计时功能。

<DemoBlock>

```vue
<template>
  <ZcStatistic title="活动倒计时" :start-value="Date.now() + 6 * 60 * 60 * 1000" countdown />
</template>
```

</DemoBlock>

## Statistic API

### Props

<ApiTable type="props" :data="[
{ name: 'value', description: '数值', type: 'number', default: '0' },
{ name: 'title', description: '标题', type: 'string', default: `''` },
{ name: 'prefix', description: '前缀', type: 'string', default: `''` },
{ name: 'suffix', description: '后缀', type: 'string', default: `''` },
{ name: 'precision', description: '数字精度', type: 'number', default: '0' },
{ name: 'decimalSeparator', description: '小数点', type: 'string', default: `'.'` },
{ name: 'groupSeparator', description: '千分位分隔符', type: 'string', default: `','` },
{ name: 'formatter', description: '自定义格式化函数', type: '(value: number) => string', default: 'undefined' },
{ name: 'valueStyle', description: '数值自定义样式', type: 'object', default: '{}' },
{ name: 'countUp', description: '是否开启数字增长动画', type: 'boolean', default: 'false' },
{ name: 'countFrom', description: '动画起始值', type: 'number', default: '0' },
{ name: 'duration', description: '动画时长(ms)', type: 'number', default: '2000' },
{ name: 'countdown', description: '是否开启倒计时', type: 'boolean', default: 'false' },
{ name: 'format', description: '倒计时格式', type: 'string', default: `'HH:mm:ss'` },
{ name: 'startValue', description: '倒计时起始时间戳', type: 'number', default: '0' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义数值显示' },
  { name: 'title', description: '自定义标题' },
  { name: 'prefix', description: '自定义前缀' },
  { name: 'suffix', description: '自定义后缀' },
]" />
