# Countdown 倒计时

倒计时组件，常配合 Statistic 使用。支持自定义格式、暂停/恢复/重置等操作。

## 基础用法

通过 `value` 设置目标时间（时间戳或倒计时毫秒数），`format` 设置显示格式。

:::warning
`value` 为相对毫秒数时（< 1e10），从组件挂载时开始倒计时；为绝对时间戳时（≥ 1e10），倒计时到该时间点结束。
:::

<DemoBlock>

```vue
<template>
  <ZcCountdown :value="Date.now() + 1000 * 60 * 30" title="距离活动开始" />
</template>
```

</DemoBlock>

## 自定义格式

`format` 支持 `DD`、`HH`、`mm`、`ss`、`SSS` 等占位符。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 16px;">
    <ZcCountdown :value="Date.now() + 1000 * 60 * 60 * 26" format="HH:mm:ss" title="HH:mm:ss" />
    <ZcCountdown :value="Date.now() + 1000 * 60 * 60 * 26" format="DD天 HH:mm:ss" title="DD天 HH:mm:ss" />
    <ZcCountdown :value="Date.now() + 1000 * 60 * 60 * 26" format="DD天HH小时mm分ss秒" title="中文格式" />
  </div>
</template>
```

</DemoBlock>

## 前缀与后缀

通过 `prefix`、`suffix` 属性或同名插槽设置。

<DemoBlock>

```vue
<template>
  <ZcCountdown :value="Date.now() + 1000 * 60 * 60" title="限时优惠" prefix="⏰" suffix="后结束" />
</template>
```

</DemoBlock>

## 自定义数值样式

通过 `valueStyle` 设置数值区域的样式。

<DemoBlock>

```vue
<template>
  <ZcCountdown
    :value="Date.now() + 1000 * 60 * 10"
    title="倒计时"
    :value-style="{ color: '#f5222d', fontSize: '32px', fontWeight: '700' }"
  />
</template>
```

</DemoBlock>

## 暂停 / 恢复 / 重置

通过 `ref` 调用 `pause()`、`resume()`、`reset()` 方法。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const countdownRef = ref()

const value = Date.now() + 1000 * 60 * 5

function handlePause() {
  countdownRef.value?.pause()
}
function handleResume() {
  countdownRef.value?.resume()
}
function handleReset() {
  countdownRef.value?.reset()
}
function onFinish() {
  console.log('倒计时结束')
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
    <ZcCountdown ref="countdownRef" :value="value" title="可控制倒计时" @finish="onFinish" />
    <div style="display: flex; gap: 8px;">
      <ZcButton size="small" @click="handlePause">暂停</ZcButton>
      <ZcButton size="small" @click="handleResume">恢复</ZcButton>
      <ZcButton size="small" @click="handleReset">重置</ZcButton>
    </div>
  </div>
</template>
```

</DemoBlock>

## 配合 Statistic 使用

`ZcStatistic.Countdown` 是 `ZcCountdown` 的别名，可用于 Statistic 命名空间下。

<DemoBlock>

```vue
<script setup>
import { ZcStatistic } from '@zc-ui/components'
</script>

<template>
  <component :is="ZcStatistic.Countdown" :value="Date.now() + 1000 * 60 * 15" title="Statistic.Countdown 模式" />
</template>
```

</DemoBlock>

## Countdown API

### Props

<ApiTable type="props" :data="[
  { name: 'value', description: '目标时间（时间戳 ≥ 1e10 或倒计时毫秒数）', type: 'number', default: '0' },
  { name: 'format', description: '显示格式（支持 YYYY MM DD HH mm ss SSS S）', type: 'string', default: `'HH:mm:ss'` },
  { name: 'title', description: '标题', type: 'string', default: `''` },
  { name: 'prefix', description: '前缀', type: 'string', default: `''` },
  { name: 'suffix', description: '后缀', type: 'string', default: `''` },
  { name: 'valueStyle', description: '数值自定义样式', type: 'Record<string, string>', default: '{}' },
  { name: 'interval', description: '更新间隔(ms)，默认根据 format 自动判断', type: 'number', default: '1000 | 50' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '每次更新时触发', params: 'remaining: number (剩余毫秒)' },
  { name: 'finish', description: '倒计时结束时触发', params: '—' },
]" />

### Methods (via ref)

<ApiTable type="methods" :data="[
  { name: 'pause()', description: '暂停倒计时', params: '—' },
  { name: 'resume()', description: '恢复倒计时', params: '—' },
  { name: 'reset()', description: '重置到初始值并重新开始', params: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义数值显示（作用域插槽：displayValue）' },
  { name: 'title', description: '自定义标题' },
  { name: 'prefix', description: '自定义前缀' },
  { name: 'suffix', description: '自定义后缀' },
]" />
