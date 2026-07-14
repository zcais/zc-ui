# Notification 通知

在页面一角显示通知信息，常用于系统推送、操作结果等场景。

## 基础用法

通过 `ZcNotification` 函数调用，传入标题和内容。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="showNotify">显示通知</ZcButton>
</template>

<script setup>
import { ZcNotification } from '@zc-ui/components'

const showNotify = () => {
  ZcNotification({ title: '通知标题', message: '这是一条通知消息内容' })
}
</script>
```

</DemoBlock>

## 不同类型

通过 `type` 属性设置通知类型，支持 `info`、`success`、`warning`、`danger`。

<DemoBlock>

```vue
<template>
  <ZcButton @click="ZcNotification.info({ title: '信息', message: '这是一条信息通知' })"
    >Info</ZcButton
  >
  <ZcButton
    type="success"
    @click="ZcNotification.success({ title: '成功', message: '操作成功完成' })"
    >Success</ZcButton
  >
  <ZcButton type="warning" @click="ZcNotification.warning({ title: '警告', message: '请确认操作' })"
    >Warning</ZcButton
  >
  <ZcButton
    type="danger"
    @click="ZcNotification.danger({ title: '错误', message: '操作失败，请重试' })"
    >Danger</ZcButton
  >
</template>

<script setup>
import { ZcNotification } from '@zc-ui/components'
</script>
```

</DemoBlock>

## 显示位置

通过 `position` 属性控制通知出现的位置。

<DemoBlock>

```vue
<template>
  <ZcButton @click="show('top-right')">右上角</ZcButton>
  <ZcButton @click="show('top-left')">左上角</ZcButton>
  <ZcButton @click="show('bottom-right')">右下角</ZcButton>
  <ZcButton @click="show('bottom-left')">左下角</ZcButton>
</template>

<script setup>
import { ZcNotification } from '@zc-ui/components'

const show = (position) => {
  ZcNotification({
    title: '位置通知',
    message: `我在 ${position}`,
    position,
  })
}
</script>
```

</DemoBlock>

## 自定义时长

通过 `duration` 控制通知显示时长，设置为 0 则不会自动关闭。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="showDuration">长时显示（10秒）</ZcButton>
  <ZcButton @click="showPersist">常驻通知</ZcButton>
</template>

<script setup>
import { ZcNotification } from '@zc-ui/components'

const showDuration = () => {
  ZcNotification({ title: '长时通知', message: '此通知将在10秒后关闭', duration: 10000 })
}
const showPersist = () => {
  ZcNotification({ title: '常驻通知', message: '此通知不会自动关闭', duration: 0 })
}
</script>
```

</DemoBlock>

## Notification API

### Options

<ApiTable type="props" :data="[
  { name: 'title', description: '通知标题', type: 'string', default: '' },
  { name: 'message', description: '通知正文内容', type: 'string', default: '' },
  { name: 'type', description: '通知类型', type: 'info | success | warning | danger', default: 'info' },
  { name: 'duration', description: '显示时间（毫秒），0 为常驻', type: 'number', default: '4500' },
  { name: 'showClose', description: '是否显示关闭按钮', type: 'boolean', default: 'true' },
  { name: 'position', description: '通知显示位置', type: 'top-right | top-left | bottom-right | bottom-left', default: 'top-right' },
  { name: 'offset', description: '距离边界的偏移量（px）', type: 'number', default: '16' },
  { name: 'onClose', description: '关闭时的回调函数', type: '() => void', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'close', description: '通知关闭时触发', parameters: '—' }
]" />

### 快捷方式

`ZcNotification` 提供以下快捷方法：

- `ZcNotification.info(options)` - 信息通知
- `ZcNotification.success(options)` - 成功通知
- `ZcNotification.warning(options)` - 警告通知
- `ZcNotification.danger(options)` - 错误通知

每个快捷方法均接受字符串或配置对象（不含 `type` 字段）。

### 导出

| 名称                     | 描述                     |
| ------------------------ | ------------------------ |
| `ZcNotification`         | 通知函数，含类型快捷方法 |
| `ZcNotificationCloseAll` | 关闭所有通知实例         |

## 注意事项

- **SSR 兼容性**：`ZcNotification` 依赖 `document` 对象，在 SSR 环境中调用需确保仅在客户端执行。
- **自动关闭**：默认 4.5 秒后自动关闭。设置 `duration: 0` 可实现手动关闭。
- **位置管理**：支持 `top-right`、`top-left`、`bottom-right`、`bottom-left` 四个方位，相同位置的通知会自动堆叠并计算偏移量。
- **鼠标悬停**：鼠标移入通知区域时会暂停自动关闭计时器，移出后恢复。
