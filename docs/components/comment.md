# Comment 评论

评论/讨论组件，展示头像、作者、时间、内容和操作按钮，支持嵌套回复。

## 基础用法

通过 `author`、`avatar`、`datetime`、`content` 等属性快速渲染评论。

<DemoBlock>

```vue
<template>
  <ZcComment
    author="张三"
    datetime="2025-01-15 14:30"
    avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    content="这是一条评论内容，ZC UI 的 Comment 组件非常好用！"
  />
</template>
```

</DemoBlock>

## 嵌套回复

设置 `nested` 并使用 `comment-list` 插槽展示子评论。

<DemoBlock>

```vue
<template>
  <ZcComment author="李四" datetime="2025-01-15 15:00" content="这是父级评论。" nested>
    <template #comment-list>
      <ZcComment author="王五" datetime="2025-01-15 15:30" content="这是子级回复。" />
      <ZcComment author="赵六" datetime="2025-01-15 16:00" content="另一条回复。" />
    </template>
  </ZcComment>
</template>
```

</DemoBlock>

## 自定义操作

使用 `actions` 插槽自定义操作按钮，插槽暴露 `reply` 和 `like` 方法。

<DemoBlock>

```vue
<template>
  <ZcComment author="用户A" datetime="2 小时前" content="使用自定义操作栏的评论。">
    <template #actions="{ reply, like }">
      <button class="action-btn" @click="reply">💬 回复</button>
      <button class="action-btn" @click="like">👍 {{ likeCount }}</button>
      <button class="action-btn">🔗 分享</button>
    </template>
  </ZcComment>
</template>

<script setup>
import { ref } from 'vue'
const likeCount = ref(42)
</script>

<style scoped>
.action-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 13px;
  color: #909399;
  padding: 4px 8px;
  border-radius: 4px;
  transition: color 0.2s;
}
.action-btn:hover {
  color: #409eff;
  background: rgba(64, 158, 255, 0.08);
}
</style>
```

</DemoBlock>

## 自定义头像

使用 `avatar` 插槽完全自定义头像区域。

<DemoBlock>

```vue
<template>
  <ZcComment author="自定义用户" datetime="刚刚" content="使用自定义头像的评论。">
    <template #avatar>
      <div
        style="
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #409eff, #67c23a);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-weight: 600;
        "
      >
        Z
      </div>
    </template>
  </ZcComment>
</template>
```

</DemoBlock>

## API

### Comment Props

| 属性名     | 说明                       | 类型      | 默认值  |
| ---------- | -------------------------- | --------- | ------- |
| author     | 作者名                     | `string`  | `''`    |
| avatar     | 头像 URL                   | `string`  | `''`    |
| datetime   | 时间文本                   | `string`  | `''`    |
| content    | 评论内容（也可用默认插槽） | `string`  | `''`    |
| nested     | 是否显示嵌套回复区域       | `boolean` | `false` |
| avatarSize | 头像尺寸（px）             | `number`  | `40`    |

### Comment Events

| 事件名 | 说明               | 回调参数           |
| ------ | ------------------ | ------------------ |
| reply  | 点击默认回复按钮时 | `(author: string)` |
| like   | 点击默认点赞按钮时 | -                  |

### Slots

| 插槽名       | 说明                                      |
| ------------ | ----------------------------------------- |
| default      | 评论正文内容                              |
| author       | 自定义作者区域                            |
| avatar       | 自定义头像区域                            |
| datetime     | 自定义时间区域                            |
| actions      | 操作栏区域，提供 `reply` 和 `like` 方法   |
| comment-list | 嵌套回复列表（需设置 `nested` 为 `true`） |
