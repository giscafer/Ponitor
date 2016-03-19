<template>
<!-- 全局header -->
<nv-head></nv-head>
 <!-- main view -->
    <router-view
      class="view"
      keep-alive
      transition
      transition-mode="out-in">
    </router-view>
</template>
<script>
  export default {
    components: {
      "nvHead":require('./components/header.vue')
    }
  }
</script>
