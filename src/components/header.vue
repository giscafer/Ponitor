<template>
<header class="navbar navbar-static-top" id="top" role="banner">
    <div class="container">
        <div class="navbar-header"></div >
        <div  id="bs-navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="../" id="logo">Ponitor</a></li>
            </ul>
            
            <div id="user-info">
              <user-info></user-info>
            </div>
            <ul id="nv-menu" class="nav navbar-nav navbar-right">
              <nv-menu></nv-menu>
            </ul>
        </div >
    </div>
</header>
<nv-content></nv-content>

</template>
<script>
  export default{
    components: {
      'nvMenu':require('./menu.vue'),
      'userInfo':require('./user-info.vue'),
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
  #top{
      margin-bottom:0px;
  }
  #logo{
    color:#1d976c;
  }
  #forgot_password{
    float: left;
  }
  #nv-menu{
    margin-right: 50px;
    margin-top: 9px;
  }
   
</style>