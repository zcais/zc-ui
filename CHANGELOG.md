# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Engineering & Quality

- **CI/CD Pipeline**: Added GitHub Actions CI workflow (`.github/workflows/ci.yml`) running `lint → typecheck → test → build` on every push and PR, with Node.js 18.x and 20.x matrix testing.
- **SSR-Safe Locale**: `createLocale()` now creates per-app isolated locale context via `createLocaleContext()`, preventing cross-request state contamination in SSR scenarios. Backward compatible — module-level singleton still works for SPA.
- **CHANGELOG.md**: This file, for tracking all notable changes.
- **Migration Guide**: Added `docs/migration/from-element-plus.md` for smooth migration from Element Plus.

#### Component Enhancements

- **Dialog**: Added `defineExpose({ show, hide, isVisible })` for imperative API access.
- **Select**: Added `focus()` and `blur()` methods to `defineExpose`.
- **Form Validation**: Enhanced with new rule types:
  - `type`: Built-in type checking (`string`, `number`, `boolean`, `array`, `object`, `email`, `url`)
  - `enum`: Enum value validation
  - `transform`: Pre-validation value transformation
  - `message` can now be a function for dynamic error messages
  - Custom `validator` can now return a `string` as an error message (in addition to `boolean | Promise<boolean>`)
  - Empty values skip non-required rules (standard behavior)

### Changed

#### Build & Bundle

- **Tree-Shaking**: Removed `"**/*.vue"` from `sideEffects` in `package.json`. Only CSS files are now marked as side-effects, enabling better tree-shaking of unused component JS.
- **CSS Output**: Updated Vite `assetFileNames` to use hashed names for better caching and per-chunk CSS extraction.

### Fixed

- **Locale SSR**: Module-level singleton no longer causes cross-request locale contamination in SSR. `createLocale()` now creates isolated per-app state.
- **Garbage Directories**: Removed empty `done/` and `echo/` directories from `packages/components/src/`.

---

## [1.0.1] - 2025-06-17

### Added

- 100+ Vue 3 components covering layout, form, data display, feedback, and navigation categories.
- Monorepo architecture with `packages/components`, `hooks`, `locale`, `theme`, `utils`, `resolver`, `nuxt-module`.
- Runtime theming system with `createTheme()`, `applyTheme()`, CSS Layers, and namespace support.
- Comprehensive design token system in `@zc-ui/theme`.
- Virtual scrolling for Table and Select components.
- Select with remote search, filterable, multiple, and allow-create support.
- Table with editable cells, drag-to-sort, column resize, and summary rows.
- Form validation with cross-field support and async validators.
- Internationalization (i18n) with `zh-CN` and `en-US` built-in.
- `useNamespace()` BEM-style composable for class name generation.
- `useFocusTrap()`, `useVirtualList()`, `useClickOutside()`, `useZIndex()` composables.
- `unplugin-resolver` for auto-import support.
- Nuxt module for seamless Nuxt 3 integration.
- 88 unit test files covering props, events, slots, and edge cases.
- Playwright E2E tests with axe-core accessibility auditing.
- VitePress documentation with interactive `<DemoBlock>` examples.
- ConfigProvider for global size and locale configuration.
