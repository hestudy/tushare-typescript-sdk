import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: './src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  minify: true,
  target: 'node20',
  clean: true,
  sourcemap: true,
  outDir: 'dist'
})