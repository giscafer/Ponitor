<template>
<div id="content">
	<div id="info" v-show="success">
		<alert type="info">
		  {{success}}
		</alert>
	</div>
	<div id="danger" v-show="error">
		<alert type="danger" >
		  {{error}}
		</alert>
	</div>
	<form class="searchpass form-inline ">
	  <div class="form-group">
	    <label for="inputEmail">请输入注册邮箱：</label>
	    <input type="email" class="email form-control" id="inputEmail" v-model="email" placeholder="jane.doe@example.com">
	  </div>
	  <button type="button" class="btn btn-default" @click="getEmail">确定</button>
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
		 	email:'',
		 	error:'',
		 	success:''
		};
	},
	ready(){
  		Ponitor.hideCon();
  		let type=this.$route.query.type;
  		this.$data[type]=true;
	},
	methods:{
		getEmail:function(){
			request.post('api/searchpass')
			.send({email:this.$data.email})
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
		 margin:50px 240px 0 240px;
		 .searchpass{
		 	margin-left: 300px;
		 }
		 .email{
		 	width: 300px;
		 }
	}
</style>