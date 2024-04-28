# Crucible Components

This is a project for creating crucible components that will be used as part of the Crucible Repository.

Node version requirement: 20

## Install Project as a package

- `yarn add https://github.com/UQ-eLIPSE/crucible-components.git#release-package`

- Import plugin:
  1. find `main.ts` in plugin host project and add:
     `import { createViewerPlugin } from "crucible-components"`,
     `import "crucible-components/dist/styles.css"`,
     `app.use(createViewer)` or `app.use(createViewer, { myOptionKey: value });`
  2. in the component, implement the following directly:
     <CrucibleComponent />

## Project Setup

```sh
yarn install
```

### Compile and Hot-Reload for Development

## set DUMY_DATA in .env file false for real question data otherwise dummy question data :

```sh
yarn run dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn run build
```

### Run Headed Component Tests with [Vitest Component Testing](https://vitest.dev)

```sh
yarn run test
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support For `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
