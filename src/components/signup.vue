<template>
	<modal :show.sync="showSignupModal" effect="fade" width="400">
	  <div slot="modal-header" class="modal-header">
	    <h3 class="modal-title"><strong>注册</strong></h3>
	  </div>
	  <div slot="modal-body" class="modal-body">
	      <form method="POST" action="/signup" class="form-signin">
             <div class="modal-body">
                 <div class="form-group">
                 	<label for="loginname">账号</label>
                     <input class='form-control' id='loginname' name='loginname' size='30' type='text' v-model="loginname"/>
                 </div>
                 <div class="form-gourp">
                     <label for="pass">密码</label>
                     <input class='form-control' id='pass' name='pass' size='30' type='password' v-model="pass"/>
                 </div>
                 <div class="form-gourp">
                     <label for="re_pass">确认密码</label>
                     <input class='form-control' id='re_pass' name='re_pass' size='30' type='password' v-model="re_pass"/>
                 </div>
                  <div class="form-gourp">
                     <label for="email">电子邮箱</label>
                     <input class='form-control' id='email' name='email' size='30' type='text' v-model="email"/>
                 </div>
             </div>
         </form>
	  </div>
	  <div slot="modal-footer" class="modal-footer">
	  	<span style="float:left">（提示：降价通知将发送给注册邮箱）</span>
	    <button type="button" class="btn btn-default" @click='showSignupModal = false'>关闭</button>
	    <button type="submit" class="btn btn-success" @click='signup'>确定</button>
	  </div>
	</modal>
</template>

<script>
	import { modal } from 'vue-strap';
	import request from 'superagent';
	import notie from 'notie';
	export default{
		props: ['showSignupModal'],
		data(){
			return{
				email:'',
				loginname:'',
				pass:'',
				re_pass:''
			};
		},
		methods:{
			signup(){
				request.post('api/signup')
				.send(this.$data)
				.end((err,res)=>{
					console.log(err);
					console.log(res);
					if(res.body.result_code!==0){
						notie.alert(3,res.body.error,2);
						return;
					}
					notie.alert(1,res.body.success,10);
					this.$data.showSignupModal=false;
				});
			}
		},
		components:{
			modal
		}
	}
</script>