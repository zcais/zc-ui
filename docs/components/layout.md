# Layout 布局

用于布局的容器组件，方便快速搭建页面的基本结构：

- `ZcContainer`：外层容器。当子元素中包含 `ZcHeader` 或 `ZcFooter` 时，全部子元素会垂直上下排列，否则会水平左右排列。
- `ZcHeader`：顶栏容器。
- `ZcAside`：侧边栏容器。
- `ZcMain`：主要区域容器。
- `ZcFooter`：底栏容器。

::: tip
以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外，`ZcContainer` 的直接子元素必须是后四个组件中的一个或多个，后四个组件的父元素必须是一个 `ZcContainer`。
:::

## 常见页面布局

可参考以下常见页面布局组合。

### 上中下布局

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcHeader>Header</ZcHeader>
      <ZcMain>Main</ZcMain>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Header + Main + Footer

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcHeader>Header</ZcHeader>
      <ZcMain>Main</ZcMain>
      <ZcFooter>Footer</ZcFooter>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Aside + Main + Aside

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer direction="horizontal">
      <ZcAside width="200px">Aside</ZcAside>
      <ZcMain>Main</ZcMain>
      <ZcAside width="200px">Aside</ZcAside>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Header + Aside + Main

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcHeader>Header</ZcHeader>
      <ZcContainer>
        <ZcAside width="200px">Aside</ZcAside>
        <ZcMain>Main</ZcMain>
      </ZcContainer>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Header + Aside + Main + Footer

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcHeader>Header</ZcHeader>
      <ZcContainer direction="horizontal">
        <ZcAside width="200px">Aside</ZcAside>
        <ZcContainer>
          <ZcMain>Main</ZcMain>
          <ZcFooter>Footer</ZcFooter>
        </ZcContainer>
      </ZcContainer>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 220px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Aside + Header + Main

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcAside width="200px">Aside</ZcAside>
      <ZcContainer>
        <ZcHeader>Header</ZcHeader>
        <ZcMain>Main</ZcMain>
      </ZcContainer>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 260px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

### Aside + Header + Main + Footer

<DemoBlock>

```vue
<template>
  <div class="common-layout">
    <ZcContainer>
      <ZcAside width="200px">Aside</ZcAside>
      <ZcContainer>
        <ZcHeader>Header</ZcHeader>
        <ZcMain>Main</ZcMain>
        <ZcFooter>Footer</ZcFooter>
      </ZcContainer>
    </ZcContainer>
  </div>
</template>

<style>
.common-layout {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
}
.common-layout .zc-header {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
.common-layout .zc-main {
  background-color: #f0f5ff;
  color: #333;
  text-align: center;
  line-height: 160px;
}
.common-layout .zc-aside {
  background-color: #d6e4ff;
  color: #333;
  text-align: center;
  line-height: 280px;
}
.common-layout .zc-footer {
  background-color: #a0c3ff;
  color: #fff;
  text-align: center;
  line-height: 60px;
}
</style>
```

</DemoBlock>

## Container API

<ApiTable type="props" :data="[
  { name: 'direction', description: '子元素的排列方向', type: 'horizontal | vertical', default: '子元素中有 ZcHeader 或 ZcFooter 时为 vertical，否则为 horizontal' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'section' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '自定义默认内容', childTags: 'Container / Header / Aside / Main / Footer' }
]" />

## Header API

<ApiTable type="props" :data="[
  { name: 'height', description: '顶栏高度', type: 'string', default: '60px' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'header' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '头部内容' }
]" />

## Aside API

<ApiTable type="props" :data="[
  { name: 'width', description: '侧栏宽度', type: 'string', default: '200px' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'aside' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '侧栏内容' }
]" />

## Main API

<ApiTable type="props" :data="[
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'main' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '主要内容区域' }
]" />

## Footer API

<ApiTable type="props" :data="[
  { name: 'height', description: '底部高度', type: 'string', default: '60px' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'footer' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '底部内容' }
]" />

## CSS Variables

各组件通过 CSS 自定义属性控制尺寸，支持主题覆盖和全局定制：

<ApiTable type="cssVars" :data="[
  { name: '--zc-header-height', description: 'Header 顶栏高度（对应 height 属性）', default: '60px' },
  { name: '--zc-aside-width', description: 'Aside 侧栏宽度（对应 width 属性）', default: '200px' },
  { name: '--zc-footer-height', description: 'Footer 底栏高度（对应 height 属性）', default: '60px' }
]" />

::: tip
设置 `height` / `width` 属性时，组件会自动将其写入对应的 CSS 变量。
你也可以直接在 CSS 中覆盖这些变量来实现主题化定制：

```css
.my-layout .zc-header {
  --zc-header-height: 80px;
}
```
:::
