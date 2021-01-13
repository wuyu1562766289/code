<template>
  <div>
    <ul>
      <li v-for="(item) in state.stus" :key="item.id" @click="deleteData(item.id)">
        {{item.id}}-{{item.name}}-{{item.age}}
      </li>
    </ul>
  </div>
</template>

<script>
  import {reactive} from 'vue'

  export default {
    name: 'setup',
    setup() {
      let {state, deleteData} = useRemoveStudent()

      return {state, deleteData}
    }
  }

  function useRemoveStudent () {
    let state = reactive({
      stus: [
        {id: 1, name: 'wangxing', age: 18},
        {id: 2, name: 'hello', age: 28},
        {id: 3, name: 'world', age: 38}
      ]
    })

    function deleteData(index) {
      state.stus = state.stus.filter(item => item.id !== index)
    }

    return {state, deleteData}
  }
</script>

<style scoped>

</style>