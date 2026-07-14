# Message 消息提示

常用于主动操作后的反馈提示，以轻量浮层形式展示，可通过函数式 API 调用。

## 基础用法

通过 `ZcMessage` 函数调用，支持传入字符串或配置对象。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="showMessage">显示消息</ZcButton>
</template>

<script setup>
import { ZcMessage } from '@zc-ui/components'

const showMessage = () => {
  ZcMessage('这是一条消息提示')
}
</script>
```

</DemoBlock>

## 不同类型

通过 `type` 属性设置消息类型，支持 `info`、`success`、`warning`、`danger`。

<DemoBlock>

```vue
<template>
  <ZcButton @click="ZcMessage.info('信息提示')">Info</ZcButton>
  <ZcButton type="success" @click="ZcMessage.success('成功提示')">Success</ZcButton>
  <ZcButton type="warning" @click="ZcMessage.warning('警告提示')">Warning</ZcButton>
  <ZcButton type="danger" @click="ZcMessage.danger('危险提示')">Danger</ZcButton>
</template>

<script setup>
import { ZcMessage } from '@zc-ui/components'
</script>
```

</DemoBlock>

## 可关闭与持续时间

通过 `showClose` 显示关闭按钮，`duration` 控制自动关闭时间（毫秒）。

<DemoBlock>

```vue
<template>
  <ZcButton @click="showClosable">可关闭（持续10秒）</ZcButton>
  <ZcButton @click="showPersist">常驻消息</ZcButton>
</template>

<script setup>
import { ZcMessage } from '@zc-ui/components'

const showClosable = () => {
  ZcMessage({ message: '此消息10秒后自动关闭', showClose: true, duration: 10000 })
}
const showPersist = () => {
  ZcMessage({ message: '此消息不会自动关闭', showClose: true, duration: 0 })
}
</script>
```

</DemoBlock>

## 居中显示

通过 `center` 属性使消息文字居中。

<DemoBlock>

```vue
<template>
  <ZcButton @click="showCentered">居中消息</ZcButton>
</template>

<script setup>
import { ZcMessage } from '@zc-ui/components'

const showCentered = () => {
  ZcMessage({ message: '居中显示的消息', center: true })
}
</script>
```

</DemoBlock>

## Message API

### Options

<ApiTable type="props" :data="[
  { name: 'message', description: '消息文字内容', type: 'string', default: '—' },
  { name: 'type', description: '消息类型', type: 'info | success | warning | danger', default: 'info' },
  { name: 'duration', description: '显示时间（毫秒），0 为常驻', type: 'number', default: '3000' },
  { name: 'showClose', description: '是否显示关闭按钮', type: 'boolean', default: 'false' },
  { name: 'center', description: '是否居中显示', type: 'boolean', default: 'false' },
  { name: 'offset', description: '距离顶部的偏移量（px）', type: 'number', default: '20' },
  { name: 'onClose', description: '关闭时的回调函数', type: '() => void', default: '—' }
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'close', description: '消息关闭时触发', parameters: '—' }
]" />

### 快捷方式

`ZcMessage` 提供以下快捷方法：

- `ZcMessage.info(options)` - 信息提示
- `ZcMessage.success(options)` - 成功提示
- `ZcMessage.warning(options)` - 警告提示
- `ZcMessage.danger(options)` - 错误/危险提示

每个快捷方法均接受字符串或配置对象（不含 `type` 字段）。

### 导出

| 名称                | 描述                     |
| ------------------- | ------------------------ |
| `ZcMessage`         | 消息函数，含类型快捷方法 |
| `ZcMessageCloseAll` | 关闭所有消息实例         |

## 注意事项

- **SSR 兼容性**：`ZcMessage` 依赖 `document` 对象，在 SSR 环境中调用需确保仅在客户端执行（如放在 `onMounted` 中）。
- **自动关闭**：默认 3 秒后自动关闭。设置 `duration: 0` 可实现手动关闭，此时需调用返回实例的 `close()` 方法。
- **堆叠偏移**：多条消息会自动堆叠排列并计算偏移量，无需手动管理位置。
- **性能建议**：避免在短时间内频繁创建大量消息实例，应及时调用 `close()` 或 `ZcMessageCloseAll()` 清理。
