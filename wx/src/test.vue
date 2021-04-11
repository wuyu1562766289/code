<template>
  <div>
    <div class="nav-btn">
      <router-link to='/'> Home</router-link>
      <router-link to='/contact'>   Contact </router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<script setup>

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
