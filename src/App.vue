<template>
<header class="navbar navbar-static-top navbar-default" id="top" role="banner">
    <div class="container">
        <div class="navbar-header"></div >
        <div  id="bs-navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="../" style="color:#19986B">Ponitor</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="#"  class="">登录</a></li>
                <li><a href="#"   @click="add">注册</a></li>
            </ul>
        </div >
    </div>
</header>
<comp-c></comp-c>
</template>
<script>
 
  import CompC from './views/content.vue'

  export default {
    components: {
      CompC
    }
  }
</script>
<style>
@import "/normalize.css";
@import "purecss";
@import "/node_modules/nprogress/nprogress.css";
   body {
      color: #555459;
      margin: 0 auto;
      font-size: 0.8em;
      font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
  } 
    .v-link-active {
        border-bottom-color: #000;
    }
    #top{
        margin-bottom:0px;
    }
   
</style>