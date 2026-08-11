# Card 卡片

信息容器组件，支持标题、操作区插槽、阴影模式、无边框模式和自定义内容样式。

## 基础用法

通过 `header` 属性或 `header` 插槽设置卡片标题。

<DemoBlock>

```vue
<template>
  <ZcCard header="卡片标题" style="width: 100%;">
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

## 无边框模式

设置 `bordered` 为 `false` 可以隐藏卡片边框，配合阴影使用效果更佳。

<DemoBlock>

```vue
<template>
  <ZcSpace>
    <ZcCard :bordered="false" shadow="always" style="width: 220px;">
      <p>无边框卡片，仅依赖阴影区分层级</p>
    </ZcCard>
    <ZcCard :bordered="false" shadow="hover" style="width: 220px;">
      <p>悬停时才出现阴影的无边框卡片</p>
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
  <ZcCard style="width: 100%;">
    <template #header>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <span>自定义标题</span>
        <ZcButton size="small" type="primary">操作按钮</ZcButton>
      </div>
    </template>
    <p>卡片正文内容</p>
    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <ZcButton size="small">取消</ZcButton>
        <ZcButton size="small" type="primary">确定</ZcButton>
      </div>
    </template>
  </ZcCard>
</template>
```

</DemoBlock>

## 图文卡片

利用插槽构建更丰富的卡片内容，适合展示商品、文章摘要等。

<DemoBlock>

```vue
<template>
  <ZcCard style="width: 300px;" :body-style="{ padding: 0 }">
    <div
      style="height: 160px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center;"
    >
      <span style="color: #fff; font-size: 24px; font-weight: bold;">ZC UI</span>
    </div>
    <div style="padding: 16px;">
      <h3 style="margin: 0 0 8px; font-size: 16px;">组件库设计语言</h3>
      <p style="margin: 0; color: var(--color-zc-text-secondary, #909399); font-size: 14px;">
        统一的设计变量体系，让产品视觉保持一致性。
      </p>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="color: var(--color-zc-text-secondary, #909399); font-size: 13px;"
          >2025-08-11</span
        >
        <ZcButton size="small" type="primary" text>阅读更多</ZcButton>
      </div>
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
  <ZcCard header="内边距调整" body-style="padding: 30px;" style="width: 100%;">
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
  { name: 'bordered', description: '是否显示边框', type: 'boolean', default: 'true' },
  { name: 'bodyStyle', description: '内容区自定义样式', type: 'string | Record<string, string>', default: '—' },
  { name: 'bodyClass', description: '内容区自定义类名', type: 'string', default: '—' },
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '卡片正文内容' },
  { name: 'header', description: '卡片标题（覆盖 header 属性）' },
  { name: 'footer', description: '卡片底部内容' },
]" />
