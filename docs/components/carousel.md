# Carousel 走马灯

在有限空间内，循环播放同一类型的图片、文字等内容。

## 基础用法

适用广泛的基础用法。

<DemoBlock>

```vue
<template>
  <ZcCarousel height="200px">
    <ZcCarouselItem v-for="item in 4" :key="item">
      <div
        style="display: flex; align-items: center; justify-content: center; height: 100%; background: #409eff; color: #fff; font-size: 24px;"
      >
        {{ item }}
      </div>
    </ZcCarouselItem>
  </ZcCarousel>
</template>
```

</DemoBlock>

## 自动播放

通过 `autoplay` 开启自动轮播，`interval` 设置间隔时间。

<DemoBlock>

```vue
<template>
  <ZcCarousel height="200px" autoplay :interval="3000">
    <ZcCarouselItem v-for="item in 3" :key="item">
      <div
        style="display: flex; align-items: center; justify-content: center; height: 100%; background: #67c23a; color: #fff; font-size: 24px;"
      >
        第 {{ item }} 页
      </div>
    </ZcCarouselItem>
  </ZcCarousel>
</template>
```

</DemoBlock>

## 指示器与箭头

通过 `indicator-position` 控制指示器位置，`arrow` 控制箭头显示时机。

<DemoBlock>

```vue
<template>
  <ZcCarousel height="200px" indicator-position="outside" arrow="always">
    <ZcCarouselItem v-for="item in 4" :key="item">
      <div
        style="display: flex; align-items: center; justify-content: center; height: 100%; background: #e6a23c; color: #fff; font-size: 24px;"
      >
        {{ item }}
      </div>
    </ZcCarouselItem>
  </ZcCarousel>
</template>
```

</DemoBlock>

## Carousel API

### ZcCarousel Props

<ApiTable type="props" :data="[
{ name: 'height', description: '走马灯高度', type: 'string | number', default: `''` },
{ name: 'initialIndex', description: '初始状态激活的幻灯片索引', type: 'number', default: '0' },
{ name: 'trigger', description: '指示器触发方式', type: `'click' | 'hover'`, default: `'click'` },
{ name: 'autoplay', description: '是否自动播放', type: 'boolean', default: 'false' },
{ name: 'interval', description: '自动切换的时间间隔(ms)', type: 'number', default: '3000' },
{ name: 'indicatorPosition', description: '指示器位置', type: `'outside' | 'none'`, default: `'outside'` },
{ name: 'arrow', description: '切换箭头显示时机', type: `'always' | 'hover' | 'never'`, default: `'hover'` },
{ name: 'type', description: '走马灯类型', type: `'' | 'card'`, default: `''` },
{ name: 'loop', description: '是否循环播放', type: 'boolean', default: 'true' },
{ name: 'direction', description: '展示方向', type: `'horizontal' | 'vertical'`, default: `'horizontal'` },
{ name: 'pauseOnHover', description: '鼠标悬停时暂停自动播放', type: 'boolean', default: 'true' },
]" />

### ZcCarousel Events

<ApiTable type="events" :data="[
  { name: 'change', description: '幻灯片切换时触发', parameters: '(current: number, prev: number)' },
]" />

### ZcCarousel Slots

<ApiTable type="slots" :data="[
  { name: 'default', description: '幻灯片内容，放置 ZcCarouselItem' },
]" />

### ZcCarouselItem Props

<ApiTable type="props" :data="[
  { name: 'name', description: '幻灯片名称', type: 'string | number', default: '—' },
]" />
