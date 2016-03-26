<template>
<header class="navbar navbar-static-top" id="top" role="banner">
    <div class="container">
        <div class="navbar-header"></div >
        <div  id="bs-navbar" class="collapse navbar-collapse">
            <ul class="nav navbar-nav">
                <li><a href="../" id="logo">Ponitor</a></li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <li><a href="javascript:void(0)"  @click="login">登录</a></li>
                <li><a href="javascript:void(0)"   @click="signup" >注册</a></li>
            </ul>
        </div >
    </div>
</header>
<nv-menu></nv-menu>
<nv-login :show-login-modal.sync="showLoginModal"></nv-login>
<nv-signup :show-signup-modal.sync="showSignupModal"></nv-login>
</template>
<script>
import notie from 'notie';
  export default{
    replace:true,
    data(){
      return {
        showLoginModal:false,
        showSignupModal:false
      }
    },
    methods:{
      login(){
        this.$data.showLoginModal=true;
      },
      signup(){
         this.$data.showSignupModal=true;
         // notie.alert(1,'一封邮件发送到giscafer@outlook.com，请打开链接并激活！',10000);
      }
    },
    components: {
      'nvLogin':require('./login.vue'),
      'nvSignup':require('./signup.vue'),
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