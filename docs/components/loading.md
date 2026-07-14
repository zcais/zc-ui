# Loading 加载

用于页面或区块加载数据时的占位反馈，支持指令和函数式服务两种调用方式。

## 指令用法

通过 `v-loading` 指令绑定一个布尔值控制加载状态。

<DemoBlock>

```vue
<template>
  <div
    v-loading="isLoading"
    style="width: 300px; height: 150px; border: 1px solid #dcdfe6; border-radius: 4px; padding: 20px;"
  >
    <p v-if="!isLoading">内容加载完成</p>
  </div>
  <ZcButton @click="isLoading = !isLoading" style="margin-top: 12px;">
    {{ isLoading ? '停止加载' : '开始加载' }}
  </ZcButton>
</template>

<script setup>
import { ref } from 'vue'

const isLoading = ref(true)
</script>
```

</DemoBlock>

## 自定义文字

通过 `v-loading` 绑定配置对象，设置 `text` 属性显示加载文字。

<DemoBlock>

```vue
<template>
  <div
    v-loading="{ text: '加载中...' }"
    style="width: 300px; height: 150px; border: 1px solid #dcdfe6; border-radius: 4px;"
  ></div>
</template>
```

</DemoBlock>

## 全屏加载

设置 `fullscreen` 属性为 `true` 可启用全屏加载遮罩，配合 `lock` 锁定页面滚动。

<DemoBlock>

```vue
<template>
  <ZcButton type="primary" @click="showFullscreen">全屏加载（2秒）</ZcButton>
</template>

<script setup>
import { ref } from 'vue'
import { ZcLoadingService } from '@zc-ui/components'

const showFullscreen = () => {
  const instance = ZcLoadingService.service({ text: '加载中...', fullscreen: true, lock: true })
  setTimeout(() => instance.close(), 2000)
}
</script>
```

</DemoBlock>

## Loading API

### 指令

通过 `v-loading` 指令使用，支持布尔值或配置对象。

<ApiTable type="props" :data="[
  { name: 'v-loading', description: '加载状态控制，可传入布尔值或配置对象', type: 'boolean | LoadingOptions', default: 'false' },
  { name: 'text', description: '加载文字', type: 'string', default: '' },
  { name: 'size', description: '旋转图标尺寸（px）', type: 'number', default: '32' },
  { name: 'background', description: '遮罩层背景色', type: 'string', default: '' },
  { name: 'color', description: '旋转图标颜色', type: 'string', default: '' },
  { name: 'fullscreen', description: '是否全屏显示', type: 'boolean', default: 'false' },
  { name: 'lock', description: '是否锁定页面滚动', type: 'boolean', default: 'false' }
]" />

### 服务

通过 `ZcLoadingService.service()` 创建全屏加载实例。

<ApiTable type="events" :data="[
  { name: 'close', description: '调用返回实例的 close() 方法关闭加载', parameters: '—' }
]" />

### 导出

| 名称                              | 描述                                   |
| --------------------------------- | -------------------------------------- |
| `vLoading` / `ZcLoadingDirective` | `v-loading` 指令                       |
| `ZcLoadingService`                | 加载服务，提供 `service(options)` 方法 |

## 注意事项

- **SSR 兼容性**：Loading 指令和服务均依赖 DOM 操作，在 SSR 环境中需确保仅在客户端使用。
- **指令 vs 服务**：`v-loading` 指令适合局部加载场景（绑定到具体元素），`ZcLoadingService` 适合全局全屏加载。
- **滚动锁定**：服务式 Loading 支持 `lock` 选项锁定 body 滚动，关闭后自动恢复。
- **内存管理**：服务式 Loading 创建的实例在调用 `close()` 后会自动卸载和清理 DOM，但请确保在组件卸载前调用 `close()` 避免泄漏。
