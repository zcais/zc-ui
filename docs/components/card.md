# Card 卡片

信息容器组件，支持标题、操作区插槽、阴影模式和自定义内容样式。

## 基础用法

通过 `header` 属性或 `header` 插槽设置卡片标题。

<DemoBlock>

```vue
<template>
  <ZcCard header="卡片标题">
    <p>这是卡片的内容区域。可以放置任何内容。</p>
  </ZcCard>
</template>
```

</DemoBlock>

## 阴影模式

通过 `shadow` 属性控制阴影显示：`always`（默认）、`hover`（悬停时显示）、`never`（无阴影）。

<DemoBlock>

```vue
<template>
  <ZcSpace>
    <ZcCard shadow="always" style="width: 200px;">
      <p>Always 阴影</p>
    </ZcCard>
    <ZcCard shadow="hover" style="width: 200px;">
      <p>Hover 阴影</p>
    </ZcCard>
    <ZcCard shadow="never" style="width: 200px;">
      <p>Never 无阴影</p>
    </ZcCard>
  </ZcSpace>
</template>
```

</DemoBlock>

## 自定义 Header 和 Footer

使用 `header` 和 `footer` 插槽自定义卡片头尾内容。

<DemoBlock>

```vue
<template>
  <ZcCard>
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>自定义标题</span>
        <ZcButton size="small" type="primary">操作按钮</ZcButton>
      </div>
    </template>
    <p>卡片正文内容</p>
    <template #footer>
      <span>卡片底部</span>
    </template>
  </ZcCard>
</template>
```

</DemoBlock>

## 自定义 Body 样式

通过 `bodyStyle` 和 `bodyClass` 自定义内容区样式。

<DemoBlock>

```vue
<template>
  <ZcCard header="内边距调整" body-style="padding: 30px;">
    <p>这个卡片的内容区域有自定义内边距。</p>
  </ZcCard>
</template>
```

</DemoBlock>

## Card API

### Props

<ApiTable type="props" :data="[
  { name: 'header', description: '卡片标题文本', type: 'string', default: '—' },
  { name: 'shadow', description: '阴影显示模式', type: '\'always\' | \'hover\' | \'never\'', default: '\'always\'' },
  { name: 'bodyStyle', description: '内容区自定义样式', type: 'string | Record<string, string>', default: '—' },
  { name: 'bodyClass', description: '内容区自定义类名', type: 'string', default: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '卡片正文内容' },
  { name: 'header', description: '卡片标题（覆盖 header 属性）' },
  { name: 'footer', description: '卡片底部内容' },
]" />
