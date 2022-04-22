import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true,
    target: 'es6',
    outDir: 'dist/lib',
    lib: {
      entry: 'src/index.ts',
      formats: ['umd'],
      fileName: () => 'index.js',
      name: 'nautocPassword',
    },
  },
})
