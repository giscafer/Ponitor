<template>
	<div class="user-info">
	    <!-- 未登录 -->
	    <ul class="nav navbar-nav navbar-right login-no" v-if="!loginname">
	        <li><a href="javascript:void(0)"  @click="login">登录</a></li>
	       	<li><a href="javascript:void(0)"   @click="signup" >注册</a></li>
	    </ul>
	    <!-- 已登录 -->
	    <ul class="nav navbar-nav navbar-right  login-yes" v-if="loginname">
            <li><a href="javascript:void(0)" v-if="loginname"  @click="goUser">{{loginname}}</a></li>
            <li class="separator">|</li>
           	<li><a href="javascript:void(0)"  v-if="loginname"  @click="logout" >退出</a></li>
        </ul>
	</div>
	<nv-login :show-login-modal.sync="showLoginModal"></nv-login>
	<nv-signup :show-signup-modal.sync="showSignupModal"></nv-login>
</template>
<script>
import notie from 'notie';
import request from 'superagent';
export default{
	data(){
		return{
			showLoginModal:false,
    		showSignupModal:false,
			loginname:localStorage.loginname || "",
			avatar_url:localStorage.profile_image_url || ""
		};
	},
    methods:{
      login(){
        this.$data.showLoginModal=true;
      },
      signup(){
         this.$data.showSignupModal=true;
         // notie.alert(1,'一封邮件发送到giscafer@outlook.com，请打开链接并激活！',10000);
      },
      logout(){
      	var _self=this;
      	request.get('api/logout')
      	.end((err,res)=>{
      		 if(err){
                notie.alert(2,err.message,2);
                return;
             }else if(res.body.result_code===-1){
             	notie.alert(2,res.body.error,2);
                return;
             }
             localStorage.clear();
             location.reload();
      	});
      },
      goUser(){

      }
    },
    components:{
    	'nvLogin':require('./login.vue'),
      	'nvSignup':require('./signup.vue')
    }
}
</script>

<style>
	.separator{
		margin-top:10px;
	}
</style>