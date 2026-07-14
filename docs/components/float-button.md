# FloatButton 悬浮按钮

固定在页面边缘的悬浮操作按钮，常用于承载页面级的高频操作（如返回顶部、客服、菜单等）。对标 Element Plus `el-float-button` 和 Ant Design Vue `a-float-button`。

> 💡 **本页 demo 说明**：组件默认 `position: fixed`，在文档页面中会飞出 demo 区域遮住其他章节。为避免这种情况，所有 demo 都用 `:deep` 把 `position` 在容器内覆盖为 `absolute` 或 `relative`（横排对比时），实际项目使用中按钮会按设计固定在视口。

## 基础用法

最基本的用法，默认在右下角显示一个圆形图标按钮。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo">
    <ZcFloatButton icon="➕" @click="onClick" />
  </div>
</template>

<script setup>
function onClick() {
  console.log('clicked')
}
</script>

<style scoped>
.float-button-demo {
  position: relative;
  min-height: 120px;
  padding: 16px;
}
.float-button-demo :deep(.zc-float-button) {
  position: absolute !important;
}
</style>
```

</DemoBlock>

## 形状与类型

通过 `shape` 设置形状（`circle` 圆形 / `square` 方形），通过 `type` 设置主题色。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <ZcFloatButton type="primary" icon="+" />
    <ZcFloatButton type="success" shape="square" icon="✓" />
    <ZcFloatButton type="warning" icon="!" />
    <ZcFloatButton type="danger" icon="×" />
    <ZcFloatButton type="default" shape="square" icon="?" />
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 尺寸

通过 `size` 设置按钮尺寸，支持 `default`（48px）、`small`（36px）、`large`（56px）。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <ZcFloatButton size="small" icon="+" type="primary" />
    <ZcFloatButton size="default" icon="+" type="primary" />
    <ZcFloatButton size="large" icon="+" type="primary" />
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 悬停提示

通过 `tooltip` 属性为按钮添加悬停提示，提示位置默认为左侧。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <ZcFloatButton icon="💬" tooltip="联系客服" type="primary" />
    <ZcFloatButton icon="🛒" tooltip="购物车" type="warning" />
    <ZcFloatButton icon="📞" tooltip="联系我们" type="success" />
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 自定义图标与内容

通过 `icon` 属性传入图标 class，或使用 `icon` 插槽插入任意自定义内容。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <!-- 使用 iconfont class -->
    <ZcFloatButton icon="el-icon-edit" type="primary" />

    <!-- 使用 SVG 插槽 -->
    <ZcFloatButton type="success">
      <template #icon>
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </template>
    </ZcFloatButton>

    <!-- 使用默认插槽插入文本 -->
    <ZcFloatButton type="warning">
      <span style="font-weight: 600; font-size: 14px;">客服</span>
    </ZcFloatButton>
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 回到顶部

通过 `back-to-top` 启用回到顶部模式，组件会监听滚动事件并在滚动距离超过 `visibilityHeight` 时显示。本 demo 监听下方可滚动容器（通过 `target` 指定）。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--btt">
    <p v-for="i in 20" :key="i" class="float-button-demo__line">
      滚动此容器查看右下角返回顶部按钮（第 {{ i }} 段）
    </p>
    <ZcFloatButton
      back-to-top
      :target="'.float-button-demo--btt'"
      type="primary"
      icon="↑"
      :visibility-height="200"
      @click="onBackToTop"
    />
  </div>
</template>

<script setup>
function onBackToTop() {
  console.log('back to top')
}
</script>

<style scoped>
.float-button-demo--btt {
  position: relative;
  height: 300px;
  overflow: auto;
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: 4px;
  padding: 16px;
}
.float-button-demo--btt :deep(.zc-float-button) {
  position: absolute !important;
}
.float-button-demo__line {
  margin: 24px 0;
}
</style>
```

</DemoBlock>

## 徽标

通过 `badge` / `badge-dot` 属性为按钮添加数字徽标或小红点。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <ZcFloatButton icon="💬" :badge="12" type="primary" tooltip="消息中心" />
    <ZcFloatButton icon="🔔" :badge="99" type="warning" tooltip="通知" />
    <ZcFloatButton icon="📧" :badge="150" :badge-max="99" type="danger" tooltip="邮件" />
    <ZcFloatButton icon="📌" badge-dot tooltip="新功能" />
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 位置

通过 `position` 属性设置按钮的默认位置，可使用 `right` / `bottom` / `left` / `top` 调整偏移量。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--corners">
    <ZcFloatButton position="top-right" :right="20" :top="20" icon="↗" type="primary" />
    <ZcFloatButton position="bottom-left" :left="20" :bottom="20" icon="↙" type="success" />
    <ZcFloatButton position="top-left" :left="20" :top="20" icon="↖" type="warning" />
    <ZcFloatButton position="bottom-right" :right="20" :bottom="20" icon="↘" type="danger" />
  </div>
</template>

<style scoped>
.float-button-demo--corners {
  position: relative;
  height: 240px;
  padding: 16px;
}
.float-button-demo--corners :deep(.zc-float-button) {
  position: absolute !important;
}
</style>
```

</DemoBlock>

## 悬浮按钮组

使用 `ZcFloatButtonGroup` 将多个悬浮按钮组合在一起，支持可折叠展开。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--group">
    <ZcFloatButtonGroup type="primary">
      <ZcFloatButton icon="↻" tooltip="刷新" @click="onRefresh" />
      <ZcFloatButton icon="⬆" tooltip="上传" @click="onUpload" />
      <ZcFloatButton icon="★" tooltip="收藏" @click="onFavorite" />
    </ZcFloatButtonGroup>
  </div>
</template>

<script setup>
function onRefresh() {
  console.log('refresh')
}
function onUpload() {
  console.log('upload')
}
function onFavorite() {
  console.log('favorite')
}
</script>

<style scoped>
.float-button-demo--group {
  position: relative;
  height: 240px;
  padding: 16px;
}
.float-button-demo--group :deep(.zc-float-button-group),
.float-button-demo--group :deep(.zc-float-button) {
  position: absolute !important;
}
</style>
```

</DemoBlock>

### 可折叠按钮组

通过 `collapsible` 启用折叠模式，配合 `trigger="hover"` 或 `trigger="click"` 控制展开方式。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--group">
    <ZcFloatButtonGroup type="primary" collapsible trigger="hover" position="bottom-left">
      <ZcFloatButton icon="💬" tooltip="消息" />
      <ZcFloatButton icon="📞" tooltip="电话" />
      <ZcFloatButton icon="✉" tooltip="邮件" />
    </ZcFloatButtonGroup>
  </div>
</template>

<style scoped>
.float-button-demo--group {
  position: relative;
  height: 240px;
  padding: 16px;
}
.float-button-demo--group :deep(.zc-float-button-group),
.float-button-demo--group :deep(.zc-float-button) {
  position: absolute !important;
}
</style>
```

</DemoBlock>

## 禁用状态

通过 `disabled` 禁用按钮交互。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--row">
    <ZcFloatButton icon="🚫" disabled tooltip="已禁用" type="primary" />
    <ZcFloatButton icon="🔒" :disabled="true" type="warning" />
  </div>
</template>

<style scoped>
.float-button-demo--row {
  position: relative;
  min-height: 80px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}
.float-button-demo--row :deep(.zc-float-button) {
  position: relative !important;
}
</style>
```

</DemoBlock>

## 自定义容器滚动

通过 `target` 属性指定滚动容器，配合 `back-to-top` 使用。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo float-button-demo--custom-scroll">
    <p v-for="i in 30" :key="i" class="float-button-demo__line">容器内滚动内容（第 {{ i }} 段）</p>
    <ZcFloatButton
      back-to-top
      :target="'.float-button-demo--custom-scroll'"
      :visibility-height="100"
      type="primary"
      icon="↑"
    />
  </div>
</template>

<style scoped>
.float-button-demo--custom-scroll {
  position: relative;
  height: 300px;
  overflow: auto;
  border: 1px solid var(--color-zc-border-light, #e4e7ed);
  border-radius: 4px;
  padding: 16px;
}
.float-button-demo--custom-scroll :deep(.zc-float-button) {
  position: absolute !important;
}
.float-button-demo__line {
  margin: 20px 0;
}
</style>
```

</DemoBlock>

## CSS 变量自定义

通过覆盖组件内部的 CSS 变量来定制按钮外观。

<DemoBlock>

```vue
<template>
  <div class="float-button-demo">
    <ZcFloatButton icon="🎨" tooltip="自定义样式" :style="customStyle" />
  </div>
</template>

<script setup>
const customStyle = {
  '--zc-float-button-bg-color': '#67c23a',
  '--zc-float-button-text-color': '#fff',
  '--zc-float-button-hover-bg-color': '#85ce61',
  '--zc-float-button-border-radius': '12px',
}
</script>

<style scoped>
.float-button-demo {
  position: relative;
  min-height: 120px;
  padding: 16px;
}
.float-button-demo :deep(.zc-float-button) {
  position: absolute !important;
}
</style>
```

</DemoBlock>

## FloatButton API

### Props

<ApiTable type="props" :data="[
  { name: 'shape', description: '按钮形状', type: `'circle' | 'square'`, default: `'circle'` },
  { name: 'type', description: '按钮类型', type: `'primary' | 'default' | 'success' | 'warning' | 'danger'`, default: `'default'` },
  { name: 'size', description: '按钮尺寸', type: `'default' | 'small' | 'large'`, default: `'default'` },
  { name: 'icon', description: '图标 class（如 iconfont 类名）', type: 'string', default: `''` },
  { name: 'tooltip', description: '悬停提示文本', type: 'string', default: `''` },
  { name: 'position', description: '按钮位置', type: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`, default: `'bottom-right'` },
  { name: 'right', description: '距右侧偏移 (px)', type: 'number', default: '40' },
  { name: 'bottom', description: '距底部偏移 (px)', type: 'number', default: '40' },
  { name: 'left', description: '距左侧偏移 (px)', type: 'number', default: '40' },
  { name: 'top', description: '距顶部偏移 (px)', type: 'number', default: '40' },
  { name: 'badge', description: '徽标值（数字或文本）', type: 'string | number', default: `''` },
  { name: 'badgeMax', description: '徽标最大值', type: 'number', default: '99' },
  { name: 'badgeDot', description: '是否显示为红点', type: 'boolean', default: 'false' },
  { name: 'disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'backToTop', description: '是否为回到顶部按钮（自动监听滚动）', type: 'boolean', default: 'false' },
  { name: 'visibilityHeight', description: '显示阈值（px，仅在 backToTop 模式下生效）', type: 'number', default: '200' },
  { name: 'target', description: '滚动目标选择器', type: 'string', default: `''（window）` },
  { name: 'zIndex', description: '自定义 z-index', type: 'number', default: '999' },
  { name: 'ariaLabel', description: '无障碍标签', type: 'string', default: `''（自动从 tooltip/backToTop 推断）` },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'click', description: '点击时触发', parameters: '(event: MouseEvent)' },
  { name: 'show', description: 'back-to-top 按钮变为可见时触发', parameters: '—' },
  { name: 'hide', description: 'back-to-top 按钮变为隐藏时触发', parameters: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'icon', description: '自定义图标内容（当 icon prop 为空时生效）' },
  { name: 'default', description: '自定义按钮内容（替换默认图标）' },
]" />

## FloatButtonGroup API

### Props

<ApiTable type="props" :data="[
  { name: 'shape', description: '组内按钮形状', type: `'circle' | 'square'`, default: `'circle'` },
  { name: 'type', description: '组内按钮类型', type: `'primary' | 'default' | 'success' | 'warning' | 'danger'`, default: `'default'` },
  { name: 'collapsible', description: '是否可折叠', type: 'boolean', default: 'false' },
  { name: 'trigger', description: '折叠触发方式', type: `'hover' | 'click'`, default: `'hover'` },
  { name: 'position', description: '组位置', type: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`, default: `'bottom-right'` },
  { name: 'right', description: '距右侧偏移 (px)', type: 'number', default: '40' },
  { name: 'bottom', description: '距底部偏移 (px)', type: 'number', default: '40' },
  { name: 'left', description: '距左侧偏移 (px)', type: 'number', default: '40' },
  { name: 'top', description: '距顶部偏移 (px)', type: 'number', default: '40' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '组内的 ZcFloatButton 按钮' },
]" />

## CSS 变量

| 变量名                                   | 说明             | 默认值                         |
| ---------------------------------------- | ---------------- | ------------------------------ |
| `--zc-float-button-bg-color`             | 背景色           | `var(--color-zc-white)`        |
| `--zc-float-button-text-color`           | 文字/图标色      | `var(--color-zc-text-regular)` |
| `--zc-float-button-border-color`         | 边框色           | `var(--color-zc-border-light)` |
| `--zc-float-button-hover-bg-color`       | 悬停背景色       | `var(--color-zc-fill-light)`   |
| `--zc-float-button-hover-text-color`     | 悬停文字色       | `var(--color-zc-primary-500)`  |
| `--zc-float-button-hover-border-color`   | 悬停边框色       | `var(--color-zc-primary-300)`  |
| `--zc-float-button-active-bg-color`      | 按下背景色       | `var(--color-zc-fill-light)`   |
| `--zc-float-button-box-shadow`           | 默认阴影         | `var(--shadow-zc-md)`          |
| `--zc-float-button-hover-box-shadow`     | 悬停阴影         | `var(--shadow-zc-lg)`          |
| `--zc-float-button-border-radius`        | 圆角（圆形模式） | `var(--radius-zc-circle)`      |
| `--zc-float-button-border-radius-square` | 圆角（方形模式） | `var(--radius-zc-base)`        |
| `--zc-float-button-size`                 | 默认尺寸         | `48px`                         |
| `--zc-float-button-size-small`           | 小尺寸           | `36px`                         |
| `--zc-float-button-size-large`           | 大尺寸           | `56px`                         |
| `--zc-float-button-font-size`            | 图标大小         | `20px`                         |

## 暗色模式

组件内置了暗色模式适配，当文档包含 `.zc-dark` 类或 `[data-theme="dark"]` 属性时，会自动切换配色。

```html
<!-- 启用暗色模式 -->
<html class="zc-dark">
  <ZcFloatButton icon="🌙" type="primary" />
</html>
```
