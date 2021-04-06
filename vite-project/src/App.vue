<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld ref="hw" msg="Hello Vue 3 + Vite" @myclick="onmyclick" />
</template>

<script setup>
import HelloWorld from 'comps/HelloWorld.vue'
import { ref } from 'vue'

const hw = ref(null)

const onmyclick = () => {
  hw.value.someMethod() // 调用子组件暴露的方法
  console.log('emit')
}

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>