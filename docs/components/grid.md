# Grid 网格

基于 CSS Grid 的网格布局组件，通过 Grid 和 GridItem 快速构建复杂网格布局。

## 基础用法

通过 `columns` 设置列数，GridItem 可直接放入其中。

<DemoBlock>

```vue
<template>
  <ZcGrid :columns="4" :gap="12">
    <ZcGridItem v-for="i in 4" :key="i">
      <div class="grid-demo">第 {{ i }} 项</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
```

</DemoBlock>

## 列跨度

通过 GridItem 的 `colSpan` 属性跨多列，`rowSpan` 跨多行。

<DemoBlock>

```vue
<template>
  <ZcGrid :columns="6" :gap="12">
    <ZcGridItem :col-span="2">
      <div class="grid-demo">colSpan 2</div>
    </ZcGridItem>
    <ZcGridItem :col-span="2">
      <div class="grid-demo ep-bg-purple-light">colSpan 2</div>
    </ZcGridItem>
    <ZcGridItem :col-span="2">
      <div class="grid-demo">colSpan 2</div>
    </ZcGridItem>
    <ZcGridItem :col-span="4">
      <div class="grid-demo ep-bg-purple-dark">colSpan 4</div>
    </ZcGridItem>
    <ZcGridItem :col-span="2">
      <div class="grid-demo">colSpan 2</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.ep-bg-purple-dark {
  background: #5b8def;
}
.ep-bg-purple-light {
  background: #d6e4ff;
  color: #333;
}
</style>
```

</DemoBlock>

## 自定义间距

通过 `gap` 设置网格间距，支持 `[行间距, 列间距]` 元组（遵循 CSS 标准）。

<DemoBlock>

```vue
<template>
  <ZcGrid :columns="3" :gap="[16, 24]">
    <ZcGridItem v-for="i in 6" :key="i">
      <div class="grid-demo">row-gap 16 / col-gap 24</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
```

</DemoBlock>

## 行列定位

通过 `columnStart`、`columnEnd`、`rowStart`、`rowEnd` 精确定位网格项。

<DemoBlock>

```vue
<template>
  <ZcGrid :columns="4" :gap="12" :rows="4" style="height: 300px">
    <ZcGridItem :column-start="1" :column-end="3" :row-start="1" :row-end="3">
      <div class="grid-demo ep-bg-purple-dark">1/3 ⨯ 1/3</div>
    </ZcGridItem>
    <ZcGridItem :column-start="3" :column-end="5">
      <div class="grid-demo ep-bg-purple-light">col 3-5</div>
    </ZcGridItem>
    <ZcGridItem :column-start="3" :column-end="4">
      <div class="grid-demo">col 3</div>
    </ZcGridItem>
    <ZcGridItem :column-start="4" :column-end="5">
      <div class="grid-demo ep-bg-purple-light">col 4</div>
    </ZcGridItem>
    <ZcGridItem :row-start="4" :column-start="1" :column-end="5">
      <div class="grid-demo">footer row</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.ep-bg-purple-dark {
  background: #5b8def;
}
.ep-bg-purple-light {
  background: #d6e4ff;
  color: #333;
}
</style>
```

</DemoBlock>

## 网格对齐

支持 `justifyItems`、`alignItems`、`justifyContent`、`alignContent` 等 CSS Grid 对齐属性。

<DemoBlock>

```vue
<template>
  <div style="margin-bottom: 20px">
    <p>justifyItems: center</p>
    <ZcGrid
      :columns="3"
      :gap="12"
      justify-items="center"
      style="height: 120px; background: #f5f5f5; padding: 12px; border-radius: 4px"
    >
      <ZcGridItem>
        <div class="grid-demo-small">居中</div>
      </ZcGridItem>
      <ZcGridItem>
        <div class="grid-demo-small">居中</div>
      </ZcGridItem>
      <ZcGridItem>
        <div class="grid-demo-small">居中</div>
      </ZcGridItem>
    </ZcGrid>
  </div>
  <div>
    <p>alignItems: center</p>
    <ZcGrid
      :columns="3"
      :gap="12"
      align-items="center"
      style="height: 120px; background: #f5f5f5; padding: 12px; border-radius: 4px"
    >
      <ZcGridItem>
        <div class="grid-demo-tall">item 1</div>
      </ZcGridItem>
      <ZcGridItem>
        <div class="grid-demo-small">item 2</div>
      </ZcGridItem>
      <ZcGridItem>
        <div class="grid-demo-tall">item 3</div>
      </ZcGridItem>
    </ZcGrid>
  </div>
</template>

<style>
.grid-demo-small {
  border-radius: 4px;
  min-height: 36px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.grid-demo-tall {
  border-radius: 4px;
  min-height: 80px;
  background: #d6e4ff;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
```

</DemoBlock>

## 响应式网格

通过 `minColumnWidth` 实现自适应网格，列数随容器宽度自动调整。

<DemoBlock>

```vue
<template>
  <ZcGrid :gap="12" min-column-width="120px">
    <ZcGridItem v-for="i in 12" :key="i">
      <div class="grid-demo">项 {{ i }}</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
</style>
```

</DemoBlock>

## 区域命名布局

使用 `area` 属性定义网格区域，实现更灵活的布局控制。

<DemoBlock>

```vue
<template>
  <ZcGrid
    :columns="3"
    :rows="2"
    :gap="12"
    style="height: 240px"
    grid-template-areas="'header header header' 'sidebar main main'"
  >
    <ZcGridItem area="header">
      <div class="grid-demo ep-bg-purple-dark">Header</div>
    </ZcGridItem>
    <ZcGridItem area="sidebar">
      <div class="grid-demo ep-bg-purple-light">Sidebar</div>
    </ZcGridItem>
    <ZcGridItem area="main">
      <div class="grid-demo">Main Content</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.ep-bg-purple-dark {
  background: #5b8def;
}
.ep-bg-purple-light {
  background: #d6e4ff;
  color: #333;
}
</style>
```

</DemoBlock>

## 复杂网格布局

结合多种属性实现复杂的网格布局。

<DemoBlock>

```vue
<template>
  <ZcGrid :columns="4" :gap="12" style="height: 400px">
    <!-- 顶部大横条 -->
    <ZcGridItem :col-span="4">
      <div class="grid-demo ep-bg-purple-dark">Header (span 4)</div>
    </ZcGridItem>

    <!-- 左侧边栏 -->
    <ZcGridItem :col-span="1" :row-span="3">
      <div class="grid-demo ep-bg-purple-light" style="height: 100%">Sidebar (1x3)</div>
    </ZcGridItem>

    <!-- 中间内容区 -->
    <ZcGridItem :col-span="2" :row-span="2">
      <div class="grid-demo" style="height: 100%">Main Content (2x2)</div>
    </ZcGridItem>

    <!-- 右侧小方块 -->
    <ZcGridItem :col-span="1" :row-span="1">
      <div class="grid-demo ep-bg-purple">Right Top</div>
    </ZcGridItem>

    <!-- 右侧下方块 -->
    <ZcGridItem :col-span="1" :row-span="2">
      <div class="grid-demo ep-bg-purple-light" style="height: 100%">Right Bottom (1x2)</div>
    </ZcGridItem>

    <!-- 中间底部 -->
    <ZcGridItem :col-span="2">
      <div class="grid-demo ep-bg-purple">Middle Bottom</div>
    </ZcGridItem>
  </ZcGrid>
</template>

<style>
.grid-demo {
  border-radius: 4px;
  min-height: 60px;
  background: #a0c3ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.ep-bg-purple-dark {
  background: #5b8def;
}
.ep-bg-purple {
  background: #3c6ee0;
}
.ep-bg-purple-light {
  background: #d6e4ff;
  color: #333;
}
</style>
```

</DemoBlock>

## Grid API

<ApiTable type="props" :data="[
  { name: 'columns', description: '列数（数字或 CSS grid-template-columns 字符串）', type: 'number | string', default: '12' },
  { name: 'rows', description: '行数（数字或 CSS grid-template-rows 字符串）', type: 'number | string', default: '0' },
  { name: 'gap', description: '网格间距，[行, 列]（遵循 CSS 标准）', type: 'number | [number, number]', default: '0' },
  { name: 'justifyItems', description: '网格项水平对齐', type: 'start | end | center | stretch', default: 'stretch' },
  { name: 'alignItems', description: '网格项垂直对齐', type: 'start | end | center | stretch | baseline', default: 'stretch' },
  { name: 'justifyContent', description: '整体水平对齐', type: 'start | end | center | space-around | space-between | space-evenly', default: 'start' },
  { name: 'alignContent', description: '整体垂直对齐', type: 'start | end | center | space-around | space-between | stretch', default: 'start' },
  { name: 'autoFlow', description: '自动排列方向', type: 'row | column | row dense | column dense', default: 'row' },
  { name: 'minColumnWidth', description: '最小列宽（启用 auto-fill 自适应）', type: 'string', default: '' },
  { name: 'gridTemplateAreas', description: '网格区域模板', type: 'string', default: '' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'div' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '放置 GridItem 组件', childTags: 'GridItem' }
]" />

## GridItem API

<ApiTable type="props" :data="[
  { name: 'colSpan', description: '跨列数', type: 'number', default: '—' },
  { name: 'rowSpan', description: '跨行数', type: 'number', default: '—' },
  { name: 'columnStart', description: '列起始线', type: 'number | string', default: '—' },
  { name: 'columnEnd', description: '列结束线', type: 'number | string', default: '—' },
  { name: 'rowStart', description: '行起始线', type: 'number | string', default: '—' },
  { name: 'rowEnd', description: '行结束线', type: 'number | string', default: '—' },
  { name: 'area', description: '网格区域名称', type: 'string', default: '—' },
  { name: 'tag', description: '自定义根元素标签', type: 'string', default: 'div' }
]" />

### Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '网格项内容' }
]" />
