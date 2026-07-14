<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import manifest from '../../data/icons-manifest.json'

interface IconItem {
  name: string
  category: string
  body: string
}

interface CategoryMeta {
  key: string
  label: string
  emoji: string
  count: number
}

const categories = manifest.categories as CategoryMeta[]
const allIcons = manifest.icons as IconItem[]
const totalCount = manifest.total as number

/* ========== 状态 ========== */
const activeCategory = ref<string>('all')
const searchKeyword = ref('')
const visibleCount = ref(200) // 当前渲染数量（无限滚动）
const PAGE_SIZE = 200

/** 复制反馈 */
const copiedName = ref('')
let copyTimer: ReturnType<typeof setTimeout> | null = null

/* ========== 计算属性 ========== */

/** 当前分类 + 搜索关键词过滤后的图标 */
const filteredIcons = computed(() => {
  let list = allIcons
  if (activeCategory.value !== 'all') {
    list = list.filter((i) => i.category === activeCategory.value)
  }
  const kw = searchKeyword.value.trim().toLowerCase()
  if (kw) {
    list = list.filter((i) => i.name.toLowerCase().includes(kw))
  }
  return list
})

/** 实际渲染的图标（分批） */
const visibleIcons = computed(() => filteredIcons.value.slice(0, visibleCount.value))

/** 是否还有更多可加载 */
const hasMore = computed(() => visibleCount.value < filteredIcons.value.length)

/** 各分类计数（含「全部」） */
const categoryCounts = computed(() => {
  const map: Record<string, number> = { all: totalCount }
  for (const c of categories) map[c.key] = c.count
  return map
})

/* ========== 方法 ========== */

function selectCategory(key: string) {
  activeCategory.value = key
}

function clearSearch() {
  searchKeyword.value = ''
}

async function copyName(icon: IconItem) {
  const text = icon.name
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // 降级方案
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    try {
      document.execCommand('copy')
    } catch {
      /* ignore */
    }
    document.body.removeChild(ta)
  }
  copiedName.value = text
  if (copyTimer) clearTimeout(copyTimer)
  copyTimer = setTimeout(() => {
    copiedName.value = ''
  }, 1500)
}

/* ========== 无限滚动 ========== */
const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

function loadMore() {
  if (!hasMore.value) return
  visibleCount.value += PAGE_SIZE
}

function setupObserver() {
  if (!sentinel.value || typeof IntersectionObserver === 'undefined') return
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) loadMore()
      }
    },
    { rootMargin: '300px' }
  )
  observer.observe(sentinel.value)
}

function teardownObserver() {
  observer?.disconnect()
  observer = null
}

/* 分类/搜索变化时重置分页，并重新挂载 observer */
watch([activeCategory, searchKeyword], () => {
  visibleCount.value = PAGE_SIZE
  teardownObserver()
  nextTick(() => setupObserver())
})

onMounted(() => nextTick(() => setupObserver()))
onBeforeUnmount(() => teardownObserver())
</script>

<template>
  <div class="icon-gallery">
    <!-- 顶部工具栏 -->
    <div class="ig-toolbar">
      <div class="ig-search">
        <span class="ig-search__icon">🔍</span>
        <input
          v-model="searchKeyword"
          class="ig-search__input"
          type="text"
          placeholder="搜索图标名称（如 arrow、user、brand-github）…"
        />
        <button v-if="searchKeyword" class="ig-search__clear" title="清除" @click="clearSearch">
          ✕
        </button>
      </div>
      <span class="ig-count">{{ filteredIcons.length }} 个图标</span>
    </div>

    <!-- 分类标签 -->
    <div class="ig-categories">
      <button
        class="ig-category-tag"
        :class="{ 'is-active': activeCategory === 'all' }"
        @click="selectCategory('all')"
      >
        <span class="ig-category-tag__icon">🗂️</span>
        <span class="ig-category-tag__label">全部</span>
        <span class="ig-category-tag__count">{{ categoryCounts.all }}</span>
      </button>
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="ig-category-tag"
        :class="{ 'is-active': activeCategory === cat.key }"
        @click="selectCategory(cat.key)"
      >
        <span class="ig-category-tag__icon">{{ cat.emoji }}</span>
        <span class="ig-category-tag__label">{{ cat.label }}</span>
        <span class="ig-category-tag__count">{{ cat.count }}</span>
      </button>
    </div>

    <!-- 图标网格 -->
    <div v-if="visibleIcons.length === 0" class="ig-empty">
      <div class="ig-empty__icon">🔍</div>
      <p class="ig-empty__text">未找到匹配的图标</p>
      <button class="ig-empty__btn" @click="clearSearch">清除搜索条件</button>
    </div>

    <div v-else class="ig-grid">
      <button
        v-for="icon in visibleIcons"
        :key="icon.name"
        class="ig-cell"
        type="button"
        :title="`点击复制：${icon.name}`"
        @click="copyName(icon)"
      >
        <span class="ig-cell__svg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            width="24"
            height="24"
            v-html="icon.body"
          />
        </span>
        <span class="ig-cell__name">{{ icon.name }}</span>
        <span class="ig-cell__copied" :class="{ 'is-visible': copiedName === icon.name }">
          ✓ 已复制
        </span>
      </button>
    </div>

    <!-- 无限滚动哨兵 -->
    <div v-if="hasMore && visibleIcons.length > 0" ref="sentinel" class="ig-sentinel">
      <span class="ig-sentinel__spinner" />
      加载更多…
    </div>
    <div v-else-if="!hasMore && visibleIcons.length > 0" class="ig-end">
      已展示全部 {{ filteredIcons.length }} 个图标
    </div>
  </div>
</template>

<style scoped>
.icon-gallery {
  margin-top: 24px;
}

/* ===== 顶部工具栏 ===== */
.ig-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.ig-search {
  flex: 1 1 280px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  height: 44px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  transition: border-color 0.25s;
}

.ig-search:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(60, 110, 224, 0.12);
}

.ig-search__icon {
  font-size: 16px;
  opacity: 0.6;
}

.ig-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--vp-c-text-1);
}

.ig-search__input::placeholder {
  color: var(--vp-c-text-3);
}

.ig-search__clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.ig-search__clear:hover {
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}

.ig-count {
  font-size: 13px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
}

/* ===== 分类标签 ===== */
.ig-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}

.ig-category-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
  white-space: nowrap;
}

.ig-category-tag:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

.ig-category-tag.is-active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.ig-category-tag.is-active .ig-category-tag__count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.ig-category-tag__icon {
  font-size: 15px;
}

.ig-category-tag__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 600;
}

/* ===== 图标网格 ===== */
.ig-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.ig-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px 10px 14px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.ig-cell:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.ig-cell__svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: var(--vp-c-text-1);
  transition: color 0.2s;
}

.ig-cell:hover .ig-cell__svg {
  color: var(--vp-c-brand-1);
}

.ig-cell__name {
  font-size: 12px;
  line-height: 1.3;
  color: var(--vp-c-text-3);
  text-align: center;
  word-break: break-all;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.ig-cell__copied {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
}

.ig-cell__copied.is-visible {
  opacity: 1;
}

/* ===== 空状态 ===== */
.ig-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 64px 20px;
  text-align: center;
}

.ig-empty__icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.ig-empty__text {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0 0 20px;
}

.ig-empty__btn {
  padding: 8px 20px;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
}

.ig-empty__btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ===== 无限滚动 ===== */
.ig-sentinel {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 28px 0 8px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.ig-sentinel__spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-brand-1);
  border-radius: 50%;
  animation: ig-spin 0.8s linear infinite;
}

@keyframes ig-spin {
  to {
    transform: rotate(360deg);
  }
}

.ig-end {
  text-align: center;
  padding: 28px 0 8px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}
</style>
