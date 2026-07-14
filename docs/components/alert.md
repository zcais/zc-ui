# Alert 警告

用于页面中的警告、通知、提示信息展示。

## 基础用法

通过 `type` 属性设置不同的警告类型。

<DemoBlock>

```vue
<template>
  <ZcAlert type="success" title="成功提示" />
  <ZcAlert type="warning" title="警告提示" />
  <ZcAlert type="info" title="信息提示" />
  <ZcAlert type="error" title="错误提示" />
</template>
```

</DemoBlock>

## 带描述的警告

通过 `description` 属性添加辅助文字说明。

<DemoBlock>

```vue
<template>
  <ZcAlert type="success" title="成功提示" description="恭喜你，你的操作已成功完成。" show-icon />
  <ZcAlert
    type="warning"
    title="警告提示"
    description="请注意，此操作可能会产生不可逆的影响。"
    show-icon
  />
</template>
```

</DemoBlock>

## 主题与居中

使用 `effect` 属性切换主题，`center` 属性居中内容。

<DemoBlock>

```vue
<template>
  <ZcAlert type="success" title="成功提示" effect="dark" show-icon />
  <ZcAlert type="info" title="信息提示" effect="dark" show-icon />
  <ZcAlert type="warning" title="居中提示" center show-icon />
</template>
```

</DemoBlock>

## 自定义关闭按钮

通过 `close-text` 自定义关闭按钮文字，或通过 `closable` 控制是否可关闭。

<DemoBlock>

```vue
<template>
  <ZcAlert type="info" title="不可关闭" :closable="false" />
  <ZcAlert type="success" title="自定义关闭文字" close-text="知道了" />
</template>
```

</DemoBlock>

## Alert API

### Props

<ApiTable type="props" :data="[
{ name: 'type', description: 'Alert 类型', type: `'success' | 'warning' | 'info' | 'error'`, default: `'info'` },
{ name: 'title', description: '标题', type: 'string', default: `''` },
{ name: 'description', description: '辅助文字', type: 'string', default: `''` },
{ name: 'showIcon', description: '是否显示图标', type: 'boolean', default: 'false' },
{ name: 'center', description: '是否居中', type: 'boolean', default: 'false' },
{ name: 'closable', description: '是否可关闭', type: 'boolean', default: 'true' },
{ name: 'closeText', description: '关闭按钮文字', type: 'string', default: `''` },
{ name: 'effect', description: '主题样式', type: `'light' | 'dark'`, default: `'light'` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'close', description: '关闭 Alert 时触发', parameters: '(event: MouseEvent)' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义内容' }
]" />
