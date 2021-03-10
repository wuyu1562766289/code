<template>
  <div class="hello">
    <!-- 方式一 -->
    <input v-model="state.num1" @keyup="addNum" />+
    <input v-model="state.num2" @keyup="addNum" />=
    {{ state.result }}
  </div>
</template>

<script>
import { reactive } from 'vue'

const state = reactive({
  num1: 0,
  num2: 0,
  result: 0
})

// 方式一
function addNum () {
  state.result = parseInt(state.num1) + parseInt(state.num2)
}

export default {
  name: 'HelloWorld',
  setup () {
    // const state = reactive({
    //   num1: 0,
    //   num2: 0,
    //   result: 0
    // })

    // // 方式一
    // function addNum () {
    //   state.result = parseInt(state.num1) + parseInt(state.num2)
    // }

    return {
      state,
      // 方式一
      addNum
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
