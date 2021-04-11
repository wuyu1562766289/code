<template>
  <div class="header">
    <svg v-if="props.back" @click="$router.back()" style="margin: 10px" data-icon="left" width="1.5em" height="1.5em" fill="currentColor" aria-hidden="true" viewBox="64 64 896 896" focusable="false"><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 000 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
    <p style="margin: 0 auto;">{{ props.text || '九讯云客服'}}</p>
    <p v-if="props.finish" @click="onClick" class="close">完成</p>
  </div>
</template>

<script setup>
// 1.直接导入组件
import { defineProps, useContext } from 'vue'

const props = defineProps({
  back: Boolean,
  finish: Boolean,
  text: String
})

// 获取上下文
const ctx = useContext()
// 完成
const onClick = () => {
  ctx.emit('finishFun')
}
</script>

<style scoped>
  .header {
    display: flex;
    height: 44px;
    line-height: 44px;
    background: #FFFFFF;
  }
  .close {
    height: 16px;
    font-size: 12px;
    font-weight: 400;
    color: #2445F4;
    line-height: 44px;
    margin-right: 10px;
  }
</style>