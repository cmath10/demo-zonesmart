import { defineConfig } from 'vite'
import path from 'node:path'
import svg from 'vite-svg-loader'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    svg({
      svgoConfig: {
        multipass: true,
        plugins: [{
          name: 'preset-default',
          params: {
            overrides: {
              removeViewBox: false,
            },
          },
        }],
      },
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})