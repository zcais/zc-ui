import { defineConfig } from 'vitepress'
import { resolve } from 'node:path'
import { demoBlockPlugin } from './plugins/demo-block'

export default defineConfig({
  base: '/zc-ui/',
  title: 'ZC UI',
  description: 'Vue 3 企业级 UI 组件库',
  lang: 'zh-CN',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#3c6ee0' }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  vite: {
    plugins: [demoBlockPlugin()],
    resolve: {
      alias: {
        '@zc-ui/utils': resolve(__dirname, '../../packages/utils/src/index.ts'),
        '@zc-ui/hooks': resolve(__dirname, '../../packages/hooks/src/index.ts'),
        '@zc-ui/locale': resolve(__dirname, '../../packages/locale/src/index.ts'),
        '@zc-ui/theme': resolve(__dirname, '../../packages/theme/src/index.ts'),
        '@zc-ui/components': resolve(__dirname, '../../packages/components/src/index.ts'),
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'ZC UI',

    nav: [
      { text: '指南', link: '/guide/getting-started', activeMatch: '/guide/' },
      { text: '组件', link: '/components/overview', activeMatch: '/components/' },
      { text: '更新日志', link: '/guide/changelog' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '快速上手', link: '/guide/getting-started' },
            { text: '安装', link: '/guide/installation' },
            { text: '自动导入', link: '/guide/auto-import' },
            { text: '在线演练', link: '/guide/playground' },
          ],
        },
        {
          text: '设计',
          items: [
            { text: '设计原则', link: '/guide/design-principles' },
            { text: 'Design Tokens 设计令牌', link: '/guide/design-tokens' },
            { text: '主题定制', link: '/guide/theming' },
            { text: '组件级主题定制', link: '/guide/component-theme-customization' },
            { text: 'SCSS / CSS 变量混用', link: '/guide/scss-css-variables' },
            { text: '无障碍设计', link: '/guide/accessibility' },
          ],
        },
        {
          text: '进阶',
          items: [
            { text: 'SSR / Nuxt 兼容', link: '/guide/ssr' },
            { text: '组件迁移指南', link: '/guide/migration' },
            { text: '性能与体积监控', link: '/guide/bundle-size' },
          ],
        },
        {
          text: '社区',
          items: [
            { text: '贡献指南', link: '/guide/contributing' },
            { text: '常见问题 FAQ', link: '/guide/faq' },
            { text: '更新日志', link: '/guide/changelog' },
          ],
        },
      ],
      '/components/': [
        {
          text: '总览',
          items: [
            { text: '组件总览', link: '/components/overview' },
            { text: 'ConfigProvider 全局配置', link: '/components/config-provider' },
          ],
        },
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Icon 图标', link: '/components/icon' },
          ],
        },
        {
          text: '布局组件',
          collapsed: false,
          items: [
            { text: 'Layout 布局', link: '/components/layout' },
            { text: 'Row / Col 栅格', link: '/components/row-col' },
            { text: 'Space 间距', link: '/components/space' },
            { text: 'Grid 网格', link: '/components/grid' },
            { text: 'Carousel 走马灯', link: '/components/carousel' },
            { text: 'Splitter 分栏面板', link: '/components/splitter' },
          ],
        },
        {
          text: '容器与基础',
          collapsed: false,
          items: [
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Scrollbar 滚动条', link: '/components/scrollbar' },
          ],
        },
        {
          text: '表单组件',
          collapsed: false,
          items: [
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'InputNumber 计数器', link: '/components/input-number' },
            { text: 'AutoComplete 自动补全', link: '/components/auto-complete' },
            { text: 'Cascader 级联选择器', link: '/components/cascader' },
            { text: 'ColorPicker 颜色选择器', link: '/components/color-picker' },
            { text: 'DatePicker 日期选择器', link: '/components/date-picker' },
            { text: 'TimePicker 时间选择器', link: '/components/time-picker' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'Switch 开关', link: '/components/switch' },
            { text: 'Checkbox 多选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'TreeSelect 树选择', link: '/components/tree-select' },
            { text: 'Upload 上传', link: '/components/upload' },
            { text: 'Mention 提及', link: '/components/mention' },
            { text: 'InputOTP 验证码输入', link: '/components/input-otp' },
            { text: 'Form 表单', link: '/components/form' },
          ],
        },
        {
          text: '数据展示',
          collapsed: false,
          items: [
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Badge 徽章', link: '/components/badge' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Alert 警告', link: '/components/alert' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'List 列表', link: '/components/list' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Statistic 统计数值', link: '/components/statistic' },
            { text: 'Countdown 倒计时', link: '/components/countdown' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Timeline 时间线', link: '/components/timeline' },
            { text: 'Transfer 穿梭框', link: '/components/transfer' },
            { text: 'Tree 树形控件', link: '/components/tree' },
            { text: 'Watermark 水印', link: '/components/watermark' },
            { text: 'Calendar 日历', link: '/components/calendar' },
            { text: 'Result 结果', link: '/components/result' },
            { text: 'QRCode 二维码', link: '/components/qr-code' },
            { text: 'TextEllipsis 文本省略', link: '/components/text-ellipsis' },
            { text: 'Spin 加载', link: '/components/spin' },
            { text: 'Editable 行内编辑', link: '/components/editable' },
          ],
        },
        {
          text: '反馈 & 导航',
          collapsed: false,
          items: [
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
            { text: 'Popover 弹出框', link: '/components/popover' },
            { text: 'Dialog 对话框', link: '/components/dialog' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Tour 新手引导', link: '/components/tour' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'Message 消息提示', link: '/components/message' },
            { text: 'Notification 通知', link: '/components/notification' },
            { text: 'Loading 加载', link: '/components/loading' },
          ],
        },
        {
          text: '导航组件',
          collapsed: false,
          items: [
            { text: 'Menu 导航菜单', link: '/components/menu' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Segmented 分段控制器', link: '/components/segmented' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Anchor 锚点', link: '/components/anchor' },
            { text: 'Backtop 返回顶部', link: '/components/backtop' },
            { text: 'Affix 固钉', link: '/components/affix' },
            { text: 'FloatButton 悬浮按钮', link: '/components/float-button' },
          ],
        },
      ],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/zcais/zc-ui' }],

    search: {
      provider: 'local',
    },

    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024-2025 ZC UI',
    },

    outline: {
      label: '页面导航',
      level: [2, 3],
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },

    returnToTopLabel: '回到顶部',
    sidebarMenuLabel: '菜单',
    darkModeSwitchLabel: '主题',
  },
})
