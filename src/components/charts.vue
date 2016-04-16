<template>
	<modal :show.sync="showChartModal" effect="fade" width="400">
	  <div slot="modal-header" class="modal-header">
	    <h3 class="modal-title"><span class="glyphicon glyphicon-stats" aria-hidden="true">统计</h3>
	  </div>
	  <div slot="modal-body" class="modal-body">
	  <div id="priceChart" style="height:400px;width:565px;">
	      
	  </div>
	  </div>
	  <div slot="modal-footer" class="modal-footer">
	  	<button class="btn btn-default" @click="showChartModal=false">关闭</button>
	  </div>
	</modal>
</template>

<script>
	import { modal } from 'vue-strap';
	import request from 'superagent';
	import notie from 'notie';
	export default{
		props: ['showChartModal','chartOption'],
		data(){
			return{
				loginname:'',
				pass:'',
			};
		},
		ready () {
		},
		components:{
			modal
		}
	}
</script>