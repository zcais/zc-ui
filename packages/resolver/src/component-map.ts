/**
 * Component name to directory mapping.
 *
 * Keys are PascalCase export names (e.g. `ZcButton`).
 * Values are the kebab-case directory names used in the package source.
 *
 * This is auto-generated from `packages/components/src/index.ts`.
 * When a new component is added, add its mapping here.
 */
export const componentMap: Record<string, string> = {
  // ---- Basic Components ----
  ZcButton: 'button',
  ZcIcon: 'icon',

  // ---- Layout Components ----
  ZcRow: 'row',
  ZcCol: 'col',
  ZcContainer: 'container',
  ZcHeader: 'container',
  ZcAside: 'container',
  ZcMain: 'container',
  ZcFooter: 'container',
  ZcSpace: 'space',
  ZcGrid: 'grid',
  ZcGridItem: 'grid',

  // ---- Form Components ----
  ZcInput: 'input',
  ZcSwitch: 'switch',
  ZcCheckbox: 'checkbox',
  ZcCheckboxGroup: 'checkbox',
  ZcRadio: 'radio',
  ZcRadioGroup: 'radio',
  ZcSelect: 'select',
  ZcForm: 'form',
  ZcFormItem: 'form',
  ZcDatePicker: 'date-picker',

  // ---- Data Display Components ----
  ZcTag: 'tag',
  ZcBadge: 'badge',
  ZcAvatar: 'avatar',
  ZcEmpty: 'empty',
  ZcSkeleton: 'skeleton',
  ZcSkeletonItem: 'skeleton',
  ZcTable: 'table',

  // ---- Data Display Components (1.5) ----
  ZcImage: 'image',
  ZcTree: 'tree',
  ZcTreeNode: 'tree',
  ZcDescriptions: 'descriptions',
  ZcDescriptionsItem: 'descriptions',
  ZcStatistic: 'statistic',
  ZcTimeline: 'timeline',
  ZcTimelineItem: 'timeline',
  ZcList: 'list',
  ZcListItem: 'list',
  ZcCarousel: 'carousel',
  ZcCarouselItem: 'carousel',

  // ---- Feedback & Navigation Components ----
  ZcTooltip: 'tooltip',
  ZcDialog: 'dialog',
  ZcPagination: 'pagination',
  ZcMessage: 'message',
  ZcNotification: 'notification',
  ZcLoading: 'loading',

  // ---- Navigation Components ----
  ZcMenu: 'menu',
  ZcMenuItem: 'menu',
  ZcSubmenu: 'menu',
  ZcTabs: 'tabs',
  ZcTabPane: 'tabs',
  ZcBreadcrumb: 'breadcrumb',
  ZcBreadcrumbItem: 'breadcrumb',
  ZcDropdown: 'dropdown',
  ZcDropdownMenu: 'dropdown',
  ZcDropdownItem: 'dropdown',
  ZcAnchor: 'anchor',
  ZcAnchorLink: 'anchor',
  ZcBacktop: 'backtop',
  ZcAffix: 'affix',

  // ---- Container & Basic Components ----
  ZcCard: 'card',
  ZcDivider: 'divider',
  ZcCollapse: 'collapse',
  ZcCollapseItem: 'collapse',
  ZcScrollbar: 'scrollbar',

  // ---- Feedback & Interaction Components ----
  ZcAlert: 'alert',
  ZcDrawer: 'drawer',
  ZcProgress: 'progress',
  ZcSteps: 'steps',
  ZcStep: 'steps',
  ZcPopconfirm: 'popconfirm',
  ZcResult: 'result',
  ZcWatermark: 'watermark',

  // ---- Form Enhancement Components ----
  ZcAutoComplete: 'auto-complete',
  ZcInputNumber: 'input-number',
  ZcColorPicker: 'color-picker',
  ZcRate: 'rate',
  ZcSlider: 'slider',
  ZcTimePicker: 'time-picker',
  ZcUpload: 'upload',

  // ---- Advanced Form Components ----
  ZcCascader: 'cascader',
  ZcTransfer: 'transfer',
  ZcMention: 'mention',
  ZcTreeSelect: 'tree-select',

  // ---- Navigation Enhancement Components ----
  ZcSegmented: 'segmented',

  // ---- Feedback Enhancement Components ----
  ZcTour: 'tour',

  // ---- Popover ----
  ZcPopover: 'popover',

  // ---- Countdown ----
  ZcCountdown: 'countdown',

  // ---- QR Code ----
  ZcQrCode: 'qr-code',
}

/**
 * Components that share a directory with a parent component.
 * These use the same CSS and source directory.
 */
export const parentChildMap: Record<string, string[]> = {
  Container: ['Header', 'Aside', 'Main', 'Footer'],
  Form: ['FormItem'],
  Checkbox: ['CheckboxGroup'],
  Radio: ['RadioGroup'],
  Grid: ['GridItem'],
  Skeleton: ['SkeletonItem'],
  Tree: ['TreeNode'],
  Descriptions: ['DescriptionsItem'],
  Timeline: ['TimelineItem'],
  List: ['ListItem'],
  Carousel: ['CarouselItem'],
  Menu: ['MenuItem', 'Submenu'],
  Tabs: ['TabPane'],
  Breadcrumb: ['BreadcrumbItem'],
  Dropdown: ['DropdownMenu', 'DropdownItem'],
  Anchor: ['AnchorLink'],
  Collapse: ['CollapseItem'],
  Steps: ['Step'],
}

/**
 * Functional API exports (not components, but useful with unplugin-auto-import).
 * These are imported from sub-paths within the components package.
 */
export const functionMap: Record<
  string,
  { from: string; sideEffects?: string[] }
> = {
  ZcMessage: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
  ZcMessageCloseAll: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
  ZcNotification: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
  ZcNotificationCloseAll: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
  ZcLoadingDirective: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
  ZcLoadingService: {
    from: '@zc-ui/components',
    sideEffects: ['@zc-ui/components/styles'],
  },
}
