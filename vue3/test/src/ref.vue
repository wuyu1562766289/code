<template>
  <div>
    <div ref='box'>这是一个div</div>
  </div>
</template>

<script>
  import {ref, onMounted} from 'vue'
  export default {
    name: 'box',
    // setup在beforeCreate之前加载
    setup() {
      let box = ref(null)

      onMounted(() => {
        console.log('onMounted', box.value)
      })

      console.log(box.value)  // null

      return {box}
    }
  }
</script>

<style scoped>

</style>