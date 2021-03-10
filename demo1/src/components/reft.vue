<template>
  <div class="hello">
    <!-- 方式一 -->
    <!-- <input v-model="num1" @keyup="addNum" />+
    <input v-model="num2" @keyup="addNum" />=
    {{ result }} -->

    <input v-model="num1" />+ <input v-model="num2" />=
    {{ result }}
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HelloWorld',
  setup () {
    const num1 = ref(0)
    const num2 = ref(0)
    const result = ref(0)

    // 方式一
    // function addNum () {
    //   result.value = parseInt(num1.value) + parseInt(num2.value)
    // }

    return {
      num1,
      num2,
      result
      // 方式一
      // addNum
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
