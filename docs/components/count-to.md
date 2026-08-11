# CountTo 数字动画

数字滚动动画组件，支持缓动函数、千分位分隔、前缀/后缀，适用于数据看板、统计展示等场景。

## 基础用法

设置 `start-val` 和 `end-val`，组件挂载后自动开始动画。

<DemoBlock>

```vue
<template>
  <div style="font-size: 36px; font-weight: 700; color: #409eff">
    <ZcCountTo :end-val="8888" :duration="2000" />
  </div>
</template>
```

</DemoBlock>

## 缓动函数

通过 `easing` 设置不同的缓动函数。

<DemoBlock>

```vue
<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <div v-for="item in list" :key="item.label">
      <span style="color: #909399; margin-right: 12px">{{ item.label }}:</span>
      <span style="font-size: 28px; font-weight: 700; color: #303133">
        <ZcCountTo :end-val="10000" :duration="2000" :easing="item.value" />
      </span>
    </div>
  </div>
</template>

<script setup>
const list = [
  { label: 'linear', value: 'linear' },
  { label: 'easeOut', value: 'easeOut' },
  { label: 'easeIn', value: 'easeIn' },
  { label: 'easeInOut', value: 'easeInOut' },
]
</script>
```

</DemoBlock>

## 小数和分隔符

通过 `decimals` 设置小数位数，`separator` 设置千分位分隔符。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 40px">
    <div>
      <p style="color: #909399; margin-bottom: 8px">两位小数</p>
      <span style="font-size: 28px; font-weight: 700; color: #67c23a">
        <ZcCountTo :end-val="3141.59" :decimals="2" />
      </span>
    </div>
    <div>
      <p style="color: #909399; margin-bottom: 8px">无分隔符</p>
      <span style="font-size: 28px; font-weight: 700; color: #e6a23c">
        <ZcCountTo :end-val="1000000" :separator="''" />
      </span>
    </div>
  </div>
</template>
```

</DemoBlock>

## 前缀和后缀

通过 `prefix` 和 `suffix` 添加前后缀文本。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 40px">
    <div>
      <p style="color: #909399; margin-bottom: 8px">销售额</p>
      <span style="font-size: 32px; font-weight: 700; color: #f56c6c">
        <ZcCountTo :end-val="128500" prefix="¥" :duration="2500" />
      </span>
    </div>
    <div>
      <p style="color: #909399; margin-bottom: 8px">用户数</p>
      <span style="font-size: 32px; font-weight: 700; color: #409eff">
        <ZcCountTo :end-val="9999" suffix=" 人" />
      </span>
    </div>
  </div>
</template>
```

</DemoBlock>

## 手动控制

关闭 `autoplay`，通过 ref 调用 `start()`、`pause()`、`reset()` 方法手动控制。

<DemoBlock>

```vue
<template>
  <div>
    <span style="font-size: 32px; font-weight: 700; color: #9b59b6">
      <ZcCountTo ref="countRef" :start-val="0" :end-val="5000" :duration="3000" :autoplay="false" />
    </span>
    <div style="margin-top: 16px; display: flex; gap: 12px">
      <ZcButton type="primary" @click="countRef?.start()">开始</ZcButton>
      <ZcButton @click="countRef?.pause()">暂停</ZcButton>
      <ZcButton @click="countRef?.reset()">重置</ZcButton>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const countRef = ref()
</script>
```

</DemoBlock>

## API

### CountTo Props

| 属性名      | 说明                     | 类型                                               | 默认值      |
| ----------- | ------------------------ | -------------------------------------------------- | ----------- |
| startVal    | 起始值                   | `number`                                           | `0`         |
| endVal      | 目标值                   | `number`                                           | `0`         |
| duration    | 动画时长（ms）           | `number`                                           | `2000`      |
| decimals    | 小数位数                 | `number`                                           | `0`         |
| decimal     | 小数点符号               | `string`                                           | `'.'`       |
| separator   | 千分位分隔符             | `string`                                           | `','`       |
| prefix      | 前缀文本                 | `string`                                           | `''`        |
| suffix      | 后缀文本                 | `string`                                           | `''`        |
| useEasing   | 是否使用缓动函数         | `boolean`                                          | `true`      |
| easing      | 缓动函数类型             | `'linear' \| 'easeOut' \| 'easeIn' \| 'easeInOut'` | `'easeOut'` |
| autoplay    | 是否自动播放             | `boolean`                                          | `true`      |
| autoRestart | 值变化时是否自动重新开始 | `boolean`                                          | `false`     |
| fontSize    | 字体大小（px）           | `number`                                           | -           |
| color       | 文字颜色                 | `string`                                           | -           |

### CountTo Events

| 事件名  | 说明           | 回调参数 |
| ------- | -------------- | -------- |
| start   | 动画开始时触发 | -        |
| end     | 动画结束时触发 | -        |
| mounted | 组件挂载时触发 | -        |

### CountTo Methods

通过 ref 调用。

| 方法名 | 说明         | 参数 |
| ------ | ------------ | ---- |
| start  | 开始动画     | -    |
| pause  | 暂停动画     | -    |
| reset  | 重置为起始值 | -    |
