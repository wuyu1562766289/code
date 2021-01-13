<template>
  <div>
    {{state.name}}<br>
    {{state.data.age}}<br>
    {{state.data.height}}<br>
    <button @click="add">点击</button>
  </div>
</template>

<script>
  import { isReadonly, readonly, shallowReadonly } from 'vue'

  export default {
    setup() {
      // readonly: 属性保护，递归保护，都不能修改
      // let state = readonly({name: 'wang', data: {age: 18, height: 1.88}})
      // 最外层不能修改，嵌套内容可以修改
      let state = shallowReadonly({name: 'wang', data: {age: 18, height: 1.88}})
      // const: 不能重新赋值，可以修改内部内容

      function add () {
        this.state.name = 'xing'
        this.state.data.age = 19
        this.state.data.height = 2.0
        console.log(this.state)
        console.log(isReadonly(this.state))
      }

      return {state, add}
    }
  }
</script>

<style scoped>

</style>