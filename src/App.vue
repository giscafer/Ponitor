<template>
    <div>
        <img src="./assets/logo.png" class="logo">
        <h1>{{msg}}</h1>
         <comp-a></comp-a>
        <comp-b></comp-b>
        <counter></counter>
    </div>

</template>

<script>
import CompA from './components/A.vue'
import CompB from './components/B.vue'
import Counter from './components/Counter.vue'

export default {
  data () {
    return {
      msg: 'Hello from vue-loader!'
    }
  },
  components: {
    CompA,
    CompB,
    Counter
  }
}
</script>

<style lang="stylus">
font-stack = Helvetica, sans-serif
primary-color = #999
body
  font 100% font-stack
  color primary-color

.logo
  width 40px
  height 40px
</style>
