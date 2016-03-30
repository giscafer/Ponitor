<template>
<div id="content">
	<div id="info" v-show="info">
		<alert type="info">
		  <strong>Congratulations!</strong> 账号激活成功，您已经可以登录！
		</alert>
	</div>
	<div id="danger" v-show="danger">
		<alert type="danger">
		  <strong>Oh snap!</strong> 信息有误，账号无法被激活。
		</alert>
	</div>
	<div id="warning" v-show="warning">
		<alert type="warning">
		  <strong>Warning!</strong> 账号已经是激活状态。
		</alert>
	</div>
</div>
</template>
<script>
import { alert } from 'vue-strap';

export default{
	data(){
		 return{
		 	info:false,
		 	danger:false,
		 	warning:false
		};
	},
	ready(){
  		Ponitor.hideCon();
  		let type=this.$route.query.type;
  		this.$data[type]=true;
	},
	components:{
		alert
	}
}
</script>

<style>
	#content{
		 margin:50px 240px 0 240px;
	}
</style>