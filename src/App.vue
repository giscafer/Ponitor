<template>
    <div>
        <comp-d></comp-d>
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
import CompD from './components/D.vue'

export default {
  data () {
    return {
      msg: 'Hello from vue-loader!'
    }
  },
  components: {
    CompA,
    CompB,
    Counter,
    CompD
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
  font-size: 4em;
  font-weight: lighter;
</style>
