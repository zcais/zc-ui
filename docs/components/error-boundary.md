# ErrorBoundary 错误边界

错误边界组件，捕获子组件树中的运行时错误并展示友好的降级 UI。支持自定义错误展示、重试按钮和开发环境错误详情。

## 基础用法

将可能出错的组件包裹在 `ZcErrorBoundary` 中，当子组件抛出错误时会自动捕获并展示降级 UI。

<DemoBlock>

```vue
<template>
  <ZcErrorBoundary>
    <RiskyComponent />
  </ZcErrorBoundary>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const RiskyComponent = defineComponent({
  name: 'RiskyComponent',
  setup() {
    // 模拟一个渲染错误
    throw new Error('模拟的运行时错误：数据加载失败！')
  },
  render() {
    return h('div', '正常内容')
  },
})
</script>
```

</DemoBlock>

## 自定义错误标题和描述

通过 `error-title` 和 `error-description` 自定义错误展示文本。

<DemoBlock>

```vue
<template>
  <ZcErrorBoundary
    error-title="页面加载失败"
    error-description="请检查网络连接后重试，如问题持续请联系技术支持。"
  >
    <RiskyComponent />
  </ZcErrorBoundary>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const RiskyComponent = defineComponent({
  name: 'RiskyComponent',
  setup() {
    throw new Error('Something went wrong')
  },
  render() {
    return h('div', '正常内容')
  },
})
</script>
```

</DemoBlock>

## 自定义错误展示

使用 `error` 插槽完全自定义错误降级 UI，插槽提供 `error` 和 `reset` 参数。

<DemoBlock>

```vue
<template>
  <ZcErrorBoundary>
    <RiskyComponent />

    <template #error="{ error, reset }">
      <div
        style="
          padding: 40px;
          text-align: center;
          background: #fef0f0;
          border: 1px solid #fde2e2;
          border-radius: 8px;
        "
      >
        <p style="font-size: 48px; margin-bottom: 12px">😵</p>
        <p style="color: #f56c6c; font-weight: 600; margin-bottom: 8px">
          {{ error.message }}
        </p>
        <ZcButton type="danger" @click="reset">重新加载</ZcButton>
      </div>
    </template>
  </ZcErrorBoundary>
</template>

<script setup>
import { defineComponent, h } from 'vue'

const RiskyComponent = defineComponent({
  name: 'RiskyComponent',
  setup() {
    throw new Error('自定义错误展示')
  },
  render() {
    return h('div', '正常内容')
  },
})
</script>
```

</DemoBlock>

## API

### ErrorBoundary Props

| 属性名           | 说明                           | 类型      | 默认值                              |
| ---------------- | ------------------------------ | --------- | ----------------------------------- |
| catchErrors      | 是否捕获错误（`false` 时透传） | `boolean` | `true`                              |
| showDetails      | 是否显示错误详情折叠           | `boolean` | 开发环境为 `true`，生产环境 `false` |
| errorTitle       | 错误标题                       | `string`  | `'Something went wrong'`            |
| errorDescription | 错误描述                       | `string`  | `''`                                |

### ErrorBoundary Events

| 事件名 | 说明               | 回调参数                       |
| ------ | ------------------ | ------------------------------ |
| error  | 捕获到错误时触发   | `(error: Error, info: string)` |
| reset  | 用户点击重试时触发 | -                              |

### ErrorBoundary Methods

通过 ref 调用。

| 方法名 | 说明         | 参数 |
| ------ | ------------ | ---- |
| reset  | 重置错误状态 | -    |

### Slots

| 插槽名  | 说明                                                   |
| ------- | ------------------------------------------------------ |
| default | 正常渲染的子内容                                       |
| error   | 错误降级 UI，提供 `error`（Error 对象）和 `reset` 方法 |
