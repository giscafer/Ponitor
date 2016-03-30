<template>
	<div id="danger" v-show="error">
		<alert type="danger" >
		  {{error}}
		</alert>
	</div>
</template>
<script>
import { alert } from 'vue-strap';
export default{
	data(){
		return{
		 	error:''
		};
	},
	ready(){
  		Ponitor.hideCon();
  		this.$data.error='信息有误，密码无法重置。';
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