# Affix 固钉

将页面元素固定在可视范围内，常用于侧边栏或顶部导航栏的固定。

## 基础用法

当页面滚动到目标位置时，元素将固定在视口中。

<DemoBlock>

```vue
<template>
  <ZcAffix :offset="50">
    <ZcButton type="primary">固定在顶部 50px</ZcButton>
  </ZcAffix>
  <div style="height: 2000px; padding: 20px;">
    <p v-for="i in 20" :key="i" style="margin: 40px 0;">滚动页面查看固钉效果（第 {{ i }} 段）</p>
  </div>
</template>
```

</DemoBlock>

## 固定在底部

通过 `position="bottom"` 设置固定在页面底部。

<DemoBlock>

```vue
<template>
  <ZcAffix :offset="50" position="bottom">
    <ZcButton type="success">固定在底部 50px</ZcButton>
  </ZcAffix>
  <div style="height: 2000px; padding: 20px;">
    <p v-for="i in 20" :key="i" style="margin: 40px 0;">
      滚动页面查看底部固钉效果（第 {{ i }} 段）
    </p>
  </div>
</template>
```

</DemoBlock>

## 指定容器

通过 `target` 指定固钉作用的滚动容器。

<DemoBlock>

```vue
<template>
  <div
    style="height: 400px; overflow: auto; border: 1px solid #ddd; position: relative; padding: 20px;"
  >
    <ZcAffix :offset="0" target=".affix-container">
      <div style="background: #409eff; color: #fff; padding: 10px 20px; border-radius: 4px;">
        固定在容器顶部
      </div>
    </ZcAffix>
    <div style="height: 150px;"></div>
    <p>容器中的内容...</p>
    <p>更多内容...</p>
    <div style="height: 600px;"></div>
  </div>
</template>
```

</DemoBlock>

## Affix API

### Props

<ApiTable type="props" :data="[
{ name: 'offset', description: '偏移量（px）', type: 'number', default: '0' },
{ name: 'position', description: '固定位置', type: `'top' | 'bottom'`, default: `'top'` },
{ name: 'target', description: '容器元素选择器', type: 'string', default: `''` },
{ name: 'zIndex', description: '固定时的 z-index', type: 'number', default: '100' },
]" />

### Events

<ApiTable type="events" :data="[
  { name: 'change', description: '固定状态变化', parameters: '(fixed: boolean)' },
  { name: 'scroll', description: '滚动事件', parameters: '(scrollTop: number)' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '需要固定的内容' },
]" />
