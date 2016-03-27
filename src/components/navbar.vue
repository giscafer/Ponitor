<template>
<header class="navbar navbar-static-top" id="navbar" role="banner">
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
</template>

<script>
  export default{
    components: {
      'nvMenu':require('./menu.vue'),
      'userInfo':require('./user-info.vue')
    }
  }
</script>

<style>
  #navbar{
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