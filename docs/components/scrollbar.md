# Scrollbar 滚动条

自定义滚动条样式组件，支持固定高度、最大高度、始终显示和原生回退模式。

## 基础用法

包裹内容即可获得自定义滚动条样式。

<DemoBlock>

```vue
<template>
  <ZcScrollbar height="200px">
    <div style="padding: 16px;">
      <p v-for="i in 20" :key="i">滚动内容第 {{ i }} 行</p>
    </div>
  </ZcScrollbar>
</template>
```

</DemoBlock>

## 最大高度

使用 `maxHeight` 属性设置内容最大高度，内容不足时不显示滚动条。

<DemoBlock>

```vue
<template>
  <ZcScrollbar max-height="200px">
    <div style="padding: 16px;">
      <p v-for="i in 15" :key="i">最大高度内容第 {{ i }} 行</p>
    </div>
  </ZcScrollbar>
</template>
```

</DemoBlock>

## 始终显示滚动条

默认滚动条在悬停时显示，通过 `always` 属性可以始终显示。

<DemoBlock>

```vue
<template>
  <ZcScrollbar height="150px" always>
    <div style="padding: 16px;">
      <p v-for="i in 10" :key="i">始终可见滚动条第 {{ i }} 行</p>
    </div>
  </ZcScrollbar>
</template>
```

</DemoBlock>

## 原生滚动条

通过 `native` 属性使用浏览器原生滚动条。

<DemoBlock>

```vue
<template>
  <ZcScrollbar height="150px" native>
    <div style="padding: 16px;">
      <p v-for="i in 10" :key="i">原生滚动条第 {{ i }} 行</p>
    </div>
  </ZcScrollbar>
</template>
```

</DemoBlock>

## Scrollbar API

### Props

<ApiTable type="props" :data="[
  { name: 'height', description: '固定高度（数字自动转 px）', type: 'string | number', default: '—' },
  { name: 'maxHeight', description: '最大高度（数字自动转 px）', type: 'string | number', default: '—' },
  { name: 'native', description: '使用浏览器原生滚动条', type: 'boolean', default: 'false' },
  { name: 'always', description: '始终显示滚动条', type: 'boolean', default: 'false' },
  { name: 'minSize', description: '滚动条最小尺寸（px）', type: 'number', default: '20' },
  { name: 'tag', description: '容器元素标签', type: 'string', default: '\'div\'' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '滚动区域内容' },
]" />
