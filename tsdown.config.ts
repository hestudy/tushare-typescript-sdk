import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  minify: true,
  target: 'es2020',
  clean: true,
  sourcemap: true,
  outDir: 'dist',
  globalName: 'Tushare',
  platform: 'browser'
})