<template>
<div id="good-list-con">
	<input type="checkbox" v-model="checked">
	<label for="checked">一次仅展开一栏</label>
	<br>
	<accordion :one-at-atime="checked">
	  <panel class="jd" header="京东" :is-open="true">
        <span v-show="jdGoods.length===0">
          该分类没有商品
        </span>
        <div v-else v-for="good in jdGoods" class="goodlist">
            <good class="card good-item" data-id="good._id">
                <div class="card-block">
                  <header class="good-item-hd">
                    <img v-bind:src="good.image" alt="good.name">
                  </header>
                  <section class="good-item-bd fix-break-word">{{good.name}}</section>
                </div>
           </good>
        </div>
     </panel>
	  <panel class="alibaba" header="淘宝 | 天猫">
	    <span v-show="alibabaGoods.length===0">
        该分类没有商品
      </span>
      <div v-else v-for="good in alibabaGoods" class="goodlist">
          <good class="card good-item" data-id="good._id">
              <div class="card-block">
                <header class="good-item-hd">
                  <img v-bind:src="good.image" alt="good.name">
                </header>
                <section class="good-item-bd fix-break-word">{{good.name}}</section>
              </div>
         </good>
      </div>
	  </panel>
	  <panel class="apple" header="Apple App">
	    <span v-show="appleApps.length===0">
        该分类没有商品
      </span>
      <div v-else v-for="good in appleApps" class="goodlist">
          <good class="card good-item" data-id="good._id">
              <div class="card-block">
                <header class="good-item-hd">
                  <img v-bind:src="good.image" alt="good.name">
                </header>
                <section class="good-item-bd fix-break-word">{{good.name}}</section>
              </div>
         </good>
      </div>
	  </panel>
	</accordion>
</div>

</template>
<script>
import { accordion } from 'vue-strap';
import { panel } from 'vue-strap';
import _ from 'lodash';
import request  from 'superagent';
import nprogress  from 'nprogress';
  export default{
    data(){
      return{
        jdGoods:[],
        alibabaGoods:[],
        appleApps:[]
      };
    },
  	ready(){
  		if(this.$route.path==='/goodlist'){
  			jQuery('#nv-content').hide();
  			jQuery('#navbar').css({
  			  background: '#F5F5F5'
  			});
        jQuery(".panel-collapse").css('max-height', '');
  		}
  	},
    methods:{
      sortGoods:function(goods){
        console.log(goods)
        if(!goods.length) return;
        this.$data.jdGoods=_.filter(goods,(item,index)=>{
           return item.type==='jd';
        });
        this.$data.alibabaGoods=_.filter(goods,(item,index)=>{
           return item.type==='alibaba';
        });
        this.$data.appleApps=_.filter(goods,(item,index)=>{
           return item.type==='apple';
        });
        this.buildGoodsList();
      },
      buildGoodsList:function(){
        $('#good-list-con .alibaba .panel-title').append('<span class="label label-info label-pill count">'+this.alibabaGoods.length+'</span>');
        $('#good-list-con .jd .panel-title a').append('<span class="label label-info label-pill count">'+this.jdGoods.length+'</span>');
        $('#good-list-con .apple .panel-title a').append('<span class="label label-info label-pill count">'+this.appleApps.length+'</span>');
      }
    },
     route: {
      data(transition){
        request
          .get('/api/goodlist')
          .end((err, res) => {
            nprogress.done();
            if (err) {
              notie.alert(3, err.message, 1.5);
            } else if(res.body.result_code===-1){
              notie.alert(3, res.body.error, 1.5);
            }
            console.log(res.body)
            this.sortGoods(res.body);
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
   .goodlist{
      overflow-y:auto;
      .name{
        font-size: 0.8em;
      }
      .good-item-hd{
        img{
          width: 100px;
          border-radius: 20px;
        }
      }
      .price{
        font-size: 0.8em;
        margin-top: .2em;
        background-color: #DCDCDC;
      }
  }
}
</style>