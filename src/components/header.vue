<template>
<nav-bar></nav-bar>
<div id="nv-content">
  <nv-content v-ref:content></nv-content>
</div>
</template>
<script>
  export default{
    components: {
      'navBar':require('../components/navbar.vue'),
      "nvContent":require('./content.vue')
    }
  }
</script>
<style>
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