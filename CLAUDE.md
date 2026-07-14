# CLAUDE.md — ZC UI Component Library

## Project Overview

ZC UI is a Vue 3 enterprise-grade UI component library built with TypeScript. It follows a monorepo architecture using pnpm workspaces, inspired by Element Plus. The library provides 30+ components covering layout, form, data display, and feedback/navigation categories.

## Monorepo Structure

```
packages/
├── components/   # Core UI component library (30+ Vue 3 SFC components)
├── hooks/        # Vue 3 Composables (useNamespace, useEventListener, etc.)
├── locale/       # Internationalization (i18n) system
├── theme/        # Design tokens & CSS custom properties
├── utils/        # Shared utility functions (withInstall, DOM helpers, etc.)
docs/             # VitePress documentation site with interactive demos
```

## Key Directories & Roles

- **`packages/components/src/`** — All component source code. Each component lives in its own directory (e.g., `button/button.vue`).
- **`packages/components/src/__tests__/`** — Vitest test files for each component.
- **`packages/components/src/index.ts`** — Barrel export entry. Registers all components with `withInstall()` pattern.
- **`docs/components/`** — Markdown documentation with `<DemoBlock>` interactive examples.
- **`docs/.vitepress/theme/`** — Custom VitePress theme components (ApiTable, DemoBlock).

## Build & Development Commands

```bash
pnpm install          # Install all workspace dependencies
pnpm dev              # Start VitePress docs dev server
pnpm build            # Build all packages (theme → utils → locale → hooks → components)
pnpm test             # Run all tests (Vitest)
pnpm test:watch       # Watch mode tests
pnpm test:coverage    # Test coverage report
pnpm typecheck        # TypeScript type checking (vue-tsc --build)
pnpm lint             # ESLint auto-fix
pnpm lint:check       # ESLint check (no fix)
pnpm format           # Prettier format
pnpm docs:build       # Build packages + docs for production
```

## Architecture Decisions

### Component Registration Pattern

Each component uses `withInstall(Component, 'Name')` to support both individual imports (tree-shakeable) and global registration via `app.use()`.

### CSS Architecture

- Components use scoped `<style>` blocks within SFCs
- Design tokens are defined as CSS custom properties in `@zc-ui/theme`
- `useNamespace()` composable provides BEM-style class name generation (`zc-button__label--active`)

### Type Exports

Component types are co-located with components and re-exported from `index.ts` using `export type { ... }` syntax for proper tree-shaking.

### Testing

- Vitest + Vue Test Utils (`@vue/test-utils`)
- Tests are in `packages/components/src/__tests__/` and `packages/*/src/__tests__/`
- Each component has comprehensive unit tests covering props, events, slots, and edge cases

### Build

- Vite is used as the build tool for all packages
- `vite-plugin-dts` generates TypeScript declaration files (`.d.ts`)
- Output formats: ESM (`.mjs`), CJS (`.cjs`), UMD (`.umd.js`)
- CSS is extracted to a single `dist/index.css` file

## Coding Conventions

- **Vue 3 Composition API** with `<script setup lang="ts">`
- **Component naming**: `Zc` prefix (e.g., `ZcButton`, `ZcInput`)
- **File naming**: kebab-case for directories, PascalCase or kebab-case for `.vue` files
- **TypeScript**: Strict mode enabled, prefer explicit types for public APIs
- **CSS**: Use design tokens (CSS variables) instead of hardcoded values
- **Git commits**: Conventional Commits enforced via commitlint (`feat:`, `fix:`, `docs:`, `refactor:`, etc.)
- **Pre-commit hooks**: Husky + lint-staged runs ESLint and Prettier on staged files

## Component Categories

1. **Basic**: Button, Icon
2. **Layout**: Container, Header, Aside, Main, Footer, Row, Col, Space, Grid, GridItem
3. **Form**: Input, Switch, Checkbox, CheckboxGroup, Radio, RadioGroup, Select, Form, FormItem, DatePicker
4. **Data Display**: Tag, Badge, Avatar, Empty, Skeleton, Table
5. **Feedback & Navigation**: Tooltip, Dialog, Pagination, Message, Notification, Loading

## CI/CD

- GitHub Actions workflows for CI (test + build) and docs deployment to GitHub Pages
- Changesets for versioning and publishing to npm
