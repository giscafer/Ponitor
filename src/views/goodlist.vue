<template>
<div id="good-list-con">
	<input type="checkbox" v-model="checked">
	<label for="checked">一次仅展开一栏</label>
	<br>
	<accordion :one-at-atime="checked">
	  <panel header="Panel #1" :is-open="true">
	    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
	  </panel>
	  <panel header="Panel #2">
	    ...
	  </panel>
	  <panel header="Panel #3">
	    ...
	  </panel>
	  <panel header="Panel #4">
	    ...
	  </panel>
	</accordion>
</div>

</template>
<script>
import { accordion } from 'vue-strap';
import { panel } from 'vue-strap';
  export default{
  	ready(){
  		if(this.$route.path==='/goodlist'){
  			jQuery('#nv-content').hide();
  			jQuery('#navbar').css({
  			  background: '#F5F5F5'
  			});
  		}
  	},
    components: {
      accordion,
      panel
    }
  }
</script>

<style>

#good-list-con{
   margin:50px 240px 0 240px;
	.loading{
		margin-top: 20px;
	    color: #393;
	    text-align: center;
	    font-size: 0.8em;
    }
   .good{
      text-align: center;
    .icon{
      padding: 2em;
      padding-bottom: .6em;
      img{
        border-radius: 20px;
      }
    }
    .name{
      font-size: 0.8em;
    }
    .price{
      font-size: 0.8em;
      margin-top: .2em;
      background-color: #DCDCDC;
    }
  }
}
</style>