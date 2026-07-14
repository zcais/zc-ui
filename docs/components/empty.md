# Empty 空状态

当数据为空时显示的占位提示组件。

## 基础用法

默认显示插画和 "暂无数据" 提示文字。

<DemoBlock>

```vue
<template>
  <ZcEmpty />
</template>
```

</DemoBlock>

## 自定义描述

通过 `description` 属性自定义提示文字。

<DemoBlock>

```vue
<template>
  <ZcEmpty description="暂无搜索结果" />
  <ZcEmpty description="暂无待办事项" />
</template>
```

</DemoBlock>

## 自定义图片

通过 `image` 属性传入图片地址，或使用 `image` 插槽自定义内容。

<DemoBlock>

```vue
<template>
  <ZcEmpty description="购物车是空的">
    <template #image>
      <svg viewBox="0 0 120 120" width="120" height="120" fill="none">
        <circle cx="60" cy="60" r="50" fill="#ecf5ff" />
        <path d="M40 50h40l-6 30H46l-6-30z" fill="#c6e2ff" />
        <circle cx="48" cy="82" r="4" fill="#409eff" />
        <circle cx="72" cy="82" r="4" fill="#409eff" />
      </svg>
    </template>
  </ZcEmpty>
</template>
```

</DemoBlock>

## 带操作按钮

默认插槽可用于放置操作按钮。

<DemoBlock>

```vue
<template>
  <ZcEmpty description="暂无数据，点击刷新试试">
    <button
      style="padding: 6px 16px; background: #409eff; color: #fff; border: none; border-radius: 4px; cursor: pointer;"
    >
      刷新
    </button>
  </ZcEmpty>
</template>
```

</DemoBlock>

## Empty API

### Props

<ApiTable type="props" :data="[
  { name: 'description', description: '空状态描述文字', type: 'string', default: '暂无数据' },
  { name: 'image', description: '自定义图片地址', type: 'string', default: '' },
  { name: 'imageSize', description: '图片尺寸（px），0 表示不限制', type: 'number', default: '0' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '底部额外内容（如操作按钮）' },
  { name: 'image', description: '自定义图片或插画内容' },
  { name: 'description', description: '自定义描述内容' }
]" />
