import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import DemoBlock from './components/DemoBlock.vue'
import ApiTable from './components/ApiTable.vue'
import ComponentOverview from './components/ComponentOverview.vue'
import IconGallery from './components/IconGallery.vue'
import ZcIconName from './components/ZcIconName.vue'
import DesignTokenPage from './components/DesignTokenPage.vue'
import ZcUI, { ZcLoadingDirective } from '@zc-ui/components'
import './styles.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // Register all Zc UI components globally
    app.use(ZcUI)
    // Register the v-loading directive
    app.directive('loading', ZcLoadingDirective)
    // Register documentation helper components
    app.component('DemoBlock', DemoBlock)
    app.component('ApiTable', ApiTable)
    app.component('ComponentOverview', ComponentOverview)
    app.component('IconGallery', IconGallery)
    app.component('ZcIconName', ZcIconName)
    app.component('DesignTokenPage', DesignTokenPage)
  },
} satisfies Theme
