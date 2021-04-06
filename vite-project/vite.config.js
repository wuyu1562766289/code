import { defineConfig } from 'vite' // 提示
import vue from '@vitejs/plugin-vue'
import path from 'path'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteMockServe from 'vite-plugin-mock'

// https://vitejs.dev/config/
export default defineConfig({
  alias: {  // 别名配置
    '@': path.resolve(__dirname, 'src'),
    'comps': path.resolve(__dirname, 'src/components'),
    'apis': path.resolve(__dirname, 'src/components'),
    'views': path.resolve(__dirname, 'src/views'),
    'utils': path.resolve(__dirname, 'src/utils'),
    'routes': path.resolve(__dirname, 'src/routes'),
    'styles': path.resolve(__dirname, 'src/styles')
  },
  css: {},
  esbuild: {},
  plugins: [vue(), vueJsx(), viteMockServe({ supportTs: false })]
})
