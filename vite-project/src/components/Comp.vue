<script lang="jsx">
  import { ref } from 'vue'
  export default {
    setup() {
      const counter = ref(0);
      const onclick = () => {
        counter.value++
      }

      return () => {
        <>
          <div>comp</div>
          <p onClick={onclick}>{counter.value}</p>
        </>
      }
    }
  }
  // export default {
  //   render(h) {
  //     return (
  //       <div>comp</div>
  //     )
  //   },
  // }
</script>

<style scoped>

</style>