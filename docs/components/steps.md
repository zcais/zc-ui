# Steps 步骤条

引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤。

## 基础用法

简单的步骤条。

<DemoBlock>

```vue
<template>
  <ZcSteps :current="current" @change="current = $event">
    <ZcStep title="步骤 1" description="这是一段描述信息" />
    <ZcStep title="步骤 2" description="这是一段描述信息" />
    <ZcStep title="步骤 3" description="这是一段描述信息" />
  </ZcSteps>
  <ZcButton style="margin-top: 16px;" @click="current = Math.max(0, current - 1)">上一步</ZcButton>
  <ZcButton style="margin-top: 16px;" type="primary" @click="current = Math.min(2, current + 1)"
    >下一步</ZcButton
  >
</template>
<script setup>
import { ref } from 'vue'
const current = ref(1)
</script>
```

</DemoBlock>

## 竖式步骤条

设置 `direction` 属性为 `vertical` 展示竖式步骤条。

<DemoBlock>

```vue
<template>
  <ZcSteps direction="vertical" :current="1">
    <ZcStep title="步骤 1" description="这是一段描述信息" />
    <ZcStep title="步骤 2" description="这是一段描述信息" />
    <ZcStep title="步骤 3" description="这是一段描述信息" />
  </ZcSteps>
</template>
```

</DemoBlock>

## 带图标的步骤条

通过 `icon` 属性设置步骤图标。

<DemoBlock>

```vue
<template>
  <ZcSteps :current="1">
    <ZcStep title="登录" icon="user" />
    <ZcStep title="验证" icon="lock" />
    <ZcStep title="完成" icon="check" />
  </ZcSteps>
</template>
```

</DemoBlock>

## Steps API

### ZcSteps Props

<ApiTable type="props" :data="[
{ name: 'current', description: '当前激活步骤', type: 'number', default: '0' },
{ name: 'direction', description: '显示方向', type: `'horizontal' | 'vertical'`, default: `'horizontal'` },
{ name: 'type', description: '类型', type: `'default' | 'simple'`, default: `'default'` },
{ name: 'error', description: '当前步骤是否为错误状态', type: 'boolean', default: 'false' },
{ name: 'space', description: '每个 step 的间距', type: 'number | string', default: `''` },
]" />

### ZcSteps Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '放置 ZcStep 组件' },
]" />

### ZcStep Props

<ApiTable type="props" :data="[
{ name: 'title', description: '标题', type: 'string', default: `''` },
{ name: 'description', description: '描述', type: 'string', default: `''` },
{ name: 'icon', description: '图标', type: 'string', default: `''` },
{ name: 'status', description: '步骤状态', type: `'wait' | 'process' | 'finish' | 'error' | 'success'`, default: '自动推断' },
]" />
