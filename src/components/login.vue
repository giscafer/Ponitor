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
	                  <input class='form-control' id='loginname' name='loginname' size='30' type='text' value='' />
	              </div>
	              <div class="form-gourp">
	                  <label for="pass">密码</label>
	                  <input class='form-control' id='pass' name='pass' size='30' type='password' />
	              </div>
	          </div>
	      </form>
	  </div>
	  </div>
	  <div slot="modal-footer" class="modal-footer">
	    <a id="forgot_password" href="#" @click='showLoginModal = false'>忘记密码了？</a>
	    <button type="button" class="btn btn-default" @click='showLoginModal = false'>关闭</button>
	    <button type="submit" class="btn btn-success" @click='showLoginModal = false'>登录</button>
	  </div>
	</modal>
</template>

<script>
	import { modal } from 'vue-strap';
	export default{
		props: ['showLoginModal'],
		data(){
			return{
			}
		},
		components:{
			modal
		}
	}
</script>