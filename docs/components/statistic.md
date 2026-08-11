# Statistic 统计数值

统计数值展示，支持数字动画（4种缓动函数、暂停/恢复/重置）和倒计时功能。

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

设置 `count-up` 开启数字增长动画，通过 `count-from` 设置起始值，`duration` 设置动画时长。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 32px;">
    <ZcStatistic title="活跃用户" :value="268500" count-up :count-from="0" :duration="2000" />
    <ZcStatistic title="总收入" :value="1280000" count-up prefix="¥" :duration="2500" />
  </div>
</template>
```

</DemoBlock>

## 缓动函数

设置 `easing` 选择不同的缓动函数，`use-easing` 可关闭缓动使用匀速动画。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ZcStatistic
      v-for="item in [
        { label: 'linear 匀速', value: 'linear' },
        { label: 'easeOut 先快后慢', value: 'easeOut' },
        { label: 'easeIn 先慢后快', value: 'easeIn' },
        { label: 'easeInOut 两端慢中间快', value: 'easeInOut' },
      ]"
      :key="item.value"
      :title="item.label"
      :value="8888"
      count-up
      :count-from="0"
      :duration="2500"
      :easing="item.value"
    />
  </div>
</template>
```

</DemoBlock>

## 手动控制

通过 `autoplay` 关闭自动播放，使用 `ref` 调用 `start`、`pause`、`resume`、`reset` 方法。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
    <ZcStatistic
      ref="statRef"
      title="可控数值"
      :value="5000"
      count-up
      :count-from="0"
      :duration="3000"
      :autoplay="false"
    />
    <div style="display: flex; gap: 8px;">
      <ZcButton size="small" @click="statRef?.start()">开始</ZcButton>
      <ZcButton size="small" @click="statRef?.pause()">暂停</ZcButton>
      <ZcButton size="small" @click="statRef?.resume()">继续</ZcButton>
      <ZcButton size="small" @click="statRef?.reset()">重置</ZcButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const statRef = ref()
</script>
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
{ name: 'decimalSeparator', description: '小数点分隔符', type: 'string', default: `'.'` },
{ name: 'groupSeparator', description: '千分位分隔符', type: 'string', default: `','` },
{ name: 'formatter', description: '自定义格式化函数', type: '(value: number) => string', default: 'undefined' },
{ name: 'valueStyle', description: '数值自定义样式', type: 'object', default: '{}' },
{ name: 'countUp', description: '是否开启数字增长动画', type: 'boolean', default: 'false' },
{ name: 'countFrom', description: '动画起始值', type: 'number', default: '0' },
{ name: 'duration', description: '动画时长(ms)', type: 'number', default: '2000' },
{ name: 'useEasing', description: '是否使用缓动函数', type: 'boolean', default: 'true' },
{ name: 'easing', description: '缓动函数类型', type: "'linear' | 'easeOut' | 'easeIn' | 'easeInOut'", default: "'easeOut'" },
{ name: 'autoplay', description: '是否自动播放动画', type: 'boolean', default: 'true' },
{ name: 'autoRestart', description: '值变化时是否自动重新播放', type: 'boolean', default: 'false' },
{ name: 'countdown', description: '是否开启倒计时', type: 'boolean', default: 'false' },
{ name: 'startValue', description: '倒计时起始时间戳(ms)', type: 'number', default: '0' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'start', description: '动画开始时触发', params: '—' },
  { name: 'end', description: '动画结束或倒计时结束时触发', params: '—' },
]" />

### Methods

<ApiTable type="methods" :data="[
  { name: 'start', description: '开始（或重新开始）数字动画', params: '—' },
  { name: 'pause', description: '暂停当前动画', params: '—' },
  { name: 'resume', description: '继续暂停的动画', params: '—' },
  { name: 'reset', description: '重置到起始值', params: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义数值显示' },
  { name: 'title', description: '自定义标题' },
  { name: 'prefix', description: '自定义前缀' },
  { name: 'suffix', description: '自定义后缀' },
]" />
