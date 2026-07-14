# Backtop 返回顶部

返回页面顶部的操作按钮，当页面滚动到一定高度时自动显示。

## 基础用法

滑动页面即可看到右下方的返回顶部按钮，默认在滚动超过 200px 时显示。

<DemoBlock>

```vue
<template>
  <ZcBacktop />
  <div style="height: 2000px; padding: 20px;">
    <p v-for="i in 20" :key="i" style="margin: 40px 0;">
      滚动页面查看返回顶部按钮（第 {{ i }} 段）
    </p>
  </div>
</template>
```

</DemoBlock>

## 自定义位置和内容

通过 `position` 设置按钮位置，使用默认插槽自定义按钮内容。

<DemoBlock>

```vue
<template>
  <ZcBacktop position="bottom-left" :right="80" :bottom="100">
    <span style="font-size: 12px;">顶部</span>
  </ZcBacktop>
  <div style="height: 2000px; padding: 20px;">
    <p v-for="i in 10" :key="i" style="margin: 80px 0;">自定义返回顶部按钮（第 {{ i }} 段）</p>
  </div>
</template>
```

</DemoBlock>

## 指定滚动容器

通过 `target` 指定需要监听滚动的容器。

<DemoBlock>

```vue
<template>
  <div
    ref="scrollContainer"
    style="height: 300px; overflow: auto; border: 1px solid #ddd; padding: 20px;"
  >
    <p v-for="i in 30" :key="i" style="margin: 20px 0;">容器内滚动内容（第 {{ i }} 段）</p>
  </div>
  <ZcBacktop target=".scroll-wrapper" :visibility-height="100" />
</template>
```

</DemoBlock>

## Backtop API

### Props

<ApiTable type="props" :data="[
{ name: 'target', description: '滚动目标元素选择器', type: 'string', default: `''（window）` },
{ name: 'visibilityHeight', description: '显示阈值（px）', type: 'number', default: '200' },
{ name: 'position', description: '按钮位置', type: `'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'`, default: `'bottom-right'` },
{ name: 'right', description: '右侧偏移（px）', type: 'number', default: '40' },
{ name: 'bottom', description: '底部偏移（px）', type: 'number', default: '40' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'click', description: '点击时', parameters: '(event: MouseEvent)' },
  { name: 'show', description: '按钮显示时', parameters: '—' },
  { name: 'hide', description: '按钮隐藏时', parameters: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义按钮内容（默认显示箭头图标）' },
]" />
