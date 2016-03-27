<template>
	<modal :show.sync="showLoginModal" effect="fade" width="400">
	  <div slot="modal-header" class="modal-header">
	    <h3 class="modal-title"><strong>登录</strong></h3>
	  </div>
	  <div slot="modal-body" class="modal-body">
	  <div id="login">
	      <form id="signin_form" method="POST" action="/signin"  class="form-signin">
	          <div>
	              <div class="form-group">
	                  <label for="loginname">用户名</label>
	                  <input class='form-control' id='loginname' name='loginname' v-model="loginname"  size='30' type='text' value='' />
	              </div>
	              <div class="form-gourp">
	                  <label for="pass">密码</label>
	                  <input class='form-control' id='pass' name='pass' v-model="pass" size='30' type='password' />
	              </div>
	          </div>
	      </form>
	  </div>
	  </div>
	  <div slot="modal-footer" class="modal-footer">
	    <a id="forgot_password" href="#" @click='showLoginModal = false'>忘记密码了？</a>
	    <button type="button" class="btn btn-default" @click='showLoginModal = false'>关闭</button>
	    <button type="submit" class="btn btn-success" @click='login'>登录</button>
	  </div>
	</modal>
</template>

<script>
	import { modal } from 'vue-strap';
	import request from 'superagent';
	import notie from 'notie';
	export default{
		props: ['showLoginModal'],
		data(){
			return{
				loginname:'',
				pass:'',
			};
		},
		methods:{
			login(){
				request.post('api/login')
				.send(this.$data)
				.end((err,res)=>{
					console.log(err);
					console.log(res);
					if(res.body.result_code!==0){
						notie.alert(2,res.body.error,2);
						return;
					}else{
						localStorage.userId=res.body.userInfo._id;
						localStorage.loginname=res.body.userInfo.loginname;
						localStorage.email=res.body.userInfo.email;
						localStorage.profile_image_url=res.body.userInfo.profile_image_url;
						localStorage.accessToken=res.body.userInfo.accessToken;
						this.$data.showLoginModal=false;
						this.$router.go({ name: 'all', params: { type: 'all' }});
						location.reload();
					}
					
				});
			}
		},
		components:{
			modal
		}
	}
</script>