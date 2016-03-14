<style>
.taobao {
  color: orange;
  text-align: center;
  font-size: 3em;
}
</style>
<template>
  <div class="taobao">
    <h1>taobao.com</h1>
    <p>Current count: {{count}}</p>
  </div>
</template>

<script>
export default {
  data () {
    return { count: 0 }
  },

  ready () {
    this.handle = setInterval(() => {
      this.count++
    }, 1000)
  },

  destroyed () {
    clearInterval(this.handle)
  }
}
</script>
