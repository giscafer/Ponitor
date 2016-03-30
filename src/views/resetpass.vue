<template>
<div id="content">
	<div id="info" v-show="success">
		<alert type="info">
		  {{success}}
		</alert>
	</div>
	<div id="danger" v-show="error!==''">
		<alert type="danger" >
		  {{error}}
		</alert>
	</div>
	<form class="searchpass form-group ">
	  <div class="form-group">
	    <label for="inputNewPass">新密码</label>
	    <input type="password" class="email form-control" id="inputNewPass" v-model="pass">
	  </div>
	  <div class="form-group">
	    <label for="inputNewPass">重复一遍密码</label>
	    <input type="password" class="email form-control" id="inputNewPass" v-model="repass" @keyup.enter="updatePass">
	  </div>
	  <button type="button" class="btn btn-default" @click="updatePass">确定</button>
	</form>
</div>
<br>
</template>
<script>
import { alert } from 'vue-strap';
import request from 'superagent';
export default{
	data(){
		 return{
		 	pass:'',
		 	repass:'',
		 	key:'',
		 	name:'',
		 	error:'',
		 	success:''
		};
	},
	ready(){
  		Ponitor.hideCon();
  		this.$data.key=this.$route.query.key;
  		this.$data.name=this.$route.query.name;
  		this.resetPass(key);
	},
	methods:{
		resetPass:function(key){
			if(key){
				request.post('api/resetvalid')
				.send({key:this.$data.key,name:this.$data.name})
				.end((err,res)=>{
					console.log(res);
				});
			}
		},
		updatePass:function(){
			request.post('api/updatepass')
			.send(this.$data)
			.end((err,res)=>{
				if(res.body.result_code!==0){
					this.$data.success='';
					this.$data.error=res.body.error;
					this.$data['email']=res.body.email;
				}else if(err){
					this.$data.success='';
					this.$data.error='出错了！';
					this.$data['email']=res.body.email;
				}else{
					this.$data.error='';
					this.$data.success=res.body.success;
				}
			});
		}
	},
	components:{
		alert
	}
}
</script>

<style>
	#content{
		 margin:50px 340px 50px 340px;
		 .searchpass{
		 	margin-left: 300px;
		 }
		 .email{
		 	width: 300px;
		 }
	}
</style>