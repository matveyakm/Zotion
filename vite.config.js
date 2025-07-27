import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/content.ts'),
      output: {
        entryFileNames: 'content.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
        format: 'iife',
      },
      inlineDynamicImports: true,
    },
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, 
    minify: false, 
    lib: {
      entry: path.resolve(__dirname, 'src/content.ts'),
      formats: ['iife'], 
      name: 'contentScript', 
      fileName: 'content',
    },
  },
  test: {
    globals: true, 
    environment: 'jsdom',  
    include: ['test/**/*.test.ts'], 
    css: false, 
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
