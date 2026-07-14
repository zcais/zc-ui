# ConfigProvider 全局配置

ConfigProvider 用于为组件树提供全局配置，通过 Vue 的 provide/inject 机制将配置注入到所有子组件中。

支持配置：组件默认尺寸、国际化语言、z-index 起始值、命名空间前缀、以及 Message / Notification / Button 的默认行为。

## 基础用法

通过 `size` 属性设置所有子组件的默认尺寸。

<DemoBlock>

```vue
<template>
  <ZcConfigProvider size="small">
    <div style="display: flex; gap: 12px; align-items: center">
      <ZcButton type="primary">Small 按钮</ZcButton>
      <ZcInput placeholder="Small 输入框" style="width: 200px" />
    </div>
  </ZcConfigProvider>

  <ZcConfigProvider size="large">
    <div style="display: flex; gap: 12px; align-items: center; margin-top: 16px">
      <ZcButton type="primary">Large 按钮</ZcButton>
      <ZcInput placeholder="Large 输入框" style="width: 200px" />
    </div>
  </ZcConfigProvider>
</template>
```

</DemoBlock>

## 尺寸切换

使用 `size` 控制全部子组件的尺寸，支持 `large`、`medium`、`small`、`mini` 四种。

<DemoBlock>

```vue
<template>
  <div>
    <ZcSegmented v-model="size" :options="sizeOptions" style="margin-bottom: 16px" />
    <ZcConfigProvider :size="size">
      <div style="display: flex; gap: 12px; align-items: center">
        <ZcButton type="primary">按钮</ZcButton>
        <ZcInput placeholder="输入框" style="width: 200px" />
        <ZcSwitch />
      </div>
    </ZcConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const size = ref('medium')
const sizeOptions = [
  { label: 'Large', value: 'large' },
  { label: 'Medium', value: 'medium' },
  { label: 'Small', value: 'small' },
  { label: 'Mini', value: 'mini' },
]
</script>
```

</DemoBlock>

## 国际化语言切换

通过 `locale` 属性切换全局语言。

<DemoBlock>

```vue
<template>
  <div>
    <ZcSegmented v-model="lang" :options="langOptions" style="margin-bottom: 16px" />
    <ZcConfigProvider :locale="lang">
      <div style="display: flex; gap: 16px; flex-wrap: wrap">
        <ZcEmpty />
        <ZcPagination :total="50" />
      </div>
    </ZcConfigProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const lang = ref('zh-CN')
const langOptions = [
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' },
]
</script>
```

</DemoBlock>

## Z-Index 配置

设置弹层组件的 z-index 基础值。

<DemoBlock>

```vue
<template>
  <ZcConfigProvider :z-index="5000">
    <div>
      <p>此区域内的弹层 z-index 从 5000 开始递增。</p>
      <ZcTooltip content="z-index 已被 ConfigProvider 调整">
        <ZcButton>Hover Me</ZcButton>
      </ZcTooltip>
    </div>
  </ZcConfigProvider>
</template>
```

</DemoBlock>

## 命名空间隔离

通过 `namespace` 属性实现多主题区域的 CSS 类名前缀隔离（需要配合自定义主题样式使用）。

<DemoBlock>

```vue
<template>
  <div style="display: flex; gap: 24px">
    <ZcConfigProvider namespace="zc" as="section">
      <ZcCard style="width: 200px">
        <p>默认命名空间：zc</p>
        <ZcButton type="primary">Primary</ZcButton>
      </ZcCard>
    </ZcConfigProvider>
  </div>
</template>
```

</DemoBlock>

## 组件级主题覆写

通过 `brandColors` 设置品牌色，通过 `themeOverrides` 按组件粒度覆盖 CSS 变量。

<DemoBlock>

```vue
<template>
  <ZcConfigProvider
    :brand-colors="{ primary: '#722ed1' }"
    :theme-overrides="{
      Button: {
        '--zc-button-border-radius': '20px',
      },
    }"
  >
    <div style="display: flex; gap: 12px; align-items: center">
      <ZcButton type="primary">紫色品牌色</ZcButton>
      <ZcButton type="primary" plain>圆角覆写</ZcButton>
      <ZcTag type="primary">标签</ZcTag>
    </div>
  </ZcConfigProvider>
</template>
```

</DemoBlock>

## 嵌套使用

ConfigProvider 支持嵌套，内层会继承外层未指定的配置，同时覆盖已指定的配置。

<DemoBlock>

```vue
<template>
  <ZcConfigProvider size="large" locale="zh-CN">
    <div>
      <p>外层：large + zh-CN</p>
      <ZcButton type="primary">外层按钮</ZcButton>

      <ZcConfigProvider size="small">
        <div style="margin-top: 16px">
          <p>内层：small（继承 zh-CN）</p>
          <ZcButton type="success">内层按钮</ZcButton>
        </div>
      </ZcConfigProvider>
    </div>
  </ZcConfigProvider>
</template>
```

</DemoBlock>

## 消息 / 通知默认配置

通过 `message` 和 `notification` 属性预设消息提示和通知的默认行为。

<DemoBlock>

```vue
<template>
  <ZcConfigProvider :message="{ duration: 5000 }" :notification="{ position: 'bottom-right' }">
    <div>
      <p>此区域内的 Message 默认 5 秒后关闭</p>
      <ZcButton type="primary" @click="showMessage">显示 Message</ZcButton>
    </div>
  </ZcConfigProvider>
</template>

<script setup lang="ts">
import { ZcMessage } from '@zc-ui/components'

function showMessage() {
  ZcMessage.success('这是一条消息提示（默认 5 秒关闭）')
}
</script>
```

</DemoBlock>

## 在代码中读取配置

使用 `useGlobalConfig()` 组合式函数在任意子组件中读取注入的全局配置。

```vue
<script setup lang="ts">
import { useGlobalConfig } from '@zc-ui/components'

const { size, locale, zIndex } = useGlobalConfig()

// size.value → 'small'
// locale.value → 'zh-CN'
// zIndex.value → 5000
</script>
```

## ConfigProvider API

### Props

<ApiTable type="props" :data="[
  { name: 'size', description: '全局组件尺寸', type: '\'large\' | \'medium\' | \'small\' | \'mini\'', default: '—' },
  { name: 'locale', description: '国际化语言代码', type: 'string', default: '—' },
  { name: 'zIndex', description: '弹层 z-index 起始值', type: 'number', default: '—' },
  { name: 'namespace', description: 'CSS 类名命名空间前缀', type: 'string', default: '\'zc\'' },
  { name: 'brandColors', description: '品牌色覆盖（自动生成完整色阶）', type: 'Record<string, string>', default: '—' },
  { name: 'themeVariables', description: '全局 CSS 变量覆盖', type: 'ThemeVariables', default: '—' },
  { name: 'themeOverrides', description: '组件级 CSS 变量覆写', type: 'ComponentThemeOverrides', default: '—' },
  { name: 'button', description: '按钮默认配置', type: 'ButtonConfig', default: '—' },
  { name: 'message', description: '消息提示默认配置', type: 'MessageConfig', default: '—' },
  { name: 'notification', description: '通知默认配置', type: 'NotificationConfig', default: '—' },
  { name: 'as', description: '渲染为的 HTML 标签（不设置则为无渲染模式）', type: 'string', default: '—' },
]" />

### ButtonConfig

<ApiTable type="props" :data="[
  { name: 'autoInsertSpace', description: '是否在两个中文字符之间自动插入空格', type: 'boolean', default: '—' },
]" />

### MessageConfig

<ApiTable type="props" :data="[
  { name: 'max', description: '同时显示的最大数量', type: 'number', default: '—' },
  { name: 'duration', description: '默认关闭时间（毫秒）', type: 'number', default: '—' },
  { name: 'showClose', description: '是否显示关闭按钮', type: 'boolean', default: '—' },
]" />

### NotificationConfig

<ApiTable type="props" :data="[
  { name: 'max', description: '同时显示的最大数量', type: 'number', default: '—' },
  { name: 'duration', description: '默认关闭时间（毫秒）', type: 'number', default: '—' },
  { name: 'position', description: '默认显示位置', type: '\'top-right\' | \'top-left\' | \'bottom-right\' | \'bottom-left\'', default: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '需要应用全局配置的子组件内容' },
]" />

### Composable: useGlobalConfig

```ts
function useGlobalConfig(): ConfigProviderContext
```

返回响应式的全局配置上下文，包含 `size`、`locale`、`zIndex`、`namespace`、`button`、`message`、`notification` 等计算属性。
