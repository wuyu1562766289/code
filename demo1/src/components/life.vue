<template>
  <div class="hello"></div>
</template>

<script>
import { onMounted, onUpdated, onRenderTracked, onRenderTriggered } from 'vue'

export default {
  name: 'HelloWorld',
  setup () {
    // onBeforeMount(() => {
    //   console.log('onBeforeMount')
    // })
    onMounted(() => {
      console.log('onMounted')
    })
    onUpdated(() => {
      console.log('onUpdated')
    })
    onRenderTracked((e) => {
      console.log('onRenderTracked', e)
    })
    onRenderTriggered((e) => {
      console.log('onRenderTriggered', e)
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
