<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/** 组件元数据 */
interface ComponentMeta {
  name: string
  cnName: string
  description: string
  category: string
  link: string
}

/** 语义大类定义 */
interface Category {
  key: string
  label: string
  icon: string
}

const categories: Category[] = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'basic', label: '基础组件', icon: '🎯' },
  { key: 'layout', label: '布局组件', icon: '📐' },
  { key: 'container', label: '容器与基础', icon: '📦' },
  { key: 'form', label: '表单组件', icon: '📝' },
  { key: 'data', label: '数据展示', icon: '📊' },
  { key: 'feedback', label: '反馈 \u0026 导航', icon: '🔔' },
  { key: 'navigation', label: '导航组件', icon: '🧭' },
]

/** 全量组件数据 */
const allComponents: ComponentMeta[] = [
  // 基础组件
  {
    name: 'Button',
    cnName: '按钮',
    description: '常用的操作按钮，支持多种类型、尺寸和状态',
    category: 'basic',
    link: '/components/button',
  },
  {
    name: 'Icon',
    cnName: '图标',
    description: '语义化的矢量图标组件',
    category: 'basic',
    link: '/components/icon',
  },
  // 布局组件
  {
    name: 'Container',
    cnName: '布局容器',
    description: '用于页面整体布局的容器组件',
    category: 'layout',
    link: '/components/layout',
  },
  {
    name: 'Row / Col',
    cnName: '栅格',
    description: '24 栅格系统，灵活的响应式布局',
    category: 'layout',
    link: '/components/row-col',
  },
  {
    name: 'Space',
    cnName: '间距',
    description: '设置组件之间的间距',
    category: 'layout',
    link: '/components/space',
  },
  {
    name: 'Grid',
    cnName: '网格',
    description: 'CSS Grid 布局，支持自定义行列',
    category: 'layout',
    link: '/components/grid',
  },
  {
    name: 'Carousel',
    cnName: '走马灯',
    description: '循环展示一组图片或内容的轮播组件',
    category: 'layout',
    link: '/components/carousel',
  },
  // 容器与基础
  {
    name: 'Card',
    cnName: '卡片',
    description: '将信息聚合在卡片容器中展示',
    category: 'container',
    link: '/components/card',
  },
  {
    name: 'Divider',
    cnName: '分割线',
    description: '区隔内容的分割线，支持文字和图标',
    category: 'container',
    link: '/components/divider',
  },
  {
    name: 'Collapse',
    cnName: '折叠面板',
    description: '将内容区域折叠/展开，节省页面空间',
    category: 'container',
    link: '/components/collapse',
  },
  {
    name: 'Scrollbar',
    cnName: '滚动条',
    description: '自定义滚动条样式，提升视觉效果',
    category: 'container',
    link: '/components/scrollbar',
  },
  // 表单组件
  {
    name: 'Input',
    cnName: '输入框',
    description: '通过鼠标或键盘输入字符',
    category: 'form',
    link: '/components/input',
  },
  {
    name: 'Switch',
    cnName: '开关',
    description: '在两个互斥状态间切换',
    category: 'form',
    link: '/components/switch',
  },
  {
    name: 'Checkbox',
    cnName: '多选框',
    description: '一组备选项中进行多选',
    category: 'form',
    link: '/components/checkbox',
  },
  {
    name: 'Radio',
    cnName: '单选框',
    description: '一组备选项中进行单选',
    category: 'form',
    link: '/components/radio',
  },
  {
    name: 'Select',
    cnName: '选择器',
    description: '下拉选择器，支持单选和多选',
    category: 'form',
    link: '/components/select',
  },
  {
    name: 'Form',
    cnName: '表单',
    description: '具有数据收集、校验和提交功能的表单',
    category: 'form',
    link: '/components/form',
  },
  {
    name: 'DatePicker',
    cnName: '日期选择器',
    description: '选择或输入日期的控件',
    category: 'form',
    link: '/components/date-picker',
  },
  {
    name: 'InputNumber',
    cnName: '计数器',
    description: '通过按钮或键盘输入调整数值',
    category: 'form',
    link: '/components/input-number',
  },
  {
    name: 'AutoComplete',
    cnName: '自动补全',
    description: '输入时根据建议列表自动补全',
    category: 'form',
    link: '/components/auto-complete',
  },
  {
    name: 'ColorPicker',
    cnName: '颜色选择器',
    description: '用于选择颜色，支持预设色板和自定义',
    category: 'form',
    link: '/components/color-picker',
  },
  {
    name: 'TimePicker',
    cnName: '时间选择器',
    description: '选择或输入时间的控件',
    category: 'form',
    link: '/components/time-picker',
  },
  {
    name: 'Slider',
    cnName: '滑块',
    description: '通过拖动滑块在固定范围内选择数值',
    category: 'form',
    link: '/components/slider',
  },
  {
    name: 'Rate',
    cnName: '评分',
    description: '通过星级进行评分',
    category: 'form',
    link: '/components/rate',
  },
  {
    name: 'Cascader',
    cnName: '级联选择器',
    description: '多级联动选择器，适用于省市区等层级数据',
    category: 'form',
    link: '/components/cascader',
  },
  {
    name: 'TreeSelect',
    cnName: '树选择',
    description: '以树形结构展示数据的下拉选择器',
    category: 'form',
    link: '/components/tree-select',
  },
  {
    name: 'Upload',
    cnName: '上传',
    description: '文件上传组件，支持拖拽和多文件',
    category: 'form',
    link: '/components/upload',
  },
  {
    name: 'Transfer',
    cnName: '穿梭框',
    description: '双栏穿梭选择框，用于批量数据迁移',
    category: 'form',
    link: '/components/transfer',
  },
  {
    name: 'Mention',
    cnName: '提及',
    description: '输入时弹出建议列表，支持 @提及场景',
    category: 'form',
    link: '/components/mention',
  },
  // 数据展示
  {
    name: 'Tag',
    cnName: '标签',
    description: '用于标记和选择的标签',
    category: 'data',
    link: '/components/tag',
  },
  {
    name: 'Badge',
    cnName: '徽章',
    description: '图标右上角的消息数量',
    category: 'data',
    link: '/components/badge',
  },
  {
    name: 'Avatar',
    cnName: '头像',
    description: '展示用户或事物信息的头像',
    category: 'data',
    link: '/components/avatar',
  },
  {
    name: 'Empty',
    cnName: '空状态',
    description: '空状态时的占位提示',
    category: 'data',
    link: '/components/empty',
  },
  {
    name: 'Skeleton',
    cnName: '骨架屏',
    description: '在内容加载时展示占位图形',
    category: 'data',
    link: '/components/skeleton',
  },
  {
    name: 'Table',
    cnName: '表格',
    description: '展示行列数据，支持排序和筛选',
    category: 'data',
    link: '/components/table',
  },
  {
    name: 'Image',
    cnName: '图片',
    description: '增强版的 img 标签，支持懒加载和预览',
    category: 'data',
    link: '/components/image',
  },
  {
    name: 'Tree',
    cnName: '树形控件',
    description: '以树形结构清晰展示层级数据',
    category: 'data',
    link: '/components/tree',
  },
  {
    name: 'Descriptions',
    cnName: '描述列表',
    description: '成对展示键值信息的列表组件',
    category: 'data',
    link: '/components/descriptions',
  },
  {
    name: 'Statistic',
    cnName: '统计数值',
    description: '突出展示数值和趋势的组件',
    category: 'data',
    link: '/components/statistic',
  },
  {
    name: 'Timeline',
    cnName: '时间线',
    description: '按时间顺序展示一系列事件',
    category: 'data',
    link: '/components/timeline',
  },
  {
    name: 'List',
    cnName: '列表',
    description: '基础列表容器，用于展示一系列内容',
    category: 'data',
    link: '/components/list',
  },
  {
    name: 'Progress',
    cnName: '进度条',
    description: '展示操作进度的组件，支持多种样式',
    category: 'data',
    link: '/components/progress',
  },
  {
    name: 'Steps',
    cnName: '步骤条',
    description: '引导用户按流程完成任务的导航条',
    category: 'data',
    link: '/components/steps',
  },
  {
    name: 'Watermark',
    cnName: '水印',
    description: '为页面添加水印，防止信息被盗用',
    category: 'data',
    link: '/components/watermark',
  },
  {
    name: 'Result',
    cnName: '结果',
    description: '反馈操作结果的页面级组件',
    category: 'data',
    link: '/components/result',
  },
  // 反馈 \u0026 导航
  {
    name: 'Tooltip',
    cnName: '文字提示',
    description: '鼠标悬停时展示的文字提示',
    category: 'feedback',
    link: '/components/tooltip',
  },
  {
    name: 'Popconfirm',
    cnName: '气泡确认框',
    description: '点击元素弹出气泡确认框，用于二次确认',
    category: 'feedback',
    link: '/components/popconfirm',
  },
  {
    name: 'Dialog',
    cnName: '对话框',
    description: '在保留当前页面状态下通知用户并承载相关操作',
    category: 'feedback',
    link: '/components/dialog',
  },
  {
    name: 'Drawer',
    cnName: '抽屉',
    description: '从屏幕边缘滑出的浮层面板',
    category: 'feedback',
    link: '/components/drawer',
  },
  {
    name: 'Alert',
    cnName: '警告',
    description: '页面中的警告、通知、提示信息展示',
    category: 'feedback',
    link: '/components/alert',
  },
  {
    name: 'Pagination',
    cnName: '分页',
    description: '数据量过多时采用分页分解数据',
    category: 'feedback',
    link: '/components/pagination',
  },
  {
    name: 'Message',
    cnName: '消息提示',
    description: '常用于主动反馈操作的轻量级提示',
    category: 'feedback',
    link: '/components/message',
  },
  {
    name: 'Notification',
    cnName: '通知',
    description: '悬浮出现在页面角落，显示全局通知',
    category: 'feedback',
    link: '/components/notification',
  },
  {
    name: 'Loading',
    cnName: '加载',
    description: '加载数据时的动画效果',
    category: 'feedback',
    link: '/components/loading',
  },
  // 导航组件
  {
    name: 'Menu',
    cnName: '导航菜单',
    description: '为网站提供导航功能的菜单',
    category: 'navigation',
    link: '/components/menu',
  },
  {
    name: 'Tabs',
    cnName: '标签页',
    description: '分隔内容上有关联但属于不同类别的数据集合',
    category: 'navigation',
    link: '/components/tabs',
  },
  {
    name: 'Breadcrumb',
    cnName: '面包屑',
    description: '显示当前页面的路径，快速返回之前的任意页面',
    category: 'navigation',
    link: '/components/breadcrumb',
  },
  {
    name: 'Dropdown',
    cnName: '下拉菜单',
    description: '将动作或菜单折叠到下拉菜单中',
    category: 'navigation',
    link: '/components/dropdown',
  },
  {
    name: 'Anchor',
    cnName: '锚点',
    description: '用于跳转到页面指定位置',
    category: 'navigation',
    link: '/components/anchor',
  },
  {
    name: 'Backtop',
    cnName: '返回顶部',
    description: '返回页面顶部的操作按钮',
    category: 'navigation',
    link: '/components/backtop',
  },
  {
    name: 'Affix',
    cnName: '固钉',
    description: '将页面元素固定在可视范围内',
    category: 'navigation',
    link: '/components/affix',
  },
]

/* ========== 状态 ========== */
const activeCategory = ref('all')
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

/* ========== 计算属性 ========== */

/** 当前分类下，经过搜索过滤后的组件 */
const filteredComponents = computed(() => {
  let result = allComponents

  // 分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter((c) => c.category === activeCategory.value)
  }

  // 关键词搜索
  const kw = searchKeyword.value.trim().toLowerCase()
  if (kw) {
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(kw) ||
        c.cnName.includes(searchKeyword.value.trim()) ||
        c.description.toLowerCase().includes(kw)
    )
  }

  return result
})

/** 按语义大类分组 */
const groupedComponents = computed(() => {
  const pageStart = (currentPage.value - 1) * pageSize.value
  const pageEnd = pageStart + pageSize.value
  const pageItems = filteredComponents.value.slice(pageStart, pageEnd)

  const groups: Record<string, ComponentMeta[]> = {}
  for (const comp of pageItems) {
    if (!groups[comp.category]) {
      groups[comp.category] = []
    }
    groups[comp.category].push(comp)
  }

  // 按预定义的分类顺序排序
  const orderedGroups: { category: Category; items: ComponentMeta[] }[] = []
  for (const cat of categories) {
    if (cat.key === 'all') continue
    if (groups[cat.key]) {
      orderedGroups.push({ category: cat, items: groups[cat.key] })
    }
  }
  return orderedGroups
})

/** 总页数 */
const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredComponents.value.length / pageSize.value))
)

/** 分页按钮列表 */
const pageNumbers = computed(() => {
  const pages: (number | string)[] = []
  const current = currentPage.value
  const total = totalPages.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push('...')
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push('...')
    pages.push(total)
  }
  return pages
})

/** 各分类组件数量统计 */
const categoryCounts = computed(() => {
  const counts: Record<string, number> = { all: allComponents.length }
  for (const cat of categories) {
    if (cat.key === 'all') continue
    counts[cat.key] = allComponents.filter((c) => c.category === cat.key).length
  }
  return counts
})

/* ========== 方法 ========== */

function selectCategory(key: string) {
  activeCategory.value = key
  currentPage.value = 1
}

function goToPage(page: number | string) {
  if (typeof page === 'number') {
    currentPage.value = page
    // 滚动到列表顶部
    const el = document.querySelector('.component-overview')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function clearSearch() {
  searchKeyword.value = ''
  currentPage.value = 1
}

/* ========== 监听 ========== */

// 搜索时重置页码
watch(searchKeyword, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="component-overview">
    <!-- 搜索栏 -->
    <div class="co-toolbar">
      <div class="co-search">
        <span class="co-search__icon">🔍</span>
        <input
          v-model="searchKeyword"
          class="co-search__input"
          type="text"
          placeholder="搜索组件名称或描述…"
        />
        <button v-if="searchKeyword" class="co-search__clear" title="清除" @click="clearSearch">
          ✕
        </button>
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="co-categories">
      <button
        v-for="cat in categories"
        :key="cat.key"
        class="co-category-tag"
        :class="{ 'is-active': activeCategory === cat.key }"
        @click="selectCategory(cat.key)"
      >
        <span class="co-category-tag__icon">{{ cat.icon }}</span>
        <span class="co-category-tag__label">{{ cat.label }}</span>
        <span class="co-category-tag__count">{{ categoryCounts[cat.key] }}</span>
      </button>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredComponents.length === 0" class="co-empty">
      <div class="co-empty__icon">🔍</div>
      <p class="co-empty__text">未找到匹配的组件</p>
      <button class="co-empty__btn" @click="clearSearch">清除搜索条件</button>
    </div>

    <!-- 组件列表（按语义大类分组） -->
    <template v-else>
      <div v-for="group in groupedComponents" :key="group.category.key" class="co-group">
        <div class="co-group__header">
          <span class="co-group__icon">{{ group.category.icon }}</span>
          <h3 class="co-group__title">{{ group.category.label }}</h3>
          <span class="co-group__line" />
        </div>

        <div class="co-cards">
          <a v-for="comp in group.items" :key="comp.name" :href="comp.link" class="co-card">
            <div class="co-card__header">
              <span class="co-card__name">{{ comp.name }}</span>
              <span class="co-card__cn">{{ comp.cnName }}</span>
            </div>
            <p class="co-card__desc">{{ comp.description }}</p>
            <span class="co-card__arrow">→</span>
          </a>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="totalPages > 1" class="co-pagination">
        <button
          class="co-page-btn"
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
        >
          ‹ 上一页
        </button>
        <div class="co-page-numbers">
          <template v-for="(page, idx) in pageNumbers" :key="idx">
            <span v-if="page === '...'" class="co-page-ellipsis">…</span>
            <button
              v-else
              class="co-page-number"
              :class="{ 'is-active': currentPage === page }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </template>
        </div>
        <button
          class="co-page-btn"
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
        >
          下一页 ›
        </button>
      </div>

      <!-- 统计信息 -->
      <div class="co-stats">
        共 {{ filteredComponents.length }} 个组件 · 第 {{ currentPage }} / {{ totalPages }} 页
      </div>
    </template>
  </div>
</template>

<style scoped>
.component-overview {
  margin-top: 24px;
}

/* ===== 搜索栏 ===== */
.co-toolbar {
  margin-bottom: 20px;
}

.co-search {
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

.co-search:focus-within {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px rgba(60, 110, 224, 0.12);
}

.co-search__icon {
  font-size: 16px;
  opacity: 0.6;
}

.co-search__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 15px;
  color: var(--vp-c-text-1);
}

.co-search__input::placeholder {
  color: var(--vp-c-text-3);
}

.co-search__clear {
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

.co-search__clear:hover {
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-text-1);
}

/* ===== 分类标签 ===== */
.co-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 32px;
}

.co-category-tag {
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

.co-category-tag:hover {
  border-color: var(--vp-c-brand-2);
  color: var(--vp-c-brand-1);
}

.co-category-tag.is-active {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-1);
  color: #fff;
}

.co-category-tag.is-active .co-category-tag__count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.co-category-tag__icon {
  font-size: 15px;
}

.co-category-tag__count {
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

/* ===== 分组标题 ===== */
.co-group {
  margin-bottom: 36px;
}

.co-group__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 18px;
}

.co-group__icon {
  font-size: 20px;
}

.co-group__title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.co-group__line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--vp-c-divider), transparent);
}

/* ===== 组件卡片 ===== */
.co-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 14px;
}

.co-card {
  position: relative;
  display: block;
  padding: 18px 20px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  text-decoration: none;
  transition: all 0.25s ease;
  overflow: hidden;
}

.co-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--vp-c-brand-1);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.25s ease;
}

.co-card:hover {
  border-color: var(--vp-c-brand-2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.co-card:hover::before {
  transform: scaleY(1);
}

.co-card__header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 6px;
}

.co-card__name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.co-card__cn {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

.co-card__desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.co-card__arrow {
  position: absolute;
  right: 16px;
  top: 18px;
  font-size: 14px;
  color: var(--vp-c-text-3);
  opacity: 0;
  transition: all 0.25s ease;
}

.co-card:hover .co-card__arrow {
  opacity: 1;
  transform: translateX(2px);
  color: var(--vp-c-brand-1);
}

/* ===== 空状态 ===== */
.co-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  text-align: center;
}

.co-empty__icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.co-empty__text {
  font-size: 16px;
  color: var(--vp-c-text-2);
  margin: 0 0 20px;
}

.co-empty__btn {
  padding: 8px 20px;
  border: 1.5px solid var(--vp-c-brand-1);
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
}

.co-empty__btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ===== 分页 ===== */
.co-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.co-page-btn {
  padding: 7px 16px;
  border: 1.5px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
}

.co-page-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.co-page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.co-page-numbers {
  display: flex;
  align-items: center;
  gap: 4px;
}

.co-page-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 4px;
  border: 1.5px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.25s;
}

.co-page-number:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.co-page-number.is-active {
  background: var(--vp-c-brand-1);
  color: #fff;
  font-weight: 600;
}

.co-page-ellipsis {
  padding: 0 4px;
  color: var(--vp-c-text-3);
}

/* ===== 统计 ===== */
.co-stats {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
</style>
