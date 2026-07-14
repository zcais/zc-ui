# QRCode 二维码

二维码生成组件，支持 Canvas / SVG / Image 三种渲染方式，可自定义颜色、容错等级、嵌入 Logo 等。

## 基础用法

通过 `value` 属性设置二维码内容。

<DemoBlock>

```vue
<template>
  <ZcQRCode value="https://github.com/zhichang2022/zc-ui" />
</template>
```

</DemoBlock>

## 自定义尺寸

通过 `size` 属性设置二维码尺寸（像素）。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px; align-items: center;">
    <ZcQRCode value="https://example.com" :size="100" />
    <ZcQRCode value="https://example.com" :size="160" />
    <ZcQRCode value="https://example.com" :size="240" />
  </div>
</template>
```

</DemoBlock>

## 渲染方式

支持 `canvas`（默认）、`svg`、`image` 三种渲染方式。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <div style="text-align: center;">
      <ZcQRCode value="canvas-mode" type="canvas" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">Canvas</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="svg-mode" type="svg" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">SVG</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="image-mode" type="image" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">Image</p>
    </div>
  </div>
</template>
```

</DemoBlock>

## 自定义颜色

通过 `color` 和 `background` 属性自定义前景色和背景色。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <ZcQRCode value="https://example.com" color="#3c6ee0" />
    <ZcQRCode value="https://example.com" color="#52c41a" background="#f6ffed" />
    <ZcQRCode value="https://example.com" color="#ffffff" background="#722ed1" />
  </div>
</template>
```

</DemoBlock>

## 容错等级

通过 `level` 属性设置容错等级：`L`（~7%）、`M`（~15%，默认）、`Q`（~25%）、`H`（~30%）。容错率越高，二维码越复杂但抗损坏能力越强。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" level="L" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">L (~7%)</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" level="M" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">M (~15%)</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" level="Q" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">Q (~25%)</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" level="H" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">H (~30%)</p>
    </div>
  </div>
</template>
```

</DemoBlock>

## 边距配置

通过 `includeMargin` 属性控制是否包含静区边距。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" :include-margin="false" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">无边距</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" :include-margin="true" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">有边距</p>
    </div>
  </div>
</template>
```

</DemoBlock>

## 嵌入图标

通过 `image` 属性在二维码中心嵌入 Logo，或使用 `imageSettings` 精细控制。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px;">
    <ZcQRCode
      value="https://example.com"
      level="H"
      image="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzNjNmVlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPlpDPC90ZXh0Pjwvc3ZnPg=="
      :size="160"
    />
    <ZcQRCode
      value="https://example.com"
      level="H"
      type="svg"
      :image-settings="{
        src: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MCA0MCI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzUyYzQxYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9ImJvbGQiPk9LPC90ZXh0Pjwvc3ZnPg==',
        width: 48,
        height: 48,
      }"
      :size="160"
    />
  </div>
</template>
```

</DemoBlock>

:::tip
嵌入 Logo 时建议使用 `level="H"` 容错等级，以确保即使 Logo 遮挡部分二维码模块，仍可正常扫描。
:::

## 状态展示

通过 `status` 属性设置二维码状态：`active`（默认）、`loading`、`expired`、`scanning`。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px; flex-wrap: wrap;">
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" status="active" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">active</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" status="loading" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">loading</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" status="expired" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">expired</p>
    </div>
    <div style="text-align: center;">
      <ZcQRCode value="https://example.com" status="scanning" />
      <p style="margin-top: 8px; font-size: 12px; color: #909399;">scanning</p>
    </div>
  </div>
</template>
```

</DemoBlock>

## 自定义状态插槽

每种状态都提供同名插槽用于自定义内容。

<DemoBlock>

```vue
<template>
  <ZcQRCode value="https://example.com" status="expired" :size="200">
    <template #expired>
      <div style="display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 32px;">⚠️</span>
        <ZcButton type="primary" size="small">点击刷新</ZcButton>
      </div>
    </template>
  </ZcQRCode>
</template>
```

</DemoBlock>

## 手动刷新

通过 `ref` 调用 `refresh()` 方法重新生成二维码。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const qrRef = ref()
const text = ref('https://example.com/page/1')

function handleRefresh() {
  qrRef.value?.refresh()
}

function handleChange() {
  text.value = 'https://example.com/page/' + Math.floor(Math.random() * 1000)
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
    <ZcQRCode ref="qrRef" :value="text" />
    <div style="display: flex; gap: 8px;">
      <ZcButton size="small" @click="handleChange">修改内容</ZcButton>
      <ZcButton size="small" @click="handleRefresh">刷新二维码</ZcButton>
    </div>
  </div>
</template>
```

</DemoBlock>

## 自动刷新

通过 `refreshInterval` 属性设置自动刷新间隔（毫秒）。

<DemoBlock>

```vue
<script setup>
import { ref } from 'vue'

const token = ref(generateToken())

function generateToken() {
  return 'token-' + Date.now() + '-' + Math.floor(Math.random() * 10000)
}

function handleRefresh() {
  console.log('QR code refreshed')
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px; align-items: flex-start;">
    <ZcQRCode :value="token" :refresh-interval="5000" @refresh="handleRefresh" />
    <span style="font-size: 12px; color: #909399;">每 5 秒自动刷新</span>
  </div>
</template>
```

</DemoBlock>

## QRCode API

### Props

<ApiTable type="props" :data="[
  { name: 'value', description: '二维码内容', type: 'string', default: '—（必填）' },
  { name: 'size', description: '二维码尺寸（像素）', type: 'number', default: '160' },
  { name: 'type', description: '渲染方式', type: 'canvas | svg | image', default: 'canvas' },
  { name: 'color', description: '前景色', type: 'string', default: '#000000' },
  { name: 'background', description: '背景色', type: 'string', default: '#ffffff' },
  { name: 'level', description: '容错等级', type: 'L | M | Q | H', default: 'M' },
  { name: 'includeMargin', description: '是否包含静区边距', type: 'boolean', default: 'false' },
  { name: 'image', description: '嵌入 Logo 的 URL', type: 'string', default: '—' },
  { name: 'imageSettings', description: '嵌入 Logo 的详细配置（覆盖 image）', type: 'QRCodeImageSettings', default: '—' },
  { name: 'status', description: '二维码状态', type: 'active | expired | loading | scanning', default: 'active' },
  { name: 'refreshInterval', description: '自动刷新间隔（毫秒）', type: 'number', default: '—' },
]" />

### QRCodeImageSettings

| 属性       | 说明                          | 类型    | 默认值 |
| ---------- | ----------------------------- | ------- | ------ |
| src        | 图片 URL                      | string  | —      |
| width      | 图片宽度                      | number  | —      |
| height     | 图片高度                      | number  | —      |

### Events

<ApiTable type="events" :data="[
  { name: 'ready', description: '二维码生成成功时触发', params: '—' },
  { name: 'error', description: '二维码生成失败时触发', params: 'err: Error' },
  { name: 'refresh', description: '调用 refresh() 时触发', params: '—' },
]" />

### Methods (via ref)

<ApiTable type="methods" :data="[
  { name: 'refresh()', description: '手动重新生成二维码', params: '—' },
  { name: 'toDataURL()', description: '获取当前二维码的 Data URL', params: '— → Promise<string>' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'loading', description: '自定义 loading 状态展示' },
  { name: 'expired', description: '自定义过期状态展示' },
  { name: 'scanning', description: '自定义扫描状态展示' },
]" />
