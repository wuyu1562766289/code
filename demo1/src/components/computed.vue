<template>
  <div class="hello">
    <!-- 方式一 -->
    <!-- <input v-model="num1" />+ <input v-model="num2" />=
    {{ result }} -->

    <input v-model="state.num1" />+ <input v-model="state.num2" />=
    {{ state.result }}
    <button @click="handle">click</button>
  </div>
</template>

<script>
import { reactive, computed } from 'vue'

export default {
  name: 'HelloWorld',
  setup (props, { emit }) {
    // const num1 = ref(0)
    // const num2 = ref(0)
    // const result = computed(() => {
    //   return parseInt(num1.value) + parseInt(num2.value)
    // })

    // return {
    //   num1,
    //   num2,
    //   result
    // }

    const state = reactive({
      num1: 0,
      num2: 0,
      result: computed(() => {
        return parseInt(state.num1) + parseInt(state.num2)
      })
    })

    const handle = () => {
      console.log('click comit')
      emit('submit', `传递数据啊${state.result}`)
    }
    return {
      state,
      handle
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
