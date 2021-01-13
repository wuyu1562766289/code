<template>
  <div>{{msg}}</div>
  <button @click="onClick">点我</button>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      msg: 'wangxing'
    }
  },
  methods: {
    onClick () {
      alert(this.msg)
    }
  },
}
</script>
