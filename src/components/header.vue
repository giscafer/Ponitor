<template>
<nav-bar></nav-bar>
<nv-content></nv-content>
</template>
<script>
  export default{
    components: {
      'navBar':require('./navbar.vue'),
      "nvContent":require('./content.vue')
    }
  }
</script>
<style>
@import "../../node_modules/normalize.css/normalize.css";
@import "purecss";
@import "../../node_modules/nprogress/nprogress.css";
   body {
      color: #555459;
      margin: 0 auto;
      font-size: 2em;
      font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
  } 
   
</style>