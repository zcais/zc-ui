# 反馈与导航组件

ZC UI 的反馈类和导航类基础组件，包括 Dialog、Message、Tooltip、Loading、Notification、Pagination 和 Icon。

---

## Dialog 对话框

在浮层中显示内容，支持拖拽、全屏、自定义头部/底部。

### 基础用法

```vue
<template>
  <ZcButton @click="visible = true">打开对话框</ZcButton>

  <ZcDialog v-model="visible" title="提示">
    <p>这是一段对话框内容</p>
    <template #footer>
      <ZcButton @click="visible = false">取消</ZcButton>
      <ZcButton type="primary" @click="visible = false">确定</ZcButton>
    </template>
  </ZcDialog>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
</script>
```

### Props

| 参数                 | 说明         | 类型                                       | 默认值     |
| -------------------- | ------------ | ------------------------------------------ | ---------- |
| modelValue (v-model) | 是否显示     | boolean                                    | —          |
| title                | 标题         | string                                     | ''         |
| width                | 宽度         | string \| number                           | 按尺寸预设 |
| size                 | 尺寸预设     | `'small' \| 'medium' \| 'large' \| 'full'` | `'medium'` |
| fullscreen           | 显示全屏按钮 | boolean                                    | `false`    |
| draggable            | 可拖拽头部   | boolean                                    | `false`    |
| showClose            | 显示关闭按钮 | boolean                                    | `true`     |
| center               | 居中布局     | boolean                                    | `false`    |
| closeOnClickOverlay  | 点击遮罩关闭 | boolean                                    | `true`     |
| closeOnEsc           | ESC 键关闭   | boolean                                    | `true`     |
| lockScroll           | 锁定滚动     | boolean                                    | `true`     |

### Events

| 事件              | 说明       | 回调参数         |
| ----------------- | ---------- | ---------------- |
| update:modelValue | 可见性变化 | `(val: boolean)` |
| open              | 打开时     | —                |
| close             | 关闭时     | —                |

### Slots

| 插槽    | 说明       |
| ------- | ---------- |
| default | 主体内容   |
| title   | 标题区     |
| footer  | 底部操作区 |

---

## Message 消息提示

全局函数式调用，显示操作反馈。

### 基础用法

```ts
import { ZcMessage } from '@zc-ui/components'

ZcMessage('Hello World')
ZcMessage.success('操作成功')
ZcMessage.warning('请注意')
ZcMessage.danger('操作失败')
ZcMessage({ message: '自定义', type: 'info', duration: 5000, showClose: true })
```

### Options

| 参数      | 说明                         | 类型                                           | 默认值   |
| --------- | ---------------------------- | ---------------------------------------------- | -------- |
| message   | 消息内容                     | string                                         | —        |
| type      | 类型                         | `'info' \| 'success' \| 'warning' \| 'danger'` | `'info'` |
| duration  | 自动关闭时间(ms)，0 为不关闭 | number                                         | `3000`   |
| showClose | 显示关闭按钮                 | boolean                                        | `false`  |
| center    | 居中                         | boolean                                        | `false`  |
| offset    | 距顶部偏移(px)               | number                                         | `20`     |
| onClose   | 关闭回调                     | `() => void`                                   | —        |

### 方法

| 方法                         | 说明               |
| ---------------------------- | ------------------ |
| `ZcMessage(text \| options)` | 显示消息，返回实例 |
| `ZcMessage.info(...)`        | info 类型          |
| `ZcMessage.success(...)`     | success 类型       |
| `ZcMessage.warning(...)`     | warning 类型       |
| `ZcMessage.danger(...)`      | danger 类型        |
| `ZcMessageCloseAll()`        | 关闭所有消息       |

---

## Notification 通知

全局函数式调用，在角落显示通知，支持位置和偏移。

### 基础用法

```ts
import { ZcNotification } from '@zc-ui/components'

ZcNotification({ title: '通知', message: '内容' })
ZcNotification.success({ message: '操作成功' })
ZcNotification({ message: '自定义位置', position: 'bottom-right', offset: 50 })
```

### Options

| 参数      | 说明                         | 类型                                                           | 默认值        |
| --------- | ---------------------------- | -------------------------------------------------------------- | ------------- |
| title     | 标题                         | string                                                         | ''            |
| message   | 内容                         | string                                                         | ''            |
| type      | 类型                         | `'info' \| 'success' \| 'warning' \| 'danger'`                 | `'info'`      |
| duration  | 自动关闭时间(ms)，0 为不关闭 | number                                                         | `4500`        |
| showClose | 显示关闭按钮                 | boolean                                                        | `true`        |
| position  | 显示位置                     | `'top-right' \| 'top-left' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` |
| offset    | 距边缘偏移(px)               | number                                                         | `16`          |
| onClose   | 关闭回调                     | `() => void`                                                   | —             |

### 方法

| 方法                          | 说明         |
| ----------------------------- | ------------ |
| `ZcNotification(options)`     | 显示通知     |
| `ZcNotification.info(...)`    | info 类型    |
| `ZcNotification.success(...)` | success 类型 |
| `ZcNotification.warning(...)` | warning 类型 |
| `ZcNotification.danger(...)`  | danger 类型  |
| `ZcNotificationCloseAll()`    | 关闭所有通知 |

---

## Tooltip 文字提示

鼠标悬浮或点击时显示提示信息，支持 12 个方位。

### 基础用法

```vue
<template>
  <ZcTooltip content="这是提示文字">
    <ZcButton>悬浮查看提示</ZcButton>
  </ZcTooltip>

  <ZcTooltip content="点击触发" :triggers="['click']" placement="right">
    <ZcButton>点击查看</ZcButton>
  </ZcTooltip>
</template>
```

### Props

| 参数              | 说明         | 类型                                | 默认值      |
| ----------------- | ------------ | ----------------------------------- | ----------- |
| content           | 提示内容     | string                              | ''          |
| visible (v-model) | 手动控制     | boolean                             | `false`     |
| placement         | 方位         | `TooltipPlacement`                  | `'top'`     |
| triggers          | 触发方式     | `('hover' \| 'click' \| 'focus')[]` | `['hover']` |
| showDelay         | 显示延迟(ms) | number                              | `100`       |
| hideDelay         | 隐藏延迟(ms) | number                              | `100`       |
| disabled          | 禁用         | boolean                             | `false`     |
| showArrow         | 显示箭头     | boolean                             | `true`      |

### Placement 取值

`top`、`top-start`、`top-end`、`bottom`、`bottom-start`、`bottom-end`、`left`、`left-start`、`left-end`、`right`、`right-start`、`right-end`

### Slots

| 插槽    | 说明           |
| ------- | -------------- |
| default | 触发元素       |
| content | 自定义提示内容 |

---

## Loading 加载

指令式 `v-loading` 和服务式 `ZcLoadingService` 两种调用方式。

### 指令式

```vue
<template>
  <div v-loading="isLoading" style="height: 200px;">内容区域</div>
</template>

<script setup>
import { ref } from 'vue'
const isLoading = ref(true)
</script>
```

### 服务式

```ts
import { ZcLoadingService } from '@zc-ui/components'

const loading = ZcLoadingService.service({ text: '加载中...', lock: true })
// ...异步操作
loading.close()
```

### 指令参数

`v-loading` 可接受 `boolean` 或 `LoadingOptions` 对象：

| 参数       | 说明             | 类型   | 默认值     |
| ---------- | ---------------- | ------ | ---------- |
| text       | 加载文字         | string | ''         |
| size       | 旋转图标尺寸(px) | number | `32`       |
| background | 遮罩背景色       | string | 半透明白色 |
| color      | 旋转图标颜色     | string | —          |

### 服务 Options

| 参数       | 说明     | 类型    | 默认值  |
| ---------- | -------- | ------- | ------- |
| text       | 加载文字 | string  | ''      |
| size       | 尺寸     | number  | `32`    |
| background | 背景色   | string  | —       |
| color      | 颜色     | string  | —       |
| lock       | 锁定滚动 | boolean | `false` |

---

## Pagination 分页

数据分页导航，支持灵活的布局配置。

### 基础用法

```vue
<template>
  <ZcPagination
    v-model:current-page="currentPage"
    :total="100"
    :page-size="10"
    layout="total, prev, pager, next, jumper"
  />
</template>

<script setup>
import { ref } from 'vue'
const currentPage = ref(1)
</script>
```

### Props

| 参数                  | 说明               | 类型    | 默认值                               |
| --------------------- | ------------------ | ------- | ------------------------------------ |
| total                 | 总记录数           | number  | — (必填)                             |
| pageSize              | 每页条数           | number  | `10`                                 |
| currentPage (v-model) | 当前页             | number  | `1`                                  |
| layout                | 布局组件，逗号分隔 | string  | `'prev, pager, next, jumper, total'` |
| pagerCount            | 最大页码按钮数     | number  | `7`                                  |
| disabled              | 禁用               | boolean | `false`                              |

### Layout 组件

| 值       | 说明       |
| -------- | ---------- |
| `total`  | 总数显示   |
| `prev`   | 上一页按钮 |
| `pager`  | 页码列表   |
| `next`   | 下一页按钮 |
| `jumper` | 跳页输入框 |

### Events

| 事件               | 说明       | 回调参数           |
| ------------------ | ---------- | ------------------ |
| update:currentPage | 页码变化   | `(page: number)`   |
| change             | 页码变化   | `(page, pageSize)` |
| prev-click         | 点击上一页 | `(page: number)`   |
| next-click         | 点击下一页 | `(page: number)`   |

---

## Icon 图标

SVG 图标封装组件，通过路径数据或插槽渲染图标。

### 基础用法

```vue
<template>
  <!-- 通过 path/name 传入 SVG path data -->
  <ZcIcon :path="'M12 2L2 22h20L12 2z'" :size="24" color="#409eff" />

  <!-- 通过插槽自定义 -->
  <ZcIcon :size="20">
    <circle cx="12" cy="12" r="6" fill="currentColor" />
  </ZcIcon>
</template>
```

### Props

| 参数    | 说明                         | 类型             | 默认值        |
| ------- | ---------------------------- | ---------------- | ------------- |
| name    | SVG path data（等价于 path） | string           | ''            |
| path    | SVG path data（优先于 name） | string           | ''            |
| size    | 图标大小                     | number \| string | `16`          |
| color   | 图标颜色                     | string           | 继承          |
| viewBox | SVG viewBox                  | string           | `'0 0 24 24'` |
| label   | 无障碍标签                   | string           | ''            |

### Slots

| 插槽    | 说明                                 |
| ------- | ------------------------------------ |
| default | 自定义 SVG 内容（当无 path/name 时） |
