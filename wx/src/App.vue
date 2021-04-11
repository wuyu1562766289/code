<template>
  <div>
    <div class="nav-btn">
      <router-link to='/'></router-link>
      <!-- <router-link to='/contact'>   Contact </router-link> -->
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {

    return {}
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: PingFangSC-Medium, PingFang SC;
  height: inherit;
  background: #F5F5F5;
  margin: 0;
  border: 1px solid #F5F5F5;
}
</style>