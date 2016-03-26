<template>
<header class="navbar navbar-static-top" id="top" role="banner">
    <div class="container">
        <div class="navbar-header"></div >
        <div  id="bs-navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="../" id="logo">Ponitor</a></li>
            </ul>
            <!-- <ul class="nav navbar-nav navbar-right">
                <li><a href="javascript:void(0)"  @click="login">登录</a></li>
                <li><a href="javascript:void(0)"   @click="signup" >注册</a></li>
            </ul> -->
            <user-info></user-info>
        </div >
    </div>
</header>
<nv-menu></nv-menu>

</template>
<script>
  export default{
    data(){
      return {
        
      }
    },
    components: {
      'userInfo':require('./user-info.vue'),
      "nvMenu":require('./menu.vue')
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
  #top{
      margin-bottom:0px;
  }
  #logo{
    color:#1d976c;
  }
  #forgot_password{
    float: left;
  }
   
</style>