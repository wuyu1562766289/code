import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { buildConfig } from './build/config/buildConfig'
import vueJsx from '@vitejs/plugin-vue-jsx'

function pathResolve(dir) {
  return resolve(__dirname, '.', dir);
}

export default defineConfig({
  plugins: [vue(), vueJsx()],
  alias: {
    // '/@/': pathResolve('src'),
    '@': pathResolve('src'),
    'api': pathResolve('src/api'),
    'imgs': pathResolve('src/assets/images'),
    'comps': pathResolve('src/components'),
    'views': pathResolve('src/views'),
    'util': pathResolve('src/util'),
    'router': pathResolve('src/router'),
    'styles': pathResolve('src/styles')
  },
  build: buildConfig,
  optimizeDeps: {
    include: ['@ant-design/icons-vue']
  },
  server: {
    port: 8333,
    proxy: {
      // '/lsbdb': 'http://10.192.195.96:8087',
    },
    hmr: {
      overlay: true,
    },
    open: true,
    hot: true
  },
})
