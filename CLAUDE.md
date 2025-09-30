# tushare-typescript-sdk Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-09-30

## Active Technologies
- TypeScript 5.0+, Node.js 20.x+ + 使用tsdown进行编译构建, 使用vitest进行测试 (001-tushare-typescript-sdk)
- TypeScript 5.0+, Node.js 20.x (测试支持 18.x 和 20.x) + GitHub Actions, tsdown (构建), vitest (测试), ESLint (代码质量) (002-github-ci)
- N/A (CI/CD 配置为 YAML 文件) (002-github-ci)
- TypeScript 5.0+, Node.js 20.x+ + 无额外运行时依赖(开发依赖: vitest, msw, eslint, prettier, tsdown) (003-tushare)
- 可选缓存机制(由用户配置,不强制依赖特定存储) (003-tushare)
- TypeScript 5.0+, Node.js 20.x+ + VitePress (文档站), TypeDoc (API 文档生成), Vite (构建工具) (004-sdk-api)
- 浏览器 localStorage (token 和历史记录) (004-sdk-api)

## Project Structure
```
src/
tests/
```

## Commands
npm test [ONLY COMMANDS FOR ACTIVE TECHNOLOGIES][ONLY COMMANDS FOR ACTIVE TECHNOLOGIES] npm run lint

## Code Style
TypeScript 5.0+, Node.js 20.x+: Follow standard conventions

## Recent Changes
- 004-sdk-api: Added TypeScript 5.0+, Node.js 20.x+ + VitePress (文档站), TypeDoc (API 文档生成), Vite (构建工具)
- 003-tushare: Added TypeScript 5.0+, Node.js 20.x+ + 无额外运行时依赖(开发依赖: vitest, msw, eslint, prettier, tsdown)
- 002-github-ci: Added TypeScript 5.0+, Node.js 20.x (测试支持 18.x 和 20.x) + GitHub Actions, tsdown (构建), vitest (测试), ESLint (代码质量)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
