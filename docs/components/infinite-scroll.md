# InfiniteScroll 无限滚动

滚动到底部时自动触发加载更多数据的指令。

## 基础用法

在目标元素上使用 `v-infinite-scroll` 指令，指令值为加载更多的回调函数。

<DemoBlock>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const list = ref<number[]>([])

function loadMore() {
  for (let i = 0; i < 10; i++) {
    list.value.push(count.value++)
  }
}

loadMore()
</script>

<template>
  <div
    v-infinite-scroll="loadMore"
    style="height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 12px"
  >
    <div v-for="item in list" :key="item" style="padding: 8px 0; border-bottom: 1px solid #f0f0f0">
      Item {{ item }}
    </div>
  </div>
</template>
```

</DemoBlock>

## 禁用加载

通过 `:infinite-scroll-disabled="true"` 禁用滚动加载。

<DemoBlock>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const list = ref<number[]>([])
const disabled = ref(false)

function loadMore() {
  if (disabled.value) return
  for (let i = 0; i < 10; i++) {
    list.value.push(count.value++)
  }
  if (count.value >= 50) {
    disabled.value = true
  }
}

loadMore()
</script>

<template>
  <div
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="disabled"
    style="height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 12px"
  >
    <div v-for="item in list" :key="item" style="padding: 8px 0; border-bottom: 1px solid #f0f0f0">
      Item {{ item }}
    </div>
    <div v-if="disabled" style="text-align: center; padding: 12px; color: #999">没有更多了</div>
  </div>
</template>
```

</DemoBlock>

## 设置触发距离

通过 `:infinite-scroll-distance` 设置距离底部多少像素时触发加载。

<DemoBlock>

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
const list = ref<number[]>([])

function loadMore() {
  for (let i = 0; i < 10; i++) {
    list.value.push(count.value++)
  }
}

loadMore()
</script>

<template>
  <div
    v-infinite-scroll="loadMore"
    :infinite-scroll-distance="30"
    style="height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 12px"
  >
    <div v-for="item in list" :key="item" style="padding: 8px 0; border-bottom: 1px solid #f0f0f0">
      Item {{ item }}
    </div>
  </div>
</template>
```

</DemoBlock>

## InfiniteScroll API

### 指令

<ApiTable type="props" :data="[
  { name: 'v-infinite-scroll', description: '指令绑定值，滚动到底部时调用的函数', type: '(handler: () => void) => void', default: '—' },
]" />

### 指令参数

<ApiTable type="props" :data="[
  { name: 'infinite-scroll-distance', description: '触发加载的距离阈值（px）', type: 'number', default: '0' },
  { name: 'infinite-scroll-disabled', description: '是否禁用', type: 'boolean', default: 'false' },
  { name: 'infinite-scroll-immediate', description: '是否在挂载时立即检查并触发', type: 'boolean', default: 'false' },
]" />
