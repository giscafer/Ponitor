<template>
	<dropdown  v-if="loginname">
	  <button type="button" class="btn btn-default" data-toggle="dropdown">
	    菜单
	    <span class="caret"></span>
	  </button>
	  <ul name="dropdown-menu" class="dropdown-menu">
	    <li><a href="javascript:void(0)" @click="goGoodList">商品管理</a></li>
	   <!--  <li><a href="#">Another action</a></li>
	   <li><a href="#">Something else here</a></li>
	   <li role="separator" class="divider"></li>
	   <li><a href="#">Separated link</a></li> -->
	  </ul>
	</dropdown>
</template>

<script>
	import { dropdown } from 'vue-strap';
	export default{
		data (){
			return{
				loginname:localStorage.loginname || "",
			};
		},
		methods:{
			goGoodList:function(){
				this.$router.go({ name: 'goodlist' });
			}
		},
		components:{
			dropdown
		}
	}
</script>