<template>
  <h1>{{ msg }}</h1>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">Vite Documentation</a> |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button @click="state.count++">count is: {{ state.count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <!-- <button @click="emit('myclick')">emit</button> -->
  <button @click="onClick">emit</button>
</template>

<script setup>
// 1.直接导入组件
import { defineEmit, defineProps, reactive, useContext } from 'vue'

// 3.获取上下文
const ctx = useContext()
console.log(ctx)
const onClick = () => {
  ctx.emit('myclick')
}
// 对外暴露方法或属性
ctx.expose({
  someMethod () {
    console.log('some message from HelloWorld!')
  }
})

// 4.定义事件
// const emit = defineEmit(['myclick'])
// const onClick = () => {
//   emit('myclick')
// }

const state = reactive({ count: 0 })
</script>

<style scoped>
a {
  color: #42b983;
}
</style>