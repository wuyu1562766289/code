<template>
  <div>
    {{count}}
    <button @click="onClick">点击</button>
  </div>
</template>

<script>
  import {ref} from 'vue'

  export default {
    name: 'App',
    // setup函数是组合API的入口函数
    setup() {
      // 定义了一个名称叫count的变量，这个变量的初始值是0
      // 变量发生改变后vue会自动更新
      let count = ref(0)

      // 方法不用到methods中定义，直接定义即可
      function onClick() {
        count.value++
        console.log(count.value)
      }

      // 在组合API中定义的变量、方法，要想在外界使用，必须通过return{xxx， xxx}暴露出去
      return {count, onClick}
    }
  }
</script>

<style>

</style>