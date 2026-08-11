/**
 * ZC UI Components - Barrel export entry
 */

import { withInstall, withInstallAll } from '@zc-ui/utils'
import Button from './button/button.vue'
import ButtonGroup from './button/button-group.vue'
import Row from './row/row.vue'
import Col from './col/col.vue'
import Container from './container/container.vue'
import Header from './container/header.vue'
import Aside from './container/aside.vue'
import Main from './container/main.vue'
import Footer from './container/footer.vue'
import Space from './space/space.vue'
import Grid from './grid/grid.vue'
import GridItem from './grid/grid-item.vue'
// ---- Form Components ----
import Input from './input/input.vue'
import Switch from './switch/switch.vue'
import Checkbox from './checkbox/checkbox.vue'
import CheckboxGroup from './checkbox/checkbox-group.vue'
import Radio from './radio/radio.vue'
import RadioGroup from './radio/radio-group.vue'
import Select from './select/select.vue'
import Form from './form/form.vue'
import FormItem from './form/form-item.vue'
import DatePicker from './date-picker/date-picker.vue'
// ---- Data Display Components ----
import Tag from './tag/tag.vue'
import Badge from './badge/badge.vue'
import Avatar from './avatar/avatar.vue'
import AvatarGroup from './avatar/avatar-group.vue'
import Empty from './empty/empty.vue'
import Skeleton from './skeleton/skeleton.vue'
import SkeletonItem from './skeleton/skeleton-item.vue'
import Table from './table/table.vue'
// ---- Data Display Components (1.5) ----
import Image from './image/image.vue'
import Tree from './tree/tree.vue'
import TreeNode from './tree/tree-node.vue'
import Descriptions from './descriptions/descriptions.vue'
import DescriptionsItem from './descriptions/descriptions-item.vue'
import Statistic from './statistic/statistic.vue'
import Countdown from './countdown/countdown.vue'
import Timeline from './timeline/timeline.vue'
import TimelineItem from './timeline/timeline-item.vue'
import List from './list/list.vue'
import ListItem from './list/list-item.vue'
import Carousel from './carousel/carousel.vue'
import CarouselItem from './carousel/carousel-item.vue'
// ---- Calendar Component ----
import Calendar from './calendar/calendar.vue'
// ---- Feedback & Navigation Components ----
import Icon from './icon/icon.vue'
import Tooltip from './tooltip/tooltip.vue'
import Dialog from './dialog/dialog.vue'
import Pagination from './pagination/pagination.vue'
import MessageComponent from './message/message.vue'
import NotificationComponent from './notification/notification.vue'
import LoadingComponent from './loading/loading.vue'
// ---- Navigation Components ----
import Menu from './menu/menu.vue'
import MenuItem from './menu/menu-item.vue'
import Submenu from './menu/submenu.vue'
import Tabs from './tabs/tabs.vue'
import TabPane from './tabs/tab-pane.vue'
import Breadcrumb from './breadcrumb/breadcrumb.vue'
import BreadcrumbItem from './breadcrumb/breadcrumb-item.vue'
import Dropdown from './dropdown/dropdown.vue'
import DropdownMenu from './dropdown/dropdown-menu.vue'
import DropdownItem from './dropdown/dropdown-item.vue'
import Anchor from './anchor/anchor.vue'
import AnchorLink from './anchor/anchor-link.vue'
import Backtop from './backtop/backtop.vue'
import Affix from './affix/affix.vue'
import FloatButton from './float-button/float-button.vue'
import FloatButtonGroup from './float-button/float-button-group.vue'
// ---- Container & Basic Components ----
import Card from './card/card.vue'
import Divider from './divider/divider.vue'
import Collapse from './collapse/collapse.vue'
import CollapseItem from './collapse/collapse-item.vue'
import Scrollbar from './scrollbar/scrollbar.vue'
// ---- Feedback & Interaction Components ----
import Alert from './alert/alert.vue'
import Drawer from './drawer/drawer.vue'
import Progress from './progress/progress.vue'
import Steps from './steps/steps.vue'
import Step from './steps/step.vue'
import Popconfirm from './popconfirm/popconfirm.vue'
import Result from './result/result.vue'
import Watermark from './watermark/watermark.vue'
// ---- Form Enhancement Components ----
import AutoComplete from './auto-complete/auto-complete.vue'
import InputNumber from './input-number/input-number.vue'
import ColorPicker from './color-picker/color-picker.vue'
import Rate from './rate/rate.vue'
import Slider from './slider/slider.vue'
import TimePicker from './time-picker/time-picker.vue'
import Upload from './upload/upload.vue'
// ---- Tag Input Component ----
import InputTag from './input-tag/input-tag.vue'
// ---- Advanced Form Components ----
import Cascader from './cascader/cascader.vue'
import Transfer from './transfer/transfer.vue'
import Mention from './mention/mention.vue'
import TreeSelect from './tree-select/tree-select.vue'
// ---- Navigation Enhancement Components ----
import Segmented from './segmented/segmented.vue'
// ---- Feedback Enhancement Components ----
import Tour from './tour/tour.vue'
// ---- Infrastructure Components ----
import ConfigProvider from './config-provider/config-provider.vue'
// ---- Layout Enhancement Components ----
import Flex from './flex/flex.vue'
// ---- Typography Components ----
import TypographyTitle from './typography/title.vue'
import TypographyText from './typography/text.vue'
import TypographyParagraph from './typography/paragraph.vue'
import TypographyLink from './typography/link.vue'
// ---- Overlay Components ----
import Popover from './popover/popover.vue'
// ---- Utility Components ----
import QRCode from './qr-code/qr-code.vue'
// ---- Feedback Components ----
import MessageBoxComponent from './message-box/message-box.vue'
// ---- Image Viewer ----
import ImageViewer from './image-viewer/image-viewer.vue'
// ---- Context Menu ----
import ContextMenu from './context-menu/context-menu.vue'
// ---- Page Header ----
import PageHeader from './page-header/page-header.vue'
// ---- Splitter Component ----
import Splitter from './splitter/splitter.vue'
// ---- Input OTP Component ----
import InputOTP from './input-otp/input-otp.vue'
// ---- Text Ellipsis Component ----
import TextEllipsis from './text-ellipsis/text-ellipsis.vue'
// ---- Spin Component ----
import Spin from './spin/spin.vue'
// ---- Editable Component ----
import Editable from './editable/editable.vue'
// ---- Masonry Component ----
import Masonry from './masonry/masonry.vue'
// ---- Comment Component ----
import Comment from './comment/comment.vue'
// ---- CodeBlock Component ----
import CodeBlock from './code-block/code-block.vue'
// ---- CountTo Component ----
import CountTo from './count-to/count-to.vue'
// ---- StatisticCard Component ----
import StatisticCard from './statistic-card/statistic-card.vue'
// ---- ErrorBoundary Component ----
import ErrorBoundary from './error-boundary/error-boundary.vue'
// ---- ActionSheet Component ----
import ActionSheet from './action-sheet/action-sheet.vue'

/**
 * Individual component exports with installer pattern.
 * Each component can be used individually or registered globally.
 *
 * @example Individual import (tree-shakeable):
 * import { ZcButton } from '@zc-ui/components'
 *
 * @example Global registration:
 * import ZcUI from '@zc-ui/components'
 * app.use(ZcUI)
 */
export const ZcButton = withInstall(Button, 'ZcButton')
export const ZcButtonGroup = withInstall(ButtonGroup, 'ZcButtonGroup')

// ---- Layout Components ----
export const ZcRow = withInstall(Row, 'ZcRow')
export const ZcCol = withInstall(Col, 'ZcCol')
export const ZcContainer = withInstall(Container, 'ZcContainer')
export const ZcHeader = withInstall(Header, 'ZcHeader')
export const ZcAside = withInstall(Aside, 'ZcAside')
export const ZcMain = withInstall(Main, 'ZcMain')
export const ZcFooter = withInstall(Footer, 'ZcFooter')
export const ZcSpace = withInstall(Space, 'ZcSpace')
export const ZcGrid = withInstall(Grid, 'ZcGrid')
export const ZcGridItem = withInstall(GridItem, 'ZcGridItem')

// ---- Form Components ----
export const ZcInput = withInstall(Input, 'ZcInput')
export const ZcSwitch = withInstall(Switch, 'ZcSwitch')
export const ZcCheckbox = withInstall(Checkbox, 'ZcCheckbox')
export const ZcCheckboxGroup = withInstall(CheckboxGroup, 'ZcCheckboxGroup')
export const ZcRadio = withInstall(Radio, 'ZcRadio')
export const ZcRadioGroup = withInstall(RadioGroup, 'ZcRadioGroup')
export const ZcSelect = withInstall(Select, 'ZcSelect')
export const ZcForm = withInstall(Form, 'ZcForm')
export const ZcFormItem = withInstall(FormItem, 'ZcFormItem')
export const ZcDatePicker = withInstall(DatePicker, 'ZcDatePicker')

// ---- Data Display Components ----
export const ZcTag = withInstall(Tag, 'ZcTag')
export const ZcBadge = withInstall(Badge, 'ZcBadge')
export const ZcAvatar = withInstall(Avatar, 'ZcAvatar')
export const ZcAvatarGroup = withInstall(AvatarGroup, 'ZcAvatarGroup')
export const ZcEmpty = withInstall(Empty, 'ZcEmpty')
export const ZcSkeleton = withInstall(Skeleton, 'ZcSkeleton')
export const ZcSkeletonItem = withInstall(SkeletonItem, 'ZcSkeletonItem')
export const ZcTable = withInstall(Table, 'ZcTable')

// ---- Data Display Components (1.5) ----
export const ZcImage = withInstall(Image, 'ZcImage')
export const ZcTree = withInstall(Tree, 'ZcTree')
export const ZcTreeNode = withInstall(TreeNode, 'ZcTreeNode')
export const ZcDescriptions = withInstall(Descriptions, 'ZcDescriptions')
export const ZcDescriptionsItem = withInstall(DescriptionsItem, 'ZcDescriptionsItem')
export const ZcStatistic = withInstall(Statistic, 'ZcStatistic')
export const ZcCountdown = withInstall(Countdown, 'ZcCountdown')
// Statistic.Countdown namespace pattern (Ant Design compatible)
;(ZcStatistic as any).Countdown = ZcCountdown
export const ZcTimeline = withInstall(Timeline, 'ZcTimeline')
export const ZcTimelineItem = withInstall(TimelineItem, 'ZcTimelineItem')
export const ZcList = withInstall(List, 'ZcList')
export const ZcListItem = withInstall(ListItem, 'ZcListItem')
export const ZcCarousel = withInstall(Carousel, 'ZcCarousel')
export const ZcCarouselItem = withInstall(CarouselItem, 'ZcCarouselItem')

// ---- Calendar Component ----
export const ZcCalendar = withInstall(Calendar, 'ZcCalendar')

// ---- Feedback & Navigation Components ----
export const ZcIcon = withInstall(Icon, 'ZcIcon')
export const ZcTooltip = withInstall(Tooltip, 'ZcTooltip')
export const ZcDialog = withInstall(Dialog, 'ZcDialog')
export const ZcPagination = withInstall(Pagination, 'ZcPagination')
export const ZcMessageComponent = withInstall(MessageComponent, 'ZcMessage')
export const ZcNotificationComponent = withInstall(NotificationComponent, 'ZcNotification')
export const ZcLoadingComponent = withInstall(LoadingComponent, 'ZcLoading')

// ---- Navigation Components ----
export const ZcMenu = withInstall(Menu, 'ZcMenu')
export const ZcMenuItem = withInstall(MenuItem, 'ZcMenuItem')
export const ZcSubmenu = withInstall(Submenu, 'ZcSubmenu')
export const ZcTabs = withInstall(Tabs, 'ZcTabs')
export const ZcTabPane = withInstall(TabPane, 'ZcTabPane')
export const ZcBreadcrumb = withInstall(Breadcrumb, 'ZcBreadcrumb')
export const ZcBreadcrumbItem = withInstall(BreadcrumbItem, 'ZcBreadcrumbItem')
export const ZcDropdown = withInstall(Dropdown, 'ZcDropdown')
export const ZcDropdownMenu = withInstall(DropdownMenu, 'ZcDropdownMenu')
export const ZcDropdownItem = withInstall(DropdownItem, 'ZcDropdownItem')
export const ZcAnchor = withInstall(Anchor, 'ZcAnchor')
export const ZcAnchorLink = withInstall(AnchorLink, 'ZcAnchorLink')
export const ZcBacktop = withInstall(Backtop, 'ZcBacktop')
export const ZcAffix = withInstall(Affix, 'ZcAffix')
export const ZcFloatButton = withInstall(FloatButton, 'ZcFloatButton')
export const ZcFloatButtonGroup = withInstall(FloatButtonGroup, 'ZcFloatButtonGroup')

// ---- Container & Basic Components ----
export const ZcCard = withInstall(Card, 'ZcCard')
export const ZcDivider = withInstall(Divider, 'ZcDivider')
export const ZcCollapse = withInstall(Collapse, 'ZcCollapse')
export const ZcCollapseItem = withInstall(CollapseItem, 'ZcCollapseItem')
export const ZcScrollbar = withInstall(Scrollbar, 'ZcScrollbar')

// ---- Feedback & Interaction Components ----
export const ZcAlert = withInstall(Alert, 'ZcAlert')
export const ZcDrawer = withInstall(Drawer, 'ZcDrawer')
export const ZcProgress = withInstall(Progress, 'ZcProgress')
export const ZcSteps = withInstall(Steps, 'ZcSteps')
export const ZcStep = withInstall(Step, 'ZcStep')
export const ZcPopconfirm = withInstall(Popconfirm, 'ZcPopconfirm')
export const ZcResult = withInstall(Result, 'ZcResult')
export const ZcWatermark = withInstall(Watermark, 'ZcWatermark')

// ---- Form Enhancement Components ----
export const ZcAutoComplete = withInstall(AutoComplete, 'ZcAutoComplete')
export const ZcInputNumber = withInstall(InputNumber, 'ZcInputNumber')
export const ZcColorPicker = withInstall(ColorPicker, 'ZcColorPicker')
export const ZcRate = withInstall(Rate, 'ZcRate')
export const ZcSlider = withInstall(Slider, 'ZcSlider')
export const ZcTimePicker = withInstall(TimePicker, 'ZcTimePicker')
export const ZcUpload = withInstall(Upload, 'ZcUpload')

// ---- Tag Input Component ----
export const ZcInputTag = withInstall(InputTag, 'ZcInputTag')

// ---- Advanced Form Components ----
export const ZcCascader = withInstall(Cascader, 'ZcCascader')
export const ZcTransfer = withInstall(Transfer, 'ZcTransfer')
export const ZcMention = withInstall(Mention, 'ZcMention')
export const ZcTreeSelect = withInstall(TreeSelect, 'ZcTreeSelect')

// ---- Navigation Enhancement Components ----
export const ZcSegmented = withInstall(Segmented, 'ZcSegmented')

// ---- Feedback Enhancement Components ----
export const ZcTour = withInstall(Tour, 'ZcTour')

// ---- Infrastructure Components ----
export const ZcConfigProvider = withInstall(ConfigProvider, 'ZcConfigProvider')

// ---- Utility Components ----
export const ZcQRCode = withInstall(QRCode, 'ZcQRCode')

// ---- Feedback Components ----
export const ZcMessageBoxComponent = withInstall(MessageBoxComponent, 'ZcMessageBox')

// ---- Image Viewer ----
export const ZcImageViewer = withInstall(ImageViewer, 'ZcImageViewer')

// ---- Context Menu ----
export const ZcContextMenu = withInstall(ContextMenu, 'ZcContextMenu')

// ---- Page Header ----
export const ZcPageHeader = withInstall(PageHeader, 'ZcPageHeader')

// ---- Splitter Component ----
export const ZcSplitter = withInstall(Splitter, 'ZcSplitter')

// ---- Input OTP Component ----
export const ZcInputOTP = withInstall(InputOTP, 'ZcInputOTP')

// ---- Text Ellipsis Component ----
export const ZcTextEllipsis = withInstall(TextEllipsis, 'ZcTextEllipsis')

// ---- Spin Component ----
export const ZcSpin = withInstall(Spin, 'ZcSpin')

// ---- Editable Component ----
export const ZcEditable = withInstall(Editable, 'ZcEditable')

// ---- Masonry Component ----
export const ZcMasonry = withInstall(Masonry, 'ZcMasonry')

// ---- Comment Component ----
export const ZcComment = withInstall(Comment, 'ZcComment')

// ---- CodeBlock Component ----
export const ZcCodeBlock = withInstall(CodeBlock, 'ZcCodeBlock')

// ---- CountTo Component ----
export const ZcCountTo = withInstall(CountTo, 'ZcCountTo')

// ---- StatisticCard Component ----
export const ZcStatisticCard = withInstall(StatisticCard, 'ZcStatisticCard')

// ---- ErrorBoundary Component ----
export const ZcErrorBoundary = withInstall(ErrorBoundary, 'ZcErrorBoundary')

// ---- ActionSheet Component ----
export const ZcActionSheet = withInstall(ActionSheet, 'ZcActionSheet')

// ---- Layout Enhancement Components ----
export const ZcFlex = withInstall(Flex, 'ZcFlex')

// ---- Typography Components ----
export const ZcTitle = withInstall(TypographyTitle, 'ZcTitle')
export const ZcText = withInstall(TypographyText, 'ZcText')
export const ZcParagraph = withInstall(TypographyParagraph, 'ZcParagraph')
export const ZcLink = withInstall(TypographyLink, 'ZcLink')

// ---- Overlay Components ----
export const ZcPopover = withInstall(Popover, 'ZcPopover')

/**
 * Registers all ZC UI components globally.
 */
export default withInstallAll({
  ZcButton,
  ZcButtonGroup,
  ZcRow,
  ZcCol,
  ZcContainer,
  ZcHeader,
  ZcAside,
  ZcMain,
  ZcFooter,
  ZcSpace,
  ZcGrid,
  ZcGridItem,
  // Form Components
  ZcInput,
  ZcSwitch,
  ZcCheckbox,
  ZcCheckboxGroup,
  ZcRadio,
  ZcRadioGroup,
  ZcSelect,
  ZcForm,
  ZcFormItem,
  ZcDatePicker,
  // Data Display Components
  ZcTag,
  ZcBadge,
  ZcAvatar,
  ZcAvatarGroup,
  ZcEmpty,
  ZcSkeleton,
  ZcSkeletonItem,
  ZcTable,
  // Data Display Components (1.5)
  ZcImage,
  ZcTree,
  ZcTreeNode,
  ZcDescriptions,
  ZcDescriptionsItem,
  ZcStatistic,
  ZcCountdown,
  ZcTimeline,
  ZcTimelineItem,
  ZcList,
  ZcListItem,
  ZcCarousel,
  ZcCarouselItem,
  // Calendar Component
  ZcCalendar,
  // Feedback & Navigation Components
  ZcIcon,
  ZcTooltip,
  ZcDialog,
  ZcPagination,
  ZcMessageComponent,
  ZcNotificationComponent,
  ZcLoadingComponent,
  // Navigation Components
  ZcMenu,
  ZcMenuItem,
  ZcSubmenu,
  ZcTabs,
  ZcTabPane,
  ZcBreadcrumb,
  ZcBreadcrumbItem,
  ZcDropdown,
  ZcDropdownMenu,
  ZcDropdownItem,
  ZcAnchor,
  ZcAnchorLink,
  ZcBacktop,
  ZcAffix,
  ZcFloatButton,
  ZcFloatButtonGroup,
  // Container & Basic Components
  ZcCard,
  ZcDivider,
  ZcCollapse,
  ZcCollapseItem,
  ZcScrollbar,
  // Feedback & Interaction Components
  ZcAlert,
  ZcDrawer,
  ZcProgress,
  ZcSteps,
  ZcStep,
  ZcPopconfirm,
  ZcResult,
  ZcWatermark,
  // Form Enhancement Components
  ZcAutoComplete,
  ZcInputNumber,
  ZcColorPicker,
  ZcRate,
  ZcSlider,
  ZcTimePicker,
  ZcUpload,
  // Tag Input Component
  ZcInputTag,
  // Advanced Form Components
  ZcCascader,
  ZcTransfer,
  ZcMention,
  ZcTreeSelect,
  // Navigation Enhancement Components
  ZcSegmented,
  // Feedback Enhancement Components
  ZcTour,
  // Infrastructure Components
  ZcConfigProvider,
  // Utility Components
  ZcQRCode,
  // Layout Enhancement Components
  ZcFlex,
  // Typography Components
  ZcTitle,
  ZcText,
  ZcParagraph,
  ZcLink,
  // Overlay Components
  ZcPopover,
  // Feedback Components
  ZcMessageBoxComponent,
  // Image Viewer
  ZcImageViewer,
  // Context Menu
  ZcContextMenu,
  // Page Header
  ZcPageHeader,
  // Splitter
  ZcSplitter,
  // Input OTP
  ZcInputOTP,
  // Text Ellipsis
  ZcTextEllipsis,
  // Spin
  ZcSpin,
  // Editable
  ZcEditable,
  // Masonry
  ZcMasonry,
  // Comment
  ZcComment,
  // CodeBlock
  ZcCodeBlock,
  // CountTo
  ZcCountTo,
  // StatisticCard
  ZcStatisticCard,
  // ErrorBoundary
  ZcErrorBoundary,
  // ActionSheet
  ZcActionSheet,
})

// Export TypeScript types
export * from './types'
// Re-export component-level type definitions
export type { BreakpointKey, Gutter, RowJustify, RowAlign } from './row/row.vue'
export type { ResponsiveValue } from './col/col.vue'
export type { ContainerDirection } from './container/container.vue'
export type {
  SpaceDirection,
  SpaceAlignment,
  SpaceSize,
  SpaceWrap,
  SpaceFill,
} from './space/space.vue'
export type {
  GridJustifyItems,
  GridAlignItems,
  GridJustifyContent,
  GridAlignContent,
} from './grid/grid.vue'

// ---- Form Component Types ----
export type { ButtonType, ButtonSize, ButtonNativeType } from './button/button.vue'
export type { ButtonGroupSize, ButtonGroupDirection } from './button/button-group.vue'
export type { InputType, InputSize } from './input/input.vue'
export type { SwitchSize } from './switch/switch.vue'
export type { SelectOption, SelectOptionGroup, SelectValue, SelectSize } from './select/types'
export type { DatePickerType, DatePickerShortcut } from './date-picker/date-picker.vue'
export type {
  FormLabelPosition,
  FormItemRule,
  FormRules,
  FormArrayItem,
  FormArrayOptions,
  UseFormArrayReturn,
} from './form/types'
export { createFormArray, useFormArray } from './form/useFormArray'
export type { checkboxGroupKey, CheckboxGroupContext } from './checkbox/checkbox-group.vue'
export type { CheckboxSize } from './checkbox/checkbox.vue'
export { radioGroupKey, type RadioGroupContext } from './radio/radio-group.vue'
export type { RadioSize } from './radio/radio.vue'

// ---- Data Display Component Types ----
export type { TagType, TagEffect } from './tag/tag.vue'
export type { BadgeType } from './badge/badge.vue'
export type { AvatarSize, AvatarShape } from './avatar/avatar.vue'
export type { AvatarGroupSize } from './avatar/avatar-group.vue'
export type { SkeletonAnimation } from './skeleton/skeleton.vue'
export type { SkeletonItemVariant, SkeletonItemAnimation } from './skeleton/skeleton-item.vue'
export type {
  TableColumn,
  TableFilterOption,
  SortOrder,
  SortState,
  FilterState,
  PaginationConfig,
  SpanMethod,
  SpanValue,
  TableTreePropsConfig,
  SummaryMethod,
  ColumnSettingItem,
  EditState,
  DragSortEvent,
  ColumnResizeEvent,
} from './table/types'

// ---- Data Display Component Types (1.5) ----
export type { ImageFit } from './image/image.vue'
export type { TreeNodeData, TreePropsConfig } from './tree/types'
export type { DescriptionsDirection, DescriptionsSize } from './descriptions/types'
export type { TimelineItemType } from './timeline/timeline-item.vue'
export type { CountdownProps, CountdownEmits, CountdownExposed } from './countdown/types'

// ---- Calendar Component Types ----
export type { CalendarDateRange, CalendarDateCell } from './calendar/calendar.vue'

// ---- Feedback & Navigation Component Types ----
export type { IconSize } from './icon/icon.vue'
export type { TooltipPlacement, TooltipTrigger } from './tooltip/tooltip.vue'
export type { DialogSize, DialogProps, DialogEmits } from './dialog/types'
export type { PaginationLayout, PaginationProps, PaginationEmits } from './pagination/types'
export type { MessageType } from './message/message.vue'
export type { NotificationType, NotificationPosition } from './notification/notification.vue'

// ---- Functional API exports ----
export { message as ZcMessage, closeAllMessages as ZcMessageCloseAll } from './message/message'
export type { MessageOptions, MessageInstance } from './message/message'
export {
  notify as ZcNotification,
  closeAllNotifications as ZcNotificationCloseAll,
} from './notification/notification'
export type { NotificationOptions, NotificationInstance } from './notification/notification'
export { ZcLoadingDirective, ZcLoadingService } from './loading/loading'
export type { LoadingOptions, LoadingInstance } from './loading/loading'

// ---- MessageBox Functional API ----
export { ZcMessageBox } from './message-box/message-box'
export type {
  MessageBoxOptions,
  MessageBoxResult,
  MessageBoxType,
  MessageBoxAction,
  MessageBoxCallback,
} from './message-box/types'

// ---- Image Viewer Types ----
export type {
  ImageViewerOptions,
  ImageViewerProps,
  ImageViewerEmits,
  ImageViewerInstance,
} from './image-viewer/types'

// ---- Context Menu Types & Directive ----
export { ZcContextMenuDirective } from './context-menu/context-menu-directive'
export type {
  ContextMenuItem,
  ContextMenuOptions,
  ContextMenuProps,
  ContextMenuEmits,
} from './context-menu/types'

// ---- Custom Directives ----
export { ZcCopyDirective } from './directives/copy'
export { ZcDebounceDirective } from './directives/debounce'
export { ZcTooltipDirective } from './tooltip/tooltip-directive'
export type {
  TooltipDirectivePlacement,
  TooltipDirectiveOptions,
} from './tooltip/tooltip-directive'

// ---- Infinite Scroll Directive ----
export { ZcInfiniteScrollDirective } from './infinite-scroll/infinite-scroll'
export type { InfiniteScrollOptions } from './infinite-scroll/infinite-scroll'

// ---- Navigation Component Types ----
export type { MenuMode } from './menu/types'
export type { TabsType, TabsPosition, PaneData, TabsProps, TabsEmits } from './tabs/types'
export type { BreadcrumbSeparator } from './breadcrumb/breadcrumb.vue'
export type { DropdownTrigger, DropdownPlacement } from './dropdown/types'
export type { AnchorDirection } from './anchor/anchor.vue'
export type { BacktopPosition } from './backtop/backtop.vue'
export type { AffixPosition } from './affix/affix.vue'

// ---- Container & Basic Component Types ----
export type { CardShadow } from './card/card.vue'
export type {
  DividerDirection,
  DividerContentPosition,
  DividerBorderStyle,
} from './divider/divider.vue'
export type { CollapseModelValue, CollapseItemName } from './collapse/collapse.vue'
export type { ScrollbarHeight } from './scrollbar/scrollbar.vue'

// ---- Feedback & Interaction Component Types ----
export type { AlertType, AlertEffect, AlertProps, AlertEmits } from './alert/types'
export type { DrawerDirection, DrawerProps, DrawerEmits } from './drawer/types'
export type { ProgressType, ProgressStatus, ProgressProps } from './progress/types'
export type { StepsDirection, StepsType, StepStatus } from './steps/types'
export type { PopconfirmPlacement, PopconfirmTrigger } from './popconfirm/popconfirm.vue'
export type { ResultStatus } from './result/result.vue'

// ---- Form Enhancement Component Types ----
export type {
  AutoCompleteOption,
  AutoCompleteValue,
  AutoCompleteSize,
  AutoCompleteFetcher,
} from './auto-complete/types'
export type { InputNumberSize, ControlsPosition } from './input-number/types'
export type { ColorFormat, RGBColor, HSLColor } from './color-picker/types'
export type { RateProps } from './rate/types'
export type { SliderMark, SliderValue, SliderSize } from './slider/types'
export type {
  UploadFile,
  UploadRequestOptions,
  UploadListType,
  UploadTrigger,
} from './upload/types'

// ---- Tag Input Component Types ----
export type { InputTagProps, InputTagEmits, InputTagSize } from './input-tag/types'

// ---- Advanced Form Component Types ----
export type {
  CascaderOption,
  CascaderSize,
  CascaderExpandTrigger,
  CascaderProps,
} from './cascader/types'
export type { TransferOption, TransferDataItem, TransferProps } from './transfer/types'
export type {
  MentionOption,
  MentionOptionGroup,
  MentionPlacement,
  MentionType,
  MentionBlurBehavior,
  MentionFilterFunc,
  MentionProps,
  MentionMentionItem,
} from './mention/types'
export type { TreeSelectOption, TreeSelectSize, TreeSelectProps } from './tree-select/types'

// ---- Navigation Enhancement Component Types ----
export type { SegmentedOption, SegmentedSize } from './segmented/segmented.vue'

// ---- Feedback Enhancement Component Types ----
export type {
  TourPlacement,
  TourStep,
  TourTarget,
  TourIndicatorType,
  TourProps,
  TourEmits,
} from './tour/types'

// ---- Infrastructure Component Types & Composables ----
export { useGlobalConfig } from './config-provider/useGlobalConfig'
export type {
  ComponentSize,
  ConfigProviderProps,
  ConfigProviderContext,
  MessageConfig,
  NotificationConfig,
  ButtonConfig,
} from './config-provider/types'

// ---- Utility Component Types ----
export type {
  QRCodeProps,
  QRCodeEmits,
  QRCodeExposed,
  QRCodeLevel,
  QRCodeType,
  QRCodeStatus,
  QRCodeImageSettings,
} from './qr-code/types'

// ---- Layout Enhancement Component Types ----
export type { FlexJustify, FlexAlign, FlexWrap, FlexGap } from './flex/flex.vue'

// ---- Splitter Component Types ----
export type { SplitterDirection } from './splitter/splitter.vue'

// ---- Input OTP Component Types ----
export type { InputOTPSize } from './input-otp/input-otp.vue'

// ---- Text Ellipsis Component Types ----
export type { TextEllipsisPlacement } from './text-ellipsis/text-ellipsis.vue'

// ---- Spin Component Types ----
export type { SpinSize } from './spin/spin.vue'

// ---- Editable Component Types ----
export type { EditableMode } from './editable/editable.vue'

// ---- Masonry Component Types ----
// (no exported types needed — props are inline)

// ---- Comment Component Types ----
// (no exported types needed — props are inline)

// ---- CodeBlock Component Types ----
export type { CodeBlockTheme } from './code-block/code-block.vue'

// ---- CountTo Component Types ----
export type { CountToEasing } from './count-to/count-to.vue'

// ---- StatisticCard Component Types ----
export type { StatisticCardTrend } from './statistic-card/statistic-card.vue'

// ---- ActionSheet Component Types ----
export type { ActionSheetItem } from './action-sheet/action-sheet.vue'

// ---- Typography Component Types ----
export type { TitleLevel } from './typography/title.vue'
export type { TextType, TextSize } from './typography/text.vue'
export type { ParagraphEllipsisConfig } from './typography/paragraph.vue'
export type { LinkType } from './typography/link.vue'

// ---- Overlay Component Types ----
export type { PopoverPlacement, PopoverTrigger } from './popover/popover.vue'

// ---- Theme System Re-exports (from @zc-ui/theme) ----
export {
  // Color Generator
  generateColorScale,
  generatePalette,
  paletteToCssVars,
  paletteToCssText,
  // Theme Presets
  lightTheme,
  darkTheme,
  createTheme,
  mergeThemes,
  getComponentOverrides,
  themeToCssText,
  componentShorthandToCssVars,
  // Runtime Theme API
  applyTheme,
  setBrandColor,
  setBrandColors,
  setThemeVariable,
  removeThemeVariable,
  applyDarkMode,
  clearThemeOverrides,
  applyComponentOverrides,
  removeComponentOverrides,
  registerTheme,
  unregisterTheme,
  getRegisteredTheme,
  listRegisteredThemes,
  switchTheme,
  getCurrentThemeName,
  createThemeController,
  // CSS Layers
  cssLayerOrder,
  cssLayerDeclaration,
  generateCssLayerSetup,
  wrapInLayer,
  createLayeredStyleSheet,
  // CSS Variable Namespace
  createNamespace,
  applyNamespace,
  removeNamespace,
  namespaceToCssText,
  createVarResolver,
} from '@zc-ui/theme'
export type {
  ThemeVariables,
  ComponentThemeOverrides,
  ComponentShorthandOverrides,
  ThemePreset,
  CreateThemeOptions,
  PaletteInput,
  ColorPalette,
  CssVarNamespace,
  CreateNamespaceOptions,
  ZcCssLayer,
  ApplyThemeOptions,
} from '@zc-ui/theme'
