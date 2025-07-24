import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/content.js'),
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
      entry: path.resolve(__dirname, 'src/content.js'),
      formats: ['iife'], 
      name: 'contentScript', 
      fileName: 'content',
    },
  },
});
