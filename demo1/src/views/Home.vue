<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <reft></reft>
    <reactivet></reactivet>
    <computed @submit="handle"></computed>
  </div>
</template>

<script>
// import { defineComponent } from "vue";
// import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import reft from '@/components/reft.vue'
import reactivet from '@/components/reactivet'
import computed from '@/components/computed'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    reft,
    reactivet,
    computed
  },
  setup () {
    const handle = (value) => {
      console.log(value)
    }
    return { handle }
  }
}
</script>
